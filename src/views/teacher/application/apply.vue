<template>
  <div>
    <el-table :data="tableData" border stripe height="500">
      <el-table-column prop="username" label="姓名" align='center'>
      </el-table-column>
      <el-table-column prop="stuNum" label="学号" align='center'>
      </el-table-column>
      <el-table-column prop="headmaster" label="班主任" align='center'>
      </el-table-column>
      <el-table-column prop="reason" label="请假原因" align='center'>
      </el-table-column>
      <el-table-column prop="date" label="请假时间" width='180px' align='center'>
      </el-table-column>
      <el-table-column prop="leavedays" label="天数" align='center'>
      </el-table-column>
      <el-table-column prop="feedbackDescribe" label="说明" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" size='small' @click="details(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
      style="margin-left: 17.5rem; margin-top: 1.25rem;">
    </el-pagination>
    <!--查看请假图片 -->
    <el-dialog title="假条详情" :visible="dialogVisible" width="50%" :show-close='false'>
      <el-form ref="applyref" :model="applyform" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="电话:" prop="phone">
              <el-input type='number' v-model="applyform.phone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="班主任电话:" prop="headmasterPhone">
              <el-input type='number' v-model="applyform.headmasterPhone" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父母电话:" prop="parentPhone">
              <el-input type='number' v-model="applyform.parentPhone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="去向:" prop="whereabouts">
              <el-input type='text' v-model="applyform.whereabouts" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="具体原因:" prop="specificReasons">
              <el-input type="textarea" disabled :rows="2" placeholder="请输入内容" v-model="applyform.specificReasons">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dorming" v-for="(item,index) in path" :key='index'>
        <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="path">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible=false">取消</el-button>
        <el-button @click="disagree">不同意</el-button>
        <el-button type="primary" @click="agree">同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {sendmess,client} from "@/network/config/mqtt";
  import {changepage,agreeapply,disagreeapply} from '@/network/teacher/apply';
  export default {
    name: '',
    data() {
      return {
        tableData: [],
        college: window.sessionStorage.getItem('collegeAbbreviation'),
        role: window.sessionStorage.getItem('role'),
        collegename: window.sessionStorage.getItem('college'),
        classname: window.sessionStorage.getItem('className'),
        class: window.sessionStorage.getItem('classs'),
        newrole: '',
        applyform: {},
        dialogVisible: false,
        path: [],
        // 分页
        currentPage: 1,
        pagesize: 10,
        total: 0,
        pagesizes: [5, 10, 20, 30, 40, 50],
      }
    },
    created() {
      let str = this.role;
      let reg = new RegExp("ROLE_", "g");
      this.newrole = str.replace(reg, "");
      this.pagechange()
    },
    // mounted() {
    //   if (this.role == 'ROLE_headmaster') {
    //     setTimeout(() => {
    //       client.subscribe(`apply1${this.class}`, msg => {
    //         this.tableData.push(JSON.parse(msg.body))
    //       }, {})
    //     }, 10000);
    //   }
    // },
    methods: {
      details(row) {
        this.dialogVisible = true
        this.applyform = row
        if (row.picture == '' || row.picture == null || row.picture == "null") {
          this.path = []
        } else {
          this.path = row.picture.split(',')
        }
        // console.log(row);
      },
      agree() {
        agreeapply(this.newrole, this.applyform.id, this.applyform.stuNum, this.applyform.username, this.applyform
            .className,
            this.applyform.college, this.applyform.phone, this.applyform.headmaster, this.applyform.headmasterPhone,
            this.applyform.whereabouts, this.applyform.parentPhone, this.applyform.reason, this.applyform
            .specificReasons,
            this.applyform.picture, this.applyform.timeOffStart, this.applyform.timeOffEnd, this.applyform.leavedays)
          .then(res => {
            if (res.code == 200) {
              if (res.data2.leavedays > 1 || res.data2.whereabouts.substring(0, 3) != '江西省') {
                //  sendmess(`apply${this.college}`,'1').then()
                client.send(`apply${this.college}`, {}, 1)
              }
              this.dialogVisible = false
              this.path = []
              this.$message.success(`你已同意${res.data2.username}的请假申请`)
              if (this.$store.state.applycount > 0) {
                this.$store.state.applycount--
              }
              if (this.$store.state.applycount == 0) {
                this.$store.state.applyisshowmess = true
              }
              if (this.$store.state.applycount == 0 && this.$store.state.nadoptcount ==0) {
                this.$store.state.applyismess = false
              }
              this.pagechange()
            }
          })
      },
      disagree() {
        disagreeapply(this.newrole, this.applyform.id, this.applyform.stuNum, this.applyform.username, this.applyform
            .className,
            this.applyform.college, this.applyform.phone, this.applyform.headmaster, this.applyform.headmasterPhone,
            this.applyform.whereabouts, this.applyform.parentPhone, this.applyform.reason, this.applyform
            .specificReasons,
            this.applyform.picture, this.applyform.timeOffStart, this.applyform.timeOffEnd, this.applyform.leavedays)
          .then(res => {
            if (res.code == 200) {
              // console.log(res);
              this.dialogVisible = false
              this.path = []
              this.$message.error(`你已拒绝${res.data2.username}的请假申请`)
              if (this.$store.state.applycount > 0) {
                this.$store.state.applycount--
              }
              if (this.$store.state.applycount == 0) {
                this.$store.state.applyisshowmess = true
              }
              if (this.$store.state.applycount == 0 && this.$store.state.nadoptcount ==0) {
                this.$store.state.applyismess = false
              }
              this.pagechange()
            }
          })
      },
      pagechange() {
        changepage(this.newrole, this.collegename, this.classname, this.currentPage, this.pagesize).then(res => {
          this.total = res.data2.total
          res.data.forEach((item, index) => {
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

<style scoped>
  .dorming {
    display: inline-block;
    margin-top: 1.875rem;
    margin-left: .3125rem;
  }
</style>