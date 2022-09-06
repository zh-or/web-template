<template>
    <el-dialog v-model="show" title="选择商品" width="800px">
        <div class="page-search">
            <el-form :model="data.search"
                     ref="queryRef" :inline="true"
                     label-width="68px">
                <el-form-item label="商品名称" >
                    <el-input
                            v-model="data.search.name"
                            placeholder="请输入商品名称"
                            clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="Search" >查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="dialog-list">
            <el-table v-loading="loading" :data="list"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="商品名称" align="center" prop="noticeId" />
                <el-table-column label="商品类型" align="center" prop="noticeId" />
                <el-table-column label="销售价格" align="center" prop="noticeId" />
                <el-table-column label="所属分类" align="center" prop="createBy" />
                <el-table-column label="商品状态" align="center" prop="createBy" />

            </el-table>

            <pagination
                    v-show="data.total > 0"
                    :total="data.total"
                    v-model:page="data.search.pageNum"
                    v-model:limit="data.search.pageSize"
                    @pagination="loadData"
            />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirmSelectFun">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>

    const emit = defineEmits();
    const props = defineProps({
        visible: Boolean,
    });

    const show = ref(false);
    const list = ref([]);
    const loading = ref(false);
    const data = reactive({
        search: {
            name: '',
            pageSize: 20,
            pageNum: 1,
        },
        total: 0,
    })

    show.value = !!props.visible.value;
    watch(show, _ => {
        emit('update:visible', _);
    })
    watch(() => props.visible, _ => {
        show.value = _;
    })

    function confirmSelectFun() {
        console.log('confirm select');
        show.value = false;
    }

    function handleSelectionChange() {

    }

    function loadData() {

    }
</script>

<style lang="scss">

</style>
