<template>
    <view class="none-btn img-btn btn float-btn box-shadow"
            :class="{show: x > 0 && y > 0}"
            :style="posStyle"
            @touchstart="touchStart"
            @touchmove.stop.prevent="touchMove"
            @touchend="touchEnd">
        <slot/>
    </view>
</template>

<script>
    let isMove = false;
    let _p = {
        x: 0,
        y: 0
    }
    export default {
        name: "FloatBtn",
        props: {
            btm: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                width: 100,
                height: 100,

                x: 0,
                y: 0,
            }
        },
        computed: {
            posStyle() {
                return `left: ${this.x}px; top: ${this.y}px`;
            }
        },
        created() {

            this.width = this.m_windowWidth;
            this.height = this.m_windowHeight;

            this.x = this.width - 80;
            this.y = this.height * .8 + this.btm;
        },
        methods: {
            touchStart(e) {
                isMove = true;
                _p = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                }
            },
            touchEnd(e) {
                isMove = false;
            },
            touchMove(e) {
                if(!isMove) {
                    return;
                }
                this.x = this.x + (e.touches[0].clientX - _p.x);
                this.y = this.y + (e.touches[0].clientY - _p.y);
                _p = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                }
            }
        }
    }
</script>

<style lang="less">
.float-btn {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3;
    width: 40px;
    height: 40px;
    border-radius: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, .39);
    border: 1px solid #009688;
    opacity: 0;
    transition: opacity .2s;
    margin: 0;


    &.show {
        opacity: 1;
    }
}

</style>
