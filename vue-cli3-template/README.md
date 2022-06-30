## 本模板为多项目公用文件 可单独打包 可混合打包所有项目
  1. 单项目打包 ```npm run build projectName```
  2. 单项目调试运行 ```npm run serve projectName```
  3. 多项目打包  ```npm run build```
  4. 多项目调试运行 ```npm run serve```

## 子项目 在 ```projects``` 目录下建立文件夹, 必须文件
  1. config.js //配置文件
  2. main.js   //入口文件

## less 需安装插件 
```vue add style-resources-loader```

#config.js 为子项目 vue.config.js 
  1. page 同 vue.config.js 的 pages 可配置 favicon
  2. themePath 全局 less 主题文件 路径相对于 子项目根目录
  
#buildAll.sh 
    直接执行会顺序单独编译project下的项目, 编译后一个项目一个文件夹, 如果你需要混合编译 直接执行 ```npm run build``` 即可
#admin
    1. 后台模板
#form
    1. 动态表单
#svg 
    1. svg 库[svg.js](https://svgjs.com/docs/3.0/)
#test
    1. 测试项目, 无用
