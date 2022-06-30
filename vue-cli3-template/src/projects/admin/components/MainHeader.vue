<template>
    <el-header style="height: 100px;">
        <div class="nav-list">

            <el-button @click="out" type="text" style="color: #f56c6c;">&nbsp;&nbsp;退出登录&nbsp;&nbsp;</el-button>
        </div>
    </el-header>
</template>
<script>

    export default {
        name: 'main-header',
        data() {
            return {}
        },
        mounted() {

        },
        methods: {
            out() {
                this.$confirm('确认退出登录吗?', '提示')
                    .then(_ => {
                        sessionStorage.clear();
                        this.$t.cookie(this.$g.KEY, '');
                        location.reload();
                    })
            }
        }
    }
</script>
<style lang="less">
    .el-header {
        border-bottom: 1px solid #ddd;
        position: absolute;
        height: 100px;
        top: 0;
        left: 0;
        width: 100%;
        color: #fff;
        font-weight: bold;
        background-size: auto 100%;
    }

    .nav-list {
        position: absolute;
        right: 20px;
        bottom: 10px;
    }

</style>
