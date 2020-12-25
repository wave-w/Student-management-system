<template>
  <div>
    <div class="search">
      <el-card class="box-card">
        <el-select v-model="value" placeholder="请选择时间" clearable @change="timechange">
          <el-option v-for="(item,index) in datatime" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="isqualified.value" placeholder="状态" @change="timechange" clearable>
          <el-option label="合格" value="qualified"></el-option>
          <el-option label="不合格" value="unqualified"></el-option>
        </el-select>
        <el-select v-model="isread.value" placeholder="寝室消息" @change="timechange" clearable>
          <el-option label="已读" value="read"></el-option>
          <el-option label="未读" value="unread"></el-option>
        </el-select>
        <el-link href="http://111.75.252.147:8099/updownload/exceldown">
          <el-button type="primary" plain style="margin-left: 30px;margin-top: -5px;">导出表格</el-button>
        </el-link>
        <el-button type="success" plain @click="showtabup" style="margin-left: 30px;margin-top: -5px;">上传表格</el-button>
        <!-- 主表格渲染 -->
        <el-table :data="DromData" border stripe height="450">
          <el-table-column prop="dormNum" label="寝室号" align='center'>
          </el-table-column>
          <el-table-column prop="checkTime" label="查寝时间" align='center'>
          </el-table-column>
          <el-table-column prop="state" label="状态" align='center'>
            <template slot-scope="scope">
              <el-tag :type="(scope.row.state=='合格')?s:d">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="查寝情况" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size='small' @click='details(scope.$index,scope.row)'>查看
                <el-badge :is-dot="(scope.row.readIt=='unread')?t:f" :hidden='ishad[scope.$index]'
                  style="position: absolute;top:10px"></el-badge>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="反馈情况" align='center'>
            <template slot-scope="scope">
              <el-button type="warning" size='small' @click='feedback(scope.$index,scope.row)'>反馈情况
                <el-badge :is-dot="(scope.row.feedbackReadIt=='unread')?t:f" :hidden='isfhad[scope.$index]'
                  style="position: absolute;top:10px"></el-badge>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 显示寝室详情 -->
    <el-dialog title="寝室详情" :visible="dialogVisible" width="50%" :show-close='false'>
      <el-table :data="dromsData" border stripe v-if="showt">
        <el-table-column prop="college" label="学院" align='center'> </el-table-column>
        <el-table-column prop="className" label="班级" align='center'> </el-table-column>
        <el-table-column prop="name" label="寝室成员" align='center'></el-table-column>
        <el-table-column prop="stuNum" label="学号" align='center' width='180px'> </el-table-column>
        <el-table-column prop="sex" label="性别" align='center'> </el-table-column>
        <el-table-column prop="remarks" label="身份" align='center'> </el-table-column>
      </el-table>
      <el-input type="textarea" autosize placeholder="暂无消息" v-model="dormtext" disabled style="margin-top: 10px;">
      </el-input>
      <div class="dorming" v-for="(item,index) in path" :key='index'>
        <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="path">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{title}}</el-button>
        <el-button type="primary" @click="show">合 格</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible="suredialogVisible" width="30%" :show-close='false'>
      <div class="sure">是否将{{dormrow.dormNum}}寝室在{{dormrow.checkTime}}的状态更改为合格?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="suredialogVisible = false">否</el-button>
        <el-button type="primary" @click="surestate">是</el-button>
      </span>
    </el-dialog>
    <!-- 导入表格 -->
    <el-dialog :visible.sync="tabledialogVisible" width='50%' :show-close='false' :destroy-on-close='true'
      title="上传查寝表格">
      <!-- 展示上传的表格样式 -->
      <p>上传表格格式规范(必须一样)</p>
      <el-image style="width: 730px; height: 105px" :src="url" :preview-src-list="srcList"></el-image>
      <el-upload class="upload-demo" action="http://111.75.252.147:8099/updownload/uploadExcel" :with-credentials='true'
        :auto-upload='false' :limit="1" :on-success='handleSuccess' :on-exceed="handleExceed" :on-error='handleError'
        ref="tabup" style="margin-bottom: 70px; margin-top: 10px;">
        <el-button size="small" type="primary">选择文件</el-button>
      </el-upload>
      <span style="position: absolute;right:10px;bottom:20px">
        <el-button type="success" @click="submitUpload">上传</el-button>
        <el-button @click="tabledialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 import {
    client,
    connect
  } from "@/network/config/mqtt";
  import {
    getdorm,
    findbytime,
    changeread,
    changestate,
    changeFkRead
  } from '@/network/teacher/dorm';
  export default {
    name: '',
    data() {
      return {
        value: '',
        datatime: [],
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
        t: true,
        f: false,
        ishad: [],
        isfhad: [],
        dromsData: [],
        showt: true,
        shows: false,
        college: window.sessionStorage.getItem('teacherinfo'),
        tabledialogVisible: false,
        // 展示表格样式图片
        url: require('@/assets/images/tablestyle.png'),
        srcList: [require('@/assets/images/tablestyle.png'), ],
        feedbackdorm:''
      }
    },
  created() {
    connect()
     let ttconntime = setInterval(() => {
        if (!client.connected) {
          this.$message.error('网络错误请刷新页面')
        }
      }, 2000);
      setTimeout(() => {
        if (client.connected) {
          clearInterval(ttconntime)
        }
      }, 10000);
  },
    mounted() {
      getdorm(this.college).then(res => {
        if (res.code == 200) {
          this.datatime = res.data
          // this.DromData = res.data2
          res.data2.forEach(item => {
            this.DromData.push(item)
          });
        } else {
          this.$message.error("登录失效，请重新登录")
        }
      })
    },
    methods: {
      timechange() {
        findbytime(this.college, this.value, this.isqualified.value, this.isread.value).then(res => {
          this.DromData = res
        })
      },
      details(index, row) {
        this.dialogVisible = true
        this.dormtext = row.qualifiedDescribe
        this.showt = true
        if (row.qualifiedPicture == null) {
          this.path = []
        } else {
          this.path = row.qualifiedPicture.split(',')
        }
        changeread(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state, row.stuReadIt,
          row.unqualifiedDescribe, row.unqualifiedPicture).then(res => {
          this.dromsData = res.data
          //  console.log(res);
        })
        // console.log('详情',row);
        if (row.readIt == 'unread') {
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
        if (row.feedbackPicture == null) {
          this.path = []
        } else {
          this.path = row.feedbackPicture.split(',')
        }
        this.dormtext = row.feedbackDescribe
        this.dialogVisible = true
        this.dormrow = row
        if (this.dormrow.state == '不合格') {
          this.title = '不合格'
        }
        changeFkRead(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state,
          row.stuReadIt, row.unqualifiedDescribe, row.unqualifiedPicture).then()
        if (row.feedbackReadIt == 'unread') {
          this.$store.state.count--
          this.isfhad.push('')
          this.isfhad[index] = true
        }
        if (this.$store.state.count == 0) {
          this.$store.state.ismess = false
          this.$store.state.isshowmess = true
        }
      this.feedbackdorm = row.dormNum
      },
      show() {
        if (this.dormrow.state == '不合格') {
          this.suredialogVisible = true
        } else {
          this.dialogVisible = false
        }
      },
      surestate() {
        changestate(this.dormrow.checkTime, this.dormrow.dormNum, this.dormrow.feedbackDescribe,
          this.dormrow.feedbackPicture, this.dormrow.id, this.dormrow.readIt, this.dormrow.state,
          this.dormrow.stuReadIt, this.dormrow.unqualifiedDescribe, this.dormrow.unqualifiedPicture).then(res => {
          this.suredialogVisible = false
          this.dialogVisible = false
          this.$message.success("更改合格成功")
          client.send(`dorm${this.feedbackdorm}`,{},1)
        })
      },
      handleSuccess() {
        this.$message.success(`上传成功`);
        this.tabledialogVisible = false
      },
      handleExceed() {
        this.$message.warning(`最多上传一张表格`);
      },
      handleError() {
        this.$message.error("文件上传失败")
      },
      submitUpload() {
        this.$refs.tabup.submit();
      },
      showtabup() {
        this.tabledialogVisible = true
      },
    },
  }
</script>

<style scoped>
  .el-select {
    margin-left: 50px;
    margin-bottom: 30px;
  }

  .box-card {
    position: relative;
    top: 0;
    left: -40px;
  }

  .dorming {
    display: inline-block;
    margin-top: 30px;
    margin-left: 5px;
  }
</style>