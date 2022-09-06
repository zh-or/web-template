function req(arg) {
    arg = arg || {};
    arg.url = arg.url || '';
    arg.method = (arg.method || 'GET').toUpperCase();
    arg.data = arg.data || {};
    arg.header = arg.header || {};
    arg.responseType = arg.responseType || '';

    return new Promise((resolve, reject) => {
        try {
            const request = new XMLHttpRequest();
            request.open(arg.method === 'FORMDATA' ? 'POST' : arg.method, arg.url, true);

            if(arg.responseType) {
                request.responseType = arg.responseType;
            }

            Object.keys(arg.header).forEach(k => {
                request.setRequestHeader(
                    k,
                    arg.header[k]
                );
            });
            switch(arg.method) {
                case 'GET':
                case 'DELETE':
                    request.send();
                    break;
                case 'POST':
                case 'PUT':
                    request.setRequestHeader(
                        "Content-Type",
                        "application/json;charset=utf-8"
                    );
                    request.send(JSON.stringify(arg.data));
                    break;
                case 'FORMDATA':
                    request.send(arg.data);
                    break;
            }
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    const { status, statusText } = request;
                    if (status >= 200 && status <= 299) {
                        resolve(request.response);
                    } else {
                        reject(new Error("request error status is " + status));
                    }
                }
            };

        } catch(e) {
            console.error('xhr error:', e);
            reject(e);
        }
    })
}

export function get(url, params, header, arg) {
    url = url || '';
    let arr = [];
    Object.keys(params || {}).forEach(k => {
        arr.push(
            encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        )
    })
    if(arr.length > 0) {
        if(url.indexOf('?') != -1) {
            url = url + '&' + arr.join('&');
        } else {
            url = url + '?' + arr.join('&');
        }
    }
    return req({
        url: url,
        method: 'GET',
        data: params,
        header: header,
        ...arg
    })
}

export function post(url, params, header) {
    return req({
        url: url,
        method: 'POST',
        data: params,
        header: header,
    })
}

export function formData(url, params, header) {
    return req({
        url: url,
        method: 'FORMDATA',
        data: params,
        header: header,
    })
}


