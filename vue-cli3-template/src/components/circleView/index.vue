<template>
    <div
            style="opacity: 1;"
            class="circle-view"
    >
        <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "circleView"
    }
</script>

<style lang="less">

    @keyframes circle-rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes circle-dash {
        0% {
            stroke-dasharray: 1,200;
            stroke-dashoffset: 0
        }

        50% {
            stroke-dasharray: 90,150;
            stroke-dashoffset: -40px
        }

        100% {
            stroke-dasharray: 90,150;
            stroke-dashoffset: -120px
        }
    }

    .circle-view {
        text-align: center;
        display: inline-block;
        transition: opacity 200ms linear;
        z-index: 9999;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;

        svg {
            height: 42px;
            width: 42px;
            animation: circle-rotate 2s linear infinite;
        }

        circle {
            animation: circle-dash 1.5s ease-in-out infinite;
            stroke-dasharray: 90,150;
            stroke-dashoffset: 0;
            stroke-width: 2;
            stroke: #02529f;
            stroke-linecap: round;
        }
    }

</style>
