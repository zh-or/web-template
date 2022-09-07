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
        if(obj === null || obj === undefined) {
            return null;
        }
        let res = Array.isArray(obj) ? [] : {};
        for(let k in obj) {
            if(typeof obj[k] === 'object') {
                res[k] = this.cloneObject(obj[k]);
            } else {
                res[k] = obj[k];
            }
        }
        return res;
    },
    clone(from, to) {
        for(let k in to) {
            let type = typeof to[k];
            if(!from.hasOwnProperty(k)) {
                continue;
            }
            switch(type) {
                case 'number':
                    to[k] = this.tryToNumber(from[k]);
                    break;
                case 'string':
                    to[k] = this.tryToString(from[k]);
                    break;
                case 'boolean':
                    to[k] = !!from[k];
                    break;
                case 'object':
                    if(Array.isArray(to[k])) {
                        if(Array.isArray(from[k])) {
                            to[k] = this.cloneObject(from[k]);
                        } else {
                            //类型不对
                        }
                    } else  {
                        this.clone(from[k], to[k]);
                    }
                    break;
            }
        }
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
