<template>
    <svg aria-hidden="true" class="svg-icon">
        <use :href="symbolId" :fill="color" />
    </svg>
</template>

<script>
    import { defineComponent, computed } from 'vue'

    export default defineComponent({
        name: 'SvgIcon',
        props: {
            prefix: {
                type: String,
                default: 'icon',
            },
            name: {
                type: String,
                required: true,
            },
            color: {
                type: String,
                default: '#333',
            },
        },
        setup(props) {
            const symbolId = computed(() => `#${props.prefix}-${props.name}`)
            return { symbolId }
        },
    })
</script>
<style>

    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        margin: auto 3px;
        transition: all 200ms;
    }
</style>
