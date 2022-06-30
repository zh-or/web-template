import req from './request.config.js';
import {url} from "./link";
import makeService from '@/tools/makeService.js';

let service = {
    /*自动生成方法*/

    uploadHeadPic(state, file){
        /*上传文件*/
        let formData = new FormData();
        formData.append('imageFile', file);
        formData.append('token', state.getters.token);
        return req.formData(url.uploadHeadPic, formData);
    }
};

makeService(url, service, req);

export default service;
