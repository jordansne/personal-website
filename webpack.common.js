const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle-[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [ '@babel/preset-env' ]
                }
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets/images/',
                    to: 'images'
                }, {
                    from: 'assets/global.css',
                    to: 'styles/global.css'
                }, {
                    from: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
                    to: 'styles/fontawesome.css'
                }, {
                    from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
                    to: 'webfonts'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'Jordan Sne',
            template: './src/index.html',
            favicon: './assets/favicon.ico',
            inject: 'head',
            minify: true,
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                'styles/global.css',
                'styles/fontawesome.css',
            ],
            append: true,
            hash: true
        })
    ],
};
