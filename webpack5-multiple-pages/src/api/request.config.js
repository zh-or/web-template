import request from '@zh-or/lib/request';
import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';

import {getHost, getImgUrl} from './host.js';
import {clearToken, userStore} from '@base/lib/store.js';

let url = {

}

let req = new request({
    host: getHost(),
    timeout: 1000 * 60 * 10,
    headers: {
        'Accept': '*/*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
    }
});

let user;

req.reqFilter((req) => {
    if(!user) {
        user = userStore();
    }
    user.incApiLoading(1);
    let token = t.cookie('token');
    if(token) {
        req.headers.token = token;
    }
});


req.resFilter((res) => {
    user.incApiLoading(-1);
    try {
        let obj = JSON.parse(res.response);

        if(obj.code === 401 || obj.code === 402) {
            msg.error('请先登录');
            clearToken();
            e.emit(u.e.NEEDLOGIN);
        } else if(obj.code === 403) {
            msg.error('所属账号权限不足 !');
        } else if(obj.code === 400 || obj.code === 500) {
            msg.error(obj.msg);
            console.error('错误:', obj);
        } else if(obj.code !== 200) {
            msg.error(obj.msg);
        }

        return obj;
    } catch(e) {
        console.error('解析JSON出错:', e, res);
    }
    return res.response;
});

req.errFilter((e, res) => {
    //由调用方输出错误
    //console.error(e, res);
    //t.showToast('网络错误');
});

export default req;
