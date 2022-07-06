import base from './base.js';

export default {
    getQueryString(name) {
        var result = location.href.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return decodeURIComponent(result[1]);
    },
}
