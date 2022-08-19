const {defineConfig} = require('@vue/cli-service');
let path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}


let isProduction = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            require('unplugin-auto-import/webpack')({
                imports: [
                    'vue',
                    /*2.0 使用方式和3.0不一样*/
                    /*'vue-router',
                    'pinia'*/
                ],
                resolvers: [/*ElementPlusResolver()*/],
                dts: false,
                dirs: [
                    /*router死活引入不了*/
                    /*resolve('./src/autoImportUtils')*/
                    /*setup 自动引入*/
                ]
            }),
            /*<script setup name="xxx" inheritAttrs="false">*/
            require('unplugin-vue-setup-extend-plus/webpack')({ /* options */ }),
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
                    name: 'removeAttrs', // 必须指定nameT！
                    params: {attrs: 'fill'}
                }]
            })
            .end();
    },
    css: {
        //extract: true,
        sourceMap: !isProduction,
    },
});
