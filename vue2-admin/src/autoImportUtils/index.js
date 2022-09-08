import t from 'lib';
import notify from 'lib/notify';

import modal from '../utils/modal';
import api from '../api/api';
import store from '../store';
import router from '../router/index.js';


export const $t = t;
export const $modal = modal;
export const $api = api;
export const $notify = notify;
export const $store = store;
export const $router = router;

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
