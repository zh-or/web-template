<template>
<div class="page page-list">
    <div class="page-panel shadow fff txt-center h100 flex f-v-center f-h-center">
        <span style="font-size: 100px;">404</span>
        <span class="pr10">页面不存在</span>
        <el-button text @click="router.replace('/')" type="primary">返回首页</el-button>
    </div>
</div>
</template>
<script setup>
import {
    reactive, ref, useTemplateRef, computed, nextTick,
    onMounted, onUnmounted
} from 'vue';

import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import mapi from '@index/api/api.js';
import router from '@index/router.js';

defineOptions({name: 'pageNotFound'});



</script>
<style lang="less">

</style>
