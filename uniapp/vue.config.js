const path = require('path');
const envs = require('./env.js');
const fs   = require('fs');

//把变量加到scss里面
fs.writeFileSync(
    path.join(__dirname, 'env.scss'), 
    `$img: "${envs.VUE_APP_STATIC_HOST}";`
);

module.exports = {
    chainWebpack: config => {
        config
            .plugin('define')
            .tap(args => {
                //加到js的环境变量
                Object.keys(envs).forEach(k => {
                    let obj = envs[k];
                    if(typeof obj === 'string') {
                        obj = `"${obj}"`;
                    }
                    args[0]['process.env'][k] = obj;
                });
                console.log('当前环境变量', args[0]['process.env']);
                return args
            });


    }
}
