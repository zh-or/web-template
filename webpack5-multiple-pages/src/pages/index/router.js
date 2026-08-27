import { createWebHashHistory, createRouter, useRoute, useRouter } from 'vue-router';
import { toRaw } from 'vue';
import Main from './Main.vue';
import useMenuStore from './menuStore.js';
import u from '@base/lib/tools.js';

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
                            title: (q) => q?.id ? '编辑' : '新增管理', name: 'userManager', icon: 'icon-point',
                            count: 'user', countClass: 'user-count',
                        }, component: () => import('./views/userData/userManager.vue') 
                    },
                ]
            }
        ],
    },
    
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('./views/404.vue'),
        meta: {
            title: '页面不存在', name: 'pageNotFound', hide: true
        }
    },
    
    // 通配符路由，必须放在最后
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

let menuStore;

router.beforeEach((to, from) => {
    let title = '';
    if (to.meta && to.meta.title) {
        if(typeof to.meta.title === 'function') {
            title = to.meta.title(to.query);
        } else {
            title = to.meta.title;
        }
        document.title = to.meta.title
    }
    if(!menuStore) {
        menuStore = useMenuStore();
    }
    if(to.meta && to.meta.hide !== true && to.meta.name) {
        menuStore.addCache({
            name: to.meta && to.meta.name,
            path: to.fullPath,
            title: title,
        });
    }
});

export default {
    router: router,
    paths: routes,

    push(path, params) {
        params = params || {};
        if(path && path.indexOf('?') != 1) {
            let q = path.split('?');
            params = Object.assign(u.queryToObject(q[1]), params);
        }
        
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
        if(!menuStore) {
            menuStore = useMenuStore();
        }
        let current = router.currentRoute.value;
        menuStore.removeCache(current.meta);
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
