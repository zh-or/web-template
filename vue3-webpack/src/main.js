import { createApp } from 'vue';

import '@/assets/styles/base.scss'; // global css
import '@/assets/styles/index.scss'; // global css
import '@/assets/icons';

import App from './App';
import store from './store';
import router from './router';



const app = createApp(App);


import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'; // 中文语言

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
    locale: locale,
    // 支持 large、default、small
    size: 'default'
})

import SvgIcon from '@/components/SvgIcon';// svg component
app.component('SvgIcon', SvgIcon);

app.use(router);
app.use(store);
// app.use(elementIcons)

import editor from '@/components/Editor';
app.component('editor', editor);

app.mount('#app');
