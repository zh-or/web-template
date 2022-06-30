import Vue from 'vue';
import '@/assets/css/base.less';
import '@/assets/css/transition.less';
import tools from '@/tools/tools';
import local from '@/tools/local';

Vue.prototype.$local = local;
Vue.prototype.$t     = tools;


Vue.config.productionTip = false;
