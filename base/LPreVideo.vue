<template>
    <div class="l-pre-video" ref="videoRef">
        <LLoading v-if="state === 0"/>
        <img v-else-if="state === 1" :src="firstFrame"/>
        <span v-else-if="state === -1">加载出错</span>
    </div>
</template>

<script setup>

    import {
        registerImgObserver, removeImgObserver,
        loadVideoFirstFrame
    } from './UiTool.js';
    import t from '@zh-or/lib';

    import {
        reactive, ref,
        inject, computed, watch,
        onMounted, onUnmounted,
        useAttrs,
        nextTick
    } from 'vue';

    defineOptions({ name: 'LPreVideo'});
    let emit = defineEmits([]);

    let props = defineProps({
        src: [Object, String],
        lazy: {
            type: Boolean,
            default: true
        },
    });
    let attrs = useAttrs();
    let videoRef = ref(null);
    let data = reactive({
        state: 0,
        firstFrame: null,
    });

    watch(() => props.src, () => {
        free();
        load();
    })

    function addLazyLoadListener() {
        registerImgObserver(videoRef.value, dom => {
            load();
            removeImgObserver(videoRef.value);
        });

    }
    function load() {
        free();
        data.state = 0;
        loadVideoFirstFrame(props.src)
            .then(res => {
                data.firstFrame = res;
                data.state = 1;
            })
            .catch(e => {
                data.state = -1;
            })
    }
    function free() {
        if(data.firstFrame) {
            t.freeObj(data.firstFrame);
            data.firstFrame = null;
        }
    }
</script>

<style lang="less">
.l-pre-video {
    position: relative;
    display: inline-block;
    overflow: hidden;

    img {
        height: 100%;
        width: 100%;
    }
}
</style>
