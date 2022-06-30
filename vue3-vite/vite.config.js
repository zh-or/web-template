import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import autoImport from 'unplugin-auto-import/vite';
import compression from 'vite-plugin-compression';
import setupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {

    const env = loadEnv(mode, process.cwd())
    const {VITE_APP_ENV, VITE_BUILD_COMPRESS} = env;
    const isProd = VITE_APP_ENV === 'production';
    const isBuild = command === 'build';
    const plugin = [];

    if (VITE_BUILD_COMPRESS) {
        //打包压缩插件
        const compressList = VITE_BUILD_COMPRESS.split(',')
        if (compressList.includes('gzip')) {
            // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
            plugin.push(
                compression({
                    ext: '.gz',
                    deleteOriginFile: false
                })
            )
        }
        if (compressList.includes('brotli')) {
            plugin.push(
                compression({
                    ext: '.br',
                    algorithm: 'brotliCompress',
                    deleteOriginFile: false
                })
            )
        }
    }

    return {
        build: {
            //sourcemap: false,
            minify: isProd,
        },
        resolve: {
            // https://cn.vitejs.dev/config/#resolve-alias
            alias: {
                '~': path.resolve(__dirname, './'),// 设置路径
                '@': path.resolve(__dirname, './src')// 设置别名
            },
            // https://cn.vitejs.dev/config/#resolve-extensions
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        plugins: [
            vue(),
            setupExtend(),
            autoImport({
                imports: [ 'vue', 'vue-router', 'pinia' ],
                dts: false,
                dirs: [
                    './src/autoImportUtils'
                ]
            }),
            ...plugin,
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), './src/assets/icons/svg/')],
                symbolId: 'icon-[dir]-[name]',
                svgoOptions: isBuild
            })
        ],
        server: {
            //port: 80,
            host: true,
            open: false,
            hmr: true,
            proxy: {
                '/baidu-api': {
                    target: `https://api.map.baidu.com`,
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/baidu-api/, '')
                }
            }
        },
    }
})
