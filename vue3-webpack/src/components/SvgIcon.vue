<template>
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"/>
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
        <use :href="iconName"/>
    </svg>
</template>

<script >

    export default {
        name: 'SvgIcon',
        props: {
            name: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
            isExternal() {
                return /^(https?:|mailto:|tel:)/.test(this.name);
            },
            iconName() {
                return `#icon-${this.name}`;
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className;
                } else {
                    return 'svg-icon';
                }
            },
            styleExternalIcon() {
                return {
                    mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                    '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
                }
            }
        }
    }
</script>

<style >
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        margin: auto 3px;
        transition: all 200ms;
    }

    .svg-external-icon {
        background-color: currentColor;
        mask-size: cover !important;
        display: inline-block;
    }
</style>
