import req from './request.config.js';
import msg from '@base/components/msg.js';
import u from '@base/lib/tools.js';
import {getHost, getImgUrl} from '@base/api/host.js';
import {configStore} from '@base/lib/store.js';
import {toRaw} from 'vue';


let url = {

}

//加载所有links下的js到url对象
const reqFiles = require.context('./links', false, /\.js/);
const requireAll = requireContext => {
    requireContext.keys().map(path => {
        let link = requireContext(path).default;
        Object.keys(link).forEach(k => {
            if(url.hasOwnProperty(k)) {
                console.error('接口重复:', k, link[k]);
            } else {
                url[k] = link[k];
            }
        })
    });
};
requireAll(reqFiles);




let service = {
    /*自动生成方法*/

};


//解析url生成api调用对象
u.makeService(url, service, req);


export default service;
