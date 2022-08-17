export default function (url, service, req) {
    let keys = Object.keys(url);

    keys.forEach(k => {
        if (!service.hasOwnProperty(k)) {
            service[k] = function (/*state, */data, uploadData) {

                let val = url[k];
                let tmp = val.split('|');
                if (!tmp || tmp.length != 2) {
                    return req.get(val, data);
                }
                let m = tmp[0].toLocaleLowerCase();
                let path = tmp[1];
                //url/{params}
                if(path.indexOf('{') && data) {
                    Object.keys(data).forEach(k => {
                        path = path.replace(`{${k}}`, data[k]);
                    })
                }

                if (m === 'get') {
                    return req.get(path, data);
                } else if (m === 'post') {
                    return req.post(path, data);
                } else if (m === 'patch') {
                    return req.patch(path, data);
                } else if (m === 'put') {
                    return req.put(path, data);
                } else if (m === 'delete') {
                    return req.delete(path, data);
                } else if (m === 'upload') {
                    return req.upload(path, data/*files | file*/, uploadData);
                } else {
                    console.log(path + '\n暂不支持:' + tmp[0] + ', 只支持 get, post, patch 其他方法请自定义');
                }
                return Promise.reject('不支持的请求方式');
            };

        } else {
            console.log('已自定义接口:' + k);
        }
    });

}
