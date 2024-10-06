import {
	createPrompt,
	useState,
	usePrefix,
	useKeypress,
	useMemo,
	isEnterKey,
	isUpKey,
	isDownKey,
	ValidationError,
	KeypressEvent,
	isSpaceKey,
	Separator,
	Status,
} from '@inquirer/core'
import chalk from 'chalk'
import figures from 'figures'
import Table, { Cell } from 'cli-table3'
import ansiEscapes from 'ansi-escapes'

type TableRow<Value> = {
	title: string,
	value: Value,
	disabled?: boolean,
	default?: (string | number)[],
}

type TableColumn = {
	title: string,
	value: string | number | undefined,
}

type TableQuestionColumn<Value extends object> = {
	title: string,
	rowAttributeTarget: keyof Value,
}

type TableConfig<Value extends object | string | number> = {
	message: string,
	columns: ReadonlyArray<Value extends object ? TableQuestionColumn<Value> | TableColumn : TableColumn>,
	rows: ReadonlyArray<TableRow<Value> | Separator>,
	pageSize?: number,
	multiple?: boolean,
	required?: boolean,
	loop?: boolean,
	allowUnset?: boolean,
	ignoreEmptyAnswers?: boolean,
	validate?: (answers: TableAnswers<Value>) => boolean | string | Promise<string | boolean>,
	sumUp?: (answers: TableAnswers<Value>) => string
}

type TableAnswer<Value> = {
	choice: Readonly<TableRow<Value>>,
	answers: ReadonlyArray<(string | number)>,
}

export type TableAnswers<Value> = ReadonlyArray<TableAnswer<Value>>

type Pagination = {
	firstIndex: number,
	lastIndex: number,
	currentIndex: number,
}

function isTableRow<Value>(
	row: TableRow<Value> | Separator
): row is TableRow<Value> {
	return !Object.hasOwn(row, 'separator')
}

function isTableColumn<Value extends object>(
	column: TableQuestionColumn<Value> | TableColumn
): column is TableColumn {
	return !Object.hasOwn(column, 'rowAttributeTarget')
}

function hasValue (value: (string | number | undefined)): value is (string | number) {
	return value !== undefined
}

function printTable<Value>(
	columns: ReadonlyArray<Value extends object ? TableQuestionColumn<Value> | TableColumn : TableColumn>,
	rows: ReadonlyArray<TableRow<Value> | Separator>,
	values: TableAnswers<Value>,
	{
		firstIndex,
		lastIndex,
		currentIndex,
	}: Pagination,
	columnIndex: number,
	multiple?: boolean,
) {
	const table = new Table({
		head: [
			chalk.reset.dim(`${firstIndex + 1}-${lastIndex + 1} of ${rows.length}`),
		].concat(columns.map(column => column.title)),
		wordWrap: true,
	})

	const selectedFigures = multiple ? figures.checkboxOn : figures.radioOn
	const unselectedFigures = multiple ? figures.checkboxOff : figures.radioOff

	let offSet = 0

	rows.forEach((row, rowIndex) => {
		const hide = (
			rowIndex > lastIndex
			|| rowIndex < firstIndex
		)

		if (!isTableRow(row)) {
			offSet++
		}

		if (!hide) {
			if (isTableRow(row)) {
				const columnValues: Cell[] = []
				let columnOffset = 0

				columns.forEach((column, colIndex) => {
					if (isTableColumn(column)) {
						if (row.disabled) {
							columnValues.push('')
						}
						else {
							const isFocused = (
								currentIndex === rowIndex - offSet
								&& columnIndex === colIndex - columnOffset
							)

							const isDefaultSelected = values[rowIndex - offSet].answers.length === 0 && column.value === undefined
							const value = values[rowIndex - offSet].answers.findIndex(rowValue => rowValue === column.value) === -1 ? (isDefaultSelected ? selectedFigures : unselectedFigures) : selectedFigures

							columnValues.push(`${isFocused ? '[' : ' '} ${value} ${isFocused ? ']' : ' '}`)
						}
					}
					else {
						columnOffset++

						columnValues.push({
							content: row.value[column.rowAttributeTarget] as string,
							hAlign: 'center',
						})
					}
				})

				table.push([
					chalk.reset.bold.cyan(row.title),
					...columnValues,
				])
			}
			else {
				table.push([{
					content: row.separator,
					colSpan: columns.length + 1,
				}])
			}
		}
	})

	return table.toString()
}

function paginate<Value>(
	rows: ReadonlyArray<TableRow<Value> | Separator>,
	pageSize: number,
	currentRow: number,
): Pagination {
	const middleOfPage = Math.floor(pageSize / 2)
	const firstIndex = Math.max(0, currentRow - middleOfPage)
	const lastIndex = Math.min(
		firstIndex + pageSize - 1,
		rows.length - 1,
	)
	const lastPageOffset = pageSize - 1 - lastIndex + firstIndex

	return {
		firstIndex: Math.max(0, firstIndex - lastPageOffset),
		lastIndex,
		currentIndex: currentRow,
	}
}

function isLeftKey (
	key: KeypressEvent,
): boolean {
	return key.name === 'left'
}

function isRightKey (
	key: KeypressEvent,
): boolean {
	return key.name === 'right'
}

