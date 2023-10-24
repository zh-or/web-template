
export default {
    DEBUG: true,
    _id_: 0,
    _textWidthCache: {},
    _cacheSpan: null,
    getTextWidth(text, fs) {
        let _cacheSpan = this._cacheSpan;
        if (!_cacheSpan) {
            _cacheSpan = document.createElement('span');
            _cacheSpan.style.display = 'inline-block';
            _cacheSpan.style.position = 'fixed';
            _cacheSpan.style.opacity = '0';
            _cacheSpan.style.top = '0';
            _cacheSpan.style.zIndex = -1;
            document.body.appendChild(_cacheSpan);
        }
        if(fs) {
            _cacheSpan.style.fontSize = fs + 'px';
        }
        _cacheSpan.innerText = text;
        let width = _cacheSpan.offsetWidth;
        return width;
    },
    getId(prefix) {
        this._id_++;
        return (prefix || 'id_') + this._id_;
    },
    isIE() {
        return !isNaN(Number(document.documentMode));
    },
    sortArray(type, arr, column) {
        let asc = type == 'asc';
        arr.sort((_a, _b) => {
            let a = (column ? this.ObjGet(_a, column) : _a) || '', b = (column ? this.ObjGet(_b, column) : _b) || '';
            let res = false;
            if (typeof a == 'number' && typeof b == 'number') {
                res = asc ? a - b : b - a;
            } else {
                res = asc ? (a + '').localeCompare(b) : (b + '').localeCompare(a);
            }
            return res;
        });
    },
    cookie(key, value, options) {
        options = options || {};
        if (value !== undefined) {
            options.time = options.time || 24 * 60 * 60 * 1000;
            options.domain = options.domain || '/';
            let exp = new Date();
            exp.setTime(exp.getTime() + options.time);
            let str = key + "=" + encodeURIComponent(value) + ";expires=" + (Number(options.time) < 1 ? options.time : exp.toUTCString());
            str += ';path=' + options.domain;
            document.cookie = str;
        } else {
            let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return decodeURIComponent(arr[2]);
            else return '';
        }
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
    randomArray(array = []) {
        // 原理是sort排序,Math.random()产生0<= x < 1之间的数,会导致x-0.05大于或者小于0
        return array.sort(() => Math.random() - 0.5)
    },
    Number(val, def) {
        let r = Number(val);
        if(isNaN(r)) {
            return def;
        }
        return r;
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
    throttle_timer: null,
    throttle_start: 0,
    throttle_obj: {},

    objKey: [],
    getObjKey(obj) {
        let ks = this.objKey.find(_ => _.obj === obj);
        if(ks) {
            return ks.key;
        } else {
            let tObj = {
                key: this.getId('obj'),
                obj: obj
            };
            this.objKey.push(tObj);
            return tObj.key;
        }
    },

    throttle(obj, fun, t, lastRun) {//节流
        //t毫秒内只执行1次回调
        t = t || 200;
        if(!obj) {
            obj = {
                begin: Date.now(),
                timer: 0,
            };
            fun();
        } else if(Date.now() - obj.begin >= t) {
            fun();
            obj.begin = Date.now();
            clearTimeout(obj.timer);
        } else if(lastRun) {
            clearTimeout(obj.timer);
            obj.timer = setTimeout(_ => {
                fun();
            }, Date.now() - obj.begin)
        }
        return obj;
    },
    debounce(obj, fun, t) {//防抖
        t = t || 200;

        let ec = () => {
            setTimeout(() => {
                fun();
            }, t / 2);
        }

        if(!obj) {
            obj = {
                next: Date.now() + t,
            };
            ec();
        } else if(Date.now() > obj.next) {
            obj.next = Date.now() + t;
            ec();
        }
        return obj;
    }
}
