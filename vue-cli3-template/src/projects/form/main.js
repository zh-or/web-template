import Vue from "vue";
import App from "./App.vue";
import store from './store';


import tools from "@/tools/tools.js";
import "@/assets/icons"; // svg icon
import '@/components/DynamicForm/index.js';
import './assets/style/style.less';


import local from '@/tools/local.js';

Vue.prototype.$t = tools;
Vue.prototype.$local = local;
Vue.prototype.$chooseFile = function (callback) {
    let input = document.createElement('input');
    input.type = 'file';
    input.style.width = '1px';
    input.style.height = '1px';
    input.onchange = function (e) {
        //console.log('file:', e, input.files);
        callback(input.files);
        input.style.display = 'none';
    };
    document.body.appendChild(input);
    input.click();
}


let vue = new Vue({
    store,
    render: h => h(App)
});

vue.$mount("#app");
