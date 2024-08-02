<template>
    <transition name="el-message-fade"
                @after-leave="handleAfterLeave">
        <div
                ref="msgRef"
                :class="[
                    'el-message',
                    props.type && !props.iconClass ? `el-message--${ props.type }` : '',
                    props.center ? 'is-center' : '',
                    props.showClose ? 'is-closable' : '',
                    props.customClass
                ]"
                :style="positionStyle"
                v-show="data.visible"
                @mouseenter="clearTimer"
                @mouseleave="startTimer"
                role="alert">
            <i :class="props.iconClass" v-if="props.iconClass"></i>
            <i :class="typeClass" v-else></i>
            <slot>
                <p v-if="!props.dangerouslyUseHTMLString" class="el-message__content">{{ props.message }}</p>
                <p v-else v-html="props.message" class="el-message__content"></p>
            </slot>
            <i class="el-message__closeBtn el-icon-close" @click="close">
                <svg style="height: 1em;fill: currentColor;margin-right: 5px;vertical-align: middle;"
                     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z"></path>
                    <path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z"></path>
                </svg>
            </i>
        </div>
    </transition>
</template>

<script setup>
    const typeMap = {
        success: 'success',
        info: 'info',
        warning: 'warning',
        error: 'error'
    };

    import {
        reactive, ref,
        computed, watch,
        onMounted, onUnmounted
    } from 'vue';
    let emit = defineEmits(['remove', 'close']);
    let msgRef = ref(null);
    let props = defineProps({
        message: {type: String, default: ''},
        duration: {type: Number, default: 3000},
        type: {type: String, default: 'info'},
        iconClass: {type: String, default: ''},
        customClass: {type: String, default: ''},
        showClose: {type: Boolean, default: false},
        verticalOffset: {type: Number, default: 20},
        dangerouslyUseHTMLString: {type: Boolean, default: false},
        center: {type: Boolean, default: false},
    });
    let data = reactive({
        visible: false,
        closed: false,
        timer: null,
        offset: 0
    })

    let typeClass = computed(() => {
        return data.type && !data.iconClass
            ? `el-message__icon el-icon-${ typeMap[data.type] }`
            : '';
    });

    let positionStyle = computed(() => {
        return {
            'top': `${ props.verticalOffset + data.offset}px`
        };
    });

    onMounted(() => {
        document.addEventListener('keydown', keydown);
        data.visible = true;
        startTimer();
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', keydown);
    })


    function handleAfterLeave() {
        emit('remove')
    }

    function close() {
        data.closed = true;
        data.visible = false;
        emit('close');
    }

    function clearTimer() {
        clearTimeout(data.timer);
    }

    function startTimer() {
        if (props.duration > 0) {
            clearTimer();
            data.timer = setTimeout(() => {
                if (!data.closed) {
                    close();
                }
            }, props.duration);
        }
    }

    function keydown(e) {
        if (e.keyCode === 27) { // esc关闭消息
            if (!data.closed) {
                close();
            }
        }
    }

    function decTop(top) {
        data.offset -= top;
    }

    defineExpose({
        decTop
    })

</script>
<style lang="less">
    .el-message {
        min-width: 380px;
        box-sizing: border-box;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: #EBEEF5;
        position: fixed;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        background-color: #edf2fc;
        transition: opacity .3s, transform .4s, top .4s;
        overflow: hidden;
        padding: 15px 15px 15px 20px;
        display: flex;
        align-items: center;
        z-index: 2000;

        &.is-center {
            justify-content: center
        }

        &.is-closable .el-message__content {
            padding-right: 16px
        }

        p {
            margin: 0
        }

        .el-icon-success {
            color: @colorSuccess;
        }

        .el-icon-error {
            color: @colorDanger;
        }

        .el-icon-info {
            color: @colorInfo;
        }

        .el-icon-warning {
            color: @colorWarning;
        }

        &.el-message--info .el-message__content {
            color: #909399
        }

        &.el-message--success {
            background-color: #f0f9eb;
            border-color: #e1f3d8;

            .el-message__content {
                color: @colorSuccess
            }
        }

        &.el-message--warning {
            background-color: #fdf6ec;
            border-color: #faecd8;

            .el-message__content {
                color: @colorWarning;
            }
        }

        &.el-message--error {
            background-color: #fef0f0;
            border-color: #fde2e2;

            .el-message__content {
                color: @colorDanger
            }
        }


        .el-message__icon {
            margin-right: 10px;
        }

        .el-message__content {
            padding: 0;
            font-size: 14px;
            line-height: 1
        }

        .el-message__content:focus {
            outline-width: 0
        }

        .el-message__closeBtn {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            cursor: pointer;
            color: #C0C4CC;
            font-size: 16px
        }

        .el-message__closeBtn:focus {
            outline-width: 0
        }

        .el-message__closeBtn:hover {
            color: #909399
        }

    }

    .el-message-fade-enter, .el-message-fade-leave-active {
        opacity: 0;
        transform: translate(-50%, -100%)
    }


</style>
