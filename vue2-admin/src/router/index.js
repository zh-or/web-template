import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import PageMain from '@/layout/PageMain.vue';
import NoneRouter from '@/layout/NoneRouter.vue';

/*
*
* meta 字段
* {
        hidden: false, menu是否显示
        alwaysShow: false, 如果只有一个child则child顶上来显示
        redirect: false, 面包屑是否可点击
        noTagesView: true, 是否在tagsview显示
        breadcrumb: true, 是否在面包屑显示
        affix: false, 是否在tagsview中不可关闭
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
                meta: {title: '首页', icon: 'dashboard', affix: true}
            }
        ]
    },
    {
        path: '/test',
        name: 'index-wrap',
        meta: { title: 'test', icon: 'download'},
        component: PageMain,
        children: [
            {
                path: 'test1',
                component: () => import('@/views/test1'),
                name: 'Index',
                meta: {title: 'test1', icon: 'dashboard', affix: true}
            },
            {
                path: 'test2',
                component: () => import('@/views/test2'),
                name: 'test2',
                meta: {title: 'test2', icon: 'dashboard', affix: true}
            }
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
