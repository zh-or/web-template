import './assets/style.less';
import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';
import '@base/assets/style/reele.less';
import '@base/assets/style/base.less';
import QuestionHint from '@base/components/widget/QuestionHint.vue';

import router from './router.js';
import {store, initStore, reg} from '@base/lib/store.js';
import menuStore from './menuStore.js';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';

function loadAndMount(com, id, use, props) {
    let app = createApp(com, props);

    app.component('QuestionHint', QuestionHint);
    app.use(ElementPlus, {
        locale: zhCn,
        size: 'small',
    });
    app.use(store);

    if(use) {
        use.forEach(c => app.use(c));
    }
    reg(menuStore);
    initStore();
    app.mount('#' + id);
}

import app from './App.vue';
loadAndMount(app, 'app', [router.router]);


e.on(u.e.NEEDLOGIN, () => {
    router.replace('/login');
});
