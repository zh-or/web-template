import req from './request.config.js';
import {url} from "./link";
import makeService from '@/utils/makeService.js';

let service = {
    /*自动生成方法*/
};

makeService(url, service, req);

export default service;
