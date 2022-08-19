<template>
    <div class="login">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">雪炭商家管理平台</h3>
            <el-form-item prop="usercode">
                <el-input
                        v-model="loginForm.usercode"
                        type="text"
                        size="large"
                        auto-complete="off"
                        placeholder="账号"
                >
                    <template #prefix>
                        <svg-icon name="user" class="el-input__icon input-icon"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                        v-model="loginForm.password"
                        type="password"
                        size="large"
                        auto-complete="off"
                        placeholder="密码"
                        @keyup.enter="handleLogin"
                >
                    <template #prefix>
                        <svg-icon name="password" class="el-input__icon input-icon"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input
                        v-model="loginForm.code"
                        size="large"
                        auto-complete="off"
                        placeholder="验证码"
                        style="width: 63%"
                        @keyup.enter="handleLogin"
                >
                    <template #prefix>
                        <svg-icon name="validCode" class="el-input__icon input-icon"/>
                    </template>
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
            </el-form-item>
            <div class="tip">
                <transition name="fade">
                    <span v-show="errMsg">{{errMsg}}</span>&nbsp;
                </transition>
            </div>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button
                        :loading="loading"
                        size="large"
                        type="primary"
                        style="width:100%;"
                        @click.prevent="handleLogin"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2018-2022 gccy.com All Rights Reserved.</span>
        </div>
    </div>
</template>

<script setup name="login">
    import {encrypt, decrypt} from "@/utils/jsencrypt";


    import $router from '@/router';
    import $t from 'lib';
    import $modal from '@/plugins/modal';
    import $store from '@/store';
    import $api from '@/api/api.js';


    const {proxy} = getCurrentInstance();

    //console.log('auto', $t, $router, $store, $api)

    const loginForm = ref({
        tenantCode: process.env.VUE_APP_Tenant_Code,
        systemCode: "merchant",
        usercode: "",//13900000003
        password: "",//355149
        rememberMe: false,
        code: "",
        uuid: ""
    });

    const errMsg = ref('');
    let errTimer;

    function showErrMsg(msg, to) {
        to = to || 2000;
        errMsg.value = msg;
        clearTimeout(errTimer);
        setTimeout(_ => {
            errMsg.value = '';
        }, to)
    }

    const loginRules = {
        usercode: [{required: true, trigger: "blur", message: "请输入您的账号"}],
        password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
    };

    const codeUrl = ref("");
    const loading = ref(false);
    // 验证码开关
    const captchaOnOff = ref(false);
    // 注册开关
    const register = ref(false);
    const redirect = ref(undefined);

    function handleLogin() {
        proxy.$refs.loginRef.validate(valid => {
            if (valid) {
                loading.value = true;
                // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
                if (loginForm.value.rememberMe) {
                    $t.cookie("usercode", loginForm.value.usercode, {expires: 30});
                    $t.cookie("password", encrypt(loginForm.value.password), {expires: 30});
                    $t.cookie("rememberMe", loginForm.value.rememberMe, {expires: 30});
                } else {
                    // 否则移除
                    $t.cookie("usercode", '');
                    $t.cookie("password", '');
                    $t.cookie("rememberMe", '');
                }
                // 调用action的登录方法
                $store.dispatch('login', loginForm.value)
                    .then(() => {
                        console.log('router: ', $router, '\n api:', $api);
                        $router.replace({path: "/"});
                    }).catch((e) => {
                        console.error(e);
                        showErrMsg(e.message);
                        loading.value = false;
                        // 重新获取验证码
                        if (captchaOnOff.value) {
                            getCode();
                        }
                    });
            }
        });
    }

    function getCode() {
        if (!captchaOnOff.value) {
            return;
        }
        $api.getCodeImg()
            .then(res => {
                captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
                if (captchaOnOff.value) {
                    codeUrl.value = "data:image/gif;base64," + res.img;
                    loginForm.value.uuid = res.uuid;
                }
            });
    }

    function getCookie() {
        const usercode = $t.cookie("usercode");
        const password = $t.cookie("password");
        const rememberMe = $t.cookie("rememberMe");
        loginForm.value = {
            tenantCode: process.env.VUE_APP_Tenant_Code,
            systemCode: "merchant",
            usercode: usercode === undefined ? loginForm.value.usercode : usercode,
            password: password === undefined ? loginForm.value.password : decrypt(password),
            rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
    }

    getCode();
    getCookie();
</script>

<style lang='scss' scoped>
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-image: url("~@/assets/img/login-background.jpg");
        background-size: cover;

        .tip {
            color: #f56c6c;
            font-size: 12px;
            text-align: center;
            padding: 5px;
        }
    }

    .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #707070;
    }

    .login-form {
        border-radius: 6px;
        background: #ffffff;
        width: 400px;
        padding: 25px 25px 5px 25px;
        .el-input {
            height: 40px;
            input {
                height: 40px;
            }
        }
        .input-icon {
            height: 39px;
            width: 14px;
            margin-left: 0px;
        }
    }

    .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
    }

    .login-code {
        width: 33%;
        height: 40px;
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
        color: #fff;
        font-family: Arial;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .login-code-img {
        height: 40px;
        padding-left: 12px;
    }
</style>
