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
        path: '/base',
        name: 'base',
        meta: { title: '商家信息', icon: 'm-info'},
        component: PageMain,
        children: [
            {
                path: 'info',
                component: () => import('@/views/base/info'),
                name: 'enterprise1',
                meta: {title: '商户基础信息', icon: 'm-info'}
            },
            {
                path: 'setting',
                component: () => import('@/views/setting/setting'),
                name: 'setting-view',
                meta: {title: '设置', icon: 'm-info'}
            },
            {
                path: 'areaTable',
                component: () => import('@/views/setting/areaTable'),
                name: 'area-table-view',
                meta: {title: '区域桌台', icon: 'm-info'}
            },
            /*{
                path: 'info2',
                component: () => import('@/views/base/pay'),
                name: 'enterprise2',
                meta: {title: '商户支付信息', icon: 'dashboard'}
            },*/
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
            {
                path: 'group',
                component: () => import('@/views/goods/group'),
                name: 'goods-group',
                meta: {title: '商品分组', icon: 'm-info'}
            },
            {
                path: 'edit',
                component: () => import('@/views/goods/edit'),
                name: 'goods-add',
                hidden: true,
                breadcrumb: false,
                meta: {title: '编辑商品', noCache: true, noTagesView: true, icon: 'm-info'}
            },
            {
                path: 'brand',
                component: () => import('@/views/goods/brand'),
                name: 'goods-brand',
                meta: {title: '品牌管理', icon: 'm-info'}
            },
            {
                path: 'unit',
                component: () => import('@/views/goods/unit'),
                name: 'goods-unit',
                meta: {title: '单位管理', icon: 'm-info'}
            },
            {
                path: 'specs',
                component: () => import('@/views/goods/specs'),
                name: 'goods-specs',
                meta: {title: '规格管理', icon: 'm-info'}
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
