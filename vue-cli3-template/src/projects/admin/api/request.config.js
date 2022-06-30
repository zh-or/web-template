import request from '@/tools/request.js';
import {getHost} from "./link";
import store from '../store';

let req = new request({
    host: getHost()
});

req.reqFilter((req) => {
    if(req.method.toUpperCase() == 'POST'){
        req.data = Object.assign({}, req.data);
    }
});

req.reqFilter((req) => {
    req.data.token = req.data.token || store.getters.token;
    for(let i in req.data){
        if(!req.data[i]){
            /*注意此处直接删除参数有问题, 会影响页面的data*/
            delete req.data[i];
        }
    }
});
req.resFilter((res, xhr) => {
    return JSON.parse(xhr.responseText);
});

export default req;
