<template>
    <div class="sidebar-container" :style="widthStyle">
        <router-link to="/home" class="home" >
            <font style="font-weight: bold; color: blue; font-size: 40px;">logo</font>
        </router-link>
        <el-menu
                :unique-opened="true"
                mode="vertical"
                :router="true"
                :collapse="isCollapse"
                :default-active="$route.path"
        >
            <el-submenu index="/index">
                <svg-icon name="menu-1"></svg-icon>
                <span slot="title">首页</span>
            </el-submenu>

            <el-submenu index="/test/test">
                <template slot="title">
                    <svg-icon name="menu-2"></svg-icon>
                    <span>二级路由</span>
                </template>
                <el-menu-item index="/test/test">xx</el-menu-item>
            </el-submenu>



        </el-menu>
    </div>
</template>
<script>

    export default {
        name: 'main-menu',
        components: {},
        watch: {
            '$route': (to, from) => {

            }
        },
        data() {
            return {
                loading: false,
            }
        },
        computed: {
            isCollapse() {
                return this.$store.getters.sidebar;
            },
            widthStyle() {
                return {
                    'width': this.isCollapse ? '60px !important' : '210px !important'
                }
            }
        },
        methods: {}
    }
</script>
<style lang="less">
    .el-menu {
        height: 100%;
    }

    .sidebar-container{

        .svg-icon{
            height: 1.3em;
            vertical-align: middle;
        }
    }

</style>
