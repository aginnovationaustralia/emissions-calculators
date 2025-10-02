import js from '@eslint/js';
import jest from "eslint-plugin-jest";
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['**/dist/**', '**/node_modules/**'],
	},
	{
		...js.configs.recommended,
		plugins: { jest },
		files: ['**/*.js'],
	},
	...tseslint.configs.recommended.map(config => ({
		...config,
		plugins: {
			...config.plugins,
			jest,
		},
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
];