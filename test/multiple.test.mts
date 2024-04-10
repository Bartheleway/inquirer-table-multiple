import { describe, it, expect } from 'vitest'
import { render } from '@inquirer/testing'
import tableMultiple from '../src/index.mjs'

describe('table-multiple prompt [multiple]', () => {
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☐ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☒ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
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

	it('unselect when pressing space on focused value', async () => {
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☐ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☒ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
			'└──────────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☐ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬─────────┐',
			'│ 1-2 of 2 │ A?    │ Default │',
			'├──────────┼───────┼─────────┤',
			'│ Test 1   │ [ ☐ ] │   ☒     │',
			'├──────────┼───────┼─────────┤',
			'│ Test 2   │   ☐   │   ☒     │',
			'└──────────┴───────┴─────────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬─────────┐',
			'│ 1-2 of 2 │ A?    │ Default │',
			'├──────────┼───────┼─────────┤',
			'│ Test 1   │ [ ☒ ] │   ☐     │',
			'├──────────┼───────┼─────────┤',
			'│ Test 2   │   ☐   │   ☒     │',
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ☒ ] │   ☐   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ☐   │   ☐   │',
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┐',
			'│ 1-2 of 2 │ A?    │',
			'├──────────┼───────┤',
			'│ Test 1   │ [ ☐ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
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
			'│ Test 1   │ [ ☐ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
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
			'│ Test 1   │ [ ☒ ] │',
			'├──────────┼───────┤',
			'│ Test 2   │   ☐   │',
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

	it('handle multiple choice', async () => {
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
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ☐ ] │   ☐   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ☐   │   ☐   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┐',
			'│ 1-2 of 2 │ A?    │ B?    │',
			'├──────────┼───────┼───────┤',
			'│ Test 1   │ [ ☒ ] │   ☐   │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ☐   │   ☐   │',
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
			'│ Test 1   │   ☒   │ [ ☒ ] │',
			'├──────────┼───────┼───────┤',
			'│ Test 2   │   ☐   │   ☐   │',
			'└──────────┴───────┴───────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A', 'B'],
			}
		])
	})

	it('cannot select undefined choice when other choice selected', async () => {
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
				{
					title: 'Untouched',
					value: undefined,
				},
			],
			rows: choices,
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │ [ ☐ ] │   ☐   │   ☒       │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │ [ ☒ ] │   ☐   │   ☐       │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('right')
		events.keypress('right')
		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │   ☒   │   ☐   │ [ ☐ ]     │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([
			{
				choice: choices[0],
				answers: ['A'],
			}
		])
	})

	it('goes back to undefined choice when no other choice selected', async () => {
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
				{
					title: 'Untouched',
					value: undefined,
				},
			],
			rows: choices,
			multiple: true,
		})

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want? (Press <space> to select, <Up and Down> to move rows, <Left',
			'and Right> to move columns)',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │ [ ☐ ] │   ☐   │   ☒       │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │ [ ☒ ] │   ☐   │   ☐       │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('space')

		expect(getScreen()).toMatchInlineSnapshot([
			'"What do you want?',
			'',
			'┌──────────┬───────┬───────┬───────────┐',
			'│ 1-2 of 2 │ A?    │ B?    │ Untouched │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 1   │ [ ☐ ] │   ☐   │   ☒       │',
			'├──────────┼───────┼───────┼───────────┤',
			'│ Test 2   │   ☐   │   ☐   │   ☒       │',
			'└──────────┴───────┴───────┴───────────┘"'
		].join('\n'))

		events.keypress('enter')

		await expect(answer).resolves.toEqual([])
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
			multiple: true,
		})

		await expect(answer).rejects.toEqual(new Error('[table-multiple prompt] No selectable choices. All columns are not selectable or have undefined value.'))
	})
})
