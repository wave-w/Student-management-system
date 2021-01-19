<template>
  <div>
    <table-com :tableData='tableData' :istrue='false'></table-com>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
          style="margin-left: 17.5rem; margin-top: 1.25rem;">
        </el-pagination>
  </div>
</template>

<script>
import { getadopt} from '@/network/teacher/apply';
import TableCom from '@/components/common/table'
export default {
  name: '',
  components:{TableCom},
  data() {
    return {
        college:window.sessionStorage.getItem('collegeAbbreviation'),
        role:window.sessionStorage.getItem('role'),
        collegename: window.sessionStorage.getItem('college'),
        classname: window.sessionStorage.getItem('className'),
        class:window.sessionStorage.getItem('classs'),
        newrole:'',
        tableData:[],
        //分页
        currentPage: 1,
        pagesize: 10,
        total: 0,
        pagesizes: [0, 6, 10, 20, 30, 40, 50],
    }
  },
  created() {
            let str = this.role;
            let reg = new RegExp("ROLE_","g");
            this.newrole = str.replace(reg,"");
            this.pagechange()
  },
  methods: {
    pagechange(){
       getadopt(this.newrole,this.collegename,this.classname,this.currentPage,this.pagesize).then(res=>{
        //  console.log(res);
          this.total = res.data2.total
             res.data.forEach((item,index) => {
               res.data2.records[index].date = item
              });
           this.tableData = res.data2.records
        })
    },
     // 分页
       handleSizeChange(size) {
        this.pagesize = size
        this.pagechange()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.pagechange()
      }
  },
}
</script>

<style  scoped>
</style>