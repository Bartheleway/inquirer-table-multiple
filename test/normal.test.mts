import { describe, it, expect } from 'vitest'
import { render } from '@inquirer/testing'
import tableMultiple from '../src/index.mjs'
import { Separator } from '@inquirer/core'

describe('table-multiple prompt [normal]', () => {
	it('handle simple use case', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◉ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A'],
			}
		])
	})

	it('unselect when pressing space on focused value (allowUnset)', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
			allowUnset: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('space')
		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))
	})

	it('default select undefined column value', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
				{
					title: 'Default',
					value: undefined,
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬─────────┐',
			'│ 1-2 of 2 │ A?    │ Default │',
			'├──────────┼───────┼─────────┤',
			'│ Test 1   │ [ ◯ ] │   ◉     │',
			'├──────────┼───────┼─────────┤',
			'│ Test 2   │   ◯   │   ◉     │',
			'└──────────┴───────┴─────────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬─────────┐',
			'│ 1-2 of 2 │ A?    │ Default │',
			'├──────────┼───────┼─────────┤',
			'│ Test 1   │ [ ◉ ] │   ◯     │',
			'├──────────┼───────┼─────────┤',
			'│ Test 2   │   ◯   │   ◉     │',
			'└──────────┴───────┴─────────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A'],
			}
		])
	})

	it('use default attribute', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
				default: ['A'],
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
				{
					title: 'B?',
					value: 'B',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◉ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A'],
			}
		])
	})

	it('allow disabled rows', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
				disabled: true,
			}
		]

		const { getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │       │',
			'└──────────┴───────┘"'
		].join('\n'))
	})

	it('loop over by default', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('up')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │   ◯   │',
			'├──────────┼───────┤',
			'│ Test 2   │ [ ◯ ] │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('down')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))
	})

	it('navigate to bounds', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
				{
					title: 'B?',
					value: 'B',
				},
			],
			rows: choices,
			loop: false,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('up')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('down')
		events.keypress('down')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │   ◯   │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │ [ ◯ ] │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('up')
		events.keypress('up')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('left')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('right')
		events.keypress('right')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │   ◯   │ [ ◯ ] │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('left')
		events.keypress('left')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))
	})

	it('display error when required but no selection', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
			required: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◯ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘',
			'>> Please select at least one value."'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ◉ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ◯   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A'],
			}
		])
	})

	it('toggle choice in multi-column', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
				{
					title: 'B?',
					value: 'B',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◉ ] │   ◯   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('right')
		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │   ◯   │ [ ◉ ] │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['B'],
			}
		])
	})

	it('display separator as a table span column', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			new Separator('Test separator'),
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer, events, getScreen } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
				{
					title: 'B?',
					value: 'B',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-3 of 3 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ◯ ] │   ◯   │',
			'├──────────┴───────┴───────┤',
			'│ Test separator           │',
			'├──────────┬───────┬───────┤',
			'│ Test 2   │   ◯   │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('down')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-3 of 3 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │   ◯   │   ◯   │',
			'├──────────┴───────┴───────┤',
			'│ Test separator           │',
			'├──────────┬───────┬───────┤',
			'│ Test 2   │ [ ◯ ] │   ◯   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('right')
		events.keypress('space')
		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[2],
				answers: ['B'],
			}
		])
	})

	it('display information column', async () => {
		const choices = [
			{
				value: {
					test: '1',
				},
				title: 'Test 1',
			},
			new Separator('Test separator'),
			{
				value: {
					test: '2',
				},
				title: 'Test 2',
			}
		]

		const { getScreen } = await render(tableMultiple<{ test: string }>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'Test value',
					rowAttributeTarget: 'test',
				},
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: choices,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬────────────┬───────┐',
			'│ 1-3 of 3 │ Test value │ A?    │',
			'├──────────┼────────────┼───────┤',
			'│ Test 1   │     1      │ [ ◯ ] │',
			'├──────────┴────────────┴───────┤',
			'│ Test separator                │',
			'├──────────┬────────────┬───────┤',
			'│ Test 2   │     2      │   ◯   │',
			'└──────────┴────────────┴───────┘"'
		].join('\n'))
	})

	it('throws error if missing columns', async () => {
		const choices = [
			{
				value: '1',
				title: 'Test 1',
			},
			{
				value: '2',
				title: 'Test 2',
			}
		]

		const { answer } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [],
			rows: choices,
		})

		await expect(answer).rejects.toEqual(new Error('[table-multiple prompt] No selectable choices. All columns are not selectable or have undefined value.'))
	})

	it('throws error if columns don\'t have a selectable choice', async () => {
		const choices = [
			{
				value: {
					test: '1',
				},
				title: 'Test 1',
			},
			{
				value: {
					test: '2',
				},
				title: 'Test 2',
			}
		]

		const { answer } = await render(tableMultiple<{ test: string }>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					rowAttributeTarget: 'test',
				},
			],
			rows: choices,
		})

		await expect(answer).rejects.toEqual(new Error('[table-multiple prompt] No selectable choices. All columns are not selectable or have undefined value.'))
	})

	it('throws error if missing rows', async () => {
		const { answer } = await render(tableMultiple<string>, {
			message: 'What do you want?',
			columns: [
				{
					title: 'A?',
					value: 'A',
				},
			],
			rows: [],
		})

		await expect(answer).rejects.toEqual(new Error('[table-multiple prompt] No selectable choices. Missing rows or all are disabled.'))
	})
})
