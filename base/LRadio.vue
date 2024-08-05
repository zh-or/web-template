<template>
    <label
            class="el-radio"
            :class="[
                { 'is-disabled': props.disabled },
                { 'is-focus': data.focus },
                { 'is-bordered': props.border },
                { 'is-checked': model === props.label }
            ]"
            role="radio"
            :aria-checked="model === props.label"
            :aria-disabled="props.disabled"
            @keydown.space.stop.prevent="model = props.disabled ? model : props.label"
    >
        <span class="el-radio__input"
              :class="{
            'is-disabled': props.disabled,
            'is-checked': model === props.label
          }"
        >
            <span class="el-radio__inner"></span>
            <input
                  ref="radio"
                  class="el-radio__original"
                  :value="label"
                  type="radio"
                  aria-hidden="true"
                  v-model="model"
                  @focus="data.focus = true"
                  @blur="data.focus = false"
                  @change="handleChange"
                  :name="inputName"
                  :disabled="props.disabled"
                  autocomplete="off"
            >
            </span>
            <span class="el-radio__label" @keydown.stop>
            <slot>{{props.label}}</slot>
        </span>
    </label>
</template>
<script setup>
    import t from '@zh-or/lib';

    import {
        reactive, ref,
        inject, computed, watch,
        onMounted, onUnmounted,
        useAttrs,
        nextTick
    } from 'vue';

    defineOptions({ name: 'LRadio'});
    let emit = defineEmits([ ]);
    let selfModel = defineModel();
    /*从最外层读取属性*/
    let LForm = inject('LForm', {});
    let inputName = inject('inputName', '');
    let model = inject(
        'radioGroupVal',
        selfModel
    );

    let props = defineProps({
        label: [String, Number],
        disabled: Boolean,
        border: Boolean,
    });
    let attrs = useAttrs();

    let data = reactive({
        focus: false
    });


</script>
<style lang="less">
    .el-radio, .el-radio--medium.is-bordered .el-radio__label {
        font-size: 14px
    }

    .el-radio, .el-radio__input {
        white-space: nowrap;
        line-height: 1;
        outline: 0
    }

    .el-radio, .el-radio__inner, .el-radio__input {
        position: relative;
        display: inline-block
    }

    .el-radio {
        color: #606266;
        font-weight: 500;
        cursor: pointer;
        margin-right: 30px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none
    }

    .el-radio.is-bordered {
        padding: 12px 20px 0 10px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 40px
    }

    .el-radio.is-bordered.is-checked {
        border-color: @colorBase
    }

    .el-radio.is-bordered.is-disabled {
        cursor: not-allowed;
        border-color: #EBEEF5
    }

    .el-radio__input.is-disabled .el-radio__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner {
        background-color: #F5F7FA;
        border-color: #E4E7ED
    }

    .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 10px
    }

    .el-radio--medium.is-bordered {
        padding: 10px 20px 0 10px;
        border-radius: 4px;
        height: 36px
    }

    .el-radio--medium.is-bordered .el-radio__inner {
        height: 14px;
        width: 14px
    }

    .el-radio--small.is-bordered {
        padding: 8px 15px 0 10px;
        border-radius: 3px;
        height: 32px
    }

    .el-radio--small.is-bordered .el-radio__label {
        font-size: 12px
    }

    .el-radio--small.is-bordered .el-radio__inner {
        height: 12px;
        width: 12px
    }

    .el-radio--mini.is-bordered {
        padding: 6px 15px 0 10px;
        border-radius: 3px;
        height: 28px
    }

    .el-radio--mini.is-bordered .el-radio__label {
        font-size: 12px
    }

    .el-radio--mini.is-bordered .el-radio__inner {
        height: 12px;
        width: 12px
    }

    .el-radio:last-child {
        margin-right: 0
    }

    .el-radio__input {
        cursor: pointer;
        vertical-align: middle
    }

    .el-radio__input.is-disabled .el-radio__inner {
        cursor: not-allowed
    }

    .el-radio__input.is-disabled .el-radio__inner::after {
        cursor: not-allowed;
        background-color: #F5F7FA
    }

    .el-radio__input.is-disabled .el-radio__inner + .el-radio__label {
        cursor: not-allowed
    }

    .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
        background-color: #C0C4CC
    }

    .el-radio__input.is-disabled + span.el-radio__label {
        color: #C0C4CC;
        cursor: not-allowed
    }

    .el-radio__input.is-checked .el-radio__inner {
        border-color: @colorBase;
        background: @colorBase
    }

    .el-radio__input.is-checked .el-radio__inner::after {
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1)
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: @colorBase
    }

    .el-radio__input.is-focus .el-radio__inner {
        border-color: @colorBase
    }

    .el-radio__inner {
        border: 1px solid #DCDFE6;
        border-radius: 100%;
        width: 14px;
        height: 14px;
        background-color: #FFF;
        cursor: pointer;
        -webkit-box-sizing: border-box;
        box-sizing: border-box
    }

    .el-radio__inner:hover {
        border-color: @colorBase
    }

    .el-radio__inner::after {
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #FFF;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%) scale(0);
        transform: translate(-50%, -50%) scale(0);
        -webkit-transition: -webkit-transform .15s ease-in;
        transition: -webkit-transform .15s ease-in;
        transition: transform .15s ease-in;
        transition: transform .15s ease-in, -webkit-transform .15s ease-in
    }

    .el-radio__original {
        opacity: 0;
        outline: 0;
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0
    }

    .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
        -webkit-box-shadow: 0 0 2px 2px @colorBase;
        box-shadow: 0 0 2px 2px @colorBase
    }

    .el-radio__label {
        font-size: 14px;
        padding-left: 10px
    }
</style>
