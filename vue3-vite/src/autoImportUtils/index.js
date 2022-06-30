import t from '../utils/index';
import modal from '../plugins/modal';
import api from '../api/api';
import notify from '@zh-or/notify-js';

//这里导出的可以在vue的steup里面直接使用
export const $t = t;
export const $modal = modal;
export const $api = api;
export const $notify = notify;
