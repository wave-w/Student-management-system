<template>
  <div>
    <div class="search">
      <el-card class="box-card">
        <el-select v-model="value" placeholder="请选择时间" clearable @change="togettimechange">
          <el-option v-for="(item,index) in datatime" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="classesvalue" placeholder="请选择班级" clearable @change="togettimechange" v-if="showclass">
          <el-option v-for="(item,index) in classes" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="isqualified.value" placeholder="状态" @change="togettimechange" clearable style="width:150px">
          <el-option label="优秀" value="优秀"></el-option>
          <el-option label="良好" value="良好"></el-option>
          <el-option label="一般" value="一般"></el-option>
          <el-option label="较差" value="较差"></el-option>
          <el-option label="脏乱差" value="脏乱差"></el-option>
        </el-select>
        <el-select v-model="isread.value" placeholder="寝室消息" @change="togettimechange" clearable style="width:150px">
          <el-option label="已读" value="read"></el-option>
          <el-option label="未读" value="unread"></el-option>
        </el-select>
        <!-- http://111.75.252.147/score/updownload/exceldown -->
        <el-link :href="downdorm" :underline='false'>
          <el-button type="primary" plain style="margin-left:1.575rem;">导出表格</el-button>
        </el-link>
        <!-- <el-button type="info" plain style="margin-left: 2.875rem;" v-if="messagebutn">信息按钮</el-button> -->
        <!-- 主表格渲染 -->
        <!-- showtables?{prop: 'chaeckdate', order: 'descending'}: -->
        <el-table :data="DromData" border stripe height="340" :default-sort="{prop: 'message', order: 'descending'}">
          <el-table-column :prop="showtables?'dormNum':'data2'" label="寝室号" align='center'>
          </el-table-column>
          <el-table-column v-if="showtables" prop="checkTime" :label="checktp" align='center'>
          </el-table-column>
          <el-table-column v-if="!showtables" prop="data" :label="checktp" align='center'>
          </el-table-column>
          <el-table-column :prop="showtables?'state':'data3'" label="状态" align='center'>
            <template slot-scope="scope">
              <el-tag v-if="showtables"
                :type="(scope.row.state=='优秀' || scope.row.state=='良好' || scope.row.state=='一般')?s:(scope.row.state=='较差'?w:d)"
                effect="dark">{{scope.row.state}}</el-tag>
              <el-tag v-if="!showtables"
                :type="(scope.row.data3=='优秀' || scope.row.data3=='良好' || scope.row.data3=='一般')?s:(scope.row.data3=='较差'?w:d)"
                effect="dark">{{scope.row.data3}}</el-tag>
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
          <el-table-column prop="message" label="次数" align='center' sortable v-if="!showtables"></el-table-column>
          <el-table-column prop="feedbackDescribe" label="反馈情况" align='center' v-if="showtables">
            <template slot-scope="scope" v-if="showtables">
              <el-button type="warning" size='small' @click='feedback(scope.$index,scope.row)'>反馈情况
                <el-badge :is-dot="((role == 'ROLE_instructor' && 
                scope.row.fdyFeedbackReadIt == 'unread') ||(role== 'ROLE_headmaster' 
                && scope.row.feedbackReadIt == 'unread'))?t:f" :hidden='isfhad[scope.$index]'
                  style="position: absolute;top:.625rem"></el-badge>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-select v-model="statenumber" placeholder="次数排序" @change="getstatenumberchange" style="position: absolute; 
         top:440px;left:10px; width:150px">
          <el-option label="优秀次数排序" value="优秀"></el-option>
          <el-option label="良好次数排序" value="良好"></el-option>
          <el-option label="一般次数排序" value="一般"></el-option>
          <el-option label="较差次数排序" value="较差"></el-option>
          <el-option label="脏乱差次数排序" value="脏乱差"></el-option>
        </el-select>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
          style="margin-left: 14rem; margin-top: 1.25rem;">
        </el-pagination>
        <el-button icon="el-icon-view" style="position: absolute;top:440px;right: 50px;" @click="toallread">全部合格已读
        </el-button>
      </el-card>
    </div>
    <!-- 显示寝室详情 -->
    <el-dialog title="寝室详情" :visible="dialogVisible" width="80%" :show-close='false'>
      <span style="position: absolute;top:50px;left: 20px;" v-if="showt">查寝人:{{checkerman}}</span>
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
        <el-image style="width: 120px; height: 120px;" @click="dialogVisible=false"  :src="item" :preview-src-list="path">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{title}}</el-button>
        <el-button type="primary" @click="show" :disabled='showtitie'>{{title1}}</el-button>
      </span>
    </el-dialog>

    <!-- 显示查寝数量详情 -->
    <el-dialog title="详情" :visible="statenumdialogVisible" width="80%" :show-close='false'>
      <el-table :data="statenumberarr" border stripe height="200px">
        <el-table-column prop="checkTime" label="查寝时间" align='center'> </el-table-column>
        <el-table-column prop="state" label="状态" align='center'> </el-table-column>
        <el-table-column prop="checker" label="查寝人" align='center'> </el-table-column>
         <el-table-column prop="feedbackDescribe" label="详细说明" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size='small' @click='statenumberdetails(scope.row)'>查看
              </el-button>
            </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statenumdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="statenumdialogVisible = false">确认</el-button>
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
  // import {sendmess,client} from "@/network/config/mqtt";
  import {
    getdorm,
    findbytime,
    changeread,
    changestate,
    changeFkRead,
    allread,
    getstatenumbers,
    getstatenumdetail
  } from '@/network/teacher/dorm';
  export default {
    name: '',
    data() {
      return {
        showtables: true,
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
        statenumber: '',
        DromData: [],
        s: 'success',
        d: 'danger',
        w: 'warning',
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
        newrole: '',
        feedbackdorm: '',
        feedcheckTime: '',
        downdorm: '',
        // 改变页码
        currentPage: 1,
        pagesize: 5,
        total: 0,
        pagesizes: [5, 10, 20, 30, 40, 50],
        fdormNum: '',
        role: '',
        showtitie: false,
        tclass: '',
        checktp: '查寝时间',
        checkerman: '',
        statenumdialogVisible: false,
        statenumberarr: []
      }
    },
    created() {
      this.role = window.sessionStorage.getItem('role')
      this.college = window.sessionStorage.getItem('college')
      this.className = window.sessionStorage.getItem('className')
      if (this.role == 'ROLE_headmaster') {
        this.showclass = false
      }
    },
    mounted() {
      setTimeout(() => {
        let str = this.role;
        let reg = new RegExp("ROLE_", "g");
        this.newrole = str.replace(reg, "");
        if (this.role == 'ROLE_headmaster') {
          this.classesvalue = this.className
        } else {
          this.classesvalue = ""
        }
        this.timechange()
        this.downdorm =
          `https://cxcy.gmu.cn/score/updownload/exceldown?position=${this.newrole}&className=${this.classesvalue}&college=${this.college}`
      }, 1000);
    },
    methods: {
      timechange() {
        this.showtables = true
        this.checktp = '查寝时间'
        // this.currentPage = 1
        // this.pagesize = 5
        if (this.role == 'ROLE_headmaster') {
          this.classesvalue = this.className
        }
        this.statenumber = ''
        // console.log(this.college, this.classesvalue, this.newrole, this.value, this.isqualified.value,
        //   this.isread.value, this.currentPage, this.pagesize);
        findbytime(this.college, this.classesvalue, this.newrole, this.value, this.isqualified.value,
          this.isread.value, this.currentPage, this.pagesize).then(res => {
          // console.log(res);
          this.DromData = res.data2
          this.classes = res.data
          this.datatime = res.data3
          this.total = parseInt(res.message)
          // let chaeckdate = Date.parse(new Date(res.data2[0].checkTime))
          // this.DromData.forEach(item=>{
          //   item.chaeckdate = chaeckdate
          // }) 
          // console.log(this.DromData);
          // console.log(typeof date);
          // console.log(new Date());
        })
      },
      togettimechange(){
        this.currentPage = 1
        this.pagesize = 5
        this.timechange()
      },
      details(index, row) {
        if (this.showtables) {
          this.dialogVisible = true
          this.showt = true
           if(row.state == "优秀" || row.state == "良好" || row.state == "合格"){
              this.dormtext = row.qualifiedDescribe
               if (row.qualifiedPicture == '' || row.qualifiedPicture == null || row.qualifiedPicture == "null") {
            this.path = []
          } else {
            this.path = row.qualifiedPicture.split(',')
          }
           }else{
               this.dormtext = row.unqualifiedDescribe
               if (row.unqualifiedPicture == '' || row.unqualifiedPicture == null || row.unqualifiedPicture == "null") {
            this.path = []
          } else {
            this.path = row.unqualifiedPicture.split(',')
          }
           }
         
          this.checkerman = row.checker
          changeread(row.checkTime, row.dormNum, row.feedbackDescribe,
            row.feedbackPicture, row.id, row.readIt, row.state, row.stuReadIt,
            row.unqualifiedDescribe, row.unqualifiedPicture, this.newrole).then(res => {
            // console.log(res);
            this.dromsData = res.data
            this.timechange()
          })
          if ((this.role == 'ROLE_instructor' && row.fdyReadIt == 'unread') ||
            (this.role == 'ROLE_headmaster' && row.readIt == 'unread')) {
            this.$store.state.count--
            this.ishad.push('')
            this.ishad[index] = true
          }
          if (this.$store.state.count == 0) {
            this.$store.state.ismess = false
            this.$store.state.isshowmess = true
          }
        } else {
          getstatenumdetail(row.data2, row.data3, 1,10000).then(res => {
            this.statenumdialogVisible = true
            this.statenumberarr = res.data2
          })
          // console.log(row);
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
        if (this.dormrow.state == '较差' || this.dormrow.state == '脏乱差') {
          this.title = '不合格'
          this.title1 = '合格'
        }
        if (this.role == 'ROLE_headmaster' && (this.dormrow.state == '较差' || this.dormrow.state == '脏乱差')) {
          this.showtitie = true
          this.title = '确定'
        }
        changeFkRead(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state,
          row.stuReadIt, row.unqualifiedDescribe, row.unqualifiedPicture, this.newrole).then(() => {
          this.timechange()
        })
        if ((this.role == 'ROLE_instructor' && row.fdyFeedbackReadIt == 'unread') ||
          (this.role == 'ROLE_headmaster' && row.feedbackReadIt == 'unread')) {
          this.$store.state.count--
          this.isfhad.push('')
          this.isfhad[index] = true
          // if (this.role == 'ROLE_instructor') {
          //   // sendmess(`changedorm${this.fdormNum}`,'1').then()
          //   // client.send(`changedorm${this.fdormNum}`, {}, 1)
          // }
        }
        if (this.$store.state.count == 0) {
          this.$store.state.ismess = false
          this.$store.state.isshowmess = true
        }
        this.feedbackdorm = row.dormNum
        this.feedcheckTime = row.checkTime
      },
      show() {
        if (this.dormrow.state == '较差' || this.dormrow.state == '脏乱差') {
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
          this.timechange()
          // sendmess(`dorm${this.fdormNum}`,'1').then()
          // client.send(`dorm${this.fdormNum}`, {}, 1)
          // let num = this.feedbackdorm
          // let time = this.feedcheckTime
          // let msg = {
          //   num,
          //   time
          // }
          // if (this.role == 'ROLE_instructor') {
          //   //  sendmess(`changedorm${colla}`,'1').then()
          //   // client.send(`changedorm${colla}`, {}, JSON.stringify(msg))
          // }
        })
      },

      handleSizeChange(size) {
        this.pagesize = size
        if(this.showtables){this.timechange()}else{
          this.statenumberchange()
        }
        
      },
      handleCurrentChange(page) {
        this.currentPage = page
         if(this.showtables){this.timechange()}else{
          this.statenumberchange()
        }
      },
      // 合格已读
      toallread() {
        if (this.role == 'ROLE_headmaster') {
          this.tclass = this.className
        }
        // console.log(this.college, this.tclass, this.newrole);
        allread(this.college, this.tclass, this.newrole).then(res => {
          // console.log(res);
          if (res.code == 200) {
            console.log(res);
            this.$store.state.count = res.data
            if (res.data == 0) {
              this.$store.state.ismess = false
              this.$store.state.isshowmess = true
            }
            this.timechange()
          }
        })
      },
      getstatenumberchange(){
        this.currentPage = 1
        this.pagesize = 5
        this.statenumberchange()
      },
      statenumberchange() {
        if (this.role == 'ROLE_headmaster') {
          this.classesvalue = this.className
        } else {
          this.classesvalue = ''
        }
       
        this.showtables = false
        this.checktp = '寝室成员'
        this.value = ''
        this.isqualified.value = ''
        this.isread.value = ''
        // console.log(111,this.statenumber);
        getstatenumbers(this.college, this.classesvalue, this.statenumber,
       this.currentPage,this.pagesize).then(res => {
          this.DromData = res.data2
          this.total = res.data
          // console.log(res);
        })
      },
      statenumberdetails(row){
        // console.log(row);
          this.dialogVisible = true
          this.dormtext = row.qualifiedDescribe
          this.showt = false
          if (row.qualifiedPicture == '' || row.qualifiedPicture == null || row.qualifiedPicture == "null") {
            this.path = []
          } else {
            this.path = row.qualifiedPicture.split(',')
          }
          // this.checkerman = row.checker
      }
    },
  }
</script>

<style scoped>
  .el-select {
    margin-left: 3.125rem;
    margin-bottom: 1.575rem;
  }

  .box-card {
    position: relative;
    top: 0;
    /* left: -5rem; */
  }

  .dorming {
    display: inline-block;
    margin-top: 1.875rem;
    margin-left: .3125rem;
  }
</style>