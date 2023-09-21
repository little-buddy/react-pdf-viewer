module.exports = {
	plugins: {
		'tailwindcss/nesting': {},
		tailwindcss: {},
		'postcss-flexbugs-fixes': {},
		'postcss-preset-env': {
			autoprefixer: { flexbox: 'no-2009' },
			stage: 3,
		},
		'postcss-normalize': {},

		// px2rem 插件配置
		// 'postcss-plugin-px2rem': {
		// 	rootValue: 75,
		// 	unitPrecision: 2,
		// 	propWhiteList: [],
		// 	propBlackList: ['border', 'text-shadow', 'box-shadow'],
		// 	exclude: /node_modules/i,
		// 	selectorBlackList: [],
		// 	ignoreIdentifier: false,
		// 	replace: true,
		// 	mediaQuery: false,
		// 	minPixelValue: 0
		// }
	},
};
