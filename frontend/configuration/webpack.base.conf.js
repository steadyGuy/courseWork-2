const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist')
};

const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {

    entry: {
        app: PATHS.src
    },

    externals: {
        paths: PATHS
    },

    output: {
        filename: 'js/[name].[hash].js',
        path: PATHS.dist,
        publicPath: '/'
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader, //дозволяє підкючати файл css в index.js
                    {
                        loader: "css-loader", // переводить css в common.js тіпа css файл в js
                        options: { sourceMap: true }
                    },
                    {
                        loader: "postcss-loader",
                        options: { sourceMap: true, config: { path: 'postcss.config.js' } }
                    },
                    {
                        loader: "sass-loader", // компилирует Sass в CSS, используя Node Sass по умолчанию
                        options: { sourceMap: true }
                    }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, ".html")}`,
            inject: true, // плагін авоматично вставляє шляхи в HTML файлі | false - доведеться вставляти стилі і js вручну через ejs
            hash: false, // по умолчанию false
        })),
        new CopyWebpackPlugin([
            { from: `${PATHS.src}/img`, to: `img` },
            { from: `${PATHS.src}/static`, to: 'static' }
        ])
    ]

}