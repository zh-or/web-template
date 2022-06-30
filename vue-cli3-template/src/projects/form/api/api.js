import req from './request.config.js';
import {url} from "./link";
import makeService from '@/tools/makeService.js';

let service = {

    test(state, data) {
        return req.get(url.test, data);
    }
};

makeService(url, service, req);

export default service;
