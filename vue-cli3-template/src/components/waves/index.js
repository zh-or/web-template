import './waves.less';

function forRect(target) {
    var position = {
        top: 0,
        left: 0
    }
        , ele = document.documentElement;
    'undefined' != typeof target.getBoundingClientRect && (position = target.getBoundingClientRect());
    return {
        top: position.top + window.pageYOffset - ele.clientTop,
        left: position.left + window.pageXOffset - ele.clientLeft
    }
}
const duration = 750;

const directive = {
    name: 'waves',
    inserted (el, { value }) {
        let waves = {
            el: document.createElement('div'),
            wrap: el,
            click(e) {
                waves.wrap.appendChild(waves.el);
                let rect = forRect(waves.el),
                    height = e.pageY - rect.top,
                    left = e.pageX - rect.left,
                    scale = 'scale(' + waves.wrap.clientWidth / 100 * 10 + ')';
                waves.el.style.top = height + 'px';
                waves.el.style.left = left + 'px';
                waves.el.style.transform = scale;
                waves.el.style.opacity = 1;
                waves.el.style.transitionDuration = duration + 'ms';
                waves.el.style.transitionTimingFunction = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                setTimeout(_ => {
                    waves.el.style.transitionDuration = duration + 'ms';
                    waves.el.style.transform = scale;
                    waves.el.style.opacity = 0;
                    waves.el.style.top = height + 'px';
                    waves.el.style.left = left + 'px';

                    setTimeout(_ => {
                        //waves.wrap.removeChild(waves.el);
                    }, duration);
                }, 100);
            }
        };
        waves.el.className = 'waves-animation';
        el._waves = waves;
        el.addEventListener('click', waves.click);
    },
    update (el, { value }) {

    },
    unbind (el, binding) {
        let waves = el._waves;
        el.removeEventListener('click', waves.click);
    }
}

export default {
    install(Vue, options) {

        Vue.directive(directive.name, directive);
    }
}
