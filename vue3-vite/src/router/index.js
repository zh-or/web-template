import {createWebHistory, createRouter} from 'vue-router';
import NProgress from 'nprogress';
NProgress.configure({showSpinner: false});

// 公共路由
export const constantRoutes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        meta: {title: '登录'}
    },
];

const router = createRouter({
    //mode: 'hash',
    base: "/",
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    },
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    document.title = to.meta.title || '';
    let path = to.path;


    next();
    NProgress.done();
});

export default router;
