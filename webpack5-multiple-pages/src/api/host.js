export function getHost() {
    if(env.mode === 'dev') {//local
        //开发模式
        return '';
    }
    return '';
};


export function getImgUrl(url) {
    if(url) {
        if(url.startsWith('/')) {
            return getHost() + url;
        }
        return getHost() + '/' + url;
    }
    return '';
}
