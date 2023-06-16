import request from '@zh-or/lib/request';
import {getHost} from "./link";
import store from '../store.js';
import router from '../router.js';
import modal from '@/lib/modal.js';

let req = new request({
    host: getHost(),
    headers: {
        //'Content-Type': 'application/json;charset=utf-8',
    }
});

req.reqFilter((req) => {
    let token = store.getters.token;
    if(token) {
        req.headers.Authorization = 'Bearer ' + token;
    }
    req.headers['Tenant-Code'] = process.env.VUE_APP_Tenant_Code;

    let data = {...req.data};

    Object.keys(data).forEach(k => {
        if(data[k] === '' || data[k] === null) {
            delete data[k]
        }
    });
    req.data = data;

    let url = req.url;
    if(url.indexOf('{') != -1) {
        Object.keys(req.data).forEach(k => {
            url = url.replaceAll(`{${k}}`, req.data[k]);
        });
        req.url = url;
    }
});

const errObj = {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误，请反馈给管理员'
}

req.resFilter((res) => {
    let json = JSON.parse(res.response);
    const code = json.code || 200;
    const msg = errObj[code] || json.msg || errObj['default'];

    if(code !== 200) {
        if(code === 401) {
            store.dispatch('logOut')
                .then(_ => {
                    location.href = '/#/login';
                });
        }
        modal.error(msg);
        throw new Error(msg);
    }


    return json;
});

export default req;
