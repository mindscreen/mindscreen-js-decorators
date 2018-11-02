const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        'decorators': './src/decorators.js',
        'decorators.min': './src/decorators.js',
    },
    devtool: '#source-map',
    output: {
        path: path.resolve('./dist/'),
        filename: '[name].js',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min/,
            }),
        ],
    },
};
