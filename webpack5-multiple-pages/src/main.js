import './assets/style/base.less';
import './assets/style/main.less';
import api from './api/api.js';

let wt = {
    validateSelf() {
        if (env.isDev) {
            return true;
        }
        return top.location.host.indexOf('hotdoc.fun') !== -1;
    },
    utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    },

    b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }
}


window.wt = wt;

console.log('main');
