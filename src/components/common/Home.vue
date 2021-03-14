<template>
    <div class="mainhome">
        <div class="nav_top">
            <img src="~@/assets/images/gmu.png" alt="gmu">
            <div class="btnbox">
                <i class="iconfont el-icon-unlock" @click="cpdialogVisible = true">修改密码</i>
                <a href="#" target="_blank"><i class="iconfont icon-dangjian">党建</i></a>
                <i class="iconfont icon-tuichu_huaban1" @click="loginout">退出</i>
            </div>
        </div>
        <div class="navmenu">
            <el-menu :default-active="$route.path" mode="vertical" text-color='#000' active-text-color='#fff'
                :router='true' unique-opened background-color='#00702b' class="mainmenu">
                <el-submenu index="2">
                    <template slot="title">
                        <el-badge :is-dot='applyismess' style="position: absolute;"></el-badge>
                        <i class="iconfont icon-drxx81"></i>请假申请
                    </template>
                    <el-menu-item :index="router.application.apply">
                        <el-badge :value="applycount" :max="99" :hidden='applyisshowmess'
                            style="position: absolute; right: .625rem;"></el-badge>
                        <i class="iconfont icon-e53322"></i>申请
                    </el-menu-item>
                    <el-menu-item :index="router.application.failed"><i class="iconfont icon-weitongguo"></i>未通过
                    </el-menu-item>
                    <el-submenu index="2-2">
                        <template slot="title">
                            <el-badge :is-dot='nadoptismess' style="position: absolute;"></el-badge>
                            <i class="iconfont icon-tongguo"></i>已通过
                        </template>
                        <el-menu-item :index="router.application.nadopt"><i class="iconfont icon-xiaojiashenpi"></i>
                            <el-badge :value="nadoptcount" :max="99" :hidden='nadoptisshowmess'
                                style="position: absolute; right: .625rem;"></el-badge>未销假
                        </el-menu-item>
                        <el-menu-item :index="router.application.adopt"><i class="iconfont icon-xiaojiaguanli"></i>已销假
                        </el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <el-badge :is-dot='ismess' style="position: absolute;"></el-badge><i
                            class="iconfont icon-daifucha"></i>三个文明
                    </template>
                    <el-menu-item :index="router.civilization.dorm"><i class="iconfont icon-fangjianshu"></i> 寝室文明
                        <el-badge :value="count" :max="99" :hidden='isshowmess'
                            style="position: absolute; right: .625rem;"></el-badge>
                    </el-menu-item>
                    <el-menu-item :index="router.civilization.class"><i class="iconfont icon-kecheng"></i>课堂文明
                    </el-menu-item>
                     <el-menu-item :index="router.civilization.cadres" v-if="ishowcadres"
                     ><i class="iconfont icon-kecheng"></i>学生干部
                    </el-menu-item>
                </el-submenu>
                <el-menu-item :index="router.fiveone"><i class="iconfont icon-zuoye"></i>五个一</el-menu-item>
                <el-menu-item :index="router.volunteer"><i class="iconfont icon-weibiaoti--"></i>志愿活动</el-menu-item>
                <el-submenu index="4">
                    <template slot="title"><i class="iconfont icon-fenshuxian"></i>加减分项</template>
                    <el-menu-item :index="router.sfraction.bpoints"><i class="iconfont icon-wj-by"></i>加分项
                    </el-menu-item>
                    <el-menu-item :index="router.sfraction.mpoints"><i class="iconfont icon-wj-pp"></i>减分项
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="main">
            <!-- <keep-alive exclude="/slave"> -->
            <router-view></router-view>
            <!-- </keep-alive> -->
        </div>
        <!-- 修改密码 -->
        <el-dialog title="修改密码" :visible="cpdialogVisible" width="30%" :show-close='false'>
            <el-form :rules="cprules" :model="cpform" label-width="6.25rem" ref="cpformref">
                <el-form-item label="旧密码:" prop="oldpassword">
                    <el-input v-model="cpform.oldpassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newpassword">
                    <el-input v-model="cpform.newpassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="truepassword">
                    <el-input v-model="cpform.truepassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cpdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitpassword">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        logout,
        changepassword
    } from '@/network/login';
    import {
        getdorm
    } from '@/network/teacher/dorm';
    import {
        getsdorm
    } from '@/network/student/dorm';
    import {
        changepage,
        getnadopt
    } from '@/network/teacher/apply';
    export default {
        name: '',
        props: {
            router: {
                type: Object,
                default () {
                    return {}
                }
            },
            ishowcadres: {
                type: Boolean,
                default () {
                    return false
                }
            },
        },
        created() {
            let role = window.sessionStorage.getItem('role')
            let str = role;
            let reg = new RegExp("ROLE_", "g");
            let newrole = str.replace(reg, "");
            if (role == 'ROLE_instructor' || role == 'ROLE_headmaster') {
                setTimeout(() => {
                    let college = window.sessionStorage.getItem('college')
                    let className = window.sessionStorage.getItem('className')
                    // console.log(college,className);
                    getdorm(college, className, newrole).then(res => {
                        res.data2.forEach(item => {
                            if ((role == 'ROLE_instructor' && item.fdyReadIt == 'unread') ||
                                (role == 'ROLE_headmaster' && item.readIt == 'unread')) {
                                this.$store.state.count++
                                this.$store.state.ismess = true
                                this.$store.state.isshowmess = false
                            }
                            if ((role == 'ROLE_instructor' && item.fdyFeedbackReadIt =='unread') ||
                                (role == 'ROLE_headmaster' && item.feedbackReadIt == 'unread')
                            ) {
                                this.$store.state.count++
                                this.$store.state.ismess = true
                                this.$store.state.isshowmess = false
                            }
                            if (this.$store.state.count == 0) {
                                this.$store.state.ismess = false
                                this.$store.state.isshowmess = true
                            }
                        });
                    });
                    changepage(newrole, college, className, 1, 10000000)
                        .then(res => {
                            this.$store.state.applycount = res.data2.total
                            this.$store.state.applyismess = true
                            this.$store.state.applyisshowmess = false
                            // console.log(res);
                            //   console.log(res.data2.records.length); 
                            if (this.$store.state.applycount == 0) {
                                this.$store.state.applyisshowmess = true
                            }
                             if (this.$store.state.applycount == 0 && this.$store.state.nadoptcount == 0) {
                                this.$store.state.applyismess = false
                            }
                        });
                    getnadopt(newrole, college, className, 1, 10000000).then(res => {
                        res.data2.records.forEach(item => {
                            if (item.examineState == 'canceling') {
                                this.$store.state.nadoptcount++
                                this.$store.state.applyismess = true
                                this.$store.state.nadoptismess = true
                                this.$store.state.nadoptisshowmess = false
                            }
                            if (this.$store.state.nadoptcount == 0) {
                                this.$store.state.nadoptismess = false
                                this.$store.state.nadoptisshowmess = true
                            }
                            if (this.$store.state.applycount == 0 && this.$store.state
                                .nadoptcount == 0) {
                                this.$store.state.applyismess = false
                            }
                        })
                    })
                }, 2000);
            } else if (role == 'ROLE_student') {
                setTimeout(() => {
                    getsdorm(window.sessionStorage.getItem('sid')).then(res => {
                        res.data2.forEach(item => {
                            if (item.stuReadIt == 'unread') {
                                this.$store.state.count++
                                this.$store.state.ismess = true
                                this.$store.state.isshowmess = false
                            }
                            if (this.$store.state.count == 0) {
                                this.$store.state.ismess = false
                                this.$store.state.isshowmess = true
                            }
                        });
                    });
                }, 1000);
            }
        },
        computed: {
            count() {
                return this.$store.state.count
            },
            ismess() {
                return this.$store.state.ismess
            },
            isshowmess() {
                return this.$store.state.isshowmess
            },
            applycount() {
                return this.$store.state.applycount
            },
            applyismess() {
                return this.$store.state.applyismess
            },
            applyisshowmess() {
                return this.$store.state.applyisshowmess
            },
            nadoptcount() {
                return this.$store.state.nadoptcount
            },
            nadoptismess() {
                return this.$store.state.nadoptismess
            },
            nadoptisshowmess() {
                return this.$store.state.nadoptisshowmess
            }
        },
        data() {
            return {
                cpdialogVisible: false,
                cpform: {
                    oldpassword: '',
                    newpassword: '',
                    truepassword: ''
                },
                sid: window.sessionStorage.getItem('sid'),
                cprules: {
                    oldpassword: [{
                        required: true,
                        message: '请输入旧密码',
                        trigger: 'blur'
                    }, ],
                    newpassword: [{
                            required: true,
                            message: '请输入新密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 12,
                            message: '长度在 6 到 12 个字符',
                            trigger: 'blur'
                        }
                    ],
                    truepassword: [{
                            required: true,
                            message: '请确认密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 12,
                            message: '长度在 6 到 12 个字符',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        methods: {
            loginout() {
                logout().then(() => {
                    this.$message.success('退出登录')
                })
                window.sessionStorage.clear()
                this.$router.replace('/login')
            },
            commitpassword() {
                this.$refs.cpformref.validate(validate => {
                    if (validate) {
                        if (this.cpform.newpassword === this.cpform.truepassword) {
                            changepassword(this.sid, this.cpform.oldpassword, this.cpform.newpassword).then(
                                res => {
                                    if (res.code == 200) {
                                        this.loginout()
                                        this.$message.success(res.message)
                                    } else this.$message.error(res.message);
                                })
                        } else this.$message.error("两次输入的密码不一致")
                    } else this.$message.error('请入正确格式')
                })
            }
        },
        destroyed() {
            window.sessionStorage.clear()
        },
    }
</script>

<style scoped>
.mainhome{
    height: 100vh;
    min-height: 600px;
    overflow:hidden;
    /* background-color: red; */
}
    .nav_top {
        min-height: 8.75rem;
        height: 18vh;
        background: url('~@/assets/images/top_zs.png') no-repeat #00702b 35.3125rem 3.125rem;
    }

    .nav_top img {
        float: left;
        margin-top: 1.875rem;
        margin-left: 10rem;
    }

    .navmenu {
        float: left;
        width: 12.5rem;
    }

    .mainmenu {
        min-height: 35rem;
        height: 80.65vh;
    }

    .main {
        max-height: 600px;
        overflow: hidden;
        overflow-x: hidden;
    }

    .btnbox {
        float: right;
        margin-top: 3.75rem;
    }

    i {
        margin: .9375rem;
        font-size: 1.5625rem;
        cursor: pointer;
    }

    i:hover {
        color: rgb(0, 130, 153);
    }

    .is-active {
        background-color: rgba(109, 29, 29, 0.5) !important;
    }

    .main {
        height: 36.3125rem;
        width: 70rem;
        /* background-color: red; */
        margin-left: 15.875rem;

    }
</style>