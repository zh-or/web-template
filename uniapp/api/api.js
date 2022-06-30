import makeService from '../lib/makeService.js';
import store from '../store/store.js';
import req from './request.config.js';
import {url} from "./link.js";

let api = {

};

makeService(url, api, req);

export default api;

