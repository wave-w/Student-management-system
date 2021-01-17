<template>
  <div>
    <el-card>
    {{teacherinfo}}
    {{date}}
    {{data3}}
    </el-card>
  </div>
</template>

<script>
import { getteaInfo } from '@/network/teacher/teachinfo';
export default {
  name: '',
  data() {
    return {
      teacherinfo:{},
      date:'',
      data3:''
    }
  },
  created() {
    let tid = window.sessionStorage.getItem('sid')
    getteaInfo(tid).then(res=>{
        this.teacherinfo = res.data
        this.date = res.date
        this.data3 = res.data3
        window.sessionStorage.setItem('college',res.data.college)
        window.sessionStorage.setItem('collegeAbbreviation',res.data.collegeAbbreviation)
        window.sessionStorage.setItem('className',res.data.className)
        window.sessionStorage.setItem('isInstructor',res.data.isInstructor)
        window.sessionStorage.setItem('classs',res.data3)
    })
  },
}
</script>

<style  scoped>
</style>