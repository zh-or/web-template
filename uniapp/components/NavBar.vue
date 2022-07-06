<template>
    <div class="nav-bar">
        <div class="status-view"></div>
        <div class="bar">
            <div class="pos">
                <slot name="left"></slot>
            </div>
            <div class="title">{{title}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HomeNavBar",
        props: {
            location: String,
            title: String,
        },
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="scss">
.nav-bar {
    background-color: #00ADB5;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20075;

    .status-view {
        height: var(--status-bar-height);
        width: 100%;
    }

    .bar {
        position: relative;
        color: #fff;
        height: $home-nav-bar-height;
        line-height: $home-nav-bar-height;

        .pos {
            width: 40%;
            position: absolute;
            left: 30rpx;
            top: 0;
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .title {
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
