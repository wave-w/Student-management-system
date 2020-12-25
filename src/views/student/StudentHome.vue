<template>
  <div class="mainhome">
    <div class="nav_top">
      <img src="~@/assets/images/gmu.png" alt="gmu">
      <div class="btnbox">
        <a href="http://www.gmu.cn/?src=titanwolf.org" target="_blank"><i class="iconfont icon-wangluo">官网</i></a>
        <a href="#" target="_blank"><i class="iconfont icon-dangjian">党建</i></a>
        <i class="iconfont icon-tuichu_huaban1" @click="loginout">退出</i>
      </div>
    </div>
    <div class="navmenu">
      <el-menu :default-active="$route.path" mode="vertical" text-color='#000' active-text-color='#fff' :router='true'
        unique-opened background-color='#00702b' class="mainmenu">
        <el-menu-item :index="router.information"><i class="iconfont icon-gerenxinxi"></i>个人信息</el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="iconfont icon-drxx81"></i>请假申请</template>
          <el-menu-item :index="router.application.apply"><i class="iconfont icon-e53322"></i>申请</el-menu-item>
          <el-menu-item :index="router.application.failed"><i class="iconfont icon-weitongguo"></i>未通过</el-menu-item>
          <el-submenu index="2-2">
            <template slot="title"><i class="iconfont icon-tongguo"></i>已通过</template>
            <el-menu-item :index="router.application.nadopt"><i class="iconfont icon-xiaojiashenpi"></i>未销假
            </el-menu-item>
            <el-menu-item :index="router.application.adopt"><i class="iconfont icon-xiaojiaguanli"></i>已销假
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <el-badge :is-dot='$store.state.ismess' style="position: absolute;"></el-badge><i class="iconfont icon-daifucha"></i>三项文明
          </template>
          <el-menu-item :index="router.civilization.dorm"><i class="iconfont icon-fangjianshu"></i> 寝室文明
            <el-badge :value="$store.state.count"  :max="99" :hidden='$store.state.isshowmess' style="position: absolute; right: 10px;"></el-badge>
          </el-menu-item>
          <el-menu-item :index="router.civilization.class"><i class="iconfont icon-kecheng"></i>课堂文明</el-menu-item>
        </el-submenu>
        <el-menu-item :index="router.fiveone"><i class="iconfont icon-zuoye"></i>五个一</el-menu-item>
        <el-menu-item :index="router.volunteer"><i class="iconfont icon-weibiaoti--"></i>志愿活动</el-menu-item>
        <el-submenu index="4">
          <template slot="title"><i class="iconfont icon-fenshuxian"></i>加减分项</template>
          <el-menu-item :index="router.sfraction.bpoints"><i class="iconfont icon-wj-by"></i>加分项</el-menu-item>
          <el-menu-item :index="router.sfraction.mpoints"><i class="iconfont icon-wj-pp"></i>减分项</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="main">
      <!-- <keep-alive exclude="/slave"> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>
<script>
  import '@/assets/css/normal.css';
  import {
    logout
  } from '@/network/login';
   import {
    client,
    connect
  } from "@/network/config/mqtt";
  import {
    getsdorm
  } from '@/network/student/dorm';
  export default {
    name: '',
    data() {
      return {
        router: {
          information: '/sinfor',
          application: {
            apply: '/slave',
            failed: '/failed',
            adopt: '/adopt',
            nadopt: 'nadopt'
          },
          civilization: {
            dorm: '/sdormcivi',
            class: '/sclasscivi'
          },
          fiveone: '/sfone',
          volunteer: '/sactiv',
          sfraction: {
            bpoints: '/sbpoints',
            mpoints: 'smpoints'
          },
          sdormnum:''
        },
      }

    },
    methods: {
      loginout() {
        this.$router.push('/login')
        logout().then(() => {
          this.$message.success('退出登录')
        })
      },
    },
    created() {
      connect()
 setTimeout(() => {
        let sid = window.sessionStorage.getItem('sid')
       getsdorm(sid).then(res => {
        this.sdormnum =  res.data2[0].dormNum
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
 }, 200);
    },
    mounted() {
       let aconntime = setInterval(() => {
        if (!client.connected) {
          this.$message.error('网络错误请刷新页面')
        }
      }, 2000);
      setTimeout(() => {
        if (client.connected) {
          clearInterval(aconntime)
        }
      }, 10000);
      setTimeout(() => {
        // 新的查寝信息提示
        client.subscribe(this.sdormnum, msg => {
          this.$store.state.count++
         this.$message("有新的查寝消息,刷新以查看")
        }, {})
        // 反馈消息老师回复提示
         client.subscribe(`dorm${this.sdormnum}`, msg => {
          // console.log(msg.body);
         this.$message("反馈消息老师有新的回馈")
        }, {})
      }, 1000);
    },
    destroyed() {
      logout().then()
    },
  }
</script>

<style scoped>
  .nav_top {
    height: 8.75rem;
    background: url('~@/assets/images/top_zs.png') no-repeat #00702b 565px 50px;
  }

  .nav_top img {
    float: left;
    margin-top: 30px;
    margin-left: 160px;
  }

  .navmenu {
    float: left;
    width: 200px;
  }

  .mainmenu {
    height: 36.3125rem;
  }

  .btnbox {
    float: right;
    margin-top: 60px;
  }

  i {
    margin: 15px;
    font-size: 25px;
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
    margin-left: 350px;

  }
</style>