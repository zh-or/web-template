import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Test',
            component: () => import('./views/Test.vue')
        },
        {
            path: '/createForm',
            name: 'createForm',
            component: () => import('./views/CreateForm.vue')
        },
    ]
})
