import {defineComponent, render, h} from 'vue';
import t from "@zh-or/lib/index";

export function createComponent(view, props) {
    /*
    * 创建后需要调用 mount 挂载
    * 使用完毕需要调用 destory 销毁
    * */

    return {
        com: h(defineComponent(view), props),
        vm: null,
        wrap: document.createElement('div'),
        el: [],
        mount(root) {
            root = root || document.body;
            render(this.com, this.wrap);
            this.vm = this.com.component;
            for(let i = 0; i < this.wrap.childNodes.length; i++) {
                let node = this.wrap.childNodes[i];
                root.appendChild(node);
                this.el.push(node);
            }
        },
        unmount() {
            this.el.forEach(el => {
                el && el.parentNode.removeChild(el);
            });
        },
        destory() {
            //需要主动调用该方法销毁组件
            render(null, this.wrap);
        }
    }
}


export function delayFun(t, f) {
    setTimeout(f, t);
}

export function loadVideoFirstFrame(src) {
    return new Promise((resolve, reject) => {
        const videoElem = document.createElement('video');
        // 当前帧的数据是可用的
        videoElem.onloadeddata = () => {
            let meta = {
                duration: videoElem.duration,// 时长
                width: videoElem.videoWidth,// 宽
                height: videoElem.videoHeight,// 高
            };
            //this.$emit('meta', meta);
            try {
                const canvasElem = document.createElement('canvas');
                canvasElem.style.right = '100%';
                canvasElem.style.top = '100%';
                canvasElem.style.position = 'fixed';
                document.body.appendChild(canvasElem);
                canvasElem.width = meta.width;
                canvasElem.height = meta.height;
                canvasElem
                    .getContext('2d')
                    .drawImage(videoElem, 0, 0, meta.width, meta.height);
                canvasElem.toBlob(blob => {

                    let firstFrame = t.getObjectURL(blob);
                    document.body.removeChild(canvasElem);
                    document.body.removeChild(videoElem);
                    resolve(firstFrame);
                }, 'image/png')
            } catch(e) {
                document.body.removeChild(canvasElem);
                document.body.removeChild(videoElem);
                console.error('获取视频第一帧失败:', e);
                reject();
            }
        }
        videoElem.onerror = () => {
            document.body.removeChild(videoElem);
            reject();
        }
        // 设置 auto 预加载数据， 否则会出现截图为黑色图片的情况
        videoElem.setAttribute('preload', 'auto');
        videoElem.style.position = 'fixed';
        videoElem.style.right = '100%';
        videoElem.style.top = '100%';
        document.body.appendChild(videoElem);
        videoElem.src = src;
    });
}

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

const camelCase = function(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};


let imgObserver = {
    obs: null,
    domMap: [],
    ratio: 0.1
};

window.obs = imgObserver;

export function registerImgObserver(dom, cb) {
    if(!imgObserver.obs) {
        imgObserver.obs = new IntersectionObserver(
            (entries, observer) => {
                requestAnimationFrame(_ => {
                    entries.forEach(item => {
                        let obj = imgObserver.domMap.find(_ => _.dom === item.target);
                        if(obj) {
                            item.isIntersecting && obj.cb(obj.dom);
                        } else {
                            console.error('未找到目标:', imgObserver, item)
                        }
                    })
                });
            },
            {
                //用body有问题, 会导致有些不触发回调
                //root: document.body,
                rootMargin: "0px",
                threshold: imgObserver.ratio,
            }
        );
    }
    requestAnimationFrame(_ => {
        imgObserver.obs.observe(dom);
        imgObserver.domMap.push({
            dom, cb
        });
    })
}

export function removeImgObserver(dom) {
    if(imgObserver.obs) {
        imgObserver.obs.unobserve(dom);
        let len = imgObserver.domMap.length;
        for(let i = 0; i < len; i++) {
            if(imgObserver.domMap[i].dom === dom) {
                imgObserver.domMap.splice(i, 1);
                return;
            }
        }

    }
}

let zIndexBase = 2001;

export function getzIndex() {
    return ++zIndexBase;
}

export function hasClass(el, cls) {
    return !!cls && el && el.classList.contains(cls);
}

export function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.setAttribute('class', curClass);
    }
}

export function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.setAttribute('class', trim(curClass));
    }
}

export function getStyle(element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    let val = element.style[styleName];
    try {
        if(!val) {
            var computed = document.defaultView.getComputedStyle(element, '');
            return  computed ? computed[styleName] : null;
        }
    } catch (e) {
    }
    return val;
}

export function afterLeave(instance, callback, speed = 300, once = false) {
    if (!instance || !callback) throw new Error('instance & callback is required');
    let called = false;
    const afterLeaveCallback = function () {
        if (called) return;
        called = true;
        if (callback) {
            callback.apply(null, arguments);
        }
    };
    if (once) {
        instance.$once('after-leave', afterLeaveCallback);
    } else {
        instance.$on('after-leave', afterLeaveCallback);
    }
    setTimeout(() => {
        afterLeaveCallback();
    }, speed + 100);
}

export function merge(target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        let source = arguments[i] || {};
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                let value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }

    return target;
}

