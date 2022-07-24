import request from 'lib/request';
import {getHost} from "./link";

let req = new request({
    host: getHost()
});

req.reqFilter((req) => {

});

req.resFilter((res, data) => {
    return JSON.parse(data.response);
});

export default req;
