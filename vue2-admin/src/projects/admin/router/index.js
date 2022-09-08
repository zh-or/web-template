import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);


const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
};

import PageMain from '@/components/admin/PageMain.vue';
import NoneRouter from '@/components/admin/NoneRouter.vue';

/*
*
* meta 字段
* {
        hidden: false, menu是否显示
        alwaysShow: false, 如果只有一个child则child顶上来显示
        redirect: false, 面包屑是否可点击
        noTagesView: true, 是否在tagsview显示
        breadcrumb: true, 是否在面包屑显示
        affix: false, 是否在tagsview中不可关闭 true时不可关闭
        title: '', 标题
        icon: '', 图标
    }
*
* */

const routes = [
    {
        path: '/',
        redirect: '/index',
        meta: {hidden: true},
    },
    {
        path: '/401',
        component: () => import('@/views/com/401'),
        meta: {hidden: true},
    },
    {
        path: '/login',
        name: 'login',
        meta: {hidden: true},
        component: () => import(/* webpackChunkName: "login" */ '@/views/login.vue')
    },
    {
        path: '/',
        name: 'index-wrap',
        meta: { hidden: true, },
        component: PageMain,
        children: [
            {
                path: 'index',
                component: () => import('@/views/index'),
                name: 'Index',
                meta: {title: '首页', icon: 'm-info', affix: true}
            }
        ]
    },
    {
        path: '/goods',
        name: 'goods',
        meta: { title: '商品管理', icon: 'm-info'},
        component: PageMain,
        children: [
            {
                path: 'list',
                component: () => import('@/views/goods/list'),
                name: 'goods-list',
                meta: {title: '商品列表', noCache: true, icon: 'm-info'}
            },
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/com/404'),
        meta: {
            hidden: true, noTagesView: true
        }
    },
]

const router = new VueRouter({
    routes
});

export default router;
