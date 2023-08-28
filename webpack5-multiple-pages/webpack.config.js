const HtmlWebPackPlugin = require('html-webpack-plugin');
/*
* HtmlWebPackPlugin里面用的lodash的template来解析模板
* 所以可以这样在html里面引用其他共用文件
* 1. 先用html-loader加载出来html文件
* 2. 然后用lodash的template模板引擎来解析, 不然直接引用是无法解析里面引用的变量的
* 3. :)
* <%=  _.template(require('html-loader!@base/components/header.html').default)(env)  %>
* */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

let path = require('path');
let fs = require('fs');

const devExclude = [

];

const devInclude = [

];

function resolve(dir) {
    return path.join(__dirname, dir)
}

////////////////////////////////////////////////////////////////////////////////////

const devMode = process.env.NODE_ENV !== "production";
const SERVER_PORT = 9000;
const publicPath = '/';//资源引用前缀
const outDirPreFix = 'static/';//资源输出目录前缀, 如果是目录则需要反斜杠结尾


const htmlEnv = {
    /*html 环境变量*/
    prefixTitle: '风车网 - ',//页面title前缀
    logoName: '风车网',
    publicPath: publicPath,
    headKeyPre: ['风车网', '热搜', '热搜榜', '算命', '狗屁不通文章生成', '万年历'].join(','),
    isDev: devMode,
};


let alias = {
    '@base': resolve('src/'),//直接用@可能会和vue冲突
};


////////////////////////////////////////////////////////////////////////////////////


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
        if(filename.startsWith('vue-')) {
            //单独处理一下?

        }
        //每个目录增加alias
        alias[key] = `@${key}`;

        entrys[filename] = resolve(`src/pages/${key}/index.js`);
        plugins.push(new HtmlWebPackPlugin({
            template: resolve(`src/pages/${key}/index.html`),
            filename: `${key}.html`,
            minify: false,
            chunks: ['main'/*每个都引入全局引入的文件*/, filename]
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
            mode: argv.mode,
            ...htmlEnv
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
        filename: `${outDirPreFix}style/[name].css`
    }));

    plugins.push(new VueLoaderPlugin());
    return {
        entry: {
            ...entrys,
        },
        plugins: plugins,
        output: {
            filename: `${outDirPreFix}js/[name].[hash].js`,
            path: resolve('dist'),
            publicPath: publicPath,
        },

        optimization: {
            runtimeChunk: 'single',
            minimizer: [
                // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
                `...`,
                new CssMinimizerPlugin(),//生产环境压缩css
            ],
            splitChunks: {
                cacheGroups: {
                    //打包公共模块
                    commons: {
                        chunks: 'initial', //initial表示提取入口文件的公共部分
                        minChunks: 2, //表示提取公共部分最少的文件数
                        minSize: 0, //表示提取公共部分最小的大小
                        name: 'commons' //提取出来的文件命名
                    }
                }
            }
        },
        resolve: {
            alias: alias,
        },

        module: {
            rules: [
                /*
                * 如果引入了html-loader HtmlWebPackPlugin就不会解析模板了
                * */
               /* {
                    test: /\.html$/i,
                    loader: "html-loader",
                    options: {
                        // Disables attributes processing
                        sources: false,
                    },
                },*/
                {
                    test: /\.(png|svg|gif|jpe?g)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `${outDirPreFix}img/[name].[hash:6].[ext]`,
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
                    //test: /\.less$/,
                    use: [
                        'vue-style-loader',
                        // compiles Less to CSS
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: false,
                            },
                        },
                        {
                            loader: 'css-loader'
                        },
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                additionalData: '@import "@base/assets/style/var.less";',
                            }
                        },
                    ],
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },

            ]
        },
        devServer: {
            port: SERVER_PORT,
            hot: true
        },
    };
}
