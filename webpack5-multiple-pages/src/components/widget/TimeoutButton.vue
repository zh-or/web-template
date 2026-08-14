<template>
    <el-button @click.stop.prevent="clickFun"
              :loading="data.loading"
              :disabled="data.countdown > 0"
              :type="type"
              :loading-str="props.loadingStr">
        <span v-if="data.countdown > 0">{{data.showSec}}</span>
        <slot v-else/>
    </el-button>
</template>

<script setup>
    import t from '@zh-or/lib';

    import {
        reactive, ref,
        computed, watch,
        onMounted, onUnmounted, useTemplateRef
    } from 'vue';

    defineOptions({ name: 'TimeoutButton' });

    let emit = defineEmits(['click']);

    let props = defineProps({
        loadingStr: {
            type: String,
            default: '发送中'
        },
        type: String,
        keyName: {
            type: String,
            default: '05616151-1d49-48a4-b5c7-cf911d132ed9',
        },
        format: {
            type: String,
            default: '{time}秒后再试'
        }
    });

    let data = reactive({
        timer: null,
        countdown: 0,
        showSec: '',
        loading: false,
    })

    onMounted(() => {
        let n = t.getLocal(props.keyName, 0);
        n = Number(n);
        data.countdown = isNaN(n) ? 0 : n;
        execTime();
    });

    function execTime() {
        if(data.countdown <= 0 || data.countdown < Date.now()) {
            data.countdown = 0;
            return;
        }
        clearTimeout(data.timer);
        let timeFun = call => {
            let loss = data.countdown - Date.now();
            let str = props.format;
            loss = loss / 1000;
            loss = loss.toFixed(0);
            data.showSec = str.replaceAll('{time}', loss);

            if(!call) {
                execTime();
            }
        };
        data.timer = setTimeout(timeFun, 1000);
        timeFun(true);
    }

    function clickFun() {
        data.loading = true;
        let p = new Promise((resolve, reject) => {
            emit('click', {resolve, reject});
        });
        p.then(time => {
            data.countdown = Date.now() + time;
            t.setLocal(props.keyName, data.countdown);
            execTime();
            data.loading = false;
        })
        .catch(e => {
            data.loading = false;
            console.error('LTimeoutButton 回调错误:', e);
        })
    }
</script>

<style lang="less">

</style>
