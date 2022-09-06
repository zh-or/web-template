<template>
    <el-select v-model="val"
               @change="changeVal"
               v-loading="loading"
               value-key="groupId"
               placeholder="行业类型"
               filterable
               :multiple="props.multiple"
               clearable>
        <el-option v-if="props.showAll" label="全部" value=""/>
        <el-option v-for="item in list"
                   :key="item.tradeId"
                   :label="item.tradeName"
                   :value="item.tradeId"/>
    </el-select>
</template>

<script setup>


    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';


    const loading = ref(true);
    const list = ref([]);
    const val = ref(null);

    defineExpose({loadData});
    const emit = defineEmits();
    const props = defineProps({
        showAll: Boolean,
        value: Object | Number,
        obj: Object,
        multiple: Boolean,
    })
    val.value = props.value;
    watch(_ => props.value, _ => {
        val.value = props.value;
    })

    function changeVal() {
        let o = list.value.find(_ => _.groupId === val.value);
        emit('update:value', val);
        emit('update:obj', o);
    }

    function loadData() {
        $api.getTradeList({})
            .then(res => {
                list.value = res.rows;
                loading.value = false;
            })
    }

    loadData();
</script>

<style lang="scss">

</style>
