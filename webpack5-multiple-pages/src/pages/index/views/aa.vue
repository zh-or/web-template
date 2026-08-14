<template>
<div class="page page-list">
    <div class="page-panel ">
        <div class="list-title flex f-h-lr">
            <h3>本周重点跟进项目</h3>

            <span class="hint">测算立项已通过 · 同步可发起⑤原件借阅</span>

            <div >
                <el-button >导出</el-button>
                <el-button type="primary">+ 新增</el-button>
            </div>
        </div>
        <el-table :data="tableData"  class="list"  >
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>

        <div class="pager flex f-h-center">
            <el-pagination background
                           layout="total, prev, pager, next"
                           :total="1000" />
        </div>
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

defineOptions({name: 'aa'});

let tableData = ref(Array(10).fill({
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',}))

let uploadData = {
    type : '-1',//暂不支持传图片
};

let publish = reactive({
    apk: null,
    content: '',
    loading: false,

    loadingHistory: false,
    history: [],
});

onMounted(() => {

});



</script>
<style lang="less">

</style>
