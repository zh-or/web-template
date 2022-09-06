<template>
    <div class="page page-pay-info">
        <div class="info">
            <label>当前使用商户号: 123456</label>
            <el-button type="primary">收款码下载</el-button>
        </div>
        <el-table v-loading="loading" :data="list">
            <el-table-column label="商户号" align="center" prop="groupName" />
            <el-table-column label="商户类型" align="center" prop="iorder" />
            <el-table-column label="结算账户名" align="center" prop="goodsCount" ></el-table-column>
            <el-table-column label="结算账户帐号" align="center" prop="createTime"></el-table-column>
            <el-table-column label="开户银行" align="center" prop="createBy" />
            <el-table-column label="开户支行" align="center" prop="createBy" />
            <el-table-column label="预留手机号" align="center" prop="createBy" />

            <el-table-column label="操作" align="center"
                             width="350"
                             class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                            v-if="row.status === 0"
                            type="text"
                            icon="Action"
                            v-hasPermi="['system:notice:edit']"
                    >资质信息</el-button>
                    <el-button
                            v-if="row.status === 1"
                            type="text"
                            icon="Action"
                            v-hasPermi="['system:notice:edit']"
                    >账户信息</el-button>
                    <el-button
                            type="text"
                            icon="Edit"
                            v-hasPermi="['system:notice:edit']"
                    >立即使用</el-button>

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

<script setup name="page-pay">
    import {getRule} from "@/utils/utils";

    import {
        queryGoods
    } from '@/api/goods';

    const {proxy} = getCurrentInstance();
    const router = useRouter();
    const list = ref([]);
    const loading = ref(false);
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


</script>

<style lang="scss">
    .page-pay-info {
        .info {
            color: #333;
            padding: 10px 0;

            label {
                margin-right: 20px;
            }
        }
    }
</style>
