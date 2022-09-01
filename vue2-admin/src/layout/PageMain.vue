<template>
    <div class="main">
        <div class="menu-bar" :class="{'uncollapse': !$store.getters.isCollapse}">
            <div class="logo-view txt-ellipsis" @click="$router.push('/index')">
                <img v-if="$store.getters.isCollapse" src="@/assets/img/logo-menu.png" style="height: 60px"/>
                <img v-else src="@/assets/img/logo-menu2.png" style="height: 32px;"/>
            </div>
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <MenuView/>
            </el-scrollbar>
        </div>
        <div class="main-wrap">
            <div class="nav-bar">
                <div class="left">
                    <svg @click="toggleSideBar"
                         :class="{'is-active':$store.getters.isCollapse}"
                         class="hamburger"
                         viewBox="0 0 1024 1024"
                         xmlns="http://www.w3.org/2000/svg"
                         width="64"
                         height="64"
                    >
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"/>
                    </svg>
                    <!--<div class="paths">
                        <span @click="$router.push('/')">首页</span>
                        <template v-for="(item, i) in paths">
                            <span class="diff">/</span>
                            <span>{{item}}</span>
                        </template>
                    </div>-->

                    <div class="system-name">
                        <span>你好,</span>
                        <span class="name">商户XXXXX，</span>
                        <span>欢迎使用雪碳商家管理平台！</span>
                    </div>
                </div>
            </div>
            <tags-view />
            <div class="main-page-wrap">
                <transition name="fade">
                    <router-view/>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
    import MenuView from './components/MenuView';
    import Hamburger from './components/Hamburger';
    import TagsView from './components/TagsView';

    import $store from '@/store';
    import $router from '@/router';

    const $route = $router.app.$route;
    const paths = ref([]);

    $store.dispatch('getInfo');

    function toggleSideBar() {
        $store.dispatch('setMenuCollapse', !$store.getters.isCollapse);
    }

    function getPaths() {
        let matched = $route.matched.filter(item => item.meta && item.meta.title);
        matched = matched.filter(item => item.breadcrumb !== false);

        paths.value = matched.map(_ => _.meta.title);
    }

    $router.beforeEach((to, from, next) => {

        next();
    });

    getPaths();
</script>

<style lang="scss">
    @import "~@/assets/css/var.scss";

    .main {
        display: flex;
        height: 100%;

        .menu-bar {
            z-index: 2;
            flex-shrink: 0;
            -webkit-transition: width .28s;
            transition: width 0.28s;
            height: 100%;
            color: $base-menu-color;
            width: $menu-collapse-width;
            box-shadow: $base-menu-box-shadow;
            background: $base-menu-background url("~@/assets/img/menu-bg.png") no-repeat left bottom;
            background-size: 50% auto;

            .el-submenu__title i {
                /*图标*/
                color: $base-menu-color;
            }

            .menu-title {
                display: none;
            }

            &.uncollapse {
                width: $menu-uncollapse-width;

                .menu-title {
                    display: none;
                }

                .logo-view {

                    span {
                        display: none;
                    }
                }
            }

            .el-menu {
                background-color: transparent;
                border: 0;

                .is-active {
                    //color: $active-menu-color;
                }

                .el-menu-item.is-active {
                    color: $active-menu-color;
                    background-color: $active-menu-bg;
                }
            }


            .el-menu-item:focus, .el-menu-item:hover, .el-submenu__title:hover {
                //background-color: $hover-menu-bg !important;

                color: $active-menu-color;
            }

            .el-menu-item, .el-submenu__title {
                color: $base-menu-color;
                display: flex;
                padding-right: 20px;

                .svg-icon {
                    flex-shrink: 0;
                    margin-left: 0;
                    margin-right: 16px;
                    display: inline-block;
                    vertical-align: middle;
                }

                .menu-title {
                    display: inline-block;
                    vertical-align: middle;
                }
            }


            .logo-view {
                height: $menu-logo-height;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;

                img {
                    height: 60px;
                    vertical-align: middle;
                    //margin-right: 12px;
                }

                span {
                    display: inline-block;
                    margin: 0;
                    color: #fff;
                    font-weight: 600;
                    line-height: 50px;
                    font-size: 14px;
                    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
                    vertical-align: middle;
                }
            }

            .el-scrollbar {
                height: calc(100% - $menu-logo-height);

                .el-scrollbar__bar.is-vertical {
                    right: 0px;
                }
            }

            .scrollbar-wrapper {
                overflow-x: hidden;
            }
        }

        .main-wrap {
            height: 100%;
            flex-grow: 1;
            display: flex;
            flex-direction: column;

            .nav-bar {
                font-size: 18px;
                background: #EFFEFF;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 1px 4px rgb(0, 21, 41, .08);
                flex-shrink: 0;

                .left {
                    display: flex;
                    align-items: center;

                    .hamburger {
                        display: inline-block;
                        vertical-align: middle;
                        width: 20px;
                        height: 20px;
                        margin: 0  15px;
                        cursor: pointer;
                        transition: background 0.3s;
                        -webkit-tap-highlight-color: transparent;

                        &:hover {
                            background: rgba(0, 0, 0, 0.025);
                        }

                        &.is-active {
                            transform: rotate(180deg);
                        }
                    }



                }

                .paths {
                    font-size: 14px;
                    color: #97a8be;
                    margin-left: 10px;

                    span:nth-child(1) {
                        cursor: pointer;
                        color: #303133;
                    }

                    .diff {
                        margin: 0 9px;
                        color: #a8abb2;
                    }
                }

                .system-name {
                    color: #181D23;
                    font-size: 18px;
                    font-weight: 400;
                    .name {
                        color: #EE5E37;
                    }
                }
            }


            .tags-view-wrap {
                flex-shrink: 0;
            }

            .main-page-wrap {
                flex-grow: 1;
                overflow-y: auto;
            }
        }
    }
</style>
