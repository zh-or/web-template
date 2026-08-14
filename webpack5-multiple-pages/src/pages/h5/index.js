import './assets/style.less';
import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@base/assets/style/reele.less';

import App from './App.vue';
import QuestionHint from '@base/components/widget/QuestionHint.vue';

import {store, initStore} from '@base/lib/store.js';


let app = createApp(App);

app.component('QuestionHint', QuestionHint);
app.use(ElementPlus);
app.use(store);

initStore();
app.mount('#app');
/*
function loadAndMount(com, id, use, props) {
    let app = createApp(com, props);

    app.component('QuestionHint', QuestionHint);
    app.use(ElementPlus);
    app.use(store);

    if(use) {
        use.forEach(c => app.use(c));
    }
    initStore();
    app.mount('#' + id);
}

import UserHeaderView from '@base/layout/UserHeaderView.vue';
loadAndMount(UserHeaderView, 'header', [], { test: 'aaa', });


import SearchMain from './SearchMain.vue';
loadAndMount(SearchMain, 'search', [], {});*/


