<template>
    <router-view />
</template>
<script setup>
import {
    reactive, ref, useTemplateRef, computed, nextTick,
    onMounted, onUnmounted
} from 'vue';

defineOptions({name: 'App'});

</script>
<style lang="less">

</style>
