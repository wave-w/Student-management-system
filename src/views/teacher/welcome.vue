<template>
  <div>
    {{teacherinfo}}
    {{date}}
  </div>
</template>

<script>
import { getteaInfo } from '@/network/teacher/teachinfo';
export default {
  name: '',
  data() {
    return {
      teacherinfo:{},
      date:''
    }
  },
  created() {
    let tid = window.sessionStorage.getItem('sid')
    getteaInfo(tid).then(res=>{
        this.teacherinfo = res.data
        this.date = res.date
        window.sessionStorage.setItem('teacherinfo',res.data.college)
        window.sessionStorage.setItem('collegeAbbreviation',res.data.collegeAbbreviation)
    })
  },
}
</script>

<style  scoped>
</style>