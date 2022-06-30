import '@/tools/FixBug.js';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/style.less';
import store from './store';


/*全局组件*/

import ElementUI from 'element-ui';
/*如果使用cdn引入时, 手动注释掉 element ui 的css引用*/
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icons';

Vue.use(ElementUI, {size: 'small'});


Vue.prototype.$success = (msg) => {
    ElementUI.Message.success({
        dangerouslyUseHTMLString: true,
        message: msg || ""
    });
};
Vue.prototype.$warning = (msg) => {
    ElementUI.Message.warning({
        dangerouslyUseHTMLString: true,
        message: msg || ""
    });
};

Vue.prototype.$info = (msg) => {
    ElementUI.Message.info({
        dangerouslyUseHTMLString: true,
        message: msg || ""
    });
};
Vue.prototype.$error = (msg) => {
    ElementUI.Message.error({
        dangerouslyUseHTMLString: true,
        message: msg || ""
    });
};

Vue.prototype.$hint = (msg) => {

    ElementUI.Message.error({
        dangerouslyUseHTMLString: true,
        message: msg || "",
        customClass: 'hint-message',//
        iconClass: '',
    });
}

import '@/tools/main-config';
import './assets/css/element-ui-reset.less';

import PageView from "@/components/PageView";
Vue.component('PageView', PageView);

router.beforeEach((to, from, next) => {

    document.title = to.meta.title || '';
    let path = to.path;
    // 获取 JWT Token
    if (!store.getters.Authorization && path != '/login') {
        next('/login');
        return;
    }

    next();
});


let vue = new Vue({
    router,
    store,
    render: h => h(App),
});

vue.$mount('#app');
