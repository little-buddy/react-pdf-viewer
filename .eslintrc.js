module.exports = {
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'airbnb',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:react/jsx-runtime',
		// "prettier/react",
		// "prettier/@typescript-eslint",
	],
	plugins: ['react', 'jsx-a11y', 'import', 'prettier', '@typescript-eslint'],
	globals: {
		require: true,
	},
	rules: {
		// prettier
		'prettier/prettier': 'off',
		// TypeScript
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		// v4 changes
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': ['error'],
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		// React
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react/prop-types': ['off', {}],
		'react/function-component-definition': [
			2,
			{ namedComponents: 'arrow-function' },
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
