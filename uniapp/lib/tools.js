import decimal from './decimal.js';

const ONE_DAY = 1000 * 60 * 60 * 24;

function _calc(a, m, b) {
    let _a = Number(Number(a).toFixed(2)) * 100,
        _b = Number(Number(b).toFixed(2)) * 100;

    let r;
    switch(m) {
        case '+': r = _a + _b; break;
        case '-': r = _a - _b; break;
        case '*': r = _a * _b; break;
        case '/': r = _a / _b; break;
        case '%': r = _a.mod(_b); break;
        default:
            r = 0;
    }
    return r / 100;
}

function _calcEx() {
    let params = [...arguments];
    let res, m;
    params.forEach(v => {
        if(!res) res = v;
        else if(!m) m = v;
        else {
            res = _calc(res, m, v);
            m = null;
        }
    });
    return res;
}

export default {
    id: 0,
    reg: {
        isMobilePhone(num) {
            return /^1[3-9]\d{9}$/.test(num);
        }
    },
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        )
    },
    async sleep(t) {
        return new Promise((resolve, reject) => {
            setTimeout(_ => {
                resolve();
            }, t);
        })
    },
    toFixed(num, f) {//四舍五入
        return new decimal(num).toFixed(f || 2, decimal.ROUND_DOWN);
    },
    toFixedUP(num, f) {//四舍五入
        return new decimal(num).toFixed(f || 2, decimal.ROUND_UP);
    },
    getDecima() {
        return decimal;
    },
    formatMoney(p, fix) {
        if(typeof fix != 'undefined') {
            fix = Number(fix);
            fix = isNaN(fix) ? 0 : fix;
        } else {
            fix = 2;
        }

        let p2 = this.Number(p);
        p2 = p2.toFixed(fix);
        return p2;
    },
    formatWeek(str) {

        let week = '周日,周一,周二,周三,周四,周五,周六'.split(',');
        let date = this.parseDate(str);
        let w = week[date.getDay()];
        //不考虑月, 年差
        let s = date.getDate() - new Date().getDate();
        if(s === 0) {
            w = '今天';
        } else if(s === 1) {
            w = '明天';
        } else if(s === 2) {
            w = '后天';
        }
        return w;
    },
    Number(v, def) {
        try {
            let r = Number(v);
            if(!isNaN(v)) {
                return r;
            }
            if(def) {
                return def;
            }
        } catch(e) {
            console.error('format number error: ', e, v, def);
        }
        return 0;
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
    getId() {
        let t = this.id;
        this.id++;
        return 'i_' + t;
    },
    showInfo(title, content) {
        return this.showConfirm(title, content, false);
    },
    showConfirm(title, content, cancel) {
        cancel = cancel === undefined ? true : cancel;
        return new Promise((resolve, reject) => {
            uni.showModal({
                title: title || '',
                content: content || '',
                showCancel: cancel,
                success:  (res) => {
                    if (res.confirm) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            })
        })
    },
    oldTimer: null,
    showToast(opt) {
        if (typeof opt != 'object') {
            opt = {
                title: opt,
                icon: 'none'
            }
        }
        opt.duration = opt.duration || 3000;
        if(!opt.title) {
            console.log('未显示 toast:', opt);
            return;
        }

        setTimeout(_ => {
            console.log('toast:', opt);
            uni.showToast(opt);
        }, 100);
        return new Promise((resolve, reject) => {

            setTimeout(resolve, opt.duration);
        })
    },
    showWaitM(title) {
        this.showWait({
            mask: true,
            title : title || ''
        })
    } ,
    showWait(opt) {
        opt = opt || '';
        if (typeof opt != 'object') {
            opt = {
                title: opt || '',
                mask: false
            }
        }
        uni.showLoading(opt);
    },
    hideWait() {
        uni.hideLoading();
    },
    fuckNull(obj, def) {
        for(let i in obj) {
            if(obj[i] === null || obj[i] === undefined) {
                obj[i] = def || '';
            } else if(typeof obj[i] === 'object') {
                this.fuckNull(obj[i], def);
            }
        }
    },
    clone(from, to, lvl) {
        if(!from) {
            console.log('from is null:', from);
            return;
        }
        //根据to对象的字段来复制
        if (lvl && lvl <= 0) return false;
        let keys = Object.keys(to);
        let val, type;
        keys.forEach(k => {
            if(!from || !Object.prototype.hasOwnProperty.call(from, k)) {
                return;
            }
            val = to[k];
            type = typeof val;
            switch (type) {
                case 'string':
                case 'number':
                    to[k] = from[k];
                    break;
                case 'boolean':
                    to[k] = !!from[k];
                    break;
                case 'object':
                    //to[k] = null, from[k] = number

                    if(typeof from[k] === 'number') {
                        to[k] = from[k];
                    } else if (Array.isArray(to[k])) {
                        to[k] = from[k];
                    } else if (from[k] != null) {//null时不复制
                        if(to[k] != null) {
                            this.clone(from[k], to[k], lvl ? lvl - 1 : undefined);
                        } else {
                            to[k] = from[k];
                        }

                    } else {
                        //to[k] = null;
                    }
                    break;
                default:
                    //to[k] = null;
            }
        });
    },
    deepClone(obj) {
        // 对常见的“非”值，直接返回原来值
        if ([null, undefined, NaN, false].includes(obj)) return obj
        if (typeof obj !== 'object' && typeof obj !== 'function') {
            // 原始类型直接返回
            return obj
        }
        const o = Array.isArray(obj) ? [] : {}
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === 'object' ? this.deepClone(obj[i]) : obj[i]
            }
        }
        return o
    },
    getWeek(date) {
        let weeks = '周日,周一,周二,周三,周四,周五,周六'.split(',');
        date = this.parseDate(date);
        if(date) {
            return weeks[date.getDay()];
        }
        return '';
    },
    parseDate(date) {
        let parse = (par) => {
            if (!date) {
                return null;
            }
            if (typeof date === 'object') {//date 对象
                return date;
            }
            if (typeof date === 'string') {
                //yyyy-MM-dd hh:mm:ss -> yyyy-MM-ddThh:mm:ss
                //date = date.replace(' ', 'T');
                //return new Date(Date.parse(date));
                //有时区问题

                let times = Date.parse(date);
                if(isNaN(times)) {
                    console.error('格式化时间有问题1:', date, times);
                    //2023-06-14T01:59:30.000Z
                    let tmp = date;
                    //tmp = tmp.replace(' ', 'T') + '.000Z';//iso时间格式 Z表示无时区 即时区为 +00:00
                    tmp = tmp.replace(' ', 'T') + '+08:00';//iso时间格式
                    times = Date.parse(tmp);

                    if(isNaN(times)) {
                        console.error('格式化时间有问题2:', date, times);
                        tmp = date;
                        tmp = tmp.replace(/-/g, '/');
                        times = Date.parse(tmp);

                        if(isNaN(times)) {
                            console.error('格式化时间有问题3:', date, times);
                        }
                    } else {//时区-8小时
                        times = times - 8 * 60 * 60 * 1000;
                    }

                }
                return new Date(times);
            }
            if (typeof date === 'number') {//时间戳
                let t = new Date();
                t.setTime(date);
                return t;
            }
        }
        //debugger
        let tmp = parse(date);
        /*if(tmp) {
            let t = tmp.toString();
            tmp.setMinutes(tmp.getMinutes() + tmp.getTimezoneOffset());
            tmp.setHours(tmp.getHours() + 8);//utc+8 北京时间

            console.log(date, t, '---', tmp);
        }*/
        return tmp;
    },
    formatDate(date, formatStr) {
        try {
            if (!date) {
                return '';
            }
            date = this.parseDate(date);


            formatStr = formatStr || 'yyyy-MM-dd hh:mm:ss';
            let obj = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            };
            if (/(y+)/.test(formatStr)) {
                formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (let k in obj) {
                if (new RegExp('(' + k + ')').test(formatStr)) {
                    formatStr = formatStr.replace(
                        RegExp.$1,
                        (RegExp.$1.length == 1) ? (obj[k]) : (('00' + obj[k]).substr(('' + obj[k]).length))
                    );
                }
            }
            return formatStr;
        } catch (e) {

        }
        return '';
    },
    getMonthDays(year, month/*1 - 12*/) {
        let date = new Date(year, month, 1);
        date.setDate(0);
        return date.getDate();
    },
    fill(start, end, f) {
        let arr = [];
        for(let i = start; i <= end; i++) {
            arr.push(f ? f(arr, i) : i);
        }
        return arr;
    },
    countSpace(lat1, lng1, lat2, lng2) {
        let radLat1 = lat1 * Math.PI / 180.0;
        let radLat2 = lat2 * Math.PI / 180.0;
        let a = radLat1 - radLat2;
        let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        return Math.abs(s);  // 单位千米
    },
    getXXPhone(raw) {
        if(raw && raw.length >= 11) {
            return raw.substring(0, 3) + '****' + raw.substring(8, 11);
        }
        return raw;
    },
    getQueryString(str, name) {
        var result = str.match(new RegExp("[\?\&]" + name + "=([^\&\#]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    objToQueryString(obj) {
        let res = [];
        Object.keys(obj).forEach(k => {
            res.push(k + '=' + encodeURIComponent(obj[k]));
        });
        return res.join('&');
    },
    randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return Math.random();
        }
    },
    setData(key, val) {
        uni.setStorageSync(key, val);
    },
    getData(key, def) {
        try {
            const value = uni.getStorageSync(key);
            if (value) {
                return value;
            }
        } catch (e) {
        }
        return def;
    },
    getDataAndRemove(key, def) {
        let v = this.getData(key, def);
        uni.removeStorage({
            key: key,
            success: function (res) {
                console.log('移除缓存:', key);
            }
        });
        return v;
    },
    getDiffDay(type) {
        let now = new Date();
        let weekDay = now.getDay();
        let start = new Date();

        switch (type) {
            case 'today'://今天
                break;
            case 'yesterday'://昨天
                start.setMilliseconds(now.getTime() - ONE_DAY * 1);
                now.setMilliseconds(start.getTime());

                now.setHours(23);
                now.setMinutes(59);
                now.setMilliseconds(59);
                break;
            case 'week'://本周
                start.setTime(now.getTime() - ONE_DAY * weekDay);
                break;
            case 'lastWeek'://上周
                now.setTime(start.getTime() - ONE_DAY * weekDay);
                start.setTime(now.getTime() - ONE_DAY * 7);
                break;
            case 'month'://本月
                let date = now.getDate();
                start.setTime(start.getTime() - ONE_DAY * date);
                break;
            case 'near30'://最近30天
                start.setTime(now.getTime() - ONE_DAY * 30);
                break;
            default:
                start.setTime(now.getTime() - ONE_DAY * Number(type));
                break;
        }
        start.setHours(0);
        start.setMinutes(0);
        start.setMilliseconds(0);
        return [start, now];
    },
    // 腾讯转百度
    change (lat, lng) {
        var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
        var x = parseFloat(lng);
        var y = parseFloat(lat);
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        lng = z * Math.cos(theta) + 0.0065;
        lat = z * Math.sin(theta) + 0.006;
        return { lng, lat };
    },
