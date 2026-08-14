const HtmlWebPackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

let path = require('path');
let fs = require('fs');

const devExclude = [

];

const devInclude = [

];

function resolve(dir) {
    return path.join(__dirname, dir)
}


function getDirs(path, fullPath) {
    fullPath = !!fullPath;
    let arr = fs.readdirSync(path);
    let res = [];
    arr.forEach(f => {
        let state = fs.statSync(path + f);
        if(state.isDirectory()) {
            res.push(fullPath ? path + f : f);
        }
    })
    return res;
}


let alias = {
    '@base': resolve('src/'),
    'vue$': 'vue/dist/vue.esm-bundler.js',
};


module.exports = (env, argv, htmlEnv,
                  SERVER_PORT,
                  publicPath,
                  outDirPreFix) => {

    let devMode = htmlEnv.mode !== 'prod';
    htmlEnv.isDev = devMode;

    console.log('devMode:' + devMode, '\n', argv);
    if(env.WEBPACK_SERVE) {
        fs.rmSync(resolve('dist'), {recursive : true, force : true});
    }
    if(env.WEBPACK_BUILD) {
        fs.rmSync(resolve('dist'), {recursive : true, force : true});
    }

    let entrys = {}, plugins = [];

    //全局引入的文件
    let mainPath = './src/main.js';
    if(fs.existsSync(mainPath)) {
        entrys['main'] = mainPath;
    }

    let dirs = getDirs('./src/pages/');
    dirs.forEach((key) => {

        let filename = `${key}`;

        let pageConfig = {
            template: resolve(`src/pages/${filename}/index.html`),
            filename: `${filename}.html`,
            entry: resolve(`src/pages/${filename}/index.js`),
        }

        let configFilePath = `./src/pages/${filename}/config.js`;
        if(fs.existsSync(configFilePath)) {
            let selfConfig = require(configFilePath);
            pageConfig.template = selfConfig.template || pageConfig.template;
            pageConfig.filename = selfConfig.filename || pageConfig.filename;
            pageConfig.entry = selfConfig.entry || pageConfig.entry;
        }

        //每个目录增加alias
        if(alias.hasOwnProperty(filename)) {
            console.error('alias 有重复, 只生效最后一个:', filename);
        }
        alias[`@${filename}`] = resolve(`src/pages/${filename}`) ;

        entrys[filename] = pageConfig.entry;
        plugins.push(new HtmlWebPackPlugin({
            template: pageConfig.template,
            filename: pageConfig.filename,
            minify: false,
            chunks: ['main'/*每个都引入全局引入的文件*/, filename],
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
        }),
        //vue3新增 https://cn.vuejs.org/api/compile-time-flags.html#configuration-guides
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: `${devMode}`,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: `${devMode}`
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
        filename: `${outDirPreFix}style/[name].css`,
        ignoreOrder: true
    }));

    //svg 输出到html
    /*plugins.push(new SpriteLoaderPlugin({
        plainSprite: true,
        spriteAttrs: {
            style: 'visibility:hidden'
        }
    }));*/

    plugins.push(new VueLoaderPlugin({
        compilerOptions: {
            hoistStatic: false,
        }
    }));
    
    //分析 文件占用时启用这个插件
    //yarn run build
    /*plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true,
    }));*/

    console.log('alias', alias);

    return {
        stats: {
            modules: true,
        },
        entry: {
            ...entrys,
        },
        plugins: plugins,
        output: {
            filename: devMode ? `${outDirPreFix}js/[name][chunkhash:3].js` : `${outDirPreFix}js/[name][chunkhash:3].js`,
            path: resolve('dist'),
            publicPath: publicPath,
        },

        optimization: {
            usedExports: true,
            runtimeChunk: 'single',
            minimize: !devMode, //true,
            minimizer: [
                `...`,
                new CssMinimizerPlugin(),
            ],
            runtimeChunk: { name: "lib" },
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: 'initial',
                        minChunks: 2,
                        minSize: 0,
                        name: 'lib'
                    },
                    lib: {
                        name: "lib",
                        test: /node_modules/,
                        chunks: "all",
                        priority: 10
                    }
                }
            }
        },
        resolve: {
            alias: alias,
        },

        module: {
            rules: [

                {
                    //test: /\.(png|svg|gif|jpe?g)$/,
                    test: /\.(png|gif|jpe?g|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `${outDirPreFix}img/[name][ext]`,
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
        mode: argv.mode,
        //devtool: devMode ? 'source-map' : 'hidden-source-map',
        devtool: devMode ? 'source-map' : false,
        devServer: {
            port: SERVER_PORT,
            allowedHosts: 'all',
            hot: true,
            devMiddleware: {
                //dev 运行时写出到硬盘
                index: true,
                serverSideRender: true,
                //publicPath: '/publicPathForDevServe',
                writeToDisk: true,
            },
            client: {
                overlay: false,
                webSocketURL: `ws://127.0.0.1:${SERVER_PORT}/ws`
            },
            proxy: {
                '/api/*': {
                    ws: true,
                    changeOrigin: true,
                    target: 'https://xxx.xx.com/'
                },
            }
        },
    };
}
