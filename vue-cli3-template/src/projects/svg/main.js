import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/tools/main-config.js';

import '@/assets/icons';


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
