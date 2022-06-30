import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/svg'
        },
        {
            path: '/svg',
            name: 'svg',
            meta: {title: 'svg 测试'},
            component: () => import('./App.vue')
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
