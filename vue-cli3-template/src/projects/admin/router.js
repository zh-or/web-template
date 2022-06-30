import Vue from 'vue';
import Router from 'vue-router';
import Main from './page/Main.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            meta: {title: '登录'},
            component: () => import(/* webpackChunkName: "page-login" */ './page/Login.vue'),
        },
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: Main,
            children: [
                {
                    path: '/index',
                    name: 'index',
                    meta: {title: '统计'},
                    component: () => import(/* webpackChunkName: "page-admin" */ './page/Index.vue'),
                },
                {
                    path: 'test',
                    name: 'test',
                    component: {
                        template: '<router-view/>'
                    },
                    children: [
                        {
                            path: 'test',
                            name: 'test',
                            meta: {title: 'test'},
                            component: () => import(/* webpackChunkName: "page-test" */ './page/content/test.vue'),
                        }
                    ]
                }
            ]
        },
        {
            path: '*',
            name: '404',
            component: {
                template: '<div>无效路由 <a href="/" style="color: #5dc0fe;">返回首页</a></div>'
            }
        }
    ]
})
