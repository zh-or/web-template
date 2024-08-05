<template>
    <div class="el-image" ref="imgRef" >
        <slot v-if="data.loading" name="placeholder">
            <div class="el-image__placeholder"></div>
        </slot>
        <slot v-else-if="data.error" name="error">
            <div class="el-image__error">加载出错</div>
        </slot>
        <img v-else
             class="el-image__inner"
             v-bind="attrs"
             @click="emit('click')"
             :src="data.lastObj"
             :style="imageStyle"
             :class="{ 'el-image__inner--center': alignCenter}">

    </div>
</template>

<script setup>
    import t from '@zh-or/lib';

    import {
        reactive, ref,
        inject, computed, watch,
        onMounted, onUnmounted, onBeforeUnmount,
        useAttrs,
        nextTick
    } from 'vue';

    defineOptions({ name: 'ElImage', inheritAttrs: false});
    let emit = defineEmits(['error']);
    let props = defineProps({
        src: [String, File],
        fit: String,
        lazy: Boolean,
    });
    let attrs = useAttrs();

    let data = reactive({
        state: 0,//-1加载失败, 0未加载, 1 加载中, 2加载成功
        loading: true,
        error: false,
        imageWidth: 0,
        imageHeight: 0,
        lastObj: null,
    });

    let imgRef = ref(null);

    import {registerImgObserver, removeImgObserver} from './UiTool.js';

    const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;


    const ObjectFit = {
        NONE: 'none',
        CONTAIN: 'contain',
        COVER: 'cover',
        FILL: 'fill',
        SCALE_DOWN: 'scale-down'
    };

    let imageStyle = computed(() => {
        if (props.fit) {
            return isSupportObjectFit()
                ? {'object-fit': props.fit}
                : getImageStyle(props.fit);
        }
        return {};
    });

    let alignCenter = computed(() => {
        return !isSupportObjectFit() && props.fit !== ObjectFit.FILL;

    });


    watch(() => props.src, () => {
        data.state = 0;
        loadImage();
    });

    onMounted(() => {
        if (props.lazy) {
            nextTick(addLazyLoadListener);
        } else {
            loadImage();
        }
    });

    onBeforeUnmount(() => {
        freeImg();
        props.lazy && removeImgObserver(imgRef.value);
    });

    function freeImg() {
        data.lastObj && t.freeObj(data.lastObj);
        data.lastObj = null;
    }
    function loadImage() {
        data.state = 1;
        // reset status
        data.loading = true;
        data.error = false;


        const img = new Image();
        img.onload = e => handleLoad(e, img);
        img.onerror = handleError;

        freeImg();

        Object.keys(attrs)
            .forEach((key) => {
                const value = attrs[key];
                img.setAttribute(key, value);
            });

        if(props.src instanceof File) {
            data.lastObj = t.getObjectURL(props.src);
            img.src = data.lastObj;
        } else {
            data.lastObj = props.src;
            img.src = props.src;
        }
    }
    function handleLoad(e, img) {

        data.state = 2;
        data.imageWidth = img.width;
        data.imageHeight = img.height;
        data.loading = false;
        data.error = false;
    }
    function handleError(e) {
        data.state = -1;
        data.loading = false;
        data.error = true;
        emit('error', e);
    }
    function addLazyLoadListener() {

        registerImgObserver(imgRef.value, dom => {
            loadImage();
            removeImgObserver(imgRef.value);
        });

    }
    /**
     * simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
     */
    function getImageStyle(fit) {
        const {imageWidth, imageHeight} = data;
        const {
            clientWidth: containerWidth,
            clientHeight: containerHeight
        } = imgRef.value;

        if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {};

        const imageAspectRatio = imageWidth / imageHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        if (fit === ObjectFit.SCALE_DOWN) {
            const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;
            fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
        }

        switch (fit) {
            case ObjectFit.NONE:
                return {width: 'auto', height: 'auto'};
            case ObjectFit.CONTAIN:
                return (imageAspectRatio < containerAspectRatio) ? {width: 'auto'} : {height: 'auto'};
            case ObjectFit.COVER:
                return (imageAspectRatio < containerAspectRatio) ? {height: 'auto'} : {width: 'auto'};
            default:
                return {};
        }
    }
</script>
<style lang="less">
    .el-image__error, .el-image__placeholder {
        background: #F5F7FA
    }

    .el-image__error, .el-image__inner, .el-image__placeholder {
        width: 100%;
        height: 100%
    }

    .el-image {
        position: relative;
        display: inline-block;
        overflow: hidden
    }

    .el-image__inner {
        vertical-align: top
    }

    .el-image__inner--center {
        position: relative;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: block
    }

    .el-image__error {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        font-size: 14px;
        color: #C0C4CC;
        vertical-align: middle
    }


</style>
