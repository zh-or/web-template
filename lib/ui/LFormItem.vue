<template>
<div class="l-form-item" :class="{'l-form-item-error': data.errMsg}">
    <label class="l-form-label"
           :class="{'l-form-required': data.isRequired}"
           :style="labelStyle">{{props.label}}</label>
    <div class="l-form-item-input" :style="inputStyle">
        <slot/>
        <transition name="el-zoom-in-top">
            <div v-show="data.errMsg" class="error-msg">{{data.errMsg}}</div>
        </transition>
    </div>
</div>
</template>

<script setup>

    import {
        reactive,
        inject, provide, computed, watch, watchEffect,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'LFormItem' });
    let emit = defineEmits();
    let props = defineProps({
        label: String,
        prop: String
    });
    let data = reactive({
        errMsg: '',
        isRequired: false,
    });

    provide('inputEventCall', inputEventCall);

    let regisiterItem = inject('regisiterItem', null);
    let callCalidate = inject('callCalidate', null);
    let labelWidth = inject('labelWidth', '80px');
    let inline = inject('inline', false);

    let labelStyle = computed(() => {
        return {
            'width': labelWidth || 'auto'
        }
    });
    let inputStyle = computed(() => {});

    watchEffect(() => {
        regisiter(props.prop);
    });

    function inputEventCall(e, obj) {
        setTimeout(_ => {
            callCalidate(e, props.prop, obj)
                .then(err => {
                    data.errMsg = err;
                });
        }, 0)
    }
    function showError(err) {
        data.errMsg = err;
    }
    function hideError() {
        data.errMsg = '';
    }

    function regisiter() {
        data.isRequired = regisiterItem(props.prop, {showError, hideError});
    }

</script>

<style lang="less">
.l-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .l-form-label {
        flex-shrink: 0;
        margin-right: 10px;
        text-align: right;
        font-weight: bold;

        &.l-form-required {

            &:after {
                vertical-align: middle;
                content: ' * ';
                color: @colorDanger;
            }
        }
    }

    .l-form-item-input {
        flex-grow: 1;
        position: relative;
    }

    &.l-form-item-error {

        .error-msg {
            color: @colorDanger;
            position: absolute;
            left: 0;
            margin-top: 3px;
        }

        .l-input input, .tag-input-wrap{

            &:focus, &:focus {
                border-color: @colorDanger!important;
            }
            border-color: @colorDanger!important;
        }


    }
}
</style>
