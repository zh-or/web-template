import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/style.less'
import '@/tools/main-config.js'
import tools from '@/tools/tools';
import store from './store';

import Validation from '@/tools/validation'
//import loading from '@/tools/loading';

//Vue.directive('loading', loading);

import Loading from '@/components/loading/index.js';

Vue.use(Loading);

Validation.setOptions({
    delayHide: 3000,
    tipsPos: 'right',
    errorFunction: function(checker){
        if(checker.isExtend){
            checker.el.forEach(function(el){
                el.style.border = '1px solid #f00';
            })
        }else{
            checker.el.style.border = '1px solid #f00';
        }
    },
    hideTipsFunction: function(checker){

        if(checker.isExtend){
            checker.el.forEach(function(el){
                el.style.border = '';
            });
        }else{
            checker.el.style.border = '';
        }
    }
});

Vue.directive('validation', Validation.directive);
Vue.prototype.$validation = Validation;


router.beforeEach((to, from, next) => {

    document.title = to.meta.title || '';
    let path = to.path;
    // 获取 JWT Token
    if (!store.getters.Authorization && path != '/login') {
        tools.log('没有登录');
        /*next('/login');
        return;*/
    }

    next();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
