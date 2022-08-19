import Vue from "vue";
import Vuex from "vuex";
import getters from './getters';
import { $api } from '@/autoImportUtils/index.js';
import $router from '@/router';
import {getToken, setToken, removeToken} from '@/utils/auth'
import defAva from '@/assets/img/def_user.png';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        app: {
            state: {
                token: getToken(),
                name: '',
                avatar: '',
                roles: [],
                permissions: [],
                menuCollapse: true,
                menuList: [],
            },
            actions: {
                setMenuCollapse(store, val) {
                    store.state.menuCollapse = val;
                },
                login(store, userInfo) {
                    const tenantCode = userInfo.tenantCode;
                    const systemCode = userInfo.systemCode;
                    const usercode = userInfo.usercode;
                    const password = userInfo.password;
                    const code = userInfo.code;
                    const uuid = userInfo.uuid;

                    return new Promise((resolve, reject) => {
                        $api.login({
                            tenantCode, systemCode, usercode, password, code, uuid
                        }).then(res => {
                            console.log(res);
                            store.state.token = res.data.access_token
                            setToken(store.state.token);

                            resolve()
                        }).catch(error => {
                            reject(error)
                        })
                    })
                },
                getInfo(store) {
                    return new Promise((resolve, reject) => {
                        $api.getInfo()
                            .then(res => {
                                const user = res.user
                                const avatar = (user.avatar == "" || user.avatar == null) ? defAva : process.env.VUE_APP_BASE_API + user.avatar;

                                if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                                    store.state.roles = res.roles
                                    store.state.permissions = res.permissions
                                } else {
                                    this.setRoutes = ['ROLE_DEFAULT']
                                }
                                store.dispatch('buildRouters');
                                store.state.name = user.userName
                                store.state.avatar = avatar;
                                resolve(res)
                            }).catch(error => {
                            reject(error)
                        })
                    })
                },
                buildRouters(store) {
                    let list = $router.options.routes;
                    let defMeta = {
                        hidden: false,
                        alwaysShow: false,
                        redirect: false,
                        noTagesView: true,
                        breadcrumb: true,
                        affix: false,
                        title: '',
                        icon: '',
                    }
                    list = list.map(item => {
                        item.meta = item.meta || defMeta;
                        item.meta = Object.assign(defMeta, item.meta);
                        return item;
                    });

                    store.state.menuList = list;
                },
                logOut(store) {
                    return new Promise((resolve, reject) => {
                        $api.logout().then(() => {
                            store.state.token = ''
                            store.state.roles = []
                            store.state.permissions = []
                            removeToken()
                            resolve()
                        }).catch(error => {
                            reject(error)
                        })
                    })
                }
            }
        },
    },
    getters
});


export default store;

