<template>
    <div class="LoginStyle" @keyup.enter="toLogin">
        <div class="gnxh"></div>
        <div class="LoginBox">
            <el-form :model="LoginForm" ref="loginref" :rules='LoginRules'>
                <el-form-item prop="username">
                    <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-mima" type='password'></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row>
                        <el-col :span="12">
                            <el-input v-model="LoginForm.code" prefix-icon="iconfont icon-yanzhengma"></el-input>
                        </el-col>
                        <el-col :span="5" class="scode">
                            <div @click="random">{{stringcode}}</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="btnstyle">
                    <el-checkbox v-model="rememberme" name="remember-me" class="checkbox">记住密码</el-checkbox>
                    <el-button type="primary" @click="toLogin">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import '@/assets/css/normal.css';
    import {Login} from '@/network/login';
    export default {
        name: 'Login',
        data() {
            return {
                LoginForm: {
                    username: 'admin',
                    password: '123456',
                    code: ''
                },
                rememberme: false,
                LoginRules: {
                    username: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    code: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }],
                },
                stringrandom: [],
                stringcode: ''
            }
        },
        created() {
            this.random()
            window.sessionStorage.clear()
        },
        methods: {
            // 重置按钮
            reset() {
                this.$refs.loginref.resetFields()
            },
            toLogin() {
                this.$refs.loginref.validate(val => {
                    if (val) {
                        if (this.LoginForm.code == this.stringcode) {
                            window.sessionStorage.setItem('sid', this.LoginForm.username)
                            let mobile = this.LoginForm.username
                            let password = this.LoginForm.password
                            Login(mobile, password, this.rememberme).then(res => {
                                if (res.code == 200) {
                                    window.sessionStorage.setItem('role',res.data.role)
                                    if (res.data.role == 'ROLE_instructor'||res.data.role == 'ROLE_headmaster') {
                                        this.$router.push('/thome')
                                    } else if (res.data.role == 'ROLE_student') {
                                        this.$router.push('/shome')
                                    }
                                    this.$message.success(res.message)
                                } else this.$message.error("账号或密码错误");
                            })
                        } else {
                            this.$message.error("验证码错误")
                            this.random()
                        }
                    } else {
                        this.$message.error("请输入账号或密码")
                    }
                })
            },
            // 生成随机数
            random() {
                this.stringrandom = []
                for (let i = 0; i < 4; i++) {
                    let number = Math.floor(Math.random() * 10);
                    this.stringrandom.push(number)
                    this.stringcode = this.stringrandom.join('')
                }
            }
        },
    }
</script>

<style scoped>
    .LoginStyle {
        position: relative;
        width: 100%;
        min-height: 45rem;
        height: 100vh;
        background-color: #2b4b6b;
    }

    .LoginBox {
        position: absolute;
        top: 14.375rem;
        left: 34.375rem;
        height: 21.875rem;
        width: 31.25rem;
        background-color: #fff;
    }

    form {
        margin: 3.125rem;
        margin-top: 6.25rem;
        width: 25rem;
    }

    .btnstyle {
        float: right;
    }

    .checkbox {
        margin-right: 10.625rem !important;
    }

    .gnxh {
        position: absolute;
        top: 10.3125rem;
        left: 45rem;
        height: 9.375rem;
        width: 9.375rem;
        border-radius: 50%;
        z-index: 99;
        background: url('~@/assets/images/Schoolbadge.png') -0.3125rem 0px no-repeat;
        background-size: 10.125rem 9.375rem;
    }

    .scode {
        margin-left: 3.125rem;
        border: 1px solid;
        text-align: center;
        color: #fff;
        background: url('~@/assets/images/code.jpg');
    }
</style>