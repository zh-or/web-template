<template>
    <div class="login">

        <div style="width: 820px;height: 460px;margin: 0 auto;border-radius: 10px;
        display: flex;flex-direction: row;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);">
            <div class="left">
                <img src="@base/assets/img/logo2.png"
                     style="width: 220px;position:absolute;top:10px;left: 10px"
                     alt="">
                <div>
                    <img src="../assets/img/login1.png"
                         style="border-bottom-left-radius: 10px"
                         alt="">
                </div>

            </div>

            <div class="right">
                <div
                    style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 30px">
                    <img src="@base/assets/img/logo.png"
                         style="width: 48px;"
                         alt="">
                    <h2 style="margin-left: 14px;">管理系统</h2>
                </div>

                <div style="padding: 20px 40px">
                    <div>
                        <div style="font-size: 16px;margin-bottom: 8px;margin-left: 2px">账号</div>
                        <el-input
                            v-model="data.loginForm.usercode"
                            type="text"
                            class="table-button"
                            auto-complete="off"
                            placeholder="请输入账号"
                            size="large"
                        >
                        </el-input>
                    </div>

                    <div style="margin-top: 20px;">
                        <div style="font-size: 16px;margin-bottom: 8px;margin-left: 2px">密码</div>
                        <el-input
                            v-model="data.loginForm.password"
                            type="password"
                            auto-complete="off"
                            placeholder="请输入密码"
                            size="large"
                        >
                        </el-input>
                    </div>

                    <div style="margin-top: 20px; display: flex;flex-direction: row;align-items: center">
                        <el-input
                            style="width: 60%"
                            v-model="data.loginForm.code"
                            auto-complete="off"
                            placeholder="请输入验证码"
                            @keyup.enter.native="handleLogin"
                            size="large"
                        >
                            <template #prefix>
                                <svg viewBox="0 0 1024 1024"
                                     aria-hidden="true" class="el-input__icon input-icon svg-icon"
                                     style="height: 1.2em; width: 1.2em; ">
                                    <path d="M513.3 958.5c-142.2 0-397.9-222.1-401.6-440.5V268c1.7-39.6 31.7-72.3 71.1-77.3 49-4.6 97.1-16.5 142.7-35.3 47.8-14 91.9-38.3 129.4-71.1 30.3-24.4 72.9-26.3 105.3-4.6 39.9 30.7 83.8 55.9 130.5 74.6 48.6 14.7 98.2 25.9 148.4 33.7 38.5 7.6 67.1 40.3 69.5 79.5 3.3 84.9 2.5 169.9-2.6 254.7-33.7 281.6-253.7 436.4-392.7 436.3z m-0.1-813.7c-7.2-0.2-14.3 2-20 6.4-39.7 35.2-86.8 61.1-137.7 75.7-46.8 19.2-96.2 31-146.6 35.2-11 3.2-18.8 13-19.5 24.4v230.1c3.5 180.3 223.3 361 323.9 361s287.3-120.2 317.6-360.5c7.3-142.7 0-228.6 0-229.6-1.3-13.3-11-24.3-24-27.3-49.6-7.7-98.6-19-146.5-33.7-46.3-19.5-89.7-45.3-129-76.7-5.8-3.8-12.7-5.5-19.5-4.9l1.3-0.1z" fill="#C6CCDA" p-id="1940"></path><path d="M750.1 428L490.7 673.2c-11.7 11.1-29.5 12.9-43.1 4.2l-6.8-5.8-141.2-149.4c-9.3-9.3-12.7-22.9-9-35.5 3.8-12.6 14.1-22.1 27-24.8 12.9-2.7 26.1 1.9 34.6 11.9L469 597.5l233.7-221c14.6-12.8 36.8-11.6 49.9 2.7 13.2 14.2 11.5 35.3-2.5 48.8" fill="#C6CCDA" p-id="1941"></path>
                                </svg>
                            </template>
                        </el-input>
                        <img
                            v-if="data.codeUrl"
                            :src="data.codeUrl"
                            @click="refreshCaptcha" class="login-code-img"/>
                    </div>


                    <div style="margin-top: 20px;">
                        <el-checkbox v-model="data.loginForm.rememberMe"
                                     size="large"
                                     style="margin:0 0 25px 2px;">记住密码</el-checkbox>
                    </div>

                    <div>
                        <el-button
                            :loading="data.loading"
                            size="large"
                            type="primary"
                            style="width:100%;"
                            @click.native.prevent="handleLogin"
                        >
                            <span >{{data.loading ? '登 录 中...' : '登 录'}}</span>
                        </el-button>

                    </div>

                </div>


            </div>


        </div>


        <div class="el-login-footer">
            <span>Copyright © 2026 xxx All Rights Reserved.</span>
        </div>
    </div>
</template>

<script setup>

import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import mapi from '@index/api/api.js';
import {getHost} from "@base/api/host.js";

import {
    reactive, ref, useTemplateRef, toRaw,
    onMounted, onUnmounted, watch, computed, watchEffect
} from 'vue';

import {waitLogin, userStore } from "@base/lib/store.js";
import router from '../router.js';
let route = router.route();
let user = userStore();

defineOptions({name: 'login'});

let data = reactive({
    codeUrl: null,
    systemCode: "SYSTEM",
    loginForm: {
        cacheKey: "",
        systemCode: "SYSTEM",
        usercode: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
    },
    loginRules: {
        usercode: [
            {required: true, trigger: "blur", message: "请输入您的账号"}
        ],
        password: [
            {required: true, trigger: "blur", message: "请输入您的密码"}
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}]
    },
    loading: false,
    // 验证码开关
    captchaOnOff: true,
    captchaExpTime: 0,
    // 注册开关
    register: false,
    redirect: undefined
})

onMounted(() => {
    getCookie();
    
})

function generateRandomNumber() {
    // 生成一个 9 位的随机数（可能包含前导零）
    let randomNumber = '';
    for (let i = 0; i < 9; i++) {
        randomNumber += Math.floor(Math.random() * 10); // 每次生成一个 0-9 的随机数字
    }
    return randomNumber;
}

function handleLogin() {
    if (!data.loginForm.usercode) {
        msg.error('请输入账号')
        return
    }

    if (!data.loginForm.password) {
        msg.error('请输入密码')
        return
    }
    if (!data.loginForm.code) {
        msg.error('请输入图片验证码')
        return
    }

    data.loading = true;
    
}
</script>

<style lang="less">

.left {
    position: relative;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    height: 100%;
    width: 450px;
    overflow: hidden;
}

.right {
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5); /* 半透明背景 */
    backdrop-filter: blur(20px); /* 背景模糊 */
    -webkit-backdrop-filter: blur(20px); /* 兼容老版本 Safari */
    width: 400px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    //width: 100%; /* 根据需要设置宽度 */
    //background: radial-gradient(
    //        circle at center,
    //        #a8a1a1,
    //        #e5eccd,
    //        #d9c6b3,
    //        #1d5d8e
    //);
    /* 可选：增加模糊效果 */
    ///* backdrop-filter: blur(10px); */
    ///* -webkit-backdrop-filter: blur(10px); */
    background-image: url("../assets/img/login-bg.jpg");
    background-size: cover;
}


.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: #f5d0d0;
    width: 400px;
    padding: 25px 25px 5px 25px;


    .el-input {
        height: 38px;

        input {
            height: 38px;
        }
    }

    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    letter-spacing: 1px;
    color: #333333;
}

.login-code-img {
    cursor: pointer;
    margin-left: 20px;
    //height: 38px;
}
</style>