export default createPrompt(
	<Value extends object | string | number,>(
		config: TableConfig<Value>,
		done: (value: TableAnswers<Value>) => void
	) => {
		const {
			pageSize = 7,
			loop = true,
			validate = () => true,
			sumUp = () => '',
			ignoreEmptyAnswers = true,
		} = config

		const [status, setStatus] = useState<Status>('idle')
		const [rowIndex, setRowIndex] = useState(0)
		const [columnIndex, setColumnIndex] = useState(0)
		const [showHelpTip, setShowHelpTip] = useState(true)
		const [values, setValues] = useState<TableAnswers<Value>>(
			config.rows
				.filter(row => isTableRow(row) && !row.disabled)
				.map(row => {
					const tableRow = row as TableRow<Value>

					return {
						choice: tableRow,
						answers: tableRow.default ? tableRow.default : [],
					}
				})
		)
		const [errorMsg, setError] = useState<string | undefined>(undefined)

		const bounds = useMemo(() => {
			if (!values.length) {
				throw new ValidationError('[table-multiple prompt] No selectable choices. Missing rows or all are disabled.')
			}

			if (!config.columns.filter(column => isTableColumn(column) && column.value !== undefined).length) {
				throw new ValidationError('[table-multiple prompt] No selectable choices. All columns are not selectable or have undefined value.')
			}

			const columns = config.columns.filter(column => isTableColumn(column)) as TableColumn[]

			return {
				lastRow: values.length - 1,
				lastColumn: columns.length - 1,
				columns,
			}
		}, [config.rows, config.columns])

		useKeypress(async (key) => {
			const answers = ignoreEmptyAnswers ? values.filter(row => row.answers.length) : values

			// Ignore keypress while our prompt is doing other processing.
			if (status !== 'idle') {
				return
			}

			if (isEnterKey(key)) {
				setStatus('loading')

				if (
					config.required
					&& !answers.find(value => value.answers.length)
				) {
					setError('Please select at least one value.')
					setStatus('idle')
				}
				else {
					const isValid = await validate(answers)

					if (isValid === true) {
						setShowHelpTip(false)
						setStatus('done')
						done(answers)
					} else {
						setError(isValid || 'You must provide a valid value')
						setStatus('idle')
					}
				}
			}
			else if (
				isUpKey(key)
				|| isDownKey(key)
			) {
				const offset = isUpKey(key) ? -1 : 1

				setError(undefined)

				if (
					loop
					|| (
						rowIndex + offset >= 0
						&& rowIndex + offset <= bounds.lastRow
					)
				) {
					const newIndex = (values.length + rowIndex + offset) % values.length

					setRowIndex(newIndex)
				}
			}
			else if (
				isLeftKey(key)
				|| isRightKey(key)
			) {
				const offset = isLeftKey(key) ? -1 : 1

				setError(undefined)

				if (
					columnIndex + offset >= 0
					&& columnIndex + offset <= bounds.lastColumn
				) {
					setColumnIndex(columnIndex + offset)
				}
			}
			else if (
				isSpaceKey(key)
			) {
				setError(undefined)
				setShowHelpTip(false)

				const prevItems = values.slice(0, rowIndex)
				const nextItems = values.slice(rowIndex + 1, values.length)

				let currentValues: (string | number)[] = [...values[rowIndex].answers]

				const value = bounds.columns[columnIndex].value

				if (config.multiple) {
					const valueIndex = currentValues.findIndex(value => bounds.columns[columnIndex].value === value)

					if (valueIndex === -1) {
						if (hasValue(value)) {
							currentValues.push(value)
						} else {
							currentValues = []
						}
					}
					else {
						currentValues.splice(valueIndex, 1)
					}
				}
				else if (config.allowUnset) {
					if (currentValues.length) {
						if (
							value !== currentValues[0]
							&& hasValue(value)
						) {
							currentValues = [value]
						}
						else {
							currentValues = []
						}
					}
					else if (hasValue(value)) {
						currentValues = [value]
					}
				}
				else if (hasValue(value)) {
					currentValues = [value]
				}
				else {
					currentValues = []
				}

				setValues([
					...prevItems,
					{
						choice: values[rowIndex].choice,
						answers: currentValues,
					},
					...nextItems
				])
			}
		})

		const table = printTable(config.columns, config.rows, values, paginate(config.rows, pageSize, rowIndex), columnIndex, config.multiple)

		let helpTip = ''

		if (showHelpTip) {
			helpTip = `(Press ${chalk.cyan.bold('<space>')} to select, ${chalk.cyan.bold('<Up and Down>')} to move rows, ${chalk.cyan.bold('<Left and Right>')} to move columns)`
		}

		let error = ''

		if (errorMsg) {
			error = chalk.red('>> ' + errorMsg)
		}

		const prefix = usePrefix({ status })

		const printToShell = [
			[
				prefix,
				config.message,
				helpTip,
			].filter(Boolean).join(' '),
		]

		if (status !== 'done') {
			printToShell.push('', table.toString())
		} else {
			const answers = ignoreEmptyAnswers ? values.filter(row => row.answers.length) : values
			const summarized = sumUp(answers)

			if (summarized) {
				printToShell.push(summarized)
			} else {
				printToShell[printToShell.length - 1] += ` (answered, no preview)`
			}
		}

		printToShell.push(`${error}${ansiEscapes.cursorHide}`)

		return printToShell.join('\n')
	}
)
