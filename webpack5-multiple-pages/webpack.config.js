const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

let path = require('path');
let fs = require('fs');

const devMode = process.env.NODE_ENV !== "production";

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports= (env, argv) => {
    console.log(argv);
    if(env.WEBPACK_SERVE) {//dev

    }
    if(env.WEBPACK_BUILD) {//编译时删除dist的文件
        fs.rmSync(resolve('dist'), {recursive : true, force : true});
    }

    let entrys = {}, plugins = [];

    //全局引入的文件
    let mainPath = './src/main.js';
    if(fs.existsSync(mainPath)) {
        entrys['main'] = mainPath;
    }

    let dirs = fs.readdirSync('./src/pages/');
    dirs.forEach((key) => {
        let filename = `${key}`;

        entrys[filename] = resolve(`src/pages/${key}/index.js`);
        plugins.push(new HtmlWebPackPlugin({
            template: resolve(`src/pages/${key}/index.html`),
            filename: `${key}.html`,
            minify: false,
            chunks: ['main', filename]
        }));
    });

    //环境变量
    plugins.push(new webpack.DefinePlugin({
        /*
        * html模板读取方法<%= BASE_URL %>
        * js 运行时读取方法 直接写名字 如: console.log(env);
        * */
        BASE_URL: JSON.stringify("/"),
        env: JSON.stringify({
            mode: argv.mode
        })
    }));

    //复制public内的文件到dist
    plugins.push(new copyWebpackPlugin({
        patterns: [
            {
                from: 'public/',
                to: resolve('dist')
            }
        ]
    }));

    //抽取css到单独的文件
    plugins.push(new MiniCssExtractPlugin({
        filename: 'static/style/[name].css'
    }));

    return {
        entry: {
            ...entrys,
        },
        plugins: plugins,
        output: {
            filename: 'static/js/[name].[hash].js',
            path: resolve('dist'),
            //publicPath: '/',
        },
        //生产环境压缩css
        optimization: {
            minimizer: [
                // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
                // `...`,
                new CssMinimizerPlugin(),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.(png|svg|gif|jpe?g)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/img/[name].[hash:6].[ext]',
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                {
                    test: /\.less$|\.css$/i,
                    use: [
                        // compiles Less to CSS
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader'
                        },
                        'postcss-loader',
                        'less-loader',
                    ],
                },
            ]
        },
        devServer: {
            port: 9000,
        },
    };
}
