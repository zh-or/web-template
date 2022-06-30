let html = '<svg viewBox="25 25 50 50"> <circle cx="50" cy="50" r="20" fill="none"></circle></svg>';


let loading = {
    views: {},
    id: 0,
    create(){
        let wrap = document.createElement('div');
        wrap.innerHTML = html;
        wrap.className = 'loading-wrap';
        wrap.addEventListener('transitionend', function(){
            if(wrap.style.opacity == 0){
                wrap.style.display = 'none';
            }
        }, false);
        let k = 'key-' + (++this.id) ;
        this.views[k] = wrap;
        return k;
    },
    getView(key){
        return this.views[key];
    },
    removeView(key){
        delete this.views[key];
    },
    c(key, show){
        //console.log('key:' + key, 'show:' + show);
        let v = this.getView(key);
        if(v){
            if((show || false)){
                v.style.display = 'flex';
                v.style.opacity = 1;
            } else {
                v.style.opacity = 0;
            }
        }
    }
};


export default {
    bind: function (el, binding, vnode, oldVnode) {
        let k = loading.create();
        let v = loading.getView(k);
        el.setAttribute('loading-key', k);
        el.appendChild(v);
        loading.c(binding.value);
    },
    inserted: function (el, binding, vnode, oldVnode) {
        let k = el.getAttribute('loading-key');
        if(!k){
            return;
        }
        let v = loading.getView(k);
        let style = window.getComputedStyle(el);
        //console.log(el.offsetWidth, el.parentNode.offsetWidth, el, el.parentNode );
        if(style.position == 'relative'){
            v.style.top = '0';
            v.style.width = '100%';
            //v.style.position = 'absolute';
        } else if(style.position == 'static'){
            v.style.top = el.offsetTop + 'px';
            v.style.left = el.offsetLeft + 'px';
            let w = (el.offsetWidth || el.parentNode.offsetWidth);
            if(w == 0){
                v.style.width = '100%';
                v.style.height = '100%';
            } else {
                v.style.width = w + 'px';
                v.style.height = (el.offsetHeight || el.parentNode.offsetHeight) + 'px';
            }

        }
    },
    update: function (el, binding, vnode, oldVnode) {
        let k = el.getAttribute('loading-key');
        if(k){
            loading.c(k, binding.value);
        }
    },
    componentUpdated: function (el, binding, vnode, oldVnode) {

    },
    unbind: function (el, binding, vnode, oldVnode) {
        let k = el.getAttribute('loading-key');
        el.removeAttribute('loading-key');
        loading.removeView(k);
    }
};
