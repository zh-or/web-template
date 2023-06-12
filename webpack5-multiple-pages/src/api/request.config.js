import request from '@zh-or/lib/request';
import {getHost} from "./link";
import t from '@zh-or/lib';


let req = new request({
    host: getHost(),
    timeout: 1000 * 60 * 10,
});

req.reqFilter((req) => {

});


req.resFilter((res) => {
    try {
        let obj = JSON.parse(res.response);

        return obj;
    } catch(e) {
        console.error('解析JSON出错:', e, res);
    }
    return res.response;
});

req.errFilter((e, res) => {
    console.error(e, res);
    t.showToast('网络错误');
});

export default req;
