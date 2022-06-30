<template>
    <div class="list-wrap"
         ref="listWrap"
         @touchstart="touchStart"
         @touchmove="touchMove"
         @touchend="touchEnd"
         @scroll="listScroll"
    >
        <div
                class="list-header"
                :style="headerStyle"
        >
            <slot name="header" :state="touchState">
                <!--
                 <span v-if="touchState == -1">滑动中</span>
                 <span v-if="touchState == 0">无状态</span>
                 <span v-if="touchState == 1">下拉中</span>
                 <span v-if="touchState == 2">松开刷新</span>
                 <span v-if="touchState == 3">刷新中</span>
                 <span v-if="touchState == 4">刷新完成</span>
                 -->

                <span v-if="touchState == 1">下拉刷新</span>
                <span v-if="touchState == 2">释放刷新</span>
                <span v-if="touchState == 3">
                    <svg class="loading"
                         viewBox="25 25 50 50"
                    >
                        <circle
                                class="loading-cle"
                                cx="50"
                                cy="50"
                                r="20"
                                fill="none"
                        ></circle>
                    </svg>
                    <span class="loading-text">刷新中</span>
                </span>
                <span v-if="touchState == 4">刷新完成</span>
            </slot>
        </div>

        <transition-group
                tag="div"
                appear
                :name="anim || 'fade'"
                class="item-wrap"
                :style="itemWrapStyle"
                ref="itemWrap"
        >
            <div v-for="(item, index) in data" :key="'key-' + index" class="list-item">
                <slot :row="item" :index="index" name="item"></slot>
            </div>
        </transition-group>

        <div v-show="!finished && (touchState == 0 || touchState == 5)" class="load-more">
            <svg class="loading"
                 viewBox="25 25 50 50"
            >
                <circle
                        class="loading-cle"
                        cx="50"
                        cy="50"
                        r="20"
                        fill="none"
                ></circle>
            </svg>
            <span class="loading-text">正在加载...</span>
        </div>
        <div v-show="finished && touchState != 3 && data.length > 0" class="load-more">已加载完毕</div>
        <div v-show="data.length <= 0 && finished  && touchState == 0" class="list-none">暂无数据~</div>
    </div>

