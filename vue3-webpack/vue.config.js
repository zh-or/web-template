let path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

const {defineConfig} = require('@vue/cli-service');
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers');

let isProduction = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
    transpileDependencies: isProduction,
    filenameHashing: isProduction,
    configureWebpack: {
        plugins: [
            require('unplugin-auto-import/webpack')({
                imports: [
                    'vue',
                    'vue-router',
                    'pinia'
                ],
                resolvers: [ElementPlusResolver()],
                dts: false,
                dirs: [
                    './src/autoImportUtils'
                    /*steup 自动引入*/
                ]
            }),
            /*require('unplugin-vue-components/webpack')({
                //自动导入的目录:src/components
                dirs: [],
                resolvers: [ElementPlusResolver()],
            })*/
        ],
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
                symbolId: 'icon-[name]',
                plugins: [{
                    name: 'removeAttrs', // 必须指定name！
                    params: {attrs: 'fill'}
                }]
            })
            .end();
    },
    css: {
        sourceMap: !isProduction,
    },
    devServer: {
        proxy: {
            '/baidu-api': {
                target: `https://api.map.baidu.com`,
                changeOrigin: true,
                pathRewrite: {'^/baidu-api': ''},
                rewrite: (p) => p.replace(/^\/baidu-api/, '')

            }
        }
    }
})
