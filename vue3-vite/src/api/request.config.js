import request from '@/utils/request.js';
import {getHost} from "./link";

let req = new request({
    host: getHost()
});

req.reqFilter((req) => {

});

req.resFilter((res, xhr) => {
    return JSON.parse(xhr.responseText);
});

export default req;
