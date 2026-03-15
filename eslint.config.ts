import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import {
	defineConfig,
	globalIgnores,
} from 'eslint/config'

export default defineConfig([
	globalIgnores([
		'.pnp.cjs',
		'.yarn/**',
		'coverage/**',
		'dist/**',
	]),
	{
		extends: ['js/recommended'],
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
		},
		plugins: { js },
		rules: {
			indent: [
				'error',
				'tab'
			],
			'linebreak-style': [
				'error',
				'unix'
			],
			quotes: [
				'error',
				'single'
			],
			semi: [
				'error',
				'never'
			]
		},
	},
	tseslint.configs.recommended,
	{
		files: ['**/*.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended'],
	},
	{
		files: ['**/*.md'],
		plugins: { markdown },
		language: 'markdown/gfm',
		extends: ['markdown/recommended']
	},
])
