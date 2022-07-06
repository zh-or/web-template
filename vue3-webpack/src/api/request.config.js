import {request} from 'lib';
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
