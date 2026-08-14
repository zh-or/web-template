<script >
import {
    reactive, ref, useTemplateRef, computed, nextTick, defineEmits, defineExpose,
    onMounted, onUnmounted, defineComponent, h, watch,
} from 'vue';

export default defineComponent({
    name: 'CountTo',
    props: {
        start: {
            type: [Number, String],
            required: false,
            default: 0
        },
        end: {
            type: [Number, String],
            required: false,
            default: 2017
        },
        duration: {
            type: Number,
            required: false,
            default: 3000
        },
        autoplay: {
            type: Boolean,
            required: false,
            default: true
        },
        decimals: {//要显示的小数位数
            type: Number,
            required: false,
            default: 0,
            validator(value) {
                return value >= 0
            }
        },
        decimal: {
            type: String,
            required: false,
            default: '.'
        },
        separator: {
            type: String,
            required: false,
            default: ','
        },
        prefix: {
            type: String,
            required: false,
            default: ''
        },
        suffix: {
            type: String,
            required: false,
            default: ''
        },
        useEasing: {
            type: Boolean,
            required: false,
            default: true
        },
        easingFn: {
            type: Function,
            default(t, b, c, d) {
                return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
            }
        },
    },
    setup(props, { attrs, slots, emit, expose }) {
        function formatNumber(num) {
            num = Number(num).toFixed(props.decimals);
            num += '';
            const x = num.split('.');
            let x1 = x[0];
            const x2 = x.length > 1 ? props.decimal + x[1] : '';
            const rgx = /(\d+)(\d{3})/;
            if (props.separator && isNaN(parseFloat(props.separator))) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + props.separator + '$2');
                }
            }
            return props.prefix + x1 + x2 + props.suffix;
        }



        function start() {
            data.localStartVal = Number(props.start);
            data.startTime = null;
            data.localDuration = props.duration;
            data.paused = false;
            data.rAF = requestAnimationFrame(count);
        }

        function pauseResume() {
            if (data.paused) {
                resume();
                data.paused = false;
            } else {
                pause();
                data.paused = true;
            }
        }

        function pause() {
            cancelAnimationFrame(data.rAF);
        }
        function resume() {
            data.startTime = null;
            data.localDuration = +data.remaining;
            data.localStartVal = +data.printVal;
            requestAnimationFrame(count);
        }

        function reset() {
            data.startTime = null;
            cancelAnimationFrame(data.rAF);
            data.displayValue = formatNumber(props.start);
        }

        function count(timestamp) {
            let end = Number(props.end);
            if (!data.startTime) data.startTime = timestamp;
            data.timestamp = timestamp;
            const progress = timestamp - data.startTime;
            data.remaining = data.localDuration - progress;

            if (props.useEasing) {
                if (countDown.value) {
                    data.printVal = data.localStartVal - props.easingFn(progress, 0, data.localStartVal - end, data.localDuration);
                } else {
                    data.printVal = props.easingFn(progress, data.localStartVal, end - data.localStartVal, data.localDuration);
                }
            } else {
                if (countDown.value) {
                    data.printVal = data.localStartVal - ((data.localStartVal - end) * (progress / data.localDuration));
                } else {
                    data.printVal = data.localStartVal + (end - data.localStartVal) * (progress / data.localDuration);
                }
            }
            if (countDown.value) {
                data.printVal = data.printVal < end ? end : data.printVal;
            } else {
                data.printVal = data.printVal > end ? end : data.printVal;
            }

            data.displayValue = formatNumber(data.printVal)
            if (progress < data.localDuration) {
                data.rAF = requestAnimationFrame(count);
            } else {
                emit('callback');
            }
        }

        let countDown = computed(() => {
            return Number(props.start) > Number(props.end);
        })

        let data = reactive({
            localStartVal: Number(props.start),
            displayValue: formatNumber(props.start),
            printVal: null,
            paused: false,
            localDuration: props.duration,
            startTime: null,
            timestamp: null,
            remaining: null,
            rAF: null
        })

        watch(() => props.start, start);
        watch(() => props.end, start);

        onMounted(() => {
            if(props.autoplay) start();
        });

        onUnmounted(() => {
            cancelAnimationFrame(data.rAF);
        });

        //defineEmits(['callback']);
        expose({
            pauseResume, reset, start, pause, resume
        });
        return () => {
            return h('span', data.displayValue);
        }
    }
})

</script>
<style lang="less">

</style>
