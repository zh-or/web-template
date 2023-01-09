const {defineConfig} = require('@vue/cli-service');
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
let fs = require('fs');
let project = require('./config/project');
let path = require('path');

process.env.isProduction = isProduction;

function resolve(dir) {
    return path.join(__dirname, dir)
}

function mergePage(from, name, chunksName) {
    chunksName = chunksName || name;
    let tmpPath = `'public/${name}.html'`;
    if(!fs.existsSync(tmpPath)) {
        tmpPath = 'public/index.html';
    }
    return Object.assign({
        entry: `./src/projects/${name}/main.js`,
        template: tmpPath,
        favicon: 'public/favicon.ico',
        filename: `${name}.html`,
        title: '未设置标题',
        chunks: ['chunk-vendors', 'chunk-common', chunksName],//这里要和下面 149 行匹配, 所以打包一个项目时这里用 index
    }, from.page);
}

let projectName = project.projectName;

let tmpPage = {};
let outDir    = './dist/';
let assetsDir = 'static';

let build = process.argv[2] == 'build';
let serve = process.argv[2] == 'serve';



if(projectName && projectName != '') {
    let config  = require(`./src/projects/${projectName}/config.js`);
    outDir      = config.outDir || `./dist/${projectName}`;
    assetsDir   = config.assetsDir || assetsDir;
    tmpPage.index = mergePage(config, projectName, 'index');//fix bug
    console.log(`编译项目: ${projectName}, 页面标题: ${tmpPage.index.title}...`);
} else {
    console.log(`编译全部项目 ...`);
    let dirs = fs.readdirSync('./src/projects/');
    dirs.forEach((dir) => {
        let config = require(`./src/projects/${dir}/config.js`);
        tmpPage[dir] = mergePage(config, dir);
    });
}

console.log(
    '-------------\n',
    tmpPage,
    '\n-------------'
)

module.exports = defineConfig({
    transpileDependencies: false,
    productionSourceMap: false,

    /*css: {
        loaderOptions: {
            less: {
                additionalData: `@import "@/assets/css/var.less";`
            },
        }
    },*/

    publicPath: isProduction ? './' : '/',
    assetsDir: assetsDir,
    outputDir: outDir,
    pages: tmpPage,

    chainWebpack(config) {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        //打包优化
        config.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                    name: 'chunk-elementUI', // split elementUI into a single package
                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                    name: 'chunk-commons',
                    test: resolve('src/components'), // can customize your rules
                    minChunks: 3, //  minimum common number
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        });


        /*坑1: https://github.com/vuejs/vue-cli/issues/1669
        * are you using the pages feature? In that case,
        * there are multiple instance of the webpack plugin (one for each page) and they are named like 'html-nameOfThePage'.
        * Run this to see what your plugins are named:
        *
        * npx vue-cli-service inspect --plugins
        * */

        let addArgs = (name, pars) => {
            pars = pars || {};

            config.plugin(name ? 'html-' + name : 'html').tap(args  => {
                let newArgs = [].concat(args || []);
                if(newArgs.length > 0){
                    newArgs[0].isProduction = isProduction;
                    newArgs[0].useCND = isProduction;
                    newArgs[0].pars = pars;
                } else {
                    newArgs.push({
                        isProduction: isProduction,
                        useCND: isProduction,
                        pars: pars,
                    })
                }
                //console.log('-------------', args, '-------------');

                return newArgs;
            });
        }

        if(projectName) {
            //default page name is index
            addArgs('index', tmpPage.index.html);
            config.resolve.alias.set(`@${projectName}`, resolve(`src/projects/${projectName}`));
        } else {
            Object.keys(tmpPage).forEach(dir => {
                addArgs(dir, tmpPage[dir].html);
                config.resolve.alias.set(`@${dir}`, resolve(`src/projects/${dir}`));
            });
        }

        console.log('alias:', config.resolve.alias.store);


        /* https://blog.csdn.net/weixin_34294049/article/details/97278751 */

        if(isProduction){
            config.optimization.splitChunks({chunks: 'all'});//分割代码
            config.optimization.minimize(isProduction);//压缩代码
        }
    },

    /*devServer: {
        disableHostCheck: true,//外网反向代理 Invalid Host header 问题
        progress: false,
    },*/
});
