let config = require('./webpack.config.js');

let devMode = true;
const SERVER_PORT = 60000;
const publicPath = '/';
const outDirPreFix = 'static/';


let htmlEnv = {
    appName: '市场投标管理系统',
    publicPath: publicPath,
    isDev: true,
    mode: 'dev',
};



module.exports = (env, argv) => config(
    env,
    argv,
    htmlEnv,
    SERVER_PORT,
    publicPath,
    outDirPreFix
    );
