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
      <el-table-column prop="whereabouts" label="去向" align='center'>
      </el-table-column>
      <el-table-column prop="specificReasons" label="详细说明" align='center'>
      </el-table-column>
      <el-table-column label="反馈情况" align='center' v-if="istrue">
        <template slot-scope="scope">
          <el-button type="warning" size='small' @click='detail(scope.row)'>查看
          </el-button>
          <el-badge :is-dot="scope.row.examineState=='canceling'" style="position: relative;top:-8px;left: -15px;">
          </el-badge>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="假条详情" :visible="dialogVisible" width="50%" :show-close='false'>
      销假说明:<el-input type="textarea" disabled :rows="2" placeholder="暂无消息" v-model="adoptform.cancelExplain">
      </el-input>
      <div class="dorming" v-for="(item,index) in path" :key='index'>
        <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="path">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button @click="disagree">不同意</el-button>
        <el-button type="primary" @click="agree">同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    disagreeadopt,
    agreeadopt
  } from '@/network/teacher/apply';
  export default {
    name: '',
    data() {
      return {
        adoptform: {},
        dialogVisible: false,
        path: []
      }
    },
    props: {
      tableData: {
        type: Array,
        default () {
          return []
        }
      },
      istrue: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    methods: {
      detail(row) {
        this.dialogVisible = true
        this.adoptform = row
        if (row.cancelPicture == '' || row.cancelPicture == null || row.cancelPicture == "null") {
          this.path = []
        } else {
          this.path = row.cancelPicture.split(',')
        }
      },
      agree() {
        this.dialogVisible = false
        agreeadopt(this.adoptform.id, this.adoptform.stuNum, this.adoptform.username, this.adoptform.className,
            this.adoptform.college, this.adoptform.phone, this.adoptform.headmaster, this.adoptform.headmasterPhone,
            this.adoptform.whereabouts, this.adoptform.parentPhone, this.adoptform.reason, this.adoptform
            .specificReasons,
            this.adoptform.picture, this.adoptform.timeOffStart, this.adoptform.timeOffEnd, this.adoptform.leavedays)
          .then(res => {
            if (res.code == 200) {
              this.$message(`你已同意${res.data2.username}的销假申请`)
              if (this.$store.state.nadoptcount >0) {
                this.$store.state.nadoptcount--
              }
              if (this.$store.state.nadoptcount ==0) {
                this.$store.state.nadoptismess = false
                this.$store.state.nadoptisshowmess = true
              }
                if (this.$store.state.applycount == 0 && this.$store.state.nadoptcount ==0) {
                this.$store.state.applyismess = false
              }
              this.$parent.pagechange();
            } else {
              this.$message.error("操作失败")
            }
          })
        this.$parent.pagechange();
      },
      disagree() {
        this.dialogVisible = false
        // 不同意销假
        disagreeadopt(this.adoptform.id, this.adoptform.stuNum, this.adoptform.username, this.adoptform.className,
            this.adoptform.college, this.adoptform.phone, this.adoptform.headmaster, this.adoptform.headmasterPhone,
            this.adoptform.whereabouts, this.adoptform.parentPhone, this.adoptform.reason, this.adoptform
            .specificReasons,
            this.adoptform.picture, this.adoptform.timeOffStart, this.adoptform.timeOffEnd, this.adoptform.leavedays)
          .then(res => {
            if (res.code == 200) {
              this.$message(`你已拒绝${res.data2.username}的销假申请`)
              this.$parent.pagechange();
            } else {
              this.$message.error("操作失败")
            }
          })
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