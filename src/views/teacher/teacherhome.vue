<template>
  <div>
    <keep-alive>
    <home :router='routers' :ishowcadres='true'></home></keep-alive>
  </div>
</template>
<script>
  // import {client} from "@/network/config/mqtt";
  import Home from '@/components/common/Home'
  export default {
    name: '',
    components: {
      Home
    },
    data() {
      return {
        routers: {
          application: {
            apply: '/tslave',
            failed: '/tfailed',
            adopt: '/tadopt',
            nadopt: 'tnadopt'
          },
          civilization: {
            dorm: '/tsdormcivi',
            class: '/tsclasscivi',
            cadres:'/cadres'
          },
          fiveone: '/tsfone',
          volunteer: '/tsactiv',
          sfraction: {
            bpoints: '/tsbpoints',
            mpoints: '/tsmpoints'
          }
        },
      }

    },
    // mounted() {
    //   setTimeout(() => {
    //      let colla = window.sessionStorage.getItem('collegeAbbreviation')
    //       if (window.sessionStorage.getItem('role')== 'ROLE_instructor'){
    //     // 新的学生反馈信息提示
    //     client.subscribe(`feed${colla}`, msg => {
    //         this.$store.state.count++
    //         this.$store.state.ismess = true
    //         this.$store.state.isshowmess = false
    //         this.$message("有新的学生反馈消息")
    //     }, {})
    //     // 新的查寝信息提示
    //     client.subscribe(colla, msg => {
    //       this.$store.state.count++
    //        this.$store.state.ismess = true
    //        this.$store.state.isshowmess = false
    //       this.$message("有新的学生查寝消息")
    //     }, {})
    //     // 老师更改寝室状态
    //     client.subscribe(`changedorm${colla}`, msg => {
    //       let mes = JSON.parse(msg.body)
    //       this.$message(`有老师把${mes.num}寝室在${mes.time}号的查寝状态更改为更改为合格`)
    //     }, {})
    //       // 辅导员获取请假
    //     client.subscribe(`apply${colla}`, msg => {
    //        this.$store.state.applycount++
    //        this.$store.state.applyismess = true
    //        this.$store.state.applyisshowmess = false
    //       this.$message(`有新的学生请假消息`)
    //     }, {})
    //     // 辅导员获取申请销假
    //       client.subscribe(`nadopt${colla}`, msg => {
    //         this.$store.state.nadoptcount++
    //         this.$store.state.applyismess = true
    //         this.$store.state.nadoptismess = true
    //         this.$store.state.nadoptisshowmess = false
    //       this.$message(`有新的学生申请销假消息`)
    //     }, {})
    //       }
    //       let classes = window.sessionStorage.getItem('classs')
    // if (window.sessionStorage.getItem('role') == 'ROLE_headmaster'){
    //    client.subscribe(classes, msg => {
    //       this.$store.state.count++
    //        this.$store.state.ismess = true
    //        this.$store.state.isshowmess = false
    //       this.$message("班级有新的学生查寝消息")
    //     }, {})
    //     // console.log(`apply${classes}`);
    //      client.subscribe(`apply${classes}`, msg => {
    //          this.$store.state.applycount++
    //          this.$store.state.applyismess = true
    //          this.$store.state.applyisshowmess = false
    //          this.$message("班级有新的学生请假消息")
    //       }, {})
    //       // console.log(`nadopt${classes}`);
    //      client.subscribe(`nadopt${classes}`, msg => {
    //         this.$store.state.nadoptcount++
    //         this.$store.state.applyismess = true
    //         this.$store.state.nadoptismess = true
    //         this.$store.state.nadoptisshowmess = false
    //          this.$message("班级有新的学生销假消息")
    //       }, {})
    //        }
    //   }, 8000);
    // },
  }
</script>

<style scoped>

</style>