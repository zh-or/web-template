import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/lib/common.js';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI, {size: 'small'});

Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
    document.title = to.meta.title || '';
    let path = to.path;

    next();
});

router.onError(e => {
    console.error(e);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