</template>
<script>
    export default {
        name: 'list-view',
        props: {
            'refresh': Function,
            'needRefresh': {
                type: Boolean,
                default: false
            },
            'anim': String,
            'finished': {
                type: Boolean,
                default: true,
            },
            'offsetButtom': {
                type: Number,
                default: 10
            },
            'data': {
                type: Array,
                default: () => {
                    return [];
                },
            }
        },
        data: function () {
            return {
                touchState: 0,
                /*
                * -1 滑动中, 但是没有松开,
                * 0 无状态,
                * 1 下拉中,
                * 2 可松开刷新但是还没有松开,
                * 3 松开执行刷新中,
                * 4 刷新完成
                * 5 加载更多
                * */
                duration: 0,
                moveDistance: 0,
                startY: 0,
                startScrollTop: 0,
                loading: false,
                headerDelayTimer: null,
            }
        },
        watch: {
            touchState(state) {
                if (state == 4) {
                    this.headerDelayTimer = setTimeout(() => {
                        this.moveDistance = 0;
                        this.touchState = 0;
                    }, 500);
                }
                if (state == 5) {
                    /*以免头部还没有隐藏的时候 又在加载下一页数据导致显示问题*/
                    this.moveDistance = 0;
                    clearTimeout(this.headerDelayTimer);
                }
            },
            data() {
                if(this.data.length > 0){
                    this.$nextTick(() => {
                        this.listScroll();
                    })
                }
            }
        },
        computed: {
            itemWrapStyle() {
                return {
                    transition: `${this.duration}ms`,
                    transform: `translate3d(0, ${this.moveDistance}px, 0)`,
                }
            },
            headerStyle() {
                return {
                    /*'opacity': this.touchState == 0 ? '0.1' : '1',*/
                    'height': `${this.moveDistance}px`,
                    'line-height': `${this.moveDistance}px`,

                }
            }
        },
        methods: {
            touchStart(e) {
                if (this.touchState >= 3) {
                    /*正处于刷新状态*/
                    return;
                }
                this.duration = 0;
                this.moveDistance = 0;
                this.startY = e.targetTouches[0].clientY;
                this.startScrollTop = this.$refs.listWrap.scrollTop;
            },
            touchMove(e) {
                if (this.touchState >= 3) {
                    /*正处于刷新状态*/
                    return;
                }
                this.touchState = -1;
                if (this.startScrollTop > 0 || !this.needRefresh) {
                    //必须先滑动到最顶部才能下拉刷新
                    return;
                }
                let move = e.targetTouches[0].clientY - this.startY;
                if (move > 0) {

                    this.touchState = 1;
                    this.moveDistance = move >>> 1;
                    if (this.moveDistance > 50) {
                        this.touchState = 2;
                    } else {
                        this.touchState = 1;
                    }
                    if (typeof e.cancelable !== 'boolean' || e.cancelable) {
                        e.preventDefault();
                    }
                }
            },
            touchEnd(e) {
                if (this.touchState >= 3) {
                    /*正处于刷新状态*/
                    return;
                }
                this.duration = 300;
                if (this.touchState == 2) {
                    this.touchState = 3;
                    this.moveDistance = 50

                    var done = () => {
                        this.touchState = 4;
                    }
                    this.$nextTick(() => {
                        this.$emit('refresh', done);
                    });
                    //console.log('刷新');
                } else {
                    this.touchState = 0;
                    this.moveDistance = 0;
                }
            },
            listScroll() {
                if (this.finished || this.loading) {
                    return;
                }

                if (
                    /*滚动到底部加载*/
                    (this.$refs.listWrap.scrollTop + this.$refs.listWrap.clientHeight + this.offsetButtom) >= this.$refs.listWrap.scrollHeight ||
                    /*加载数据后一页不满*/
                    (this.$refs.itemWrap.offsetHeight < this.$refs.listWrap.clientHeight && !this.finished)
                ) {
                    this.loading = true;
                    this.touchState = 5;
                    var done = () => {
                        this.touchState = -1;
                        this.loading = false;
                    }
                    this.$nextTick(() => {
                        this.$emit('load', done);
                    })
                    //console.log('加载更多数据');
                }
            }

        }
    }
</script>

<style lang="less">
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.6s ease;
    }

    .list-wrap {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        position: relative;


        /*转圈圈动画*/
        @keyframes loading-rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes loading-dash {
            0% {
                stroke-dasharray: 90, 150;
            }
            50% {
                stroke-dasharray: 0, 150;
            }
            100% {
                stroke-dasharray: 90, 150;
            }
        }
        @keyframes loading-dash {
            0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 130, 200;
                stroke-dashoffset: -50;
            }
            100% {
                stroke-dasharray: 130, 200;
                stroke-dashoffset: -188;
            }
        }

        .loading {
            height: 14px;
            width: 14px;
            animation: loading-rotate 2s linear infinite;
            -webkit-animation: loading-rotate 2s linear infinite;
        }

        .loading, .loading-text {
            vertical-align: middle;
        }

        .loading-text {
            margin-left: 10px;
        }

        .loading-cle {
            animation: loading-dash 1.5s ease-in-out infinite;
            -webkit-animation: loading-dash 1.5s ease-in-out infinite;
            stroke-dasharray: 90, 150;
            stroke-dashoffset: 0;
            stroke-width: 2;
            stroke: #7d7e80;
            stroke-linecap: round;
        }

        .list-header {
            text-align: center;
            color: #7d7e80;
            height: 0px;
            line-height: 0px;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        .item-wrap {
            background-color: #fff;
        }

        .load-more, .list-none, .loading-text {
            text-align: center;
            color: #7d7e80;
        }

        .load-more, .list-none {
            padding-bottom: 10px;
        }

        .list-none {
            margin-top: 20%;
        }
    }
</style>
