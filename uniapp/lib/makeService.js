export default function (url, service, req) {
    let keys = Object.keys(url);

    keys.forEach(k => {
        if (!service.hasOwnProperty(k)) {
            service[k] = function (/*state, */data) {

                let val = url[k];
                let tmp = val.split('|');
                if (!tmp || tmp.length != 2) {
                    return req.get(val, data);
                }
                let m = tmp[0].toLocaleLowerCase();

                if (m === 'get') {
                    return req.get(tmp[1], data);
                } else if (m === 'post') {
                    return req.post(tmp[1], data);
                } else if (m === 'patch') {
                    return req.patch(tmp[1], data);
                } else if (m === 'delete') {
                    return req.delete(tmp[1], data);
                } else if (m === 'upload') {
                    return req.upload(tmp[1], data);
                } else {
                    console.log(tmp[1] + '\n暂不支持:' + tmp[0] + ', 只支持 get, post, patch 其他方法请自定义');
                }
                return Promise.reject('不支持的请求方式');
            };

        } else {
            console.log('已自定义接口:' + k);
        }
    });

}
