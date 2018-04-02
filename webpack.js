


const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const extractLess = new ExtractTextPlugin({
	filename: '[name].[contenthash].css',

	/** 开发模式下关闭这个插件 */
	disable: process.env.NODE_ENV === 'development'
});

module.exports = function (env, argv) {
	return {
		entry: {
			/** “简称”:“路径” */
			'demo': './demo.js'
		},

		output: {

			filename: '[name]/main.[hash:8].js',

			chunkFilename: '[name].[chunkhash:8].js',

			/** dist为目标文件夹 */
			path: path.resolve(__dirname, 'dist')
		},

		resolve: {
			modules: [
				path.resolve(__dirname, 'src'),
				'node_modules'
			]
		},

		/** sourcemap采用inline */
		devtool: 'inline-source-map',

		/** 启动node服务器代理 */
		devServer: {
			proxy: [{
				/** 采用数组写法,可以简单添加需要代理的页面 */
				context: ['/apiA', '/apiB', '/apiC'],

				target: 'https://www.demo.com',

				/** 关闭 ssl 证书校验 */
				secure: false,

				/** 修改 header 中的 host 字端 */
				changeOrigin: true,

				/** 设置referer头,开发时候用 */
				onProxyReq(proxyReq, req, res) {
					proxyReq.setHeader('referer', 'https://www.demo.com/')
				}
			}],

			host: 'www.demo.com',

			/** 取消警告 */
			noInfo: true
		},

		plugins: [
			/** html生成 */
			new HtmlWebpackPlugin({
				filename: 'demo.html',
				title: 'demo',
				/** 默认模板选取 */
				template: path.relative(__dirname, 'src/default.html'),
				/** js文件选取「demo.js」 */
				chunks: ['demo']
			}),

			/** 提取less文件 */
			extractLess,

			/** 每build一次,清一次原来的打包代码 */
			new CleanWebpackPlugin(['dist']),

			/** 声明文件生成 */
			new ManifestPlugin()
		]
	};
};
