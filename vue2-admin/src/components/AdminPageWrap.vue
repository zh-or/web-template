<template>
    <AdminMain :menu="routes" :indexPath="indexPath">
        <template #main-header>
            <div class="admin-header-wrap">
                <div class="paths">{{paths.join(' / ')}}</div>
            </div>
        </template>
        <template #main-page>
            <router-view />
        </template>
    </AdminMain>
</template>

<script >
    import AdminMain from './AdminMain';

export default {
    name : "admin-page-wrap",
    components: {
        AdminMain
    },
    data() {
        return {
            routes: [],
            indexPath: '',

            paths: [],
        }
    },
    mounted() {
        console.log(this.$route, this.$router);
        this.routes = this.$router.options.routes;
        this.indexPath = this.$route.path;

        this.$router.afterEach(() => {
            this.getPaths();
        });
    },
    methods: {
        getPaths() {
            this.paths = this.$route.matched
                .map(_ => _.meta)
                .filter(_ => _ && _.hide !== true)
                .map(_ => _.title);
        }
    }
}
</script>

<style lang="less">
.admin-header-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .paths {
        padding-left: 20px;
        font-size: 16px;
        color: @colorTxt2;
    }
}
</style>
