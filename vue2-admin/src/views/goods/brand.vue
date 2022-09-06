<template>
    <div class="page page-brand">
        <div class="page-search">
            <el-form :model="data.query"
                     ref="queryRef" :inline="true"
                     label-width="68px">
                <el-form-item label="品牌名称" >
                    <el-input
                            v-model="data.query.brandName"
                            placeholder="请输入品牌名称"
                            clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="Search" @click="queryList">查询</el-button>
                    <el-button icon="plus" type="primary" @click="showBrandEditFun(null, false)">新建品牌</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table v-loading="loading" :data="list">
            <el-table-column label="品牌名称" align="center" prop="brandName" />
            <el-table-column label="排序值" align="center" prop="iorder" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="创建人" align="center" prop="createByName" />
            <el-table-column label="状态" align="center" prop="status" >
                <template #default="{row}">
                    <span v-if="row.status === 0">禁用</span>
                    <span v-if="row.status === 1">启用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280px">
                <template #default="{row}">
                    <el-button
                            v-if="row.status === 0"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.brandId, 1)"
                            v-hasPermi="['system:notice:edit']"
                    >启用</el-button>
                    <el-button
                            v-if="row.status === 1"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.brandId, 0)"
                            v-hasPermi="['system:notice:edit']"
                    >停用</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showBrandEditFun(row, true)"
                            v-hasPermi="['system:notice:edit']"
                    >详情</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showBrandEditFun(row, false)"
                            v-hasPermi="['system:notice:edit']"
                    >编辑</el-button>
                    <!--<el-button
                            type="text"
                            icon="Delete"
                            @click="handleDelete(row)"
                            v-hasPermi="['system:notice:remove']"
                    >删除</el-button>
-->
                </template>
            </el-table-column>
        </el-table>

        <pagination
                v-show="data.total > 0"
                :total="data.total"
                v-model:page="data.query.pageNum"
                v-model:limit="data.query.pageSize"
                @pagination="loadData"
        />

        <BrandEditDialog :obj="data.editObj"
                         :disabled="disabledDialog"
                         @update="loadData"
                         :visible.sync="showBrandEdit"/>
    </div>
</template>

<script setup name="goods-list">
    import {getRule} from "@/utils/utils";
    import BrandEditDialog from './components/BrandEditDialog';

    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
        getEnumArr,
    } from '@/autoImportUtils/index.js';


    const list = ref([]);
    const loading = ref(true);
    const showBrandEdit = ref(false);
    const disabledDialog = ref(false);

    const data = reactive({
        query: {
            pageNum: 1,
            pageSize: 10,
            brandName: '',
            type: '',
            group: '',
            groupType: '',
        },
        total: 0,
        editObj: null,
    });

    function queryList() {
        data.query.pageNum = 1;
        loadData();
    }

    function loadData() {
        loading.value = true;
        $api.getBrandList((data.query))
            .then(res => {
                console.log(res);
                list.value = res.rows;
                data.total = res.total;
                loading.value = false;
            })
            .catch(e => {
                console.error(e);
                //proxy.$modal.warning('网络错误~');
                loading.value = false;
            })
    }

    function setStatus(id, status) {

        loading.value = true;
        $api.setBrandStatus(id, status)
            .then(res => {
                console.log(res);
                loadData();
                loading.value = false;
                $modal.success('修改成功');
            })
            .catch(e => {
                console.error(e);
                //proxy.$modal.warning('网络错误~');
                loading.value = false;
            })
    }

    function handleDelete(item) {

    }

    function showBrandEditFun(obj, disabled) {

        if(obj) {
            obj = {
                ... toRefs(obj),
                logoFile : {
                    url: getImgUrl('brand', obj.brandId),
                }
            };
        }
        console.log('tmp:', obj);
        data.editObj = obj;
        disabledDialog.value = disabled;
        showBrandEdit.value = true;
    }

    queryList();
</script>

<style lang="scss">
.page-brand {

}
</style>
