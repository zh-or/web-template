import t from '@/tools/tools.js';

export default function (url, service, req) {
    let keys = Object.keys(url);

    keys.forEach(k => {
        if (!service.hasOwnProperty(k)) {
            service[k] = function (state, data) {

                let val = url[k];
                let tmp = val.split('|');
                if (!tmp || tmp.length != 2) {
                    return req.get(tmp[1], data);
                }
                let m = tmp[0].toUpperCase();
                if (m == 'GET') {
                    return req.get(tmp[1], data);
                } else if (m == 'POST') {
                    return req.post(tmp[1], data);
                } else if (m == 'PATCH') {
                    return req.patch(tmp[1], data);
                } else if (m == 'DELETE') {
                    return req.delete(tmp[1], data);
                } else {
                    t.log(tmp[1] + '\n暂不支持:' + m + ', 其他方法请自定义');
                }
                return Promise.reject('不支持的请求方式');
            };

        } else {
            t.log('已自定义接口:' + k);
        }
    });

}
