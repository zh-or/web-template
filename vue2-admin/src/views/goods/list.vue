<template>
    <div class="page page-goods-list">
        <div class="page-search">
            <el-form :model="data.query"
                     ref="queryRef" :inline="true"
                     label-width="68px">
                <el-form-item label="商品名称" >
                    <el-input
                            v-model="data.query.goodsName"
                            placeholder="请输入商品名称"
                            maxlength="200"
                            clearable
                    />
                </el-form-item>
                <el-form-item label="商品分类" >
                    <GoodsCategorySelect :showAll="true"
                                         @change="_ => data.query.categoryId = _.productCategoryId"
                                         placeholder="商品分类" />
                </el-form-item>
                <el-form-item label="商品分组" >
                    <GoodsGroupSelect v-model="data.query.groupId"
                                      :showAll="true"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="queryList">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="page-tools">
            <el-radio-group v-model="data.query.status" @change="queryList">
                <el-radio-button :label="null" >全部</el-radio-button>
                <el-radio-button v-for="item in goodsState"
                                 :label="item.key"
                                 :key="item.key">{{item.value}}</el-radio-button>
            </el-radio-group>
        </div>

        <div class="page-tools">
            <el-button type="primary"
                       @click="handleUpdateStatus(data.select, 1)">上架</el-button>
            <el-button type="primary"
                       @click="handleUpdateStatus(data.select, 2)">下架</el-button>
            <!--<el-button type="primary" >修改分组</el-button>-->
            <el-button icon="plus" type="primary" @click="addGoods">新建商品</el-button>
        </div>

        <el-table v-loading="loading" :data="list"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" fixed="left"/>
            <el-table-column label="商品名称" show-overflow-tooltip align="center" prop="goodsName"  fixed="left" width="200px"/>
            <el-table-column label="商品类型" align="center" prop="goodsType" >
                <template #default="{row}">
                    <span>{{row.goodsType === 0 ? '商品' : '服务'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否多规格" align="center" prop="hasSpecs" >
                <template #default="{row}">
                    <span>{{row.hasSpecs === 0 ? '否' : '是'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="库存" align="center" prop="stockNumber" />
            <el-table-column label="状态" align="center" prop="status" >
                <template #default="{row}">
                    <FormatEnum type="goodsState" :state="row.status"/>
                </template>
            </el-table-column>

            <el-table-column label="商品分类" align="center" prop="categoryName" />
            <el-table-column label="商品分组" align="center" prop="groupNames" />
            <!--<el-table-column label="商品型号" align="center" prop="goodsModel" />
            <el-table-column label="品牌" align="center" prop="brandName" />-->
            <el-table-column label="创建时间" align="center" width="160" prop="createTime" />
            <el-table-column label="操作" align="center" width="280"
                             fixed="right"
                             class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                            type="text"
                            icon="Info"
                            v-hasPermi="['system:notice:edit']"
                            @click="router.push('/goods/edit?type=info&id=' + row.goodsBaseId)"
                    >详情</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="router.push('/goods/edit?type=edit&id=' + row.goodsBaseId)"
                            v-hasPermi="['system:notice:edit']"
                    >编辑</el-button>
                    <el-button
                            v-if="row.status === 0 || row.status === 2 || row.status == 3"
                            type="text"
                            icon="Edit"
                            @click="handleUpdateStatus([row], 1)"
                            v-hasPermi="['system:notice:edit']"
                    >上架</el-button>
                    <el-button
                            v-if="row.status === 1"
                            type="text"
                            icon="Delete"
                            @click="handleUpdateStatus([row], 2)"
                            v-hasPermi="['system:notice:remove']"
                    >下架</el-button>
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
    </div>
</template>

<script setup name="goods-list">
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
        getEnumArr,
    } from '@/autoImportUtils/index.js';

    console.log('$router:', $router);

    const list = ref([]);
    const loading = ref(true);
    const goodsState = getEnumArr('goodsState');
    const data = reactive({
        query: {
            pageNum: 1,
            pageSize: 10,
            goodsName: '',
            categoryId: '',
            groupId: '',
            status: null,
        },
        total: 0,
        select: [],
    });

    function queryList() {
        data.query.pageNum = 1;
        loadData();
    }

    function loadData() {
        loading.value = true;
        $api.queryGoods(data.query)
            .then(res => {
                list.value = res.rows;
                data.total = res.total;
                data.select = [];
                loading.value = false;
            })
            .catch(e => {
                console.error(e);
                //proxy.$modal.warning('网络错误~');
                loading.value = false;
            })
    }

    function addGoods() {
        $router.push('/goods/edit?type=new')
    }

    function handleSelectionChange(rows) {
        data.select = rows;
    }

    function handleUpdateStatus(rows, status) {
        if(!rows || rows.length <= 0) {
            $modal.warning('请先选中商品');
            return;
        }
        $modal.confirm('确定更改商品状态吗?')
            .then(_ => {
                $api.setGoodsStatus({
                    goodsBaseIds: rows.map(_ => _.goodsBaseId),
                    status: status,
                })
                    .then(res => {
                        $modal.success('修改状态成功!');
                        loadData();
                    })
                    .catch(e => {
                        console.error(e);
                        //proxy.$modal.warning('网络错误~');
                    })

            })
    }

    loadData();
</script>

<style lang="scss">
.page-goods-list {

}
</style>
