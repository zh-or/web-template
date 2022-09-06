<template>
    <div class="page page-goods-group">
        <div class="page-search">
            <el-form :model="data.query"
                     ref="queryRef" :inline="true"
                     label-width="68px">
                <el-form-item label="分组名称" >
                    <el-input
                            v-model="data.query.groupName"
                            placeholder="请输入分组名称"
                            clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="Search" @click="queryList">查询</el-button>
                    <el-button icon="plus" type="primary" @click="showGroupEditFun(null, false)">新建分组</el-button>
                </el-form-item>
            </el-form>
        </div>


        <el-table v-loading="loading" :data="list">
            <el-table-column label="分组名称" align="center" prop="groupName" />
            <el-table-column label="排序值" align="center" prop="iorder" />
            <el-table-column label="商品数量" align="center" prop="goodsCount" >
                <template #default="{row}">
                    <span style="color: #409eff; cursor: pointer;"
                          @click="queryGroupGoodsList(row.groupId)"
                    >{{row.goodsCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
            <el-table-column label="创建者" align="center" prop="createByName" />
            <el-table-column label="状态" align="center" prop="status" >
                <template #default="{row}">
                    <span v-if="row.status === 0">禁用</span>
                    <span v-if="row.status === 1">启用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center"
                             width="350"
                             class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                            v-if="row.status === 0"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.groupId, 1)"
                            v-hasPermi="['system:notice:edit']"
                    >启用</el-button>
                    <el-button
                            v-if="row.status === 1"
                            type="text"
                            icon="Action"
                            @click="setStatus(row.groupId, 0)"
                            v-hasPermi="['system:notice:edit']"
                    >停用</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showGroupEditFun(row, true)"
                            v-hasPermi="['system:notice:edit']"
                    >详情</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            @click="showGroupEditFun(row, false)"
                            v-hasPermi="['system:notice:edit']"
                    >编辑</el-button>
                    <!--<el-button
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:notice:remove']"
                    >删除</el-button>-->
                    <el-button
                            type="text"
                            icon="Plus"
                            @click="handleAddGoods(row)"
                            v-hasPermi="['system:notice:remove']"
                    >添加商品</el-button>
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

        <GroupEditDialog :obj="data.editObj"
                         :disabled="disabledDialog"
                         @update="loadData"
                         v-visible.sync="showGroupEdit"/>

        <el-dialog :visible.sync="groupGoodsList.show" title="商品列表" width="800px">
            <div class="page-search">
                <el-form :model="groupGoodsList.query" :inline="true"
                         label-width="68px">
                    <el-form-item label="商品名称" >
                        <el-input
                                v-model="groupGoodsList.query.goodsName"
                                placeholder="请输入商品名称"
                                clearable
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="queryGroupGoodsList()">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-list" v-loading="groupGoodsList.loading" >
                <el-table :data="groupGoodsList.data">
                    <el-table-column label="商品名称" show-overflow-tooltip align="center" prop="goodsName" />
                    <el-table-column label="商品类型" align="center" prop="goodsType" >
                        <template #default="{row}">
                            <span v-if="row.goodsType === 0">商品</span>
                            <span v-if="row.goodsType === 1">服务</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" align="center" prop="goodsModel" />
                    <el-table-column label="品牌" align="center" prop="brandName" />

                </el-table>

                <pagination
                        v-show="groupGoodsList.total > 0"
                        :total="groupGoodsList.total"
                        v-model:page="groupGoodsList.query.pageNum"
                        v-model:limit="groupGoodsList.query.pageSize"
                        @pagination="loadGroupGoodsList"
                />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="groupGoodsList.show = false">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="showAddSelectGoods" v-loading="goodsList.loading" title="选择商品" width="800px">
            <div class="page-search">
                <el-form :model="goodsList.query"
                         ref="queryRef" :inline="true"
                         label-width="68px">
                    <el-form-item label="商品名称" >
                        <el-input
                                v-model="goodsList.query.goodsName"
                                placeholder="请输入商品名称"
                                clearable
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="queryGoodsList">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-list"  >
                <el-table :data="goodsList.data"
                          ref="goodsListRef"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="商品名称" align="center" prop="goodsName" />
                    <el-table-column label="商品类型" align="center" prop="goodsType" >
                        <template #default="{row}">
                            <span v-if="row.goodsType === 0">商品</span>
                            <span v-if="row.goodsType === 1">服务</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" align="center" prop="goodsModel" />
                    <el-table-column label="品牌" align="center" prop="brandName" />

                </el-table>

                <pagination
                        v-show="goodsList.total > 0"
                        :total="goodsList.total"
                        v-model:page="goodsList.query.pageNum"
                        v-model:limit="goodsList.query.pageSize"
                        @pagination="loadGoodsList"
                />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="confirmGoodsSelectFun">确 定</el-button>
                    <el-button @click="showAddSelectGoods = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="goods-list">
    import {getRule} from "@/utils/utils";
    import GroupEditDialog from './components/GroupEditDialog';

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
    const showGroupEdit = ref(false);
    const disabledDialog = ref(false);
    const showAddSelectGoods = ref(false);

    const data = reactive({
        query: {
            pageNum: 1,
            pageSize: 10,
            groupName: '',
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
        $api.getGroupList((data.query))
            .then(res => {
                console.log(res);
                list.value = res.rows;
                data.total = res.total;
                loading.value = false;
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
                loading.value = false;
            })
    }

    function setStatus(id, status) {
        loading.value = true;
        $api.setGroupStatus(id, status)
            .then(res => {
                console.log(res);
                loading.value = false;
                loadData();
                $modal.success('修改成功');
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
                loading.value = false;
            })
    }

    function handleDelete(item) {

    }

    function showGroupEditFun(obj, disabled) {
        if(obj) {
            obj = {
                ... toRefs(obj),
                iconFile : {
                    url: getImgUrl('group', obj.groupId),
                }
            };
        }

        console.log('tmp:', obj);
        data.editObj = obj;
        disabledDialog.value = disabled;
        showGroupEdit.value = true;
    }


    const goodsList = reactive({
        data: [],
        allSelect: [],
        nowSelect: [],
        total: 0,
        loading: false,
        query: {
            groupId: '',
            pageNum: 1,
            pageSize: 10,
            goodsName: '',
        }
    });

    function handleAddGoods(item) {
        goodsList.query.groupId = item.groupId;
        goodsList.allSelect = [];
        goodsList.nowSelect = [];

        showAddSelectGoods.value = true;
        queryGoodsList();
    }

    function confirmGoodsSelectFun() {
        goodsList.loading = true;
        fulshToAllSelect();
        $api.addGoodsToGroup({
            "goodsBaseIds": goodsList.allSelect.map(_ => _.goodsBaseId),
            "groupId": goodsList.query.groupId
        })
            .then(res => {
                $modal.success('添加成功');
                goodsList.allSelect = [];
                goodsList.nowSelect = [];
                showAddSelectGoods.value = false;
                goodsList.loading = false;
                loadData();
            })
            .catch(e => {
                goodsList.loading = false;
                console.error(e);
                //proxy.$modal.warning('网络错误~');
            })
    }

    function queryGoodsList() {
        goodsList.query.pageNum = 1;
        loadGoodsList();
    }

    function handleSelectionChange(rows) {
        if(goodsList.loading) {
            return;
        }
        goodsList.nowSelect = rows;
    }

    function fulshToAllSelect() {
        let rm = goodsList.data.filter(_ => !goodsList.nowSelect.find(t => t.goodsBaseId === _.goodsBaseId));
        let add = goodsList.nowSelect.filter(_ => !goodsList.allSelect.find(t => t.goodsBaseId === _.goodsBaseId));
        goodsList.allSelect = goodsList.allSelect.filter(_ => !rm.find(t => t.goodsBaseId === _.goodsBaseId))
        goodsList.allSelect = goodsList.allSelect.concat(add);
    }

    function loadGoodsList() {
        goodsList.loading = true;
        $api.getGoodsListByGroup(goodsList.query)
            .then(res => {
                fulshToAllSelect();
                goodsList.data = res.rows;
                goodsList.total = res.total;
                goodsList.nowSelect = [];
                goodsList.allSelect.forEach(_ => {
                    let raw = goodsList.data.find(t => t.goodsBaseId === _.goodsBaseId);
                    if(raw) {
                        goodsList.nowSelect.push(raw);
                    }
                });
                nextTick(_ => {
                    goodsList.nowSelect.forEach(item => {
                        proxy.$refs.goodsListRef.toggleRowSelection(item, true, false);
                    });
                    goodsList.loading = false;
                })
            })
            .catch(e => {
                goodsList.loading = false;
                console.error(e);
                //proxy.$modal.warning('网络错误~');
            })
    }


    const groupGoodsList = reactive({
        show: false,
        data: [],
        loading: false,
        total: 0,
        query: {
            goodsName: '',
            groupId: '',
            pageNum: 1,
            pageSize: 10,
        }
    });

    function queryGroupGoodsList(id) {
        if(id) {
            groupGoodsList.query.groupId = id;
        }
        groupGoodsList.show = true;
        groupGoodsList.query.pageNum = 1;
        loadGroupGoodsList();
    }

    function loadGroupGoodsList() {
        groupGoodsList.loading = true;
        $api.queryGoods(groupGoodsList.query)
            .then(res => {
                groupGoodsList.data = res.rows;
                groupGoodsList.total = res.total;
                groupGoodsList.loading = false;
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
                groupGoodsList.loading = false;
            })
    }

    loadData();
</script>

<style lang="scss">
.page-goods-group {

}
</style>
