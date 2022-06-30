<template>
    <div class="navbar fixed-header" :style="widthStyle">

        <hamburger id="hamburger-container"
                   :is-active="isCollapse"
                   class="hamburger-container "
                   @toggleClick="toggleSideBar"/>


        <div class="right-ctl">
            <slot name="right-view"></slot>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Hamburger from '@/components/Hamburger.vue';

    export default {
        components: {
            Hamburger,
        },
        computed: {
            isCollapse(){
                return this.$store.getters.sidebar;
            },
            widthStyle(){
                return {
                    'padding-left': this.isCollapse ? '60px !important' : '216px !important'
                }
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('toggleSideBar')
            },

        }
    }
</script>

<style lang="less" scoped>
    @h: 64px;

    .navbar {
        height: @h;
        overflow: hidden;
        position: relative;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

        &:after{
            content: " ";
            display: table;
            clear: both;
        }

        .right-ctl{
            float: right;
            height: @h;
            line-height: @h;
            padding-right: 50px;
            color: #717E8C;
            & > * {
                display: inline-block;
            }

            button{
                cursor: pointer;
            }
        }

        .hamburger-container {
            line-height: @h;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background .3s;
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background: rgba(0, 0, 0, .025)
            }
        }

        .breadcrumb-container {
            float: left;
        }

        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }

        .right-menu {
            float: right;
            height: 100%;
            line-height: 50px;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                padding: 0 8px;
                height: 100%;
                font-size: 18px;
                color: #5a5e66;
                vertical-align: text-bottom;

                &.hover-effect {
                    cursor: pointer;
                    transition: background .3s;

                    &:hover {
                        background: rgba(0, 0, 0, .025)
                    }
                }
            }

            .avatar-container {
                margin-right: 30px;

                .avatar-wrapper {
                    margin-top: 5px;
                    position: relative;

                    .user-avatar {
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }

                    .el-icon-caret-bottom {
                        cursor: pointer;
                        position: absolute;
                        right: -20px;
                        top: 25px;
                        font-size: 12px;
                    }
                }
            }
        }
    }


</style>
