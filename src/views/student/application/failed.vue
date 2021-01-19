<template>
  <div>
      <table-com :tableData='tableData' :istrue='false'></table-com>
  </div>
</template>
<script>
import {getsinfor} from '@/network/student/sinfor';
import { getfailedapply } from '@/network/student/apply';
import TableCom from '@/components/common/table'
export default {
  name: '',
    components:{TableCom},
  data() {
    return {
      username:'',
      stuNum:'',
      tableData:[],
    }
  },
  created() {
     let sid = window.sessionStorage.getItem('sid')
      getsinfor(sid).then(res => {
      this.username = res.data.name
      this.stuNum = res.data.stuNum
      })
    getfailedapply(this.stuNum,this.username).then(res=>{
       res.data.forEach((item,index) => {
               res.data2[index].date = item
              });
     this.tableData = res.data2
    //  console.log(res);
    })
  },
}
</script>

<style  scoped>
</style>