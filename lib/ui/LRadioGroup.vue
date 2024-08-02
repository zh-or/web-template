<template>
    <div class="l-radio-group">
        <slot></slot>
    </div>
</template>
<script setup>


    import {
        reactive, ref,
        inject, provide, computed, watch,
        onMounted, onUnmounted,
        useAttrs,
        nextTick
    } from 'vue';

    defineOptions({ name: 'LRadioGroup'});
    provide('inputName', 'radio-group-' + Date.now());

    let model = defineModel({
        get(v) {
            return v;
        },
        set(v) {
            return v;
        }
    });
    provide('radioGroupVal', model);

    let props = defineProps({
        value: {},
        size: String,
        fill: String,
        textColor: String,
        disabled: Boolean
    })


</script>
<style lang="less">
    .l-radio-group {
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        font-size: 0
    }
</style>
