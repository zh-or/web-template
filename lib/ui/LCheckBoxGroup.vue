
<template>
    <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
        <slot></slot>
    </div>
</template>

<script setup>


    import {
        reactive,
        inject, provide, computed,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'LCheckboxGroup' });
    let emit = defineEmits();
    let props = defineProps({
        value: {},
        disabled: Boolean,
        min: Number,
        max: Number,
        size: String,
        fill: String,
        textColor: String
    })

</script>
