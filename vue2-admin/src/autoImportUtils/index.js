import t from 'lib';
import notify from 'lib/notify';

import modal from '../plugins/modal';
import api from '../api/api';
import store from '../store';
import router from '../router/index.js';


export const $t = t;
export const $modal = modal;
export const $api = api;
export const $notify = notify;
export const $store = store;
export const $router = router;


export function getImgUrl(type, param) {
    let base = process.env.VUE_APP_BASE_API;
    let code = process.env.VUE_APP_Tenant_Code;
    switch(type) {
        case 'brand':
            return base + `/merchant/goods-brand/download-files/${param}?tenantCode=${code}`;
        case 'group':
            return base + `/merchant/goods-group/download-files/${param}?tenantCode=${code}`;
        case 'goods':
            return base + `/merchant/goods-base/download-files/${param}?tenantCode=${code}`;
        case 'merchant':
            return base + `/buss/merchant-info/download-files/${param}?tenantCode=${code}`;
        case 'editor':
            return base + `/buss/rich-text-files/download-files/${param}?tenantCode=${code}`;
        case 'file':
            return base + `/buss/file/download-files?filePath=${param}&tenantCode=${code}`;
        default:
            console.error('未知的图片类型');
            return '';
    }
}

import {Loading} from 'element-ui';
import {get} from '@/utils/xhr.js';
import {saveAs} from 'file-saver';


let downloadLoadingInstance;
export function downloadXhr(url, params, name) {
    downloadLoadingInstance = Loading.service({text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)",})
    get(url, params, {
        Authorization : 'Bearer ' + store.getters.token
    }, {
        responseType: 'blob'
    })
        .then(res => {
            const blob = new Blob([res]);
            saveAs(blob, name);
            downloadLoadingInstance.close();
        })
        .catch(e => {
            console.error(e)
            modal.error('下载文件出现错误，请联系管理员！');
            downloadLoadingInstance.close();
        })
}


import {getEnumArr as getEnumArray} from '@/components/enum/FormatEnum';
export const getEnumArr = getEnumArray;
