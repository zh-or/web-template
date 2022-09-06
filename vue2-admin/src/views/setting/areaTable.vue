<template>
    <div class="page page-area-table" >
        <el-tabs type="card">
            <el-tab-pane label="区域管理">
                <div class="page-search">
                    <el-form :model="area.query"
                             ref="queryRef" :inline="true"
                             label-width="68px">
                        <el-form-item label="区域名称">
                            <el-input
                                    v-model="area.query.searchValue"
                                    placeholder="区域名称"
                                    clearable
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="Search" @click="queryAreaListFun">查询</el-button>
                            <el-button type="primary" icon="Plus" @click="editAreaFun(null)">添加区域</el-button>

                        </el-form-item>
                    </el-form>
                </div>
                <el-table v-loading="area.loading" :data="area.list" >
                    <el-table-column label="序号" align="center" width="200" prop="shopRegionId"/>
                    <el-table-column label="区域名称" align="center" prop="shopRegionName"/>
                    <el-table-column label="桌台数量" align="center" prop="countTable">
                        <template #default="{row}">
                            <span>{{row.countTable}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="区域排序" align="center" prop="iorder"/>

                    <el-table-column label="操作" align="center" >
                        <template #default="{row}">
                            <el-button
                                    type="text"
                                    icon="Edit"
                                    @click="editAreaFun(row)"
                            >编辑</el-button>
                            <el-button
                                    type="text"
                                    icon="Delete"
                                    @click="deleteAreaFun(row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <pagination
                        v-show="area.total > 0"
                        :total="area.total"
                        v-model:page="area.query.pageNum"
                        v-model:limit="area.query.pageSize"
                        @pagination="loadAreaData"
                />
            </el-tab-pane>

            <el-tab-pane label="桌台管理">
                <div class="page-search">
                    <el-form :model="table.query"
                             ref="queryRef" :inline="true"
                             label-width="68px">
                        <el-form-item label="桌台名称">
                            <el-input
                                    v-model="table.query.searchValue"
                                    placeholder="桌台名称"
                                    clearable
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="Search" @click="queryTableListFun">查询</el-button>
                            <el-button type="primary" icon="Plus" @click="editTableFun(null)">添加桌台</el-button>

                        </el-form-item>
                    </el-form>
                </div>
                <el-table v-loading="table.loading" :data="table.list" >
                    <el-table-column label="序号" align="center" width="200" prop="shopTableId"/>
                    <el-table-column label="桌台名称" align="center" prop="shopTableName"/>
                    <el-table-column label="所属区域" align="center" prop="shopRegionName"/>
                    <el-table-column label="标准用餐人数" align="center" prop="personNumber"/>

                    <el-table-column label="操作" align="center" width="250">
                        <template #default="{row}">
                            <!--<a :href="row.qrImg" :download="row.shopTableName + '.png'" target="_blank" class="link btn">
                                <svg-icon icon-class="download" />
                                点餐码下载</a>-->
                            <el-button type="text" icon="Download" @click="downloadQr(row.qrImg, row.shopTableName + '.png')">点餐码下载</el-button>

                            <el-button
                                    type="text"
                                    icon="Edit"
                                    @click="editTableFun(row)"
                            >编辑</el-button>
                            <el-button
                                    type="text"
                                    icon="Delete"
                                    @click="deleteTableFun(row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <pagination
                        v-show="table.total > 0"
                        :total="table.total"
                        v-model:page="table.query.pageNum"
                        v-model:limit="table.query.pageSize"
                        @pagination="loadTableData"
                />

            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="area.showDialog" v-loading="area.save" :title="!area.editObj ? '新建区域' : '编辑区域'" width="600px">
            <el-form :model="area.form"
                     :rules="area.rules"
                     ref="areaFormRef"
                     label-width="120px"
                     class="dialog-form">

                <el-form-item label="区域名称:" prop="regionName">
                    <el-input v-model="area.form.regionName" maxlength="100" :show-word-limit="true" placeholder="请输入区域名称"/>
                </el-form-item>
                <el-form-item label="排序值:" prop="iorder">
                    <el-input v-model="area.form.iorder" type="number" placeholder="请输入排序值"/>
                </el-form-item>


            </el-form>
            <template #footer>
                <div class="dialog-footer" >
                    <el-button type="primary" @click="confirmAreaEditFun">确 定</el-button>
                    <el-button @click="area.showDialog = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog :visible.sync="table.showDialog" v-loading="table.save" :title="!table.editObj ? '新建桌台' : '编辑桌台'" width="600px">
            <el-form :model="table.form"
                     :rules="table.rules"
                     ref="tableFormRef"
                     label-width="120px"
                     class="dialog-form">

                <el-form-item label="桌台名称:" prop="tableName">
                    <el-input v-model="table.form.tableName" maxlength="100" :show-word-limit="true" placeholder="请输入桌台名称"/>
                </el-form-item>
                <el-form-item label="所属区域:" prop="iorder">
                    <el-select v-model="table.form.regionId" placeholder="请选择">
                        <el-option v-for="(item, i) in allArea.data"
                                   :value="item.shopRegionId"
                                   :label="item.shopRegionName"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="桌台排序:" prop="iorder">
                    <el-input v-model="table.form.iorder" type="number" placeholder="请输入排序值"/>
                </el-form-item>

                <el-form-item label="用餐人数:" prop="iorder">
                    <el-input v-model="table.form.personNum" type="number" placeholder="请输入用餐人数"/>
                </el-form-item>


            </el-form>
            <template #footer>
                <div class="dialog-footer" >
                    <el-button type="primary" @click="confirmTableEditFun">确 定</el-button>
                    <el-button @click="table.showDialog = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="area-table">
    import {getRule} from "@/utils/utils";

    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';


    const areaFormRef = ref(null);
    const tableFormRef = ref(null);

    const area = reactive({
        query: {
            regionName: '',
            pageSize: 10,
            pageNum: 1,
        },
        list: [],
        total: 0,
        loading: false,
        showDialog: false,
        editObj: null,
        save: false,
        form: {
            regionName: '',
            iorder: 0,
            regionId: '',
        },
        rules: {
            regionName: getRule('请输入区域名称'),
            iorder: getRule('请输入排序'),
        }
    });

    const table = reactive({
        query: {
            regionName: '',
            pageSize: 10,
            pageNum: 1,
        },
        list: [],
        total: 0,
        loading: false,
        showDialog: false,
        editObj: null,
        save: false,
        form: {
            tableName: '',
            iorder: '',
            personNum: '',
            regionId: '',
            tableId: '',
        },
        rules: {
            tableName: getRule('请输入区域名称'),
            iorder: getRule('请输入排序'),
            personNum: getRule('请输入用餐人数'),
            regionId: getRule('请输选择区域'),
        }
    });

    const allArea = reactive({
        loading: false,
        data: [],
    })

    function loadAllArea() {
        allArea.loading = true;
        $api.queryAreaList({})
            .then(res => {
                allArea.data = res.rows;
                allArea.loading = false;
            })
            .catch(e => {
                console.error(e);
                allArea.loading = false;
            })
    }

    function queryAreaListFun() {
        area.query.pageNum = 1;
        loadAreaData();
    }

    function loadAreaData() {
        if(area.loading) {
            return;
        }
        area.loading = true;
        $api.queryAreaList(area.query)
            .then(res => {
                area.list = res.rows;
                area.total = res.total;
                area.loading = false;
            })
            .catch(e => {
                console.error(e);
                //proxy.$modal.error('网络错误~');
                area.loading = false;
            });
        loadAllArea();
    }

    function editAreaFun(obj) {
        area.editObj = obj;
        if(obj) {
            area.form.regionName = obj.shopRegionName;
            area.form.iorder = obj.iorder;
            area.form.regionId = obj.shopRegionId;
        } else {
            area.form.regionName = '';
            area.form.iorder = '';
            area.form.regionId = '';
        }
        area.showDialog = true;
    }

    function deleteAreaFun(item) {
        $modal.confirm('确定删除区域吗?')
            .then(_ => {
                $api.deleteArea({id: item.shopRegionId})
                    .then(res => {
                        $modal.success('删除区域成功!');
                        loadAreaData();
                    })
                    .catch(e => {
                        console.error(e);
                        //proxy.$modal.warning('网络错误~');
                    })

            })
    }

    function confirmAreaEditFun() {

        areaFormRef.value.validate(v => {
            if(v) {
                area.save = true;
                let r;
                if(area.editObj) {
                    r = $api.editArea(area.form);
                } else {
                    r = $api.addArea(area.form);
                }
                r.then(res => {
                    if(res.code == 200) {
                        $modal.success('操作成功~');
                        loadAreaData();
                        area.save = false;
                        area.showDialog = false;
                    }
                })
                    .catch(e => {
                        console.error(e);
                        area.save = false;
                        //proxy.$modal.warning('网络错误~');
                    })

            }
        })
    }

    function queryTableListFun() {

        table.query.pageNum = 1;
        loadTableData();
    }

    function loadTableData() {
        if(table.loading) {
            return;
        }
        table.loading = true;
        $api.queryTableList(table.query)
            .then(res => {
                table.list = res.rows.map( _ => {
                    _.qrImg = getImgUrl('file', _.tableQrcode);
                    return _;
                });
                table.total = res.total;
                table.loading = false;
            })
            .catch(e => {
                console.error(e);
                //proxy.$modal.error('网络错误~');
                table.loading = false;
            })
    }

    function editTableFun(obj) {
        table.editObj = obj;
        if(obj) {
            table.form.tableName = obj.shopTableName;
            table.form.iorder = obj.iorder;
            table.form.personNum = obj.personNumber;
            table.form.regionId = obj.shopRegionId;
            table.form.tableId = obj.shopTableId;
        } else {
            table.form.tableName = '';
            table.form.iorder = '';
            table.form.personNum = '';
            table.form.regionId = '';
            table.form.tableId = '';
        }
        table.showDialog = true;
    }

    function deleteTableFun(item) {
        $modal.confirm('确定删除桌台吗?')
            .then(_ => {
                $api.deleteTable({id: item.shopTableId})
                    .then(res => {
                        $modal.success('删除桌台成功!');
                        loadTableData();
                    })
                    .catch(e => {
                        console.error(e);
                        //proxy.$modal.warning('网络错误~');
                    })

            })
    }


    function confirmTableEditFun() {

        tableFormRef.value.validate(v => {
            if(v) {
                table.save = true;
                let r;
                let formData = new FormData();
                Object.keys(table.form).forEach(k => {
                    formData.append(k, table.form[k]);
                })
                if(table.editObj) {
                    r = $api.editTable(formData);
                } else {
                    r = $api.addTable(formData);
                }
                r.then(res => {
                    if(res.code == 200) {
                        $modal.success('操作成功~');
                        loadTableData();
                        table.showDialog = false;
                        table.save = false;
                    }
                })
                    .catch(e => {
                        console.error(e);
                        //proxy.$modal.warning('网络错误~');
                        table.save = false;
                    })

            }
        })
    }


    function downloadQr(url, name) {
        downloadXhr(url, {} , name)
    }

    queryAreaListFun();
    queryTableListFun();
</script>

<style lang="scss">
    .page-area-table {

        .link {
            color: #409eff;
            margin-right: 10px;
        }
    }
</style>
