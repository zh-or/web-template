<template>
    <div style="display: inline-block">
        <el-select style="width: 150px; margin-right: 10px;"
                   :style="{width: props.width}"
                   v-model="data.baseVal"
                   v-loading="data.loading1"
                   @change="loadData(data.baseVal, true)"
                   placeholder="请选择"
                   filterable
                   clearable>
            <el-option label="全部" v-if="showAll" value=""/>
            <el-option v-for="item in data.arr1"
                       :key="item.productCategoryId"
                       :label="item.productCategoryName"
                       :value="item.productCategoryId"/>
        </el-select>
        <el-select v-model="data.val"
                   :style="{width: props.width}"
                   @change="changeVal"
                   value-key="productCategoryId"
                   v-loading="data.loading2"
                   placeholder="请选择"
                   filterable
                   clearable>
            <el-option label="全部" v-if="showAll" value=""/>
            <el-option v-for="item in data.arr2"
                       :key="item.productCategoryId"
                       :label="item.productCategoryName"
                       :value="item"/>
        </el-select>
    </div>
</template>

<script setup>
    import GoodsGroupSelect from '@/components/GoodsGroupSelect';
    import GoodsCategorySelect from '@/components/GoodsCategorySelect';

    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';


    defineExpose({loadData});
    const emit = defineEmits('change');
    const props = defineProps({
        showAll: Boolean,
        modelValue: Object,
        width: {
            type: String,
            default: '150px',
        }
    })

    watch(_ => props.modelValue, v => {
        if(!v) {
            return;
        }
        data.baseVal = v.parentId;
        data.val = v;
        v && v.parentId && loadData(v.parentId);
    });

    let data = reactive({
        arr1: [],
        arr2: [],
        loading1: false,
        loading2: false,
        baseVal: '',
        val: '',
    })

    function changeVal() {
        emit('update:modelValue', data.val);
        emit('change', data.val);
    }

    function loadData(lvl, clear) {
        let par;
        if(lvl) {
            if(clear) {
                data.val = '';
            }
            changeVal();
            par = {parentId: lvl};
            data.loading2 = true;
        } else {
            par = {businessCategoryId : 12};
            data.loading1 = true;
            data.arr2 = [];
            if(clear) {
                data.val = '';
                changeVal();
            }
        }

        $api.getGoodsCategory(par)
            .then(res => {
                if(lvl) {
                    data.arr2 = res.rows;
                    data.loading2 = false;
                } else {
                    data.arr1 = res.rows;
                    data.loading1 = false;
                }
            })
            .catch(e => {
                if(lvl) {
                    data.loading2 = false;
                } else {
                    data.loading1 = false;
                }
            })

    }
    loadData(null);
</script>

<style lang="scss">

</style>
