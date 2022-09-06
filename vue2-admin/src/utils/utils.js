/**
 * 通用js方法封装处理
 */

// 日期格式化
export function parseTime(time, pattern) {

    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    let search = params;
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
    if (value === undefined) {
        return "";
    }
    var actions = [];
    Object.keys(datas).some((key) => {
        if (datas[key].value == ('' + value)) {
            actions.push(datas[key].label);
            return true;
        }
    })
    if (actions.length === 0) {
        actions.push(value);
    }
    return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
    if (value === undefined) {
        return "";
    }
    var actions = [];
    var currentSeparator = undefined === separator ? "," : separator;
    var temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        var match = false;
        Object.keys(datas).some((key) => {
            if (datas[key].value == ('' + temp[val])) {
                actions.push(datas[key].label + currentSeparator);
                match = true;
            }
        })
        if (!match) {
            actions.push(temp[val] + currentSeparator);
        }
    })
    return actions.join('').substring(0, actions.join('').length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

// 数据合并
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p]);
            } else {
                source[p] = target[p];
            }
        } catch (e) {
            source[p] = target[p];
        }
    }
    return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }

    return tree;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}


// 返回项目路径
export function getNormalPath(p) {
    if (p.length === 0 || !p || p == 'undefined') {
        return p
    }
    ;
    let res = p.replace('//', '/')
    if (res[res.length - 1] === '/') {
        return res.slice(0, res.length - 1)
    }
    return res;
}

// 验证是否为blob格式
export async function blobValidate(data) {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
}

//排列组合
export function descartes(list) {
    var point = {};
    var result = [];
    var pIndex = null;
    var tempCount = 0;
    var temp = [];
    for (var index in list) {
        if (typeof list[index] == 'object') {
            point[index] = {'parent': pIndex, 'count': 0}
            pIndex = index;
        }
    }
    if (pIndex == null) {
        return list;
    }
    while (true) {
        for (var index in list) {
            tempCount = point[index]['count'];
            temp.push(list[index][tempCount]);
        }
        result.push(temp);
        temp = [];
        while (true) {
            if (point[index]['count'] + 1 >= list[index].length) {
                point[index]['count'] = 0;
                pIndex = point[index]['parent'];
                if (pIndex == null) {
                    return result;
                }
                index = pIndex;
            } else {
                point[index]['count']++;
                break;
            }
        }
    }
}

export function getRule(msg, type, trigger) {
    trigger = trigger || 'blur';
    if(msg && typeof msg === 'function') {
        return [
            {required: true, validator: msg, trigger: trigger }
        ]
    }

    msg = msg || '请输入';

    return [
        {required: true, message: msg, trigger: trigger}
    ]
}


export function getDiffDay(type) {
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
    }
    start.setHours(0);
    start.setMinutes(0);
    start.setMilliseconds(0);
    return [start, now];
}


export function obj2FormData(obj) {
    let formData = new FormData();
    Object.keys(obj).forEach(k => {
        formData.append(k, obj[k]);
    });
    return formData;
}

export function throttle(obj, fun, t) {//节流
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
}

export function downloadByUrl(url, name) {
    console.log('download', url);
    let a = document.createElement('a');
    a.style.opacity = 0;
    a.style.width = '0px';
    a.style.height = '0px';
    a.setAttribute('href', url);
    if(name) {
        a.setAttribute('download', name);
    }
    document.body.appendChild(a);
    a.click();
    setTimeout(_ => {
        document.body.removeChild(a);
    }, 100);
}

export function selectFile(cb, accept) {
    let input = document.querySelector('#_______t_select_input_1______');

    if(!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = '_______t_select_input_1______';
        input.style = 'width: 1px; height: 1px; opacity: 0.01; position: absolute; z-index: -1;top: -100px;left: -100px;';
        document.body.appendChild(input);
    }
    input.setAttribute('accept', accept || '*/*');
    input.onchange = function() {
        cb(input.files);
        document.body.removeChild(input);
    };
    input.click();

}
import './decimal.js';
export function calc(a, m, b) {
    let da = new Decimal(a);
    let db = new Decimal(b);
    let r = '0';
    switch(m) {
        case '+': r = da.add(db); break;
        case '-': r = da.sub(db); break;
        case '*': r = da.mul(db); break;
        case '/': r = da.div(db); break;
        default:
            r = new Decimal(0);
    }
    return r.toNumber();
}

export function calcEx() {
    let params = [...arguments];
    let res, m;
    params.forEach(v => {
        if(!res) res = v;
        else if(!m) m = v;
        else {
            res = calc(res, m, v);
            m = null;
        }
    });
    return res;
}
