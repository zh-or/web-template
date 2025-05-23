<template>
    <transition >
        <div class="l-dialog"
             v-if="show"
             ref="dialogRef"
             :style="styles">
            <div class="dialog-mask" @click="maskClick"></div>
            <div class="dialog-view " >
                <div class="dialog-close"
                     v-if="props.showClose"
                     @click="close">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z"></path>
                    </svg>
                </div>
                <div class="dialog-title" v-if="props.title">{{props.title}}</div>
                <slot/>

            </div>
        </div>
    </transition>
</template>

<script setup>
    import { getzIndex } from './UiTool.js';
    import {
        reactive, ref,
        watch, computed, nextTick,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'BaseDialog' });
    let emit = defineEmits(['close']);

    let dialogRef = ref(null);
    let show = defineModel({
        set(v) {
            return v;
        }
    });

    watch(show, v => {
        if(v) {
            data.zIndex = getzIndex();
        }
        checkShow();
    });

    let props = defineProps({
        title: String,
        escClose: {
            type: Boolean,
            default: true
        },
        maskClose: Boolean,
        showClose: Boolean,
        appendToBody: {
            type: Boolean,
            default: false
        },
    });

    let data = reactive({
        isAppend: false,
        zIndex: getzIndex()
    });

    onMounted(() => {
        checkShow();
        window.addEventListener('keydown', keydown);
    });

    let styles = computed(() => {
        return {
            'zIndex': data.zIndex
        }
    })

    function checkShow() {
        nextTick(_ => {
            if (props.appendToBody && dialogRef.value) {
                //这里会移动el而不是复制一份
                document.body.appendChild(dialogRef.value);
                data.isAppend = true;
            }
        })
    }

    function maskClick() {
        if(props.maskClose) {
            close();
        }
    }

    function close() {
        show.value = false;
        emit('close');
    }

    function keydown(e) {
        if(props.escClose && e.keyCode === 27) {
            if(show.value) {
                e.stopPropagation();
                close();
            }
        }
    }
</script>

<style lang="less">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
    .l-dialog {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1002;
        display: flex;
        align-items: center;
        justify-content: center;

        .dialog-mask {
            opacity: .5;
            background: #000;
            z-index: 1001;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }

        .dialog-view {
            z-index: 1002;
            position: relative;
            border-radius: 4px;
            background-color: #fff;
        }

        .dialog-close {
            position: absolute;
            z-index: 1001;
            top: 9px;
            right: 8px;
            cursor: pointer;
            color: #69AC74;
            border-radius: 50%;
            height: 20px;
            font-size: 20px;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            font-weight: bold;

            .icon {
                margin: 0;
            }
        }

        .dialog-title {
            font-size: 13px;
            font-weight: bold;
            color: @colorTxt0;
            padding: 5px 0 10px;
            text-align: center;

        }
    }


</style>
