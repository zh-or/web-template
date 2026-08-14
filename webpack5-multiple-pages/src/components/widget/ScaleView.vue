<template>
<div class="scale-view "
     @wheel="wheel"
     @mousedown="down"
     @mousemove="move"
     @mouseup="up">
    <div :style="styles" class="scale-view-content flex f-h-center f-v-center">
        <slot/>
    </div>
</div>
</template>

<script>
    let _pos = {
        x: 0,
        y: 0
    }
    export default {
        name: "ScalView",
        props: {
            maxScale: {
                type: Number,
                default: 10
            }
        },
        data() {
            return {
                isDown: false,
                left: 0,
                top: 0,
                scale: 1,
            }
        },
        computed: {
            styles() {
                return `transform: translate3d(${this.left}px, ${this.top}px, 0) scale(${this.scale});`;
            }
        },
        mounted() {

        },
        methods: {
            down(e) {
                _pos.x = e.pageX - this.left;
                _pos.y = e.pageY - this.top;
                this.isDown = true;
                e.preventDefault();
                e.stopPropagation();
            },
            up(e) {
                this.isDown = false;
            },
            move(e) {
                if(this.isDown) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.left = e.pageX - _pos.x;
                    this.top = e.pageY - _pos.y;
                }
            },
            wheel(e) {

                let step = 0.1;
                if(e.deltaY < 0) {
                    if(this.scale >= this.maxScale) {
                        this.scale = this.maxScale
                    } else {
                        this.scale += step;
                        this.left -= (this.left * step / 2);
                    }

                } else {
                    if(this.scale <= 0.1) {
                        this.scale = 0.1;
                    } else {
                        this.scale -= step;
                        this.left += (this.left * step / 2);
                    }
                }
            }
        }
    }
</script>

<style lang="less">
.scale-view {
    height: 100%;
    width: 100%;

    .scale-view-content {
        height: 100%;
        width: 100%;
    }
}
</style>
