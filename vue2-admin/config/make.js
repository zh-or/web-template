let fs = require('fs');

//如果不传的话就是编译所有的
let projectName = '';
if(process.argv.length > 2){
    projectName = process.argv[2];
}

//如果直接在vue.config.js 里面写代码来选择编译的项目的话, 会和原本的命令冲突
fs.writeFileSync('./config/project.js', `exports.projectName = '${projectName}'`)
