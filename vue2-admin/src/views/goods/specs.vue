<template>
    <div class="page page-specs">
        <div class="page-search">
            <el-form :model="data.query"
                     ref="queryRef" :inline="true"
                     label-width="68px">
                <el-form-item label="规格名称">
                    <el-input
                            v-model="data.query.specicationName"
                            placeholder="请输入规格名称"
                            clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="Search" @click="queryList">查询</el-button>
                    <el-button icon="plus" type="primary" @click="showEditFun(null, false)">新建规格</el-button>
                </el-form-item>
            </el-form>
        </div>


        <el-table v-loading="loading" :data="list">
            <el-table-column label="规格名称" align="center" prop="specicationName" />
            <el-table-column label="排序值" align="center" prop="iorder"/>
            <el-table-column label="属性数量" align="center" prop="valsCount"/>
            <el-table-column label="创建时间" align="center" prop="createTime"/>
            <el-table-column label="创建人" align="center" prop="createByName"/>
            <!--<el-table-column label="状态" align="center" prop="status" >
                <template #default="{row}">
                    <span v-if="row.status === 0">禁用</span>
                    <span v-if="row.status === 1">启用</span>
                </template>
            </el-table-column>-->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="{row}">
                    <!--<el-button
                            v-if="row.status === 0"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.specicationId, 1)"
                            v-hasPermi="['system:notice:edit']"
                    >启用</el-button>
                    <el-button
                            v-if="row.status === 1"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.specicationId, 0)"
                            v-hasPermi="['system:notice:edit']"
                    >停用</el-button>-->
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showEditFun(row, true)"
                            v-hasPermi="['system:notice:edit']"
                    >详情</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showEditFun(row, false)"
                            v-hasPermi="['system:notice:edit']"
                    >编辑</el-button>
                    <!--<el-button
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:notice:remove']"
                    >删除</el-button>-->
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

        <SpecsEditDialog :obj="data.editObj"
                         :disabled="disabledDialog"
                         @update="loadData"
                         :visible.sync="showEdit"/>
    </div>
</template>

<script setup name="goods-list">
    import {getRule} from "@/utils/utils";
    import SpecsEditDialog from './components/SpecsEditDialog';
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

    const $route = $router.app.$route;

    const list = ref([]);
    const loading = ref(true);
    const showEdit = ref(false);
    const disabledDialog = ref(false);

    const data = reactive({
        query: {
            pageNum: 1,
            pageSize: 10,
            specicationName: '',
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
        $api.getSpecsList(data.query)
            .then(res => {
                list.value = res.rows.map(_ => {
                    _.valsCount = _.values.length;
                    _.values = _.values.map(v => {
                        v.iorder = v.specicationValueOrder;
                        return v;
                    })
                    return _;
                });
                data.total = res.total;
                loading.value = false;
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
                loading.value = false;
            })
    }

    function handleDelete(item) {

    }

    function setStatus(id, status) {

        loading.value = true;
        $api.setSpecsStatus(id, status)
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

    function showEditFun(obj, disabled) {
        data.editObj = obj;
        disabledDialog.value = disabled;
        showEdit.value = true;
    }


    queryList();
</script>

<style lang="scss">


    .page-specs {


    }
</style>
