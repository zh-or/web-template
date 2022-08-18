const {defineConfig} = require('@vue/cli-service');
const env = process.env.NODE_ENV;
const isPd = env === 'production';

let fs = require('fs');
let project = require('./config/project');
let path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

let projectName = project.projectName;
let tmpPage = {};

let defaultConfig = {
    assetsDir: 'static',
    outputDir: './dist/',
    page: {
        filename: 'index.html',
        template: 'public/index.html',
        title: 'project-title',
        entry: '{dir}/main.js',
        favicon: 'public/favicon.ico',
    },

}

module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: false,

    assetsDir: projectConfig.assetsDir || 'static',
    outputDir: projectConfig.outputDir || './dist/',
    css: {
        extract: isPd,
        sourceMap: !isPd,
    }
})
