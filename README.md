# inquirer-table-multiple

[![npm version](https://badge.fury.io/js/@bartheleway%2Finquirer-table-multiple.svg)](https://badge.fury.io/js/@bartheleway%2Finquirer-table-multiple)
[![codecov](https://codecov.io/gh/Bartheleway/inquirer-table-multiple/graph/badge.svg?token=Y4RDJ47UZQ)](https://codecov.io/gh/Bartheleway/inquirer-table-multiple)
![Tests](https://github.com/Bartheleway/inquirer-table-multiple/actions/workflows/main.yml/badge.svg)

Interactive table component for command line interfaces.

```sh
Choose between choices? (Press <space> to select, <Up and Down> to move rows,
<Left and Right> to move columns)

┌──────────┬────────┬────────┐
│ 1-2 of 2 │ Yes?   │ No?    |
├──────────┼────────┼────────┤
│ Choice 1 │ [ ◯ ] │   ◯   |
├──────────┼────────┼────────┤
│ Choice 2 │   ◯   │   ◯   |
└──────────┴────────┴────────┘

```

# Installation

```sh
npm install @bartheleway/inquirer-table-multiple

yarn add @bartheleway/inquirer-table-multiple
```

# Usage

```js
import tableMultiple from '@bartheleway/inquirer-table-multiple'

const answer = await tableMultiple({
	message: 'Choose between choices?',
	columns: [
		{
			title: 'Yes?'
			value: 1,
		},
		{
			title: 'No?'
			value: 0,
		},
	],
	rows: [
		{
			value: 1,
			title: 'Choice 1',
		},
		{
			value: 2,
			title: 'Choice 2',
		}
	],
})
```

## Options

| Property | Type | Required | Description | Default |
| - | - | - | - | - |
| allowUnset | `boolean` | no | If `multiple` is set to false and this one to `true`, you can unselect the selected choice. | `false`
| columns | `(TableQuestionColumn<Value> \| TableColumn)[]` | yes | The list of columns to display. |
| loop | `boolean` | no | Indicate if you can loop over table rows.  | `true`
| message | `string` | yes | The question to ask. |
| multiple | `boolean` | no | Indicate if rows allows multiple choices or not. | `false`
| pageSize | `number` | no | The number of lines to display. | `7` |
| required | `boolean` | no | Indicate if at least one choice is necessary. | `false`
| rows | `(TableRow \| Separator)[]` | yes | The list of rows. Each row offer a choice which can be multiple (radio vs checkbox vs checkbox-multi) based on the `mode` option. |
| validate | `TableAnswers<Value> => boolean \| string \| Promise<string \| boolean>` | no | On submit, validate the answered content. When returning a string, it'll be used as the error message displayed to the user. Note: returning a rejected promise, we'll assume a code error happened and crash. |

## Columns

Column definition will be used to make the header row of the table.

You can have addition information column by using `TableQuestionColumn<Value>`with an object attribute name of the value used in rows. In this case, `value` of `TableRow` must be an object.

```typescript
type TableColumn = {
	title: string,
	value: string | number | undefined,
}

type TableQuestionColumn<Value> = {
	title: string,
	rowAttributeTarget: keyof Value,
}
```

## Rows

Row definition will be used to generate each rows of the table. A disabled row will display as usual but without any selectable choice.

`title` will be used as first column label to differenciate each row.

A separator will span over all columns and display its `separator` param.

```typescript
type TableRow<Value> = {
	title: string,
	value: Value,
	disabled?: boolean,
	default?: (string | number)[]
}
```

## Returned value

This inquirer prompt will return an array. Each responded row will contains the row value (`choice`) along with selected answers.

```typescript
type TableAnswers<Value> = TableAnswer<Value>[]

type TableAnswer<Value> = {
	choice: TableRow<Value>[],
	answers: (string | number)[],
}
```

# Advance usage & exemples

You can have a look to [tests files](https://github.com/Bartheleway/inquirer-table-multiple/tree/master/test) to look for advanced usage.

# Testing

Some OS doesn't trim test result lines so you can set an environment variable `FIX_OS_EXTRA_SPACE=1` to fix that and enable having consistent result with local & remote runner.

The simpliest way is to replace `test` entry value in `package.json` with `FIX_OS_EXTRA_SPACE=1 && vitest`.

# License

Copyright (c) 2024 Bartheleway
Licensed under the MIT license.
