import t from 'lib';

const enums = {

}

const req = require.context('./vals', false, /\.js/);
const requireAll = requireContext => {
    requireContext.keys().map(path => {
        let e = requireContext(path).default;
        Object.keys(e).forEach(k => {
            if(enums.hasOwnProperty(k)) {
                console.error('枚举值重复:', k, e[k]);
            } else {
                enums[k] = e[k];
            }
        })
    });
    //console.log(url)
};
requireAll(req);

export function getEnumArr(type, opt) {
    opt = opt || {
        key: 'key',
        value: 'value',
        filter: [],
    };
    opt.key = opt.key || 'key';
    opt.value = opt.value || 'value';
    opt.filter = opt.filter || [];
    let arr = [];
    let obj = t.ObjGet(enums, type);
    if(obj) {
        Object.keys(obj).forEach(k => {
            if(opt.filter.indexOf(Number(k)) != -1) {
                return;
            }
            let item = {};
            item[opt.key] = k;
            item[opt.value] = obj[k];
            arr.push(item);
        })
    }
    return arr;
}

export function getEnum(type, key) {
    let str = '';
    let obj = t.ObjGet(enums, type);
    if(obj && obj.hasOwnProperty(key)) {
        str = obj[key];
    }
    return str;
}

export default {
    props: {
        type: String,
        state: Number,
        tag: {
            type: String,
            default: 'span'
        },
    },
    render() {
        let str = getEnum(this.type, this.state);
        return h(this.tag, {}, str);
    }
}
