<template>
    <div class="wrapper"
         ref="wrapper"
         @touchstart.prevent="onStart"
         @touchmove.prevent="onMove"
         @touchend.prevent="onEnd"
         @touchcancel.prevent="onEnd"
         @mousedown.prevent="onStart"
         @mousemove.prevent="onMove"
         @mouseup.prevent="onEnd"
         @mousecancel.prevent="onEnd"
         @mouseleave.prevent="onEnd"
         @transitionend="onTransitionEnd">
        <ul class="list"
            ref="scroller"
            :style="scrollerStyle">
            <li class="list-item"
                v-for="item in list"
            >{{item}}</li>
        </ul>
    </div>
</template>

<script>

    /*https://codepen.io/JunreyCen/pen/arRYem
    * 滚动动画, 回弹
    * */

    export default {
        name: "scroll.vue",
        computed: {
            list() {
                const list = [];
                for (let i = 0; i < 100; i++) {
                    list.push(i);
                }
                return list;
            },
            scrollerStyle() {
                return {
                    'transform': `translate3d(0, ${this.offsetY}px, 0)`,
                    'transition-duration': `${this.duration}ms`,
                    'transition-timing-function': this.bezier,
                };
            },
        },
        data() {
            return {
                wrapper: null,
                scroller: null,
                minY: 0,
                maxY: 0,
                wrapperHeight: 0,
                offsetY: 0,
                duration: 0,
                bezier: 'linear',
                startY: 0,
                pointY: 0,
                startTime: 0,                 // 惯性滑动范围内的 startTime
                momentumStartY: 0,            // 惯性滑动范围内的 startY
                momentumTimeThreshold: 300,   // 惯性滑动的启动 时间阈值
                momentumYThreshold: 15,       // 惯性滑动的启动 距离阈值
                isStarted: false,             // start锁
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.wrapper = this.$refs.wrapper;
                this.scroller = this.$refs.scroller;
                const {height: wrapperHeight} = this.wrapper.getBoundingClientRect();
                const {height: scrollHeight} = this.scroller.getBoundingClientRect();
                this.wrapperHeight = wrapperHeight;
                this.minY = wrapperHeight - scrollHeight;
            });
        },
        methods: {
            onStart(e) {
                const point = e.touches ? e.touches[0] : e;
                this.isStarted = true;
                this.duration = 0;
                this.stop();
                this.pointY = point.pageY;
                this.momentumStartY = this.startY = this.offsetY;
                this.startTime = new Date().getTime();
            },
            onMove(e) {
                if (!this.isStarted) return;
                const point = e.touches ? e.touches[0] : e;
                const deltaY = point.pageY - this.pointY;
                // 浮点数坐标会影响渲染速度
                let offsetY = Math.round(this.startY + deltaY);
                // 超出边界时增加阻力
                if (offsetY < this.minY || offsetY > this.maxY) {
                    offsetY = Math.round(this.startY + deltaY / 3);
                }
                this.offsetY = offsetY;
                const now = new Date().getTime();
                // 记录在触发惯性滑动条件下的偏移值和时间
                if (now - this.startTime > this.momentumTimeThreshold) {
                    this.momentumStartY = this.offsetY;
                    this.startTime = now;
                }
            },
            onEnd(e) {
                if (!this.isStarted) return;
                this.isStarted = false;
                if (this.isNeedReset()) return;
                const absDeltaY = Math.abs(this.offsetY - this.momentumStartY);
                const duration = new Date().getTime() - this.startTime;
                // 启动惯性滑动
                if (duration < this.momentumTimeThreshold && absDeltaY > this.momentumYThreshold) {
                    const momentum = this.momentum(this.offsetY, this.momentumStartY, duration);
                    this.offsetY = Math.round(momentum.destination);
                    this.duration = momentum.duration;
                    this.bezier = momentum.bezier;
                }
            },
            onTransitionEnd() {
                this.isNeedReset();
            },
            momentum(current, start, duration) {
                const durationMap = {
                    'noBounce': 2500,
                    'weekBounce': 800,
                    'strongBounce': 400,
                };
                const bezierMap = {
                    'noBounce': 'cubic-bezier(.17, .89, .45, 1)',
                    'weekBounce': 'cubic-bezier(.25, .46, .45, .94)',
                    'strongBounce': 'cubic-bezier(.25, .46, .45, .94)',
                };
                let type = 'noBounce';
                // 惯性滑动加速度
                const deceleration = 0.003;
                // 回弹阻力
                const bounceRate = 10;
                // 强弱回弹的分割值
                const bounceThreshold = 300;
                // 回弹的最大限度
                const maxOverflowY = this.wrapperHeight / 6;
                let overflowY;

                const distance = current - start;
                const speed = 2 * Math.abs(distance) / duration;
                let destination = current + speed / deceleration * (distance < 0 ? -1 : 1);
                if (destination < this.minY) {
                    overflowY = this.minY - destination;
                    type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
                    destination = Math.max(this.minY - maxOverflowY, this.minY - overflowY / bounceRate);
                } else if (destination > this.maxY) {
                    overflowY = destination - this.maxY;
                    type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
                    destination = Math.min(this.maxY + maxOverflowY, this.maxY + overflowY / bounceRate);
                }

                return {
                    destination,
                    duration: durationMap[type],
                    bezier: bezierMap[type],
                };
            },
            // 超出边界时需要重置位置
            isNeedReset() {
                let offsetY;
                if (this.offsetY < this.minY) {
                    offsetY = this.minY;
                } else if (this.offsetY > this.maxY) {
                    offsetY = this.maxY;
                }
                if (typeof offsetY !== 'undefined') {
                    this.offsetY = offsetY;
                    this.duration = 500;
                    this.bezier = 'cubic-bezier(.165, .84, .44, 1)';
                    return true;
                }
                return false;
            },
            stop() {
                // 获取当前 translate 的位置
                const matrix = window.getComputedStyle(this.scroller).getPropertyValue('transform');
                this.offsetY = Math.round(+matrix.split(')')[0].split(', ')[5]);
            },
        }
    }
</script>

<style scoped>
    body, ul {
        margin: 0;
        padding: 0;
    }

    ul {
        list-style: none;
    }

    .wrapper {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 80%;
        width: 80%;
        max-width: 300px;
        max-height: 500px;
        border: 1px solid #000;
        transform: translateY(-50%);
        overflow: hidden;
    }

    .list {
        background-color: #70f3b7;
    }

    .list-item {
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #ccc;
    }
</style>
