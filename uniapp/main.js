import Vue from 'vue';
import App from './App';
import store from './store/store.js';
import router from './lib/router.js';
import tools from './lib/tools.js';
import api from './api/api.js';
import uView from '@/uni_modules/uview-ui';
Vue.use(uView);


Vue.prototype.$api = api;
Vue.prototype.$r = router;
Vue.prototype.$t = tools;
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
    store,
    ...App
});

app.$mount();
