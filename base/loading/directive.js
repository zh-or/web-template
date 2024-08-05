import {createComponent, delayFun} from '../UiTool.js';

import Loading from './loading.vue';
import {nextTick} from 'vue';


import {addClass, removeClass, getStyle} from '../UiTool.js';



const toggleLoading = (el, binding) => {
    if (binding.value) {
        nextTick(() => {
            if (binding.modifiers.fullscreen) {
                el.originalPosition = getStyle(document.body, 'position');
                el.originalOverflow = getStyle(document.body, 'overflow');
                el.maskStyle.zIndex = 2222;

                addClass(el.mask, 'is-fullscreen');
                insertDom(document.body, el, binding);
            } else {
                removeClass(el.mask, 'is-fullscreen');

                if (binding.modifiers.body) {
                    el.originalPosition = getStyle(document.body, 'position');

                    ['top', 'left'].forEach(property => {
                        const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
                        el.maskStyle[property] = el.getBoundingClientRect()[property] +
                            document.body[scroll] +
                            document.documentElement[scroll] -
                            parseInt(getStyle(document.body, `margin-${ property }`), 10) +
                            'px';
                    });
                    ['height', 'width'].forEach(property => {
                        el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
                    });

                    insertDom(document.body, el, binding);
                } else {
                    el.originalPosition = getStyle(el, 'position');
                    insertDom(el, el, binding);
                }
            }
        });
    } else {

        el.instance.vm.exposed.setVisible(false);
        el.instance.hiding = true;
    }
};
const insertDom = (parent, el, binding) => {
    if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
        Object.keys(el.maskStyle).forEach(property => {
            el.mask.style[property] = el.maskStyle[property];
        });

        if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed' && el.originalPosition !== 'sticky') {
            addClass(parent, 'el-loading-parent--relative');
        }
        if (binding.modifiers.fullscreen && binding.modifiers.lock) {
            addClass(parent, 'el-loading-parent--hidden');
        }
        el.domVisible = true;

        parent.appendChild(el.mask);
        nextTick(() => {
            if (el.instance.hiding) {

                if (!el.instance.hiding) return;
                el.domVisible = false;
                const target = binding.modifiers.fullscreen || binding.modifiers.body
                    ? document.body
                    : el;
                removeClass(target, 'el-loading-parent--relative');
                removeClass(target, 'el-loading-parent--hidden');
                el.instance.hiding = false;
            } else {
                el.instance.vm.exposed.setVisible(true);
            }
        });
        el.domInserted = true;
    } else if (el.domVisible && el.instance.hiding === true) {
        el.instance.vm.exposed.setVisible(true);
        el.instance.hiding = false;
    }
};


export default {
    install(app) {
        app.directive('loading', {
            created(el, binding, vnode, prevVnode) {
                const textExr = el.getAttribute('loading-text');
                const spinnerExr = el.getAttribute('loading-spinner');
                const backgroundExr = el.getAttribute('loading-background');
                const customClassExr = el.getAttribute('loading-custom-class');

                let com = createComponent(Loading, {
                    text: textExr || '',
                    spinner: spinnerExr || '',
                    background: backgroundExr || '',
                    customClass: customClassExr || '',
                    fullscreen: !!binding.modifiers.fullscreen
                });
                com.mount(el);
                el.instance = com;
                el.mask = com.com.el;
                el.maskStyle = {};

                binding.value && toggleLoading(el, binding);

            },
            beforeUpdate(el, binding, vnode, prevVnode) {
                el.instance.vm.exposed.setText(el.getAttribute('loading-text'));
                if (binding.oldValue !== binding.value) {
                    toggleLoading(el, binding);
                }
            },
            unmounted(el, binding, vnode, prevVnode) {
                let com = el.instance;
                if(com) {
                    com.destory();
                }
            },

        });
    }
};
