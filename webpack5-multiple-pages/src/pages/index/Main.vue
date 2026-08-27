<template>
<div class="main flex f-h-lr" >
    <div class="menu-wrap f-s0 f-v">
        <div class="menu-logo flex f-v-center f-h-center f-s0">
            <img :src="require('@base/assets/img/logo.png')"/>
            <span class="ml10" v-if="delayShowMenu">xxx</span>
        </div>
        <MenuView class="f-grow" />
    </div>
    <div class="page-wrap f-grow f-v">
        <div class="header">
            <div class="header-content  flex f-h-lr f-v-center pl10">
                <span v-if="!menuStore.isCollapse"
                      @click="menuStore.toggleCollapse(true)"
                      class="icon icon-collapse hand"></span>
                <span v-else
                      @click="menuStore.toggleCollapse(false)"
                      class="icon icon-expand hand"></span>

                <el-breadcrumb separator="/" class="breadcrumb ml20">
                    <el-breadcrumb-item v-for="r in breadcrumbs">{{r.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <Loading class="ml10 mr10" v-if="user.isApiLoading"></Loading>

                <div class="f-grow pr10 flex f-v-center f-h-end">
                    <el-dropdown trigger="click" @command="handleUserCommand">
                        <div class="flex hand f-v-center">
                            <span class="avatar">{{menuStore.firstName}}</span>
                            <span class="user-info">
                              {{menuStore.userInfo.userNickname}}<span class="icon icon-down ml10"></span>
                            </span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="resetpwd">修改密码</el-dropdown-item>
                                <el-dropdown-item command="quit">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="header-nav flex " >
                <div class="nav-scroll-btn hand" @click="handScroll(-150)">
                    <span class="icon icon-left"></span>
                </div>
                <div class="nav-list f-grow" ref="navWrap">
                    <el-dropdown
                            v-for="item in navs"
                            trigger="contextmenu"
                            @command="handleNavCommand">
                        <div class="nav-item "
                             :n="item.name"
                             :class="{active: currentPath === item.path}">
                            <span class="name hand" @click="router.push(item.path)">{{item.title}}</span>
                            <span class="icon icon-refresh hand" @click="refreshPage(item.name)"></span>
                            <span class="icon icon-close hand" @click="handleNavCommand(`c,${item.name}`)"></span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="'f,' + item.name">刷新</el-dropdown-item>
                                <el-dropdown-item :command="'c,' + item.name">关闭</el-dropdown-item>
                                <el-dropdown-item :command="'l,' + item.name">关闭左边</el-dropdown-item>
                                <el-dropdown-item :command="'r,' + item.name" >关闭右边</el-dropdown-item>
                                <el-dropdown-item :command="'o,' + item.name" >关闭其他</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                </div>
                <div class="nav-scroll-btn hand" @click="handScroll(150)">
                    <span class="icon icon-right"></span>
                </div>
            </div>
        </div>
        <div class="page-wrap-content f-grow">
            <router-view v-slot="{ Component, route }">
                <keep-alive :include="menuStore.keepAliveIncludes">
                    <template v-if="route.fullPath !== refreshPagePath">
                        <component :is="Component"
                                   :key="route.fullPath"
                                   ref="mainComponent"/>
                    </template>
                </keep-alive>
            </router-view>
        </div>
    </div>

</div>
<el-dialog title="修改密码"
           width="400px"
           center
           :close-on-press-escape="false"
           :close-on-click-modal="false"
           v-model="resetPwdData.dlg.show">
    <el-form class="form full-input"
             :model="resetPwdData.dlg.form"
             :rules="resetPwdData.dlg.rules"
             ref="resetDlgForm"
             :disabled="resetPwdData.dlg.loading"
             label-width="auto">

        <el-form-item label="旧密码" prop="userPwd">
            <el-input v-model="resetPwdData.dlg.form.userPwd" placeholder="请输入旧密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="userNewPwd" >
            <el-input v-model="resetPwdData.dlg.form.userNewPwd" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="重复新密码" prop="userPwdConfirm" >
            <el-input v-model="resetPwdData.dlg.form.userPwdConfirm" placeholder="重复输入新密码"/>
        </el-form-item>

    </el-form>
    <template #footer>
        <el-button type="primary"
                   v-loading="resetPwdData.dlg.loading"
                   @click="submitResetDlgForm()">保存</el-button>
        <el-button :disabled="resetPwdData.dlg.loading"
                   @click="resetPwdData.dlg.show = false">取消</el-button>
    </template>
</el-dialog>

</template>
<script setup>

/*
* https://router.vuejs.org/zh/guide/advanced/router-view-slot.html
* https://cn.vuejs.org/guide/built-ins/keep-alive
*
*
* */

import MenuView from './components/MenuView.vue';
import Loading from '@base/components/widget/Loading.vue';
import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import mapi from '@index/api/api.js';

import {getHost, getImgUrl} from '@base/api/host.js';
import {getRule} from "@base/components/rules.js";
import {waitLogin, userStore } from "@base/lib/store.js";
import useMenuStore from './menuStore.js';
import md5 from "@zh-or/lib/md5.js";

import {
    reactive, ref, useTemplateRef, toRaw,
    onMounted, onUnmounted, watch, computed, watchEffect
} from 'vue';
import router from './router.js';
let route = router.route();

defineOptions({name: 'Main'});

let user = userStore();
let menuStore = useMenuStore();


let navs = computed(() => {
    return menuStore.cacheViews;
});

let currentPath = computed(() => {
    return route.fullPath;
});

function handleNavCommand(cmd) {
    let c = cmd.split(',');
    let b = false;
    let len = menuStore.cacheViews.length;
    if(c[0] !== 'f' && len < 2) {
        msg.info('再关就没有了!');
        return ;
    }
    switch(c[0]) {
        case 'f': refreshPage(c[1]); return;
        case 'c':
            let obj = menuStore.cacheViews.find(_ => _.name === c[1])
            menuStore.removeCache(obj);
            break;
        case 'l':
            for(let i = len - 1; i >= 0; i--) {
                let obj = menuStore.cacheViews[i];
                if(obj.name === c[1]) {
                    b = true;
                    continue;
                }
                b && menuStore.removeCache(obj);
            }

            break;
        case 'r':
            for(let i = len - 1; i >= 0; i--) {
                let obj = menuStore.cacheViews[i];
                if(obj.name === c[1]) {
                    break;
                }
                menuStore.removeCache(obj);
            }

            break;
        case 'o':
            for(let i = len - 1; i >= 0; i--) {
                let obj = menuStore.cacheViews[i];
                if(obj.name !== c[1]) {
                    menuStore.removeCache(obj);
                }
            }
            break;
    }
    if(!menuStore.cacheViews.some(_ => _.path === currentPath.value)) {
        setTimeout(() => {
            if(len <= 0) {
                router.replace('/');
            } else {
                router.replace(menuStore.cacheViews[0].path);
            }
        }, 10);
    }
}

let refreshPagePath = ref('');

function refreshPage(name) {
    let item = menuStore.cacheViews.find(_ => _.name === name);
    if(item) {
        item.name = '_' + item.name;
        refreshPagePath.value = item.path;
        setTimeout(() => {
            refreshPagePath.value = '';

            item.name = item.name.substring(1);
        }, 10);
    }
}

let navWrap = useTemplateRef('navWrap');
router.router.beforeEach((to, from) => {
    setTimeout(() => {
        if(to.meta && navWrap.value) {
            let dom = navWrap.value.querySelector(`div[n="${to.meta.name}"]`)
            dom && dom.scrollIntoView();
        }
    }, 10);
});

function handScroll(v) {
    navWrap.value.scrollLeft += v;
}


waitLogin(() => {

});

let breadcrumbs = computed(() => {
    let arr = [{
        name: 'xx管理系统'
    }];
    route.matched.forEach(item => {
        if(item.meta && item.meta.title) {
            arr.push({
                name: typeof item.meta.title === 'function' ? item.meta.title(route.query) : item.meta.title,
            })
        }
    });
    return arr;
});

let delayShowMenu = ref(true);
let delayTimer;
watch(() => menuStore.isCollapse, () => {
    clearTimeout(delayTimer);
    if(menuStore.isCollapse) {
        delayShowMenu.value = false;
    } else {
        delayTimer = setTimeout(() => {
            delayShowMenu.value = true;
        }, 200)
    }
});

function handleUserCommand(cmd) {
    if(cmd === 'quit') {
        msg.confirm('确定退出当前登录的账号吗?', '退出登录')
        .then(() => {
            user.outLogin();
        })
        .catch(() => {})
    } else if(cmd === 'resetpwd') {

        t.clearObject(resetPwdData.dlg.form);
        resetPwdData.dlg.show = true;
    }
}

let resetDlgForm = useTemplateRef('resetDlgForm');
let resetPwdData = reactive({
    dlg: {
        show: false,
        loading: false,
        form: {
            "userPwd": "",
            "userNewPwd": "",
            "userPwdConfirm": ""
        },
        rules: {
            userPwd: getRule('请输入旧密码'),
            userNewPwd: getRule('请输入新密码'),
            userPwdConfirm: [
                { validator: (rule, value, callback) => {
                        if(resetPwdData.dlg.form.userNewPwd !== value) {
                            callback(new Error('两次新密码不一致'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur', required: true,
                }
            ],
        }
    }
})
function submitResetDlgForm() {
    resetDlgForm.value.validate((v) => {
        if(v) {
            resetPwdData.dlg.loading = true;
            mapi.userResetSelfPwd({
                "userPwd": md5(resetPwdData.dlg.form.userPwd),
                "userNewPwd": md5(resetPwdData.dlg.form.userNewPwd),
                "userPwdConfirm": md5(resetPwdData.dlg.form.userPwdConfirm)
            })
            .then(res => {
                if(res.code === 200) {
                    msg.success('重置密码成功!');
                    resetPwdData.dlg.show = false;
                }
                resetPwdData.dlg.loading = false;
            })
            .catch(e => {
                console.error('用户重置密码失败:', e);
                msg.error('重置密码出错!');
                resetPwdData.dlg.loading = false;
            })
        }
    })
}

if(!user.isLogin) {
    e.emit(u.e.NEEDLOGIN);
}


</script>
<style lang="less">
.main {
    height: 100%;

    .menu-wrap {
        //width: 180px;
        position: relative;
        z-index: 2;
        border-right: 1px solid @colorTxt5;
        box-shadow: 0px -3px 20px 0px #0000001a;
        z-index: 2;

        .menu-logo {
            background-color: #fff;
            height: @headerHeight;
            line-height: @headerHeight;
            border-bottom: 1px solid @colorTxt5;
            color: @colorBase;
            font-weight: bold;

            img {
                height: 2em;
            }
        }

    }


    .page-wrap {
        overflow: hidden;

        .header {
            background-color: #fff;
            box-shadow: 0px -3px 20px 0px #0000001a;
            z-index: 2;

            .header-content {
                height: @headerHeight;
                line-height: @headerHeight;
                border-bottom: 1px solid @colorTxt5;

                .avatar {
                    background-color: @colorBase;
                    color: #fff;
                    height: 35px;
                    width: 35px;
                    border-radius: 50%;
                    margin-right: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: 16px;
                }

                .user-info {
                    color: @colorTxt1;
                }
            }

            .icon-expand, .icon-collapse {
                font-size: 20px;
                color: @colorTxt1;
            }

            .breadcrumb {
                display: inline-block;
            }

            .header-nav {
                padding: 5px;

                .nav-list {
                    padding: 0 .3em;
                    display: flex;
                    align-items: center;
                    overflow-x: hidden;

                    .el-dropdown {
                        flex-shrink: 0;
                    }

                    .nav-item {
                        margin-right: 0.5em;
                        border: 1px solid @colorTxt4;
                        padding: 0 .3em 0 .5em;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;

                        &.active {
                            background: @colorBase;
                            color: #fff;
                            border-color: transparent;
                        }

                        .name {
                            min-width: 2.5em;
                            margin-right: .4em;
                            font-size: 12px;
                            padding: 2px 0;
                        }

                        .icon {
                            transition: background-color .2s;
                            border-radius: 50%;
                            width: 1.2em;
                            height: 1.2em;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            &:hover {
                                color: #fff;
                                background-color: @colorBaseL10;
                            }

                            &:active {
                                background-color: @colorBaseH10;
                            }
                        }
                    }
                }

                .nav-scroll-btn {
                    border: 1px solid @colorTxt5;
                    padding: 0 .3em;
                    border-radius: 4px;
                    transition: background-color .2s;

                    &:hover {
                        color: #fff;
                        background-color: @colorBaseL10;
                    }

                    &:active {
                        background-color: @colorBaseH10;
                    }
                }
            }
        }


        .page-wrap-content {
            background-color: @colorTxt5;
            overflow: auto;
        }
    }

}
</style>
