import base from './base.js';

export default {
    getQueryString(name, str) {
        var result = (str || location.href).match(new RegExp("[\?\&]" + name + "=([^\&\#]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return decodeURIComponent(result[1]);
    },
}
