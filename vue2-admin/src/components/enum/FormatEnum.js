import order from './vals/order';
import goods from './vals/goods';
import accountBook from './vals/accountBook';

const enums = {
    ...order,
    ...goods,
    ...accountBook,
}

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
    let obj = enums[type];
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
    let obj = enums[type];
    if(obj && obj.hasOwnProperty(key)) {
        str = obj[key];
    }
    return str;
}

export default {
    props: {
        type: String,
        state: Number
    },
    render() {
        let str = getEnum(this.type, this.state);
        return h('span', {}, str);
    }
}
