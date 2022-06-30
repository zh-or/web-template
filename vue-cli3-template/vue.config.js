const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const useCND = isProduction;//是否使用cdn方式, 会给html传入参数

let fs = require('fs');
let project = require('./config/project');
let path = require('path');

process.env.useCND = useCND;
process.env.isProduction = isProduction;


function resolve(dir) {
    return path.join(__dirname, dir)
}

let projectName = project.projectName;

let tmpPage = {};
let projectConfig;


let build = process.argv[2] == 'build';
let serve = process.argv[2] == 'serve';

if (projectName && projectName != '') {

    projectConfig = require(`./src/projects/${projectName}/config.js`);
    projectConfig.outputDir = `./dist/${projectName}`;
    projectConfig.page = projectConfig.page || {}

    let templateName = projectConfig.page.template || 'public/index.html';
    let tmpPath = templateName.replace(/.html/, '-test.html');
    if (serve && fs.existsSync(tmpPath)) {
        templateName = tmpPath;
    }

    tmpPage.index = {};
    tmpPage.index.entry = projectConfig.page.entry || `./src/projects/${projectName}/main.js`; // page 的入口
    tmpPage.index.template = templateName;// 模板来源

    tmpPage.index.favicon = projectConfig.page.favicon || 'public/favicon.ico';// 图标
    tmpPage.index.filename = projectConfig.page.filename || 'index.html';// 在 dist/index.html 的输出
    tmpPage.index.title = projectConfig.page.title || '未设置标题';// 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    tmpPage.index.chunks = projectConfig.page.chunks || ['chunk-vendors', 'chunk-common', 'index'];

    console.log(`编译项目: ${projectName}, 页面标题: ${tmpPage.index.title}...`);
// 在这个页面中包含的块，默认情况下会包含
// 提取出来的通用 chunk 和 vendor chunk。
} else {

    console.log(`编译项目: ${projectName} ...`);

    projectConfig = {
        /*default package config*/
        outputDir: './dist/'
    };
    let dirs = fs.readdirSync('./src/projects/');

    dirs.forEach((dir) => {
        projectConfig = require(`./src/projects/${dir}/config.js`);

        let templateName = projectConfig.page.template || 'public/index.html';
        let tmpPath = templateName.replace(/.html/, '-test.html');
        if (serve && fs.existsSync(tmpPath)) {
            templateName = tmpPath;
        }

        tmpPage[dir] = {};
        tmpPage[dir].entry = projectConfig.page.entry || `./src/projects/${dir}/main.js`; // page 的入口
        tmpPage[dir].template = projectConfig.page.template || templateName;// 模板来源
        tmpPage[dir].favicon = projectConfig.page.favicon || 'public/favicon.ico';// 图标
        //tmpPage[dir].filename  = projectConfig.page.filename || 'index.html';// 在 dist/index.html 的输出

        //全部编译的时候不能用index.html会覆盖掉
        if (!projectConfig.page.filename || projectConfig.page.filename == 'index.html') {
            tmpPage[dir].filename = `${dir}.html`;
        }

        tmpPage[dir].title = projectConfig.page.title || '未设置标题';// 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        //???
        tmpPage[dir].chunks = projectConfig.page.chunks || ['chunk-vendors', 'chunk-common', dir];

    });
}

console.log(
    '-------------\n',
    tmpPage,
    '\n-------------'
)

module.exports = {
    publicPath: isProduction ? './' : '/',
    productionSourceMap: false,
    assetsDir: projectConfig.assetsDir || 'static',
    outputDir: projectConfig.outputDir || './dist/',
    pages: tmpPage,
    css: {
        sourceMap : true
    },
    runtimeCompiler: true,
    configureWebpack: () => {
        /*xlsx-style 库报错修复*/
        return {
            externals: {
                './cptable': 'var cptable',
                '../xlsx.js': 'var _XLSX'
            }
        };
    },
    chainWebpack(config){
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
        /*坑1: https://github.com/vuejs/vue-cli/issues/1669
        * are you using the pages feature? In that case,
        * there are multiple instance of the webpack plugin (one for each page) and they are named like 'html-nameOfThePage'.
        * Run this to see what your plugins are named:
        *
        * npx vue-cli-service inspect --plugins
        * */

        let addArgs = (name) => {
            config.plugin(name ? 'html-' + name : 'html').tap(args  => {
                let newArgs = [].concat(args || []);
                if(newArgs.length > 0){
                    newArgs[0].isProduction = isProduction;
                    newArgs[0].useCND = isProduction;
                } else {
                    newArgs.push({
                        isProduction: isProduction,
                        useCND: isProduction
                    })
                }
                //console.log('-------------', args, '-------------');

                return newArgs;
            });
        }

        if(projectName) {
            //default page name is index
            addArgs('index');
            config.resolve.alias.set(`@${projectName}`, resolve(`src/projects/${projectName}`));
        } else {
            Object.keys(tmpPage).forEach(dir => {
                addArgs(dir);
                config.resolve.alias.set(`@${dir}`, resolve(`src/projects/${dir}`));
            });
        }

        console.log('alias:', config.resolve.alias.store);


        /* https://blog.csdn.net/weixin_34294049/article/details/97278751 */

        if(isProduction){
            config.optimization.splitChunks({chunks: 'all'});//分割代码
            config.optimization.minimize(isProduction);//压缩代码
        }

        if(useCND){
            // 用cdn方式引入
            config.externals({
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'axios': 'axios',
                'element-ui': 'ELEMENT'
            })
        }



    },
    devServer: {
        disableHostCheck: true,//外网反向代理 Invalid Host header 问题
        progress: false,
    },
    /*devServer: {
        proxy: {
            '/!*.do': {
                target: 'http://127.0.0.1:82/',
                changeOrigin: true
            },
            '/ws/!*': {
                ws: true,
                changeOrigin: true,
                target: 'http://127.0.0.1:82/'
            }
        }
    },*/
    /*    chainWebpack: config => {
            config.plugin('html').tap(options => {
                console.log('???->', options);
                options[0] = options[0] || {};
                options[0].minify = false;
                return options;
            });
        }*/
}
