import t from '@zh-or/lib';


//user tools
export default {
    e: {
        NEEDLOGIN: 'NEEDLOGIN',//需要登录事件
        LOGINED: 'LOGINED',//登录完成的事件
        INIT: 'INIT',//获取配置后的事件
        USERINFO: 'USERINFO',//刷新用户信息事件
    },
    selectAllTypeFile(cb) {
        t.selectFile(cb, { accept: this.getSupportFiles().join(',') });
    },
    selectImgFile(cb) {
        t.selectFile(cb, {accept: this.getSupportFiles('img').join(','), multiple: true});
    },
    selectOneImgFile(cb) {
        t.selectFile(cb, {accept: this.getSupportFiles('img').join(',')});
    },
    selectVideoFile(cb) {
        t.selectFile(cb, {accept: this.getSupportFiles('video').join(',')});
    },
    getSupportFiles(type) {
        switch(type) {
            case 'img': return [ '.png', '.jpg', '.jpeg' ];
            case 'video': return [ '.mp4' ];
            case 'all':
            default: return [ '.png', '.jpg', '.jpeg', '.mp4' ];
        }
    },
    getFileTypeByName(name) {
        if([ '.png', '.jpg', '.jpeg'].some(_ => name.endsWith(_))) {
            return 1;
        } else if(name.endsWith('.mp4')) {
            return 2;
        }
        return 0;
    },
    getDist(m, type) {
        switch(type) {
            case 'km':
                return (Number(m || '0') / 1000).toFixed(2).toLocaleString() + 'km';
                break;
            default:
            case 'm':
                return (Number(m || '0')).toFixed(2).toLocaleString() + 'm';
                break;
        }
    },
    formatBeforeDateStr(time/*时间戳*/) {
        let date = new Date(time);
        let now = new Date();
        if(now.getFullYear() === date.getFullYear()) {
            let diffMil = now.getTime() - time;
            if(diffMil < 1000 * 60) {
                return (diffMil / 1000).toFixed(0) + '秒前';
            } else if(diffMil < 1000 * 60 * 60) {//1小时内
                return (diffMil / 1000 / 60).toFixed(0) + '分钟前';
            } else if(diffMil < DAY_MIL * 1) { //1天内
                return (diffMil / 1000 / 60 / 60).toFixed(0) + '小时前';
            } else if(diffMil < DAY_MIL * 5) {
                return (diffMil / DAY_MIL).toFixed(0) + ' 天前';
            }
        }
        return t.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    formatFileSize(size) {
        if(size < 1024) {
            return `${size} byte`;
        } else if(size < 1024 * 1024) {//1小时内
            return (size / 1000).toFixed(2) + ' kb';
        } else if(size < 1024 * 1024 * 1024) { //1天内
            return (size / 1000 / 1024).toFixed(2) + ' Mb';
        }
        return 'N/A';
    },
    makeService(url, service, req) {
        let keys = Object.keys(url);
        keys.forEach(k => {
            if (!service.hasOwnProperty(k)) {
                service[k] = function (data) {

                    let val = url[k];

                    if(typeof val === 'function') {
                        return val(data);
                    }

                    let tmp = val.split('|');

                    if (!tmp || tmp.length != 2) {
                        throw new Error(url + ' 中没有分隔符 | , 格式必须为 method|path');
                    }

                    let m = tmp[0].toUpperCase();
                    let path = tmp[1];

                    if(!path) {
                        path = m;
                    }

                    //url/{params}
                    if(path.indexOf('{') && data) {
                        Object.keys(data).forEach(k => {
                            path = path.replace(`{${k}}`, data[k]);
                        })
                    }
                    if (m == 'GET') {
                        return req.get(path, data);
                    } else if (m == 'POST') {
                        return req.post(path, data);
                    } else if (m == 'FORMDATA') {
                        return req.formData(path, data);
                    } else if (m == 'PATCH') {
                        return req.patch(path, data);
                    } else if (m == 'DELETE') {
                        return req.delete(path, data);
                    } else {
                        console.log(path + '\n暂不支持:' + m + ', 其他方法请自定义');
                    }
                    return Promise.reject('不支持的请求方式');
                };

            }
        });

    },
    htmlDecode(str) {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    },
    htmlEncode(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    calc(a, m, b) {
        let da = new decimal(a);
        let db = new decimal(b);
        let r = '0';
        switch(m) {
            case '+': r = da.add(db); break;
            case '-': r = da.sub(db); break;
            case '*': r = da.mul(db); break;
            case '/': r = da.div(db); break;
            case '%': r = da.mod(db); break;
            default:
                r = new decimal(0);
        }
        
        r = r.toNumber();
        r = isNaN(r) ? 0 : r;
        
        //console.log(`calc: ${a} ${m} ${b} = ${r}`);
        return r;
    },
    calcEx() {
        let params = [...arguments];
        let res = null, m = null;
        params.forEach(v => {
            if(res === null) res = v;
            else if(m === null) m = v;
            else {
                res = this.calc(res, m, v);
                m = null;
            }
        });
        return res;
    },
    queryToObject(str) {
        str = str || '';
        let obj = {};
        let kv = str.split('&');
        kv.forEach(item => {
            let arr = item.split('=');
            if(arr.length >= 2) {
                obj[arr[0]] = arr[1];
            }
        })
        
        return obj;
    }
}
