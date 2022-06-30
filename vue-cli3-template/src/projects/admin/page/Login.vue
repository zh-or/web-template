<template>
    <div class="login-container">
        <img class="banner" src="../assets/img/login-banner.png">
        <div class="form-wrap" v-loading="loading">
            <div class="title">账号登陆</div>

            <el-form :model="data" :rules="rules" ref="loginForm">
                <el-form-item label="账号" prop="userName">
                    <el-input type="text"
                              placeholder="请输入账号"
                              v-model="data.userName"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password"
                              v-model="data.password"
                              placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
            </el-form>

            <div class="submit-btn" >
                <el-button type="primary" @click="loginFun">立即登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getRule} from "@/commons/rules";
    import {mapActions} from 'vuex';

    export default {
        name: 'Login',
        components: {},
        data() {
            return {
                loading: false,
                rules: {
                    userName: getRule('reqInput', '请输入账号'),
                    password: getRule('reqInput', '请输入密码'),
                },
                data :{
                    userName: 'yangyong',
                    password: '1234567890'
                }
            }
        },
        mounted() {

        },
        methods: {
            ...mapActions(['login', 'setUserInfo']),
            loginFun(){
                this.$refs.loginForm.validate(v => {
                    if(v){
                        this.loading = true;
                        this.login(this.data)
                            .then(res => {
                                console.log(res);
                                if(res.body.code == 0){
                                    this.setUserInfo(res.body.data);
                                    this.$router.replace('/index');
                                    this.$success('登录成功');
                                } else {
                                    this.$error('登录失败!');
                                }
                                this.loading = false;
                            })
                            .catch(e => {
                                this.loading = false;
                                console.log(e);
                                this.$error('登录失败, 网路错误!');
                            });
                    }
                })
            }
        }
    }
</script>
<style lang="less">

    .login-container {
        /*width: 1073px;*/
        display: table;
        margin: 0 auto;
        padding-top: 10%;

        .banner, .form-wrap {
            vertical-align: middle;
            display: inline-block;
        }

        .banner {
            width: 553px;
            height: 543px;
        }

        .form-wrap {
            box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            margin-left: 145px;
            width: 375px;
            padding: 20px 15px;
            background-color: #fff;

            .el-form-item__label, .el-input {
                font-size: 16px;
            }

            .el-form-item__label {
                font-weight: bold;
            }

            .title {
                font-size: 20px;
                color: #333;
                margin-bottom: 30px;
                font-weight: bold;
            }

            .el-form {

                .el-input {
                    input {
                        height: 50px;
                        line-height: 50px;
                    }
                }
            }

            .submit-btn{
                margin-top: 45px;


                .el-button{
                    border-radius:5px;
                    height: 50px;
                    line-height: 50px;
                    padding: 0;
                    font-size: 15px;
                    font-weight: bold;
                    width: 100%;
                }
            }
        }
    }

</style>

