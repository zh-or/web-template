# web-template
1. uniapp 模板
2. vue2多页模板
3. vue3 vite模板
4. vue3 webpack模板

## vue3 模板
1. 自动import
2. `$t` 工具类
3. `$modal` 信息弹窗类, 引用`element-plus`
4. `$api` api调用
5. `$notify`

## 工具类使用方法
1. 进入`lib`目录执行 `npm link`, 此时会创建`lib`的全局link
2. 进入要引用`lib`的项目目录执行`npm link lib`, 执行完毕后就可以在项目里面引用lib导出的方法

## 工具类包含方法
1. `getTextWidth(text, fs)` 获取`text`文字的实际宽度, `fs`表示字体大小
2. `getId(prefix)` 获取不重复的自增id默认前缀为`id_[num]`
3. `isIE()` 当前是否ie浏览器
4. `sortArray(type, arr, column)` 数字或者中文数组排序 
    * `type=asc|desc`类型
    * `arr`数组
    * `column` 排序使用的字段支持多层级, 如`user.age`
5. `cookie(key, value, options)`读取或写入`cookie`
    * `key` 读取或写入的key
    * `value` 写入的值, 如果不传此参数表示读取
    * `options` => `{time: [time], domain: [path]}`写入cookie的配置
6. `randomNum(minNum, maxNum)` 获取随机数
7. `toTimeStr(time)` 时间戳转换为`xx 时 xx 分 xx 秒`的格式
8. `parseDate(date)` 解析`date`为`Date`对象, 支持`yyyy-MM-dd hh:mm:ss`和时间戳或者`Date.parse()`支持的标准格式
9. `formatDate(date, formatStr)`
    * `date` 同上面`parseDate`参数
    * `formatStr`格式字符串, 默认为:`yyyy-MM-dd hh:mm:ss`
10. `getDiffDay(type)`获取时间间隔返回数组`[start, end]`
    * `type=today`今天
    * `type=yesterday`昨天
    * `type=week`本周
    * `type=lastWeek`上周
    * `type=month`本月
    * `type=near30`最近30天
    * `type=[数字]`返回今天到[今天-数字]的范围
11. `saveFile(url, saveName)`保存url到文件
12. `selectFile(cb)`弹出文件选择框
13. `selectDir(cb)`弹出目录选择框
14. `reSizeImg(file, size) `压缩图片到指定尺寸`size={width, height}`
15. `getObjectURL(file)`文件转base64
16. `setLocal(key, val)` = `localStorage.setItem`
17. `getLocal(key, def)` = `localStorage.getItem`
18. `removeLocal(key)` = `localStorage.removeItem`
19. `deepClone(obj)` 深度克隆一个`obj`
20. `clear(data)` 清空`data`的值
21. `clone(from, to, lvl)`根据`to`对象包含的字段来复制`from`的值
22. `ObjHas(obj, key)`检查对象是否存在指定字段, 支持多级`key=user.info.name`
23. `ObjGet(obj, key)`从对象获取指定字段的值, 支持多级`key=user.info.name`
24. `attr(arr, obj)`给`arr`数组的成员添加`obj`的字段和值
25. `arrToString(arr, field)`提取数组成员对象的指定字段并`join(',')`连接起来
26. `getQueryString(name)`获取`location.href`query参数的值
27. `trim(str)`正则删除字符串首尾空
28. `HTMLdecode(str)`HTML标签解码
29. `HTMLencode(str)`HTML标签编码
30. `formatFileSize(len)`把长度转换为`byte`,`KB`,`MB`
31. `copyString(str)`复制字符串到剪切板
32. `tween(type, from, to, time, callback)`缓动函数
    * `type`类型, 支持`[linear,easeIn,strongEaseIn,strongEaseOut,sineaseIn,sineaseOut]`
    * `from` number|Array<Object>
    * `to` number|Array<Object>
    * `time` 动画时长
    * `callback` 回调函数
33. `showToast(msg, timeout)` 弹出`toast` 弹窗
34. `showWait(msg)` 弹出加载框
35. `hideWait()` 隐藏加载框