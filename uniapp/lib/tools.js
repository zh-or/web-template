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
       return new decimal(num).toFixed(f || 2, decimal.ROUND_HALF_EVEN);
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
        let res, m;
        params.forEach(v => {
            if(!res) res = v;
            else if(!m) m = v;
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
            clearTimeout(this.oldTimer);
            this.oldTimer = setTimeout(resolve, opt.duration);
        })
    },
    showWait(opt) {
        opt = opt || '';
        if (typeof opt != 'object') {
            opt = {
                title: opt || '',
                mask: true
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
        //根据to对象的字段来复制
        if (lvl && lvl <= 0) return false;
        let keys = Object.keys(to);
        let val, type;
        keys.forEach(k => {
            if(!from || !from.hasOwnProperty(k)) {
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
    parseDate(date) {
        if (!date) {
            return null;
        }
        if (typeof date == 'object') {//date 对象
            return date;
        }
        if (typeof date == 'string') {
            //yyyy-MM-dd hh:mm:ss -> yyyy-MM-ddThh:mm:ss
            date = date.replace(' ', 'T');
            return new Date(Date.parse(date));
        }
        if (typeof date == 'number') {//时间戳
            let t = new Date();
            t.setTime(date);
            return t;
        }
        return null;
    },
    formatDate(date, formatStr) {
        try {
            if (!date) {
                return '';
            }
            if (typeof date == 'string') {
                date = new Date(Date.parse(date));
            }
            if (typeof date == 'number') {
                let t = new Date();
                t.setTime(date);
                date = t;
            }
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
        var result = str.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
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
}
