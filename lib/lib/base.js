
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
    Number(val, def) {
        let r = Number(val);
        if(isNaN(r)) {
            return def;
        }
        return r;
    },
    throttle(obj, fun, t) {//节流
        t = t || 200;
        if(obj == null || obj.timer === 0) {
            obj = {
                begin: Date.now(),
                timer: 0,
            };
        } else {
            clearTimeout(obj.timer);
            t = t - (Date.now() - obj.begin);
        }
        obj.timer = setTimeout(_ => {
            fun();
            obj.timer = 0;
        }, t);
        return obj;
    },
    debounce(obj, fun, t) {//防抖
        t = t || 200;
        if(obj) {
            clearTimeout(obj.timer);
        } else {
            obj = {
                timer: setTimeout(fun, t),
            };
        }
        return obj;
    }
}
