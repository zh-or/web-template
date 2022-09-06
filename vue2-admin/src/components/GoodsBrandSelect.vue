<template>
    <el-select v-model="val"
               @change="changeVal"
               v-loading="loading"
               value-key="groupId"
               placeholder="请选择"
               filterable
               clearable>
        <el-option v-if="props.showAll" label="全部" value=""/>
        <el-option v-for="item in list"
                   :key="item.brandId"
                   :label="item.brandName"
                   :value="item.brandId"/>
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
        modelValue: Object,
        obj: Object,
        par: {
            type: Object,
            default: () => {return {}}
        }
    })
    val.value = props.modelValue;
    watch(_ => props.modelValue, _ => {
        val.value = props.modelValue;
    })

    function changeVal() {
        let o = list.value.find(_ => _.brandId === val.value);
        emit('update:modelValue', val);
        emit('update:obj', o);
    }

    function loadData() {
        $api.getBrandList({
            ...props.par
        })
            .then(res => {
                list.value = res.rows;
                loading.value = false;
            })
    }

    loadData();
</script>

<style lang="scss">

</style>
