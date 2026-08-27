import {createPinia, defineStore} from 'pinia';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import mapi from './api/api.js';

import {getHost, getImgUrl} from '@base/api/host.js';

export default defineStore('menuStore', {
    state() {
        return {
            cacheViews: [],
            isCollapse: false,
            countValue: {
                user: 11
            },
            
            userInfo: {
                
            }
        }
    },
    getters: {
        keepAliveIncludes: state => {
            return state.cacheViews.map(_ => _.name);
        },
        firstName: state => {
            
            return '-';
        }
    },
    actions: {
        init() {
            return new Promise(async (resolve, reject) => {
                try {
                    let res = await mapi.getInfo();
                    if(res.code === 200) {
                        t.clone(res.data, this.userInfo);
                        console.log(this.userInfo);
                        resolve();
                        return;
                    }
                } catch(e) {
                    console.error('初始化失败:', e);
                }
                e.once(u.e.LOGINED, this.init);
                resolve();
            })
        },
        clearUserInfo() {
            t.clearObject(this.userInfo);
            e.once(u.e.LOGINED, this.init);
        },
        toggleCollapse(collapse) {
            this.isCollapse = collapse;
        },
        addCache(obj) {
            let old = this.cacheViews.find(v => v.path === obj.path)
            if(old) {
            
            } else {
                this.cacheViews.push(obj);
            }
        },
        removeCache(obj) {
            for(let i = 0; i < this.cacheViews.length; i++) {
                let item = this.cacheViews[i];
                if(obj.name === item.name) {
                    this.cacheViews.splice(i, 1);
                    return item;
                }
            }
            return null;
        },
        clearCache() {
            this.cacheViews = [];
        },
        setCountValue(k, v) {
            this.countValue[k] = v;
        }
    }
});
