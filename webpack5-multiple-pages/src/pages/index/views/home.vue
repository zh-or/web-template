<template>
<div class="page ">
    <div class="page-panel">
        home {{c}}
        <el-button @click="handle">add</el-button>
        <br/>
        <el-button @click="user.incApiLoading(1)">+</el-button>
        <el-button @click="user.incApiLoading(-1)">-</el-button>
    </div>
</div>
</template>
<script setup>
import {
    reactive, ref, useTemplateRef, computed, nextTick,
    onMounted, onUnmounted
} from 'vue';

import useMenuStore from '../menuStore.js';
import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import mapi from '@index/api/api.js';
import {waitLogin, userStore } from "@base/lib/store.js";

defineOptions({name: 'home'});
let user = userStore();
let menuStore = useMenuStore();

let c = ref(0)

let uploadData = {
    type : '-1',//暂不支持传图片
};

let publish = reactive({
});

onMounted(() => {
});

function handle() {
    c.value++;
    menuStore.setCountValue('user', c.value);
}


</script>
<style lang="less">

</style>
