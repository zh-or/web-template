<template>
    <div class="admin-main-wrap">
        <div class="admin-menu">
            <slot name="main-menu">
                <div class="def-menu">
                    <div class="logo">logo</div>
                    <div class="menu-wrap">
                        <AdminMenu :menu="props.menu"
                                   :indexPath="props.indexPath"/>
                    </div>
                </div>
            </slot>
        </div>
        <div class="admin-page-wrap">
            <div class="admin-header">
                <slot name="main-header"></slot>
            </div>
            <div class="admin-content">
                <slot name="main-page"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
    import AdminMenu from './AdminMenu';
    import {ref, reactive} from 'vue';

    let props = defineProps({
        menu: {
            type: Array,
            default: () => []
        },
        indexPath: {
            type: String,
            default: '/index'
        }
    });

</script>

<style lang="less">
    .admin-main-wrap {
        display: flex;
        height: 100%;
        background: #f2f2f2;
        overflow: hidden;

        .admin-menu {
            width: 200px;
            flex-shrink: 0;
            background-color: @colorBase;

            .def-menu {
                display: flex;
                flex-direction: column;


                .logo {
                    height: 50px;
                    text-align: center;
                    color: #fff;
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .menu-wrap {
                    flex-grow: 1;
                    overflow-y: auto;

                    @titleColor: #fff;

                    .el-menu {
                        background-color: transparent;
                        color: @titleColor;
                        border-right: 0;
                        font-weight: bold;
                    }

                    .el-submenu__title i {
                        color: @titleColor;
                    }

                    .el-menu-item, .el-submenu__title{
                        color: @titleColor;

                        &:hover, &:focus {
                            background-color: rgba(255, 255, 255, .2);
                        }

                        &.is-active {
                            background-color: @colorBaseCp2;
                        }
                    }
                }

            }

        }

        .admin-page-wrap {
            flex-grow: 1;
            display: flex;
            flex-direction: column;

            .admin-header {
                flex-shrink: 0;
                height: 50px;
                background-color: #fff;
                box-shadow: 0px 3px 18px 0px rgba(182, 182, 182, .44);
            }

            .admin-content {
                flex-grow: 1;
                overflow-y: auto;
            }
        }

    }
</style>
