import {createComponent, delayFun} from '../UiTool.js';

import MessageBox from './MessageBox.vue';
import Message from './Message.vue';

let msgInstances = [];
let msgIdCount = 1;

export default {
    confirmBox(title, content) {
        return new Promise((resolve, reject) => {
            let so = createComponent(MessageBox, {
                title,
                content,
                showCancelButton: true,
                resolve: resolve,
                reject: reject,

                onHide: () => {
                    //给动画留时间
                    delayFun(300, _ => so.destory());
                }
            });
            so.mount();
        });
    },
    infoBox(title, content) {
        return new Promise((resolve, reject) => {
            let so = createComponent(MessageBox, {
                title,
                content,
                resolve: resolve,
                reject: reject,

                onHide: () => {
                    //给动画留时间
                    delayFun(300, _ => so.destory());
                }
            });
            so.mount();
        });
    },
    msg(options) {

        let verticalOffset = options.offset || 20;
        msgInstances.forEach(item => {
            verticalOffset += item.com.el.offsetHeight + 16;
        });

        options = options || {};
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        options.type = options.type || 'info';
        options.verticalOffset = verticalOffset;

        let so = createComponent(Message, {
            ...options,
            onRemove: () => {
                delayFun(300, _ => so.destory());

            },
            onClose() {
                options.onClose && options.onClose();
                let h = so.com.el.offsetHeight + 16;

                msgInstances = msgInstances.filter(_ => _._id !== so._id);
                msgInstances.forEach(item => {
                    item.vm.exposed.decTop(h);
                });
            }
        });

        so._id = 'message_' + msgIdCount++;
        so.mount();

        msgInstances.push(so);
    },
    info(str, duration) {
        this.msg({
            type: 'info',
            message: str,
            duration: duration,
        })
    },
    warning(str, duration) {
        this.msg({
            type: 'warning',
            message: str,
            duration: duration,
        })
    },
    error(str, duration) {
        this.msg({
            type: 'error',
            message: str,
            duration: duration,
        })
    },
    success(str, duration) {
        this.msg({
            type: 'success',
            message: str,
            duration: duration,
        })
    }
};
