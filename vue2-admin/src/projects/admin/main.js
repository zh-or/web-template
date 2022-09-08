import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
    $api,
    $modal,
    $notify,
    $store,
    $router,
    getImgUrl,
    downloadXhr,
} from '@/autoImportUtils/index.js';

import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/element-variables.scss';
Vue.use(ElementUI, {size: 'small'});

import '@/assets/icons/index.js';
import SvgIcon from '@/components/SvgIcon';// svg component
Vue.component('SvgIcon', SvgIcon);

import FileSelect from './FileSelect';
Vue.component('FileSelect', FileSelect);

import Pagination from './Pagination';
Vue.component('Pagination', Pagination);

import FormatEnum from '../enum/FormatEnum.js';
Vue.component('FormatEnum', FormatEnum);

import '@/assets/css/base.scss';
import '@/assets/css/page.scss';

router.beforeEach((to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title;
    }
    store.dispatch('appendTag', to);
    if (to.fullPath !== '/login' && store.getters.token === '') {
        next('/login');
        return;
    }
    next();
});

router.push('/index');

Vue.config.productionTip = false;
let app = new Vue({
    router,
    store,
    render: h => h(App),
    created() {
    }
});

app.$mount('#app');

