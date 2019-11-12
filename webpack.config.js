const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
	entry: __dirname + '/app.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				// Preprocess your css files
				// you can add additional loaders here (e.g. sass/less etc.)
				test: /\.css$/,
				exclude: /node_modules/,
				use: ['style-loader', 'css-loader']
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
		])
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
