/* eslint-disable @typescript-eslint/no-var-requires */
const { when } = require('@craco/craco');

const webpack = require('webpack');
const WebpackBundleAnalyzer =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WepbackBar = require('webpackbar');
const Smp = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const {
	isEnvProduction,
	addPath,
	splitChunks,
	getBabelConf,
	refactorEntry,
	isAnalyze,
} = require('./cracoplugin');

/* 
	carco 的 babel 只能在 carco.config.js 里面配置
 */

/* 
	carco.config.js 不保证只加载一次
	see https://github.com/dilanx/craco/issues/518
 */
module.exports = () => {
	console.log(addPath('./src'));

	return {
		// 自定义 fork 的react-scripts 路径
		// reactScriptsVersion:''
		webpack: new Smp().wrap({
			configure: (config, { env, paths }) => {
				refactorEntry(config);
				// eslint-disable-next-line no-unused-expressions
				isEnvProduction && splitChunks(config);

				return config;
			},
			plugins: [
				new WepbackBar({
					profile: true,
					color: '#fa8c16',
				}),
				// new HardSourceWebpackPlugin(),
				new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
				// 默认处理['css', 'scss', 'sass']
				// new StyleLintPlugin(),
				...when(isAnalyze, () => [new WebpackBundleAnalyzer()], []),
			],
			babel: getBabelConf(),
			style: {
				postcss: {
					mode: 'file',
				},
			},
			eslint: {
				mode: 'file',
			},
			externals: {
				// cdn 资源不打包
			},
			alias: {
				'@': addPath('./src'),
			},
		}),

		devServer: {
			proxy: {
				'/api': {
					target: 'https://radishes.vercel.app',
					secure: false,
					changeOrigin: true,
					pathRewrite: {
						'^/api': '/api',
					},
				},
			},
		},
	};
};
