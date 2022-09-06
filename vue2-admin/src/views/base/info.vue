<template>
    <div class="page page-base-info">
        <el-button type="primary" class="download-qr">
            <svg-icon name="download" className="mr10"/>
            收款码下载
        </el-button>
        <el-descriptions title="基本信息" :column="3" border class="info-wrap order-info-wrap">
            <el-descriptions-item label-align="right" label="商户类型:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="商户名称:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="联系人:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="联系电话:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="联系人职位:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="营业执照:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="法人代表:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="实际控制人:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="所属行业:">xx</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="账户信息" :column="3" border class="info-wrap order-info-wrap">
            <el-descriptions-item label-align="right" label="账户名称:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="银行账号:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="开户行名称:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="开户支行:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="支行行号:">xx</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="税务信息" :column="3" border class="info-wrap order-info-wrap">
            <el-descriptions-item label-align="right" label="纳税人类型:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="开票名称:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="纳税人识别号:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="电话:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="账号:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="开户行行号:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="发票类型:">xx</el-descriptions-item>
            <el-descriptions-item label-align="right" label="地址:">xx</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="附件信息" :column="1" border class="info-wrap order-info-wrap">
            <el-descriptions-item label-align="right" label="">xx</el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
    export default {
        name: "base-info",
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .page-base-info {
        position: relative;

        .download-qr {
            position: absolute;
            right: 20px;
        }

        :deep(.order-info-wrap ) {
            margin-bottom: 20px;

            .el-descriptions__label {
                width: 120px !important;
            }
        }
    }
</style>
