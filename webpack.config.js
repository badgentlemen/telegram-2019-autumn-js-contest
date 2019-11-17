const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

module.exports = {
	entry: __dirname + '/app.js',
	output: {
		path: __dirname + '/dist',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash:5].js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
                        presets: ['@babel/preset-env'],
					}
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[hash:4].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.html',
			inject: true
		}),
		new AddAssetHtmlPlugin([
			{
				filepath: require.resolve('./src/vendor/jquery.min.js')
			},
			{
				filepath: require.resolve('./src/vendor/telegramApi.js')
			},
		]),
		new BundleAnalyzerPlugin({
			analyzerPort: '5555',
			analyzerMode: 'server',
			openAnalyzer: true
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					name: 'vendor',
					test: /node_modules/,
					enforce: true
				}
			}
		},
		runtimeChunk: false
	},
	devServer: {
		contentBase: './src/public',
		port: 5500
	}
};
