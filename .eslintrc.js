module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'airbnb',
		'airbnb/hooks',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:react/jsx-runtime',
	],
	plugins: [
		'react',
		'jsx-a11y',
		'import',
		'@typescript-eslint/eslint-plugin',
		'prettier',
		'unused-imports',
	],
	globals: {
		require: true,
	},
	rules: {
		// prettier
		'prettier/prettier': 'error',
		'no-unused-expressions': 1,
		'global-require': 0,
		// TypeScript
		'@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{ 'ts-expect-error': 'allow-with-description' },
		],
		// v4 changes
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': ['error'],
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		// React
		'react/no-array-index-key': 1,
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react/prop-types': ['off', {}],
		'react/function-component-definition': [
			'off',
			// {
			// 	unnamedComponents: ['function-expression', 'arrow-function'],
			// 	namedComponents: ['function-declaration'],
			// },
		],
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		// import
		// 'import/extensions': [
		// 	'error',
		// 	'ignorePackages',
		// 	{
		// 		js: 'never',
		// 		mjs: 'never',
		// 		jsx: 'never',
		// 		ts: 'never',
		// 		tsx: 'never',
		// 	},
		// ],
		'import/extensions': 'off',
		'import/prefer-default-export': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		/* unused-imports */
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
			},
		},
		'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx'],
	},
};
