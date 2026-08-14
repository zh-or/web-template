import './assets/style/base.less';
import './assets/style/main.less';

import t from "@zh-or/lib";
import e from "@zh-or/lib/event";
import u from '@base/lib/tools.js';

let tmpUserInfo = null;
let wt = {
    pos: null,
    utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    },
    b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    },
    qe(sel, e, f, dom) {
        window.addEventListener('load', () => {
            (dom || document).querySelectorAll(sel)
            .forEach(dd => {
                dd.addEventListener(e, f.bind(dd));
            })
        })
    },
    parent(dom, sel) {
        if(!dom) {
            return null;
        }
        let parent = null;
        do {
            parent = dom.parentNode;
            if(parent) {
                if(parent.matches(sel)) {
                    return parent;
                } else {
                    dom = parent;
                }
            }

        } while(parent != null);
        return null;
    },
    reload(t = 200) {
        setTimeout(() => {
            location.reload();
        }, t);
    },
    createOccupy(id) {//创建占位div用于挂载组件
        let div = document.createElement('div');
        div.setAttribute('id', id);
        document.body.append(div);
    },
    setCurrentUserInfo(info) {
        tmpUserInfo = info;
    },
    getCurrentUserInfo() {
        return tmpUserInfo;
    },
    getCurrentUserInfoStr() {
        return tmpUserInfo ? JSON.stringify({id: tmpUserInfo.id, name: tmpUserInfo.nickname}) : '';
    },
    listenLoginAndReload() {
        e.once(u.e.LOGINED, () => {
            location.reload()
        });
    },
    copy(str) {
        t.copyString(str);
        t.showToast('已复制到剪切板');
    }
}

window.wt = wt;

if(env.isDev) {
    console.log('env:', env);
} else {
    console.error = function() {
        let out = [
            'user:' + wt.getCurrentUserInfoStr(),
            'url:' + location.href,
        ];
        [...arguments].forEach(obj => {
            if(typeof obj === 'object') {
                if(obj instanceof Error) {
                    out.push(`{"msg":"${obj.toString()}", "stack": "${obj.stack}"}`);
                } else {
                    out.push(JSON.stringify(obj));
                }
            } else {
                out.push(obj);
            }
        });

        let push = navigator.sendBeacon('/api/common/saveCashLog', JSON.stringify({
            type: 'web',
            info: out.join('\n'),
        }));
        //console.log('push:', push, out.join('\n'))
    }
}

