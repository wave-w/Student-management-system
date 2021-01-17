<template>
  <div>
    <div class="search">
      <el-card class="box-card">
        <el-select v-model="value" placeholder="请选择时间" clearable @change="timechange">
          <el-option v-for="(item,index) in datatime" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="classesvalue" placeholder="请选择班级" clearable @change="timechange" v-if="showclass">
          <el-option v-for="(item,index) in classes" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="isqualified.value" placeholder="状态" @change="timechange" clearable style="width:150px">
          <el-option label="合格" value="qualified"></el-option>
          <el-option label="不合格" value="unqualified"></el-option>
        </el-select>
        <el-select v-model="isread.value" placeholder="寝室消息" @change="timechange" clearable style="width:150px">
          <el-option label="已读" value="read"></el-option>
          <el-option label="未读" value="unread"></el-option>
        </el-select>
        <el-link href="http://111.75.252.147/score/updownload/exceldown" :underline='false'>
          <el-button type="primary" plain style="margin-left: 1.875rem;margin-top: -0.3125rem;">导出表格</el-button>
        </el-link>
        <!-- 主表格渲染 -->
        <el-table :data="DromData" border stripe height="400" :default-sort="{prop: 'checkTime', order: 'descending'}">
          <el-table-column prop="dormNum" label="寝室号" align='center'>
          </el-table-column>
          <el-table-column prop="checkTime" label="查寝时间" align='center' sortable>
          </el-table-column>
          <el-table-column prop="state" label="状态" align='center'>
            <template slot-scope="scope">
              <el-tag :type="(scope.row.state=='合格')?s:d">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="查寝情况" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size='small' @click='details(scope.$index,scope.row)'>查看
                <el-badge :is-dot="((role== 'ROLE_instructor' && 
                scope.row.fdyReadIt == 'unread') ||(role== 'ROLE_headmaster' 
                && scope.row.readIt == 'unread'))?t:f" :hidden='ishad[scope.$index]'
                  style="position: absolute;top:.625rem"></el-badge>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="反馈情况" align='center'>
            <template slot-scope="scope">
              <el-button type="warning" size='small' @click='feedback(scope.$index,scope.row)'>反馈情况
                <el-badge :is-dot="((role== 'ROLE_instructor' && 
                scope.row.fdyFeedbackReadIt == 'unread') ||(role== 'ROLE_headmaster' 
                && scope.row.feedbackReadIt == 'unread'))?t:f" :hidden='isfhad[scope.$index]'
                  style="position: absolute;top:.625rem"></el-badge>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
          style="margin-left: 17.5rem; margin-top: 1.25rem;">
        </el-pagination>
      </el-card>
    </div>
    <!-- 显示寝室详情 -->
    <el-dialog title="寝室详情" :visible="dialogVisible" width="80%" :show-close='false'>
      <el-table :data="dromsData" border stripe v-if="showt">
        <el-table-column prop="college" label="学院" align='center'> </el-table-column>
        <el-table-column prop="className" label="班级" align='center'> </el-table-column>
        <el-table-column prop="name" label="寝室成员" align='center'></el-table-column>
        <el-table-column prop="stuNum" label="学号" align='center' width='180px'> </el-table-column>
        <el-table-column prop="sex" label="性别" align='center'> </el-table-column>
        <el-table-column prop="remarks" label="身份" align='center'> </el-table-column>
      </el-table>
      <el-input type="textarea" autosize placeholder="暂无消息" v-model="dormtext" disabled style="margin-top: .625rem;">
      </el-input>
      <div class="dorming" v-for="(item,index) in path" :key='index'>
        <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="path">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" >{{title}}</el-button>
        <el-button type="primary" @click="show" :disabled='showtitie'>{{title1}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible="suredialogVisible" width="30%" :show-close='false'>
      <div class="sure">是否将{{dormrow.dormNum}}寝室在{{dormrow.checkTime}}的状态更改为合格?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="suredialogVisible = false">否</el-button>
        <el-button type="primary" @click="surestate">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {client} from "@/network/config/mqtt";
  import {getdorm,findbytime,changeread,changestate,changeFkRead} from '@/network/teacher/dorm';
  export default {
    name: '',
    data() {
      return {
        value: '',
        datatime: [],
        classes: [],
        classesvalue: '',
        showclass: true,
        isqualified: {
          value: ''
        },
        isread: {
          value: ''
        },
        DromData: [],
        s: 'success',
        d: 'danger',
        dialogVisible: false,
        dormtext: '',
        mnumber: [],
        path: [],
        dormrow: {},
        suredialogVisible: false,
        title: '取消',
        title1: '确定',
        t: true,
        f: false,
        ishad: [],
        isfhad: [],
        dromsData: [],
        showt: true,
        shows: false,
        college: '',
        className: '',
        isInstructor: '',
        feedbackdorm: '',
        feedcheckTime: '',
        // 改变页码
        currentPage: 1,
        pagesize: 6,
        total: 0,
        pagesizes: [0, 6, 10, 20, 30, 40, 50],
        fdormNum: '',
        role:'',
        showtitie: false
      }
    },
    created() {
      this.role = window.sessionStorage.getItem('role')
      if (this.role== 'ROLE_headmaster') {
        this.showclass = false
      }
    },
    mounted() {
      setTimeout(() => {
        this.college = window.sessionStorage.getItem('college')
        this.className = window.sessionStorage.getItem('className')
        this.isInstructor = window.sessionStorage.getItem('isInstructor')
        this.timechange()
      }, 1000);
    },
    methods: {
      timechange() {
        if(this.role== 'ROLE_headmaster'){
          this.classesvalue = this.className
        }
        findbytime(this.college, this.classesvalue, this.isInstructor, this.value, this.isqualified.value,
          this.isread.value, this.currentPage, this.pagesize).then(res => {
          this.DromData = res.data2
          this.total = res.data
        })
      },
      details(index, row) {
        this.dialogVisible = true
        this.dormtext = row.qualifiedDescribe
        this.showt = true
        if (row.qualifiedPicture == '' || row.qualifiedPicture == null || row.qualifiedPicture == "null") {
          this.path = []
        } else {
          this.path = row.qualifiedPicture.split(',')
        }
        changeread(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state, row.stuReadIt,
          row.unqualifiedDescribe, row.unqualifiedPicture,this.isInstructor).then(res => {
          this.dromsData = res.data
        })
        if ((this.role== 'ROLE_instructor' && row.fdyReadIt == 'unread') ||
        (this.role== 'ROLE_headmaster' && row.readIt == 'unread')) {
          this.$store.state.count--
          this.ishad.push('')
          this.ishad[index] = true
        }
        if (this.$store.state.count == 0) {
          this.$store.state.ismess = false
          this.$store.state.isshowmess = true
        }
      },
      feedback(index, row) {
        this.showt = false
        this.fdormNum = row.dormNum.replace("-", "")
        if (row.feedbackPicture == null || row.feedbackPicture == "" || row.feedbackPicture == "null") {
          this.path = []
        } else {
          this.path = row.feedbackPicture.split(',')
        }
        this.dormtext = row.feedbackDescribe
        this.dialogVisible = true
        this.dormrow = row
        if (this.dormrow.state == '不合格') {
          this.title = '不合格'
          this.title1 = '合格'
        }
        if(this.role== 'ROLE_headmaster' && this.dormrow.state == '不合格'){
          this.showtitie = true
           this.title = '确定'
        }
        changeFkRead(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state,
          row.stuReadIt, row.unqualifiedDescribe, row.unqualifiedPicture,this.isInstructor).then(() => {})
        if ((this.role== 'ROLE_instructor' && row.fdyFeedbackReadIt == 'unread') ||
        (this.role== 'ROLE_headmaster' && row.feedbackReadIt == 'unread')) {
          this.$store.state.count--
          this.isfhad.push('')
          this.isfhad[index] = true
          if (this.role== 'ROLE_instructor'){
            client.send(`changedorm${this.fdormNum}`, {}, 1)
          }
        }
        if (this.$store.state.count == 0) {
          this.$store.state.ismess = false
          this.$store.state.isshowmess = true
        }
        this.feedbackdorm = row.dormNum
        this.feedcheckTime = row.checkTime
      },
      show() {
        if (this.dormrow.state == '不合格') {
          this.suredialogVisible = true
        } else {
          this.dialogVisible = false
        }
      },
      surestate() {
        let colla = window.sessionStorage.getItem('collegeAbbreviation')
        changestate(this.dormrow.checkTime, this.dormrow.dormNum, this.dormrow.feedbackDescribe,
          this.dormrow.feedbackPicture, this.dormrow.id, this.dormrow.readIt, this.dormrow.state,
          this.dormrow.stuReadIt, this.dormrow.unqualifiedDescribe, this.dormrow.unqualifiedPicture).then(res => {
          this.suredialogVisible = false
          this.dialogVisible = false
          this.$message.success("更改合格成功")
          client.send(`dorm${this.fdormNum}`, {}, 1)
          let num = this.feedbackdorm
          let time = this.feedcheckTime
          let msg = {
            num,
            time
          }
           if (this.role== 'ROLE_instructor'){
          client.send(`changedorm${colla}`, {}, JSON.stringify(msg))
           }
        })
      },

      handleSizeChange(size) {
        this.pagesize = size
        this.timechange()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.timechange()
      }
    },
  }
</script>

<style scoped>
  .el-select {
    margin-left: 3.125rem;
    margin-bottom: 1.875rem;
  }

  .box-card {
    position: relative;
    top: 0;
    left: -2.5rem;
  }

  .dorming {
    display: inline-block;
    margin-top: 1.875rem;
    margin-left: .3125rem;
  }
</style>