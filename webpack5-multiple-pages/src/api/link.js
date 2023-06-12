export const getHost = function () {
    return '';
}

export const url = {

}

const req = require.context('./links', false, /\.js/);
const requireAll = requireContext => {
    requireContext.keys().map(path => {
        let link = requireContext(path).default;
        Object.keys(link).forEach(k => {
            if(url.hasOwnProperty(k)) {
                console.error('接口重复:', k, link[k]);
            } else {
                url[k] = link[k];
            }
        })
    });
    //console.log(url)
};
requireAll(req);


