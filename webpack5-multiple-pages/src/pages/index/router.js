import { createWebHashHistory, createRouter, useRoute, useRouter } from 'vue-router';
import Main from './Main.vue';
import useMenuStore from './menuStore.js';

const routes = [
    { path: '/', redirect: '/home'},
    { path: '/login', meta: {title: '登录', name: 'login', hide: true}, component: () => import('./views/login.vue') },

    {
        path: '/',
        component: Main,
        meta: {name: 'main', icon: ''},
        children: [
            { path: 'home', meta: {title: '首页', name: 'home', icon: 'icon-ranking'}, component: () => import('./views/home.vue') },
            { path: 'aa', meta: {title: 'aa', name: 'aa', icon: 'icon-grid-unfilled', count: 'user', countClass: 'user-count',}, component: () => import('./views/aa.vue') },
            {
                path: 'userData/',
                meta: {title: '用户数据管理', icon: 'icon-ranking'},
                children: [
                    { path: 'user', meta: {
                            title: '用户管理', name: 'userManager', icon: 'icon-point',
                            count: 'user', countClass: 'user-count',
                        }, component: () => import('./views/userData/userManager.vue') },
                ]
            }
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

let menuStore;

router.beforeEach((to, from) => {

    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
    if(!menuStore) {
        menuStore = useMenuStore();
    }
    if(to.meta && to.meta.name) {
        menuStore.addCache({
            name: to.meta && to.meta.name,
            path: to.fullPath,
            title: to.meta.title,
        });
    }
});

export default {
    router: router,
    paths: routes,

    push(path, params) {
        router.push({
            path,
            query: params,
        })
    },
    replace(path, params) {
        router.replace({
            path,
            query: params,
        })
    },
    back(t) {
        if(t) {
            setTimeout(() => {router.back();}, t);
        } else {
            router.back();
        }
    },
    route() {
        return useRoute();
    }
};
