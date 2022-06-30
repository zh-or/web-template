import reqObj from '@/tools/request.js';
import {getHost, url} from "./link";
import makeService from '@/tools/makeService.js';

let request = new reqObj({
    host: getHost(),
    responseFilter: [
        (req, res) => {
            try {
                res.data = JSON.parse(res.responseText);
            } catch (e) {
                req.error(e);
            }
            return false;
        }
    ]
});

let service = {

};

makeService(url, service, request);

export default service;

