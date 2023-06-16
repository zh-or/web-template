import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminPageWrap from '@/components/AdminPageWrap.vue';
Vue.use(VueRouter)


const routes = [

    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hide: true
        },
        component: () => import(/* webpackChunkName: "chunk1" */ './views/login.vue')
    },
    {
        path: '/',
        redirect: '/main/index',
        meta: { hide: true },
    },
    {
        path: '/main',
        name: 'main',
        meta: {
            title: '首页1'
        },
        component: AdminPageWrap,
        children: [
            {
                path: 'index',
                name: 'main',
                meta: {title: '首页'},
                component: () => import(/* webpackChunkName: "aaa" */ './views/index.vue')
            },
            {
                path: 'index2',
                name: 'main',
                meta: {title: 'xxx'},
                component: () => import(/* webpackChunkName: "aaa" */ './views/index.vue')
            }
        ]
    },

    {
        path: '/main',
        name: 'main',
        meta: {
            title: '首页1',
            hide: true
        },
        component: AdminPageWrap,
        children: [
            {
                path: 'index3',
                name: 'main',
                meta: {title: '到顶级'},
                component: () => import(/* webpackChunkName: "bbb" */ './views/index.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
});

export default router
