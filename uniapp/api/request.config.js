import request from '../lib/request.js';
import {getHost} from './link.js';
import store from '../store/store.js';

let req = new request({
    host: getHost(),
    formatUrlencode: false
});

req.errFilter((obj) => {
    console.log('err', obj);
    if(obj.statusCode == 401) {//需要登录
        uni.showToast({title: '请先登录', icon: 'none'});
        uni.reLaunch({
            url: '/pages/login'
        });
        return true;
    }
    return false;
});

req.reqFilter((req) => {

    req.data = req.data || {};
    //req.data.token = store.getters.token;
    if(req.url.indexOf('?') != -1){
        req.url = req.url + '&token=' + store.getters.token;
    } else {
        req.url = req.url + '?token=' + store.getters.token;
    }
});

req.resFilter((res, xhr) => {

    let json = xhr.data;

    try{
        if(typeof json == 'string'){
            json = JSON.parse(json);
        }
    }catch(e){
        console.error('格式化json出错', 'url:' + res.url, xhr.data, e);
        json = xhr.data;
    }

    return json;
});

export default req;

