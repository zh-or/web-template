import req from '@base/api/request.config.js';
import u from '@base/lib/tools.js';

let url = {
    
    getInfo: 'post|/auth/getInfo',
};

let service = {};
u.makeService(url, service, req);

export default service;
