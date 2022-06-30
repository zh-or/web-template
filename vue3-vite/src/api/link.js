export const getHost = function () {
    return '' + import.meta.env.VITE_APP_BASE_API;
}

export const url = {

}

let files = import.meta.globEager('./links/*.js');

for(let name in files) {
    appendUrl(files[name].default);
}
console.log(url);

function appendUrl(obj) {
    Object.keys(obj).forEach(k => {
        if(url.hasOwnProperty(k)) {
            console.error('接口重复:', k, obj[k]);
        } else {
            url[k] = obj[k];
        }
    })
}


