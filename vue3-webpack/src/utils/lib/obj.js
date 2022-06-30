import base from './base.js';

export default {
    clear(data) {
        data = data || {};
        let keys = Object.keys(data);
        keys.forEach(k => {
            let type = typeof data[k];
            switch (type) {
                case 'string':
                    data[k] = '';
                    break;
                case 'number':
                    data[k] = null;
                    break;
                case 'boolean':
                    data[k] = false;
                    break;
                case 'object':
                    if (Array.isArray(data[k])) {
                        data[k] = [];
                    } else {
                        this.clear(data[k]);
                    }
                    break;
            }
        })
    },
    clone(from, to, lvl) {
        //根据to对象的字段来复制
        if(lvl && lvl <= 0) return false;
        let keys = Object.keys(to);
        let val, type;
        keys.forEach(k => {
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
                    if (Array.isArray(to[k])) {
                        to[k] = [];
                    } else if(to[k]) {//null时不复制
                        this.clone(from[k], to[k], lvl ? lvl - 1 : undefined);
                    } else {
                        to[k] = null;
                    }
                    break;
                default:
                    to[k] = null;
            }
        });
    },
    copyObj(src, to) {
        //复制一个新对象
        to = to || {};
        let keys = Object.keys(src), val, type;
        keys.forEach(k => {
            val = src[k];

            type = typeof val;
            switch (type) {
                case 'string':
                case 'number':
                    to[k] = src[k];
                    break;
                case 'boolean':
                    to[k] = !!src[k];
                    break;
                case 'object':
                    if (Array.isArray(to[k])) {
                        to[k] = [];
                    } else if(src[k]){
                        to[k] = {};
                        this.copyObj(src[k], to[k]);
                    } else {
                        to[k] = null;
                    }
                    break;
                default:
                    to[k] = null;
            }
        })
        return to;
    },
    ObjHas(obj, key) {
        try {
            let keys = key.split('.');
            let _obj = obj;
            for (let i = 0; i < keys.length; i++) {
                if (!_obj.hasOwnProperty(keys[i])) {
                    return false;
                }
                _obj = _obj[keys[i]];
            }
            return true;
        } catch (e) {
            console.error('ObjHas Error:', e);
        }

        return false;
    },
    ObjGet(obj, key) {
        try {
            let keys = key.split('.');
            let _obj = obj;
            for (let i = 0; i < keys.length; i++) {
                if (!_obj.hasOwnProperty(keys[i])) {
                    return null;
                }
                _obj = _obj[keys[i]];
            }
            return _obj;
        } catch (e) {
            console.error('ObjGet Error', e);
        }
        return null;
    },
    attr(arr, obj) {
        if (Array.isArray(arr)) {
            arr.forEach((item) => {
                for (let f in obj) {
                    item[f] = obj[f];
                }
            });
        }
    },
    arrToString(arr, c) {
        let str = [];
        arr.forEach(item => {
            str.push(item[c]);
        });
        return str.join(',');
    },
}
