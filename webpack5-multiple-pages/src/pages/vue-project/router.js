import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [

    {
        path: '/test',
        name: 'test',
        meta: {
            title: '登录',
            hide: true
        },
        component: () => import(/* webpackChunkName: "login" */ './views/test.vue')
    },
    {
        path: '/',
        redirect: '/test',
        meta: { hide: true },
    },

]

const router = new VueRouter({
    routes
});

router.onError((e) => {
    console.error('router:', e);
})

const pushFun = VueRouter.prototype.push;
const replaceFun = VueRouter.prototype.replace;

VueRouter.prototype.push = function() {
    try {
        return pushFun.apply(this, arguments);
    } catch(e) {
        console.error(e);
    }
}
VueRouter.prototype.replace = function() {
    try {
        return replaceFun.apply(this, arguments);
    } catch(e) {
        console.error(e);
    }
}

export default router
