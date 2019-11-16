const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
    entry: __dirname + '/app.js',
    devtool: 'cheap-module-source-map',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
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
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader'
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
			}
		]),
		new BundleAnalyzerPlugin({
			analyzerPort: '5555',
			analyzerMode: 'server',
			openAnalyzer: true
		})
	],
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			automaticNameMaxLength: 30,
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	},
	devServer: {
		contentBase: './src/public',
		port: 5500
	}
};
