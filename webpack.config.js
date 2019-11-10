const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: __dirname + '/app.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: []
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.html',
			inject: 'body'
		})
	],
	devServer: {
		contentBase: './src/public',
		port: 5500
	}
};
