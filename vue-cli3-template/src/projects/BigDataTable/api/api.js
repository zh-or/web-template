import reqObj from '@/tools/request.js';
import {getHost, url} from "./link";
import makeService from '@/tools/makeService.js';

let request = new reqObj({
    host: getHost(),
});

let service = {

};

makeService(url, service, request);

export default service;

