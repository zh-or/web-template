/*ajax 请求封装*/

const TIMEOUT = 20 * 1000;

function defaultSuccessFun(res) {
    console.log(res);
}

function defaultErrorFun() {
    console.log('error:', arguments);
}

function Request(arg) {

    arg = arg || {};
    arg.requestFilter = arg.requestFilter || [];
    arg.responseFilter = arg.responseFilter || [];
    arg.errorFilter = arg.errorFilter || [];
    arg.headers = arg.headers || {};
    this.requestFilter = this.requestFilter.concat(arg.requestFilter);
    this.responseFilter = this.responseFilter.concat(arg.responseFilter);
    this.errorFilter = this.errorFilter.concat(arg.errorFilter);
    this.host = arg.host || '';
    this.formatUrlencode = arg.formatUrlencode || false;

    this.headers = {...this.headers, ...arg.headers};
}

Request.prototype = {
    requestFilter: [],
    responseFilter: [],
    errorFilter: [],
    host: '',
    headers: {},
    formatUrlencode: false,//post 时如果需要url编码
    reqFilter(fun) {
        this.requestFilter.push(fun);
    },
    resFilter(fun) {
        this.responseFilter.push(fun);
    },
    errFilter(fun) {
        this.errorFilter.push(fun);
    },
    get(url, data, headers) {

        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'GET',
                data: data,
                headers: headers,
                success: resolve,
                error: reject
            })
        });
    },
    post(url, data, headers, urlencode) {
        urlencode = urlencode || false;

        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'POST',
                data: data,
                headers: headers,
                success: resolve,
                error: reject,
                formatUrlencode: urlencode,
            })
        });
    },
    patch(url, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'PATCH',
                data: data,
                headers: headers,
                success: resolve,
                error: reject
            })
        });
    },
    delete(url, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'DELETE',
                data: data,
                headers: headers,
                success: resolve,
                error: reject
            })
        });
    },
    formData(url, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'POST',
                isFormData: true,
                data: data,
                headers: headers,
                success: resolve,
                error: reject
            })
        });
    },
    request(arg) {
        let self = this;
        arg = arg || {};
        arg.method = (arg.method || 'get').toUpperCase();
        arg.success = arg.success || defaultSuccessFun;
        arg.error = arg.error || defaultErrorFun;
        arg.isFormData = arg.hasOwnProperty('isFormData') ? arg.isFormData : false;
        arg.data = arg.data || {};
        arg.timeout = arg.timeout || TIMEOUT;
        arg.url = arg.url || '#';
        arg.async = arg.hasOwnProperty('async') ? arg.async : true;

        arg.headers = arg.headers || {};
        arg.headers = {...this.headers, ...arg.headers};

        arg.formatUrlencode = typeof arg.formatUrlencode === 'undefined' ? this.formatUrlencode : arg.formatUrlencode;

        arg._re_in_ = arg._re_in_ || 0;

        arg._re_in_++;

        if (arg._re_in_ > 5) {
            console.log('重入次数:' + arg._re_in_);
            //location.reload();
            return;
        }

        let isFormData = arg.isFormData;

        this.requestFilter.forEach((fun) => {
            fun.call(self, arg);
        });

        if (arg.method == 'GET') {
            let argArr = [];
            arg.data = arg.data || {};
            if (typeof arg.data == 'object') {
                Object.keys(arg.data).forEach(k => {
                    argArr.push(k + '=' + arg.data[k]);
                });
                if (argArr.length > 0) {
                    arg.url = arg.url + '?' + argArr.join('&');
                }
            }
        }

        let obj = {};
        try {
            obj = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            //obj.withCredentials = false;
        } catch (e) {
            arg.error(e);
            console.error('当前浏览器不支持异步请求!', e);
            return;
        }
        if (arg.sync === false) {
            obj.open(arg.method, this.host + arg.url, false);
        } else {
            obj.open(arg.method, this.host + arg.url);
        }
        if (arg.sync) {
            obj.timeout = arg.timeout;
        }
        if (isFormData) {
            //会自动添加
            //obj.setRequestHeader('Content-Type', 'multipart/form-data');
        } else {
            if (arg.formatUrlencode) {
                obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
            } else {
                obj.setRequestHeader('Content-Type', 'application/json');
            }
        }
        Object.keys(arg.headers).forEach(k => {
            obj.setRequestHeader(k, arg.headers[k]);
        });

        obj.onreadystatechange = function () {
            if (obj.readyState == 4) {
                if ((obj.status >= 200 && obj.status < 300) || obj.status == 304) {
                    try {
                        let res = {
                            ...arg,
                        };
                        self.responseFilter.forEach((fun) => {
                            res = fun.call(self, res, obj);
                        });
                        if (res) arg.success.call(self, res, obj);
                    } catch (e) {
                        arg.error.call(self, e, obj);
                    }
                } else if (obj.status == 500) {
                    arg.error.call(self, '服务器出现错误~', obj);
                } else {
                    arg.error.call(self, '状态错误:' + obj.status, obj);
                }

            }
        }
        if (isFormData) {
            obj.send(arg.data);
        } else if (arg.method != 'GET') {
            if (arg.formatUrlencode) {
                let keys = Object.keys(arg.data);
                let tmp = [];
                keys.forEach(k => {
                    tmp.push(k + '=' + encodeURIComponent(arg.data[k]));
                });
                obj.send(tmp.join('&'));
            } else {
                let str = '';
                try {
                    str = JSON.stringify(arg.data);
                } catch (e) {
                    str = arg.data;
                }
                obj.send(str);
            }

        } else {
            obj.send();
        }
    }
};


export default Request;
