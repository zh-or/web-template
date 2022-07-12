import base from './base.js';



export default {
    deepClone(obj) {
        // 对常见的“非”值，直接返回原来值
        if ([null, undefined, NaN, false].includes(obj)) return obj
        if (typeof obj !== 'object' && typeof obj !== 'function') {
            // 原始类型直接返回
            return obj
        }
        const o =Array.isArray(obj) ? [] : {}
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === 'object' ? this.deepClone(obj[i]) : obj[i]
            }
        }
        return o
    },
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
    arrToString(arr, field) {
        let str = [];
        arr.forEach(item => {
            str.push(item[field]);
        });
        return str.join(',');
    },
}
