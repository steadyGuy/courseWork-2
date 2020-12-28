const merge = require('webpack-merge');
const webpack = require('webpack');

const baseConfig = require('./webpack.base.conf');
const devConfig = merge(baseConfig, {
    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    devServer: {
        overlay: {
            warnings: false,
            errors: true
        },
        port: 3001,
        contentBase: baseConfig.externals.paths.dist
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]

});

module.exports = devConfig;

// module.exports = new Promise((resolve, reject) => {
//     resolve();
// });