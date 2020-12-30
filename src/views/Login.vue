<template>
    <div class="LoginStyle">
        <div class="gnxh"></div>
        <div class="LoginBox">
            <el-form :model="LoginForm" ref="loginref" :rules='LoginRules'>
                <el-form-item prop="username">
                    <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-mima" type='password'></el-input>
                </el-form-item>
                <el-form-item class="btnstyle">
                    <el-checkbox v-model="rememberme" name="remember-me" class="checkbox">记住密码</el-checkbox>
                    <el-button type="primary" @click="Login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import '@/assets/css/normal.css';
    import { Login } from '@/network/login';
    export default {
        name: 'Login',
        data() {
            return {
                LoginForm: {
                    username: 'admin',
                    password: '123456',
                    value:'0'
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
                    value:{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                },
                options:[
                    {
                        value:'0',
                        label:'学生'
                    },
                    {
                        value:'1',
                        label:'班主任'
                    },
                    {
                        value:'2',
                        label:'辅导员'
                    }
                ],
                value:''
            }
        },
        methods: {
            // 重置按钮
            reset() {
                this.$refs.loginref.resetFields()
            },
            Login() {
                this.$refs.loginref.validate(val => {
                    if (val) {
                      window.sessionStorage.setItem('sid',this.LoginForm.username) 
                         let mobile = this.LoginForm.username
                         let password = this.LoginForm.password
                        Login(mobile,password,this.rememberme).then(res=>{
                            //   console.log(res.data.JSESSION);
                            //   window.sessionStorage.setItem('session',res.data.JSESSION)
                            //   document.cookie = `JSESSIONID=${res.data.JSESSION}`
                        if(res.code==200){
                         if(res.data.role == 'ROLE_headmaster'){
                             this.$router.push('/thome')
                         } else if(res.data.role == 'ROLE_student'){
                             this.$router.push('/shome')
                         }
                         this.$message.success(res.message)
                        }else this.$message.error("账号或密码错误");
                       })
                    } else {
                        this.$message.error("请输入账号或密码")
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .LoginStyle {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #2b4b6b;
    }

    .LoginBox {
        position: absolute;
        top: 250px;
        left: 550px;
        height: 300px;
        width: 500px;
        background-color: #fff;
    }

    form {
        margin: 50px;
        margin-top: 100px;
        width: 400px;
    }

    .btnstyle {
        float: right;
    }

    .checkbox {
        margin-right: 170px !important;
    }

    .gnxh {
        position: absolute;
        top: 165px;
        left: 720px;
        height: 150px;
        width: 150px;
        border-radius: 50%;
        z-index: 99;
        background: url('~@/assets/images/Schoolbadge.png') -5px 0px no-repeat;
        background-size: 162px 150px;
    }
</style>