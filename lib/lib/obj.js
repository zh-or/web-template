import base from './base.js';



export default {
    tryToString(str, def) {
        def = def || '';
        if(str === undefined || str === null) {
            return def;
        }
        return str + '';
    },
    tryToNumber(n, def) {
        let t = Number(n);
        if(isNaN(t)) {
            return def || 0;
        }
        return t;
    },
    clearObject(obj, lvl) {
        for(let k in obj) {
            let type = typeof obj[k];
            switch(type) {
                case 'number':
                    obj[k] = 0;
                    break;
                case 'string':
                    obj[k] = '';
                    break;
                case 'boolean':
                    obj[k] = false;
                    break;
                case 'object':
                    if(Array.isArray(obj[k])) {
                        obj[k] = [];
                    } else  if(lvl && lvl > 0){
                        this.clearObject(obj[k], lvl - 1);
                    } else {
                        obj[k] = null;
                    }
                    break;
            }
        }
    },
    cloneObject(obj) {
        if ([null, undefined, NaN, false].includes(obj)) return obj
        if (typeof obj !== 'object' && typeof obj !== 'function') {
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
    clone(from, to, lvl) {
        if(!from) {
            console.error('from is null:', from);
            return;
        }
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
