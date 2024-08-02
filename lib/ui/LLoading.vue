<template>
    <svg viewBox="25 25 50 50"
         class="circular-loading">
        <circle :style="props.color ? 'stroke: ' + props.color : ''"
                cx="50" cy="50" r="20"
                fill="none"></circle>
    </svg>
</template>

<script setup>
    import {
        reactive,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'LLoading'});

    let props = defineProps({
        color: String,
    })

</script>

<style lang="less">
    @keyframes loading-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0
        }

        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -40px
        }

        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -120px
        }
    }

    @keyframes loading-rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    .circular-loading {
        height: 1em;
        width: 1em;
        //fill: currentColor;
        animation: loading-rotate 2s linear infinite;
        -webkit-animation: loading-rotate 2s linear infinite;

        circle {
            animation: loading-dash 1.5s ease-in-out infinite;
            -webkit-animation: loading-dash 1.5s ease-in-out infinite;
            stroke-dasharray: 90, 150;
            stroke-dashoffset: 0;
            stroke-width: 2;
            stroke: currentColor;
            stroke-linecap: round;
        }

    }

</style>
