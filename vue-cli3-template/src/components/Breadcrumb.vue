<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import pathToRegexp from 'path-to-regexp'

    export default {
        name: 'Breadcrumb',
        data() {
            return {
                levelList: null
            }
        },
        watch: {
            $route(route) {

                this.getBreadcrumb()
            }
        },
        created() {
            this.getBreadcrumb()
        },
        methods: {
            getBreadcrumb() {
                // only show routes with meta.title
                let matched = this.$route.matched.filter(item => item.meta && item.meta.title)


                this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
            },
            pathCompile(path) {
                // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
                const {params} = this.$route
                var toPath = pathToRegexp.compile(path)
                return toPath(params)
            },
            handleLink(item) {
                return;//暂时不需要
                const {redirect, path} = item;
                if (redirect) {
                    this.$router.push(redirect)
                    return
                }
                this.$router.push(this.pathCompile(path))
            }
        }
    }
</script>

<style lang="less" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;

        .no-redirect {

        }

        .el-breadcrumb__item{
            a, span{
                color: #B8C1CC !important;
                cursor: text;
            }
        }

        .el-breadcrumb__item:last-child {

            a, span{
                color: #4691F6 !important;
            }
        }
    }
</style>
