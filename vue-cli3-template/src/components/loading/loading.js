import './loading.less';
import CircleView from '../circleView/index.vue';

export default {
    name: 'mu-loading',
    props: {
        size: Number,
        overlayColor: String,
        text: String,
        fixed: Boolean,
        className: String,
        color: String
    },
    data() {
        return {
            show: false
        };
    },
    render(h) {
        return h('transition', {
            props: {name:'fade',}
        }, [
            h('div', {
                staticClass: 'mu-loading-wrap',
                class: {
                    [this.className || '']: true,
                    'mu-loading-wrap__fixed': this.fixed
                },
                style: {
                    'background-color': this.overlayColor
                },
                directives: [{
                    name: 'show',
                    value: this.show
                }]
            }, [
                h(CircleView, {
                    props: {
                        size: this.size,
                        color: this.color,
                        strokeWidth: 2
                    }
                }),
                this.text ? h('span', {
                    staticClass: `mu-loading-text `,
                    style: {
                        color: this.color
                    }
                }, this.text) : undefined
            ])
        ]);
    },
};