// 百度转腾讯
    changeToTx(lat, lng) {
        if (!lng || !lat) return {
            lng: 0,
            lat: 0
        }
        let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
        let x = lng - 0.0065;
        let y = lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta);
        let lats = z * Math.sin(theta);
        return {
            lng: lngs,
            lat: lats
        };
    },


    fixMovieItemInfo(item) {
        let version = (item.version || '').split(' ');
        item.v1 = version[0];
        item.v2 = version[1];

        item.wish = this.trannumber(item.wish);
        item.sc = item.sc.toFixed(1);
        item.cat = (item.cat || '').replaceAll('|', ' ');
    },

    trannumber (num) {
        if (num) {
            let numStr = num.toString()
            let rusult = ''
            // 千以内直接返回
            if (numStr.length <= 4) {
                return numStr;
            }
            //大于8位数是亿
            else if (numStr.length > 8) {
                let decimal = numStr.substring(numStr.length - 8);
                rusult = parseFloat(Number(num / 100000000).toFixed(2) + '.' + decimal) + '亿';
            }
            //大于6位数是十万 (以10W分割 10W以下全部显示)
            else if (numStr.length > 4) {
                let decimal = numStr.substring(numStr.length - 4)
                rusult = parseFloat(Number(num / 10000).toFixed(1) + '.' + decimal) + '万';
            }
            return rusult
        }
    },

    getVer() {
        try{
            //#ifdef MP-WEIXIN
            let o1 = wx.getAccountInfoSync().miniProgram;
            return o1.version || o1.envVersion;
            //#endif
            //#ifdef MP-ALIPAY
            let o2 = my.getAccountInfoSync().miniProgram;
            return o2.version || o2.envVersion;
            //#endif
        } catch(e) {
            console.error('获取小程序版本出错:', e);
        }
    }
}
