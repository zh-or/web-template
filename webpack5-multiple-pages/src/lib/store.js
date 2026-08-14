import {createPinia, defineStore} from 'pinia';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import {getHost, getImgUrl} from '@base/api/host.js';


let pinia = createPinia();

function setToken(token) {
    t.cookie('token', token, {
        time: 1000 * 60 * 60 * 24 * 7
    });
    e.emit(u.e.LOGINED);
}

export function clearToken() {
    //console.warn('清理token');
    t.cookie('token', '', {time: -1});
}

export const userStore = defineStore('user', {
    state() {
        return {
            apiLoading: 0,
            loginState: false,
        }
    },
    getters: {
        isApiLoading: state => state.apiLoading > 0,
        isLogin: (state) => state.loginState,
        userInfo: (state) => state.userInfoState,
    },
    actions: {
        init() {
            return new Promise((resolve, reject) => {
                let token = t.cookie('token');
                if(token) {
                    this.loginState = true;
                    e.emit(u.e.LOGINED);
                }
                resolve();
            })
        },
        incApiLoading(v) {
            this.apiLoading += v;
            if(this.apiLoading < 0) {
                this.apiLoading = 0;
            }
        },
        setToken(token) {
            setToken(token);
            this.loginState = true;
        },
        checkLogin() {
            if (!this.isLogin) {
                e.emit(u.e.NEEDLOGIN);
            }
            return this.isLogin;
        },
        outLogin() {
            console.log('outlogin');
            clearToken();
            this.loginState = false;
            e.emit(u.e.NEEDLOGIN);
        },
        
    }
});


/*需要登录后才初始化的内容*/
export function waitLogin(cb) {
    waitInit(() => {
        let user = userStore();

        if (user.isLogin) {
            cb && cb();
        } else {
            e.once(u.e.LOGINED, () => {
                cb && cb();
            });
        }
    })
}

export function waitInit(cb) {
    e.once(u.e.INIT, () => {
        cb && cb();
    });
}

let childStores = [];

export function reg(store) {
    /*注册子store, 引用和初始化只需要操作 lib/store 就可以了
    *
    * */
    childStores.push(store);
}


let isInitStore = false;

export function initStore() {
    if (isInitStore) {
        return;
    }
    isInitStore = true;
    let user = userStore();
   
    let arr = childStores.map(_ => _().init());
    arr.push(user.init())

    e.on(u.e.LOGINED, async () => {
        if (!user.isLogin) {
        
        }
    });


    return Promise.all(arr);
}

export const store = pinia;
