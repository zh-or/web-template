import request from '@/tools/request.js';
import {getHost} from "./link";
import store from '../store';

let req = new request({
    host: getHost()
});

req.requestFilterFun((req) => {
    req.data.token = req.data.token || store.getters.Authorization;
});

req.responseFilterFun((res, xhr) => {
    res.body = JSON.parse(xhr.responseText);
});

export default req;
