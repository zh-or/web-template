<template>
    <LDialog v-model="data.showDialog" @close="hide">
        <div class="message-box-wrap">
            <div class="mb-title">{{props.title || ''}}</div>
            <div class="mb-content">{{props.content || ''}}</div>
            <div class="mb-btns">
                <LButton @click="hide()"
                          v-if="props.showCancel">{{props.cancelStr}}</LButton>
                <LButton type="primary"
                          @click="confirm()">{{props.okStr}}</LButton>
            </div>
        </div>
    </LDialog>

</template>

<script setup>
    import LDialog from '../LDialog.vue';
    import LButton from '../LButton.vue';

    import {
        reactive,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'MessageBox' });
    let props = defineProps({
        title: String,
        content: String,
        okStr: {type: String, default: '确认'},
        cancelStr: {type: String, default: '取消'},
        showCancel: {type: Boolean, default: false},

        resolve: Function,
        reject: Function,
    });
    let data = reactive({
        showDialog: false,
    });

    let emit = defineEmits(['hide']);

    function confirm() {
        data.showDialog = false;
        props.resolve && props.resolve();
        emit('hide');
    }

    function hide() {
        data.showDialog = false;
        props.reject && props.reject();
        emit('hide');
    }

    data.showDialog = true;
</script>

<style lang="less">

    .message-box-wrap {
        background-color: #fff;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 13px;
        min-width: 400px;
        max-height: 90%;
        overflow-y: auto;

        .mb-title {
            font-size: 14px;
            font-weight: bold;
            color: @colorTxt1;
        }

        .mb-content {
            margin: 20px 0;
            font-size: 14px;
            color: @colorTxt0;
            min-height: 2em;
            max-width: 400px;
            line-height: 1.6em;
            font-weight: bold;
        }

        .mb-btns {
            text-align: right;

            .btn + .btn {
                margin-left: 30px;
            }
        }
    }


</style>
