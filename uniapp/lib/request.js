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
    post(url, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'POST',
                data: data,
                headers: headers,
                success: resolve,
                error: reject,
            })
        });
    },
    put(url, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'PUT',
                data: data,
                headers: headers,
                success: resolve,
                error: reject
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
    upload(url, file, data, headers) {
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'UPLOAD',
                data: data,
                file: file,
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
        arg.data = arg.data || {};
        arg.timeout = arg.timeout || TIMEOUT;
        arg.url = arg.url || '#';
        arg.async = arg.hasOwnProperty('async') ? arg.async : true;

        arg.headers = arg.headers || {};
        arg.headers = {...this.headers, ...arg.headers};

        arg.formatUrlencode = typeof arg.formatUrlencode == 'undefined' ? this.formatUrlencode : arg.formatUrlencode;

        arg._re_in_ = arg._re_in_ || 0;

        arg._re_in_++;

        if (arg._re_in_ > 5) {
            console.log('重入次数:' + arg._re_in_);
            //location.reload();
            return;
        }

        let isUpload = arg.method == 'UPLOAD';

        this.requestFilter.forEach((fun) => {
            fun.call(self, arg);
        });


        try {
            let successFun = function (res) {
                let obj = {
                    request: arg,
                    response: res,
                    statusCode: res.statusCode
                };
                try {
                    let res = {
                    };
                    self.responseFilter.forEach((fun) => {
                        res = fun.call(self, res, obj);
                    });
                    if (res) arg.success.call(self, res, obj);
                } catch (e) {
                    arg.error.call(self, e, obj);
                }
            }

            if (isUpload) {
                let fs = null;
                if(Array.isArray(arg.file.path)) {
                    fs = arg.file.path;
                }
                uni.uploadFile({
                    'url': self.host + arg.url,
                    'formData': arg.data,
                    'files': fs, //需要上传的文件列表。使用 files 时，filePath 和 name 不生效
                    'filePath': arg.file.path,
                    'name': arg.file.name,
                    'header': arg.headers,
                    'timeout': arg.timeout,
                    'success': successFun,
                    'fail': function (e) {
                        let isHold = false;
                        self.errorFilter.forEach(f => {
                            if (f.call(self, e)) {
                                isHold = true;
                            }
                        });
                        if (!isHold) {
                            arg.error.call(self, e);
                        }
                    }
                });
            } else {
                if (arg.formatUrlencode) {
                    arg.headers['content-type'] = 'application/x-www-form-urlencoded';
                }
                uni.request({
                    'url': self.host + arg.url,
                    'data': arg.data,
                    'header': arg.headers,
                    'timeout': arg.timeout,
                    'method': arg.method,
                    'success': successFun,
                    'fail': function (e) {
                        let isHold = false;
                        self.errorFilter.forEach(f => {
                            if (f.call(self, e)) {
                                isHold = true;
                            }
                        });
                        if (!isHold) {
                            arg.error.call(self, e);
                        }
                    },
                    'complete': function() {
                        //uni.showToast({title:'complete url:' + arg.url})
                    }
                })
            }
        } catch (e) {
            arg.error.call(self, e, arg);
        }
    }
};

export default Request;
