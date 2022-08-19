import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {size: 'small'});

import '@/assets/icons/index.js';
import SvgIcon from '@/components/SvgIcon';// svg component
Vue.component('SvgIcon', SvgIcon);

import '@/assets/css/base.scss';

router.beforeEach((to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title;
    }

    if (to.fullPath !== '/login' && store.getters.token === '') {
        next('/login');
        return;
    }
    next();
});


Vue.config.productionTip = false;
let app = new Vue({
    router,
    store,
    render: h => h(App)
});

app.$mount('#app');

