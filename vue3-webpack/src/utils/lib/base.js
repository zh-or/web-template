const _columnMinWidth = 10;

export default {
    DEBUG: true,
    _id_: 0,
    _textWidthCache: {},
    _cacheSpan: null,
    getTextWidth(text) {
        let width = this._textWidthCache[text];
        if (typeof width != 'number') {
            if (!text || text.length <= 0) {
                width = _columnMinWidth;
            } else {
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
                _cacheSpan.innerText = text;
                width = _cacheSpan.offsetWidth;
            }
            this._textWidthCache[text] = width;
        }
        return width;
    },
    getId(str) {
        this._id_++;
        return (str || 'id_') + this._id_;
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
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    },
}
