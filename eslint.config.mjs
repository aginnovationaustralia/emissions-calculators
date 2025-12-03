import js from '@eslint/js';
import jest from "eslint-plugin-jest";
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['**/dist/**', '**/node_modules/**'],
	},
	{
		...js.configs.recommended,
	},
	{
		files: ['**/*.cjs', '**/*.mjs'],
		languageOptions: {
			globals: {
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				console: 'readonly',
			},
		},
	},
	...tseslint.configs.recommended.map(config => ({
		...config,
		rules: {
			...config.rules,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	})),
	{
		...jest.configs['flat/recommended'],
		files: ['**/*.test.ts', '**/*.test.js'],
		"rules": {
			"jest/no-standalone-expect": [
			  "error",
			  { "additionalTestBlockFunctions": ["compareEmissionsFrom2Inputs"] }
			]
		  }
	},
];