import req from '@base/api/request.config.js';
import u from '@base/lib/tools.js';

let url = {
    initData: 'get|/api/home/init',
    search: 'get|/api/home/search/{type}/{value}',
    nearSearch: 'get|/api/home/nearSearch',

};

let service = {};
u.makeService(url, service, req);

export default service;
