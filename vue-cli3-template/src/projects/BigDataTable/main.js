import Vue from 'vue';
import App from './App.vue';
import './assets/css/style.less';
import '@/tools/main-config.js';

import loading from '@/tools/loading';
import BigDataTable from '@/components/BigDataTable/index.js';;

Vue.directive('loading', loading);
Vue.use(BigDataTable);

new Vue({
    render: h => h(App)
}).$mount('#app');
