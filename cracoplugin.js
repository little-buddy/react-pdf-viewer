/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { addPlugins, removePlugins } = require('@craco/craco');
const PreloadWebapckPlugin = require('@vue/preload-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const addPath = dir => path.resolve(__dirname, dir);

const isEnvProduction = process.env.NODE_ENV === 'production';

const isAnalyze = process.env.ANALYZE;

const getBabelConf = () => ({
	// react 默认配置了
	// loaderOptions: {
	// 	cacheDirectory: true,
	// },

	plugins: [
		[
			'import',
			{
				libraryName: 'lodash',
				libraryDirectory: '',
				camel2DashComponentName: false,
			},
		],
	],
});

const preloadAsyncChunks = config => {
	addPlugins(
		config,
		[
			new PreloadWebapckPlugin({
				rel: 'preload',
				include: 'initial',
				fileBlacklist: [/\.map$/, /hot-update\.js$/],
			}),
			'append',
		],
		// prefetch
		[
			new PreloadWebapckPlugin({
				rel: 'prefetch',
				include: 'asyncChunks',
			}),
			'append',
		]
	);
};

const refactorEntry = config => {
	// eslint-disable-next-line no-param-reassign
	config.entry = {
		app: config.entry,
	};

	addPlugins(config, [
		[
			new HtmlWebpackPlugin({
				inject: 'body',
				template: addPath('./public/index.html'),
				// external的js-cdn 可以配置在这里
				cdn: {
					js: [],
					css: [],
				},
				...(isEnvProduction
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
							},
					  }
					: undefined),
			}),
			'prepend',
		],
		new WebpackManifestPlugin({
			fileName: 'asset-manifest.json',
			// publicPath: paths.publicUrlOrPath,
			generate: (seed, files, entrypoints) => {
				const manifestFiles = files.reduce((manifest, file) => {
					// eslint-disable-next-line no-param-reassign
					manifest[file.name] = file.path;
					return manifest;
				}, seed);
				const entrypointFiles = entrypoints.app.filter(
					fileName => !fileName.endsWith('.map')
				);

				return {
					files: manifestFiles,
					entrypoints: entrypointFiles,
				};
			},
		}),
	]);

	removePlugins(config, (value, index, array) => {
		const pluginName = Object.getPrototypeOf(array[index]).constructor.name;

		if (pluginName === 'HtmlWebpackPlugin' && index !== 0) {
			return true;
		}

		if (['WebpackManifestPlugin'].indexOf(pluginName) > -1) {
			const plugin = array[index];
			if (!(plugin instanceof WebpackManifestPlugin)) {
				return true;
			}
		}

		return false;
	});
};

// Override webpack optimization
// See https://github.com/dilanx/craco/issues/44
const splitChunks = config => {
	config.optimization.splitChunks = {
		cacheGroups: {
			reactLib: {
				test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@reduxjs\/toolkit\/dist)[\\/]/,
				name: 'react-lib',
				chunks: 'all',
				enforce: true,
				priority: 40,
				reuseExistingChunk: true,
			},
			vendors: {
				name: `chunk-vendors`,
				test: /[\\/]node_modules[\\/]/,
				priority: -10,
				chunks: 'initial',
			},
			common: {
				name: `chunk-common`,
				minChunks: 2,
				priority: -20,
				chunks: 'initial',
				reuseExistingChunk: true,
			},
		},
	};
};

module.exports = {
	addPath,
	isEnvProduction,
	getBabelConf,
	preloadAsyncChunks,
	splitChunks,
	refactorEntry,
	isAnalyze,
};
