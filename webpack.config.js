const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/components/index.js',
    output: {
        path: path.join(__dirname + '/public/'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            sldsCss: __dirname + "/node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css",
            sldsImages: __dirname + "/node_modules/@salesforce-ux/design-system/assets/images/",
            sldsIcons: __dirname + "/node_modules/@salesforce-ux/design-system/assets/icons/"
        }
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react', 'stage-2']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader?name=/fonts/[name].[ext]'
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles/styles.css')
    ]
}
