<template>
  <div>
    <home :router='routers'></home>
  </div>
</template>
<script>
  import Home from '@/components/common/Home'
  import {client} from "@/network/config/mqtt";
  export default {
    components: {
      Home
    },
    name: '',
    data() {
      return {
        routers: {
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
        },
        sdormnum:'',
        sid: window.sessionStorage.getItem('sid'),
      }

    },
    created() {
      setTimeout(() => {
        this.sdormnum = window.sessionStorage.getItem('sdormnum')
      }, 1000);
    },
    mounted() {
      setTimeout(() => {
        // 新的查寝信息提示
        this.sdormnum=this.sdormnum.replace("-","")
        client.subscribe(this.sdormnum, msg => {
            this.$store.state.count++
            this.$store.state.ismess = true
            this.$store.state.isshowmess = false
            this.$message("有新的查寝消息,刷新以查看")
        }, {})
        // 反馈消息老师回复提示
        client.subscribe(`dorm${this.sdormnum}`, msg => {
          // console.log(msg.body);
          this.$message("反馈消息老师有新的回馈")
        }, {})
        // `changedorm${colla}`
          client.subscribe(`changedorm${this.sdormnum}`, msg => {
          this.$message("老师已查看你的反馈消息")
        }, {})
      }, 2000);
    },
  }
</script>

<style scoped>
</style>