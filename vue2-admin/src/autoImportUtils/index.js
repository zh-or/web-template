import t from 'lib';
import notify from 'lib/notify';

import modal from '../plugins/modal';
import api from '../api/api';
import store from '../store';
//import router from '../router';



//这里导出的可以在vue的setup里面直接使用
export const $t = t;
export const $modal = modal;
export const $api = api;
export const $notify = notify;
export const $store = store;
//export const $router = router;
