<template>
  <div>
    <div class="search">
      <el-card class="box-card">
        <el-select v-model="value" placeholder="查寝时间" clearable @change="timechange">
          <el-option v-for="(item,index) in datatime" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="isqualified.value" placeholder="寝室状态" @change="timechange" clearable>
          <el-option label="合格" value="qualified"></el-option>
          <el-option label="不合格" value="unqualified"></el-option>
        </el-select>
        <el-table :data="sDromData" border class="dromtab" stripe height="450">
          <el-table-column prop="dormNum" label="寝室号" align='center'>
          </el-table-column>
          <el-table-column prop="checkTime" label="查寝时间" align='center'>
          </el-table-column>
          <el-table-column prop="state" label="状态" align='center'>
            <template slot-scope="scope">
              <el-tag :type="(scope.row.state=='合格')?s:d">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="详情" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size='small' @click='details(scope.$index,scope.row)'>
                查看 <el-badge :is-dot="(scope.row.stuReadIt=='unread')?t:f" :hidden='ishad[scope.$index]'
                  style="position: absolute;top:10px"></el-badge>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackReadIt" label="反馈情况" align='center'>
            <template slot-scope="scope">
              <el-tag :type="(scope.row.feedbackReadIt=='read')?s:d">
                {{(scope.row.feedbackReadIt=='unread')?'未读':'已读'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="寝室详情" :visible="dialogVisible" width="30%" :show-close='false'>
      <el-input type="textarea" autosize placeholder="暂无信息" v-model="dormtext" disabled></el-input>
      <div class="dorming" v-for="(item,index) in srcList" :key="index">
        <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="srcList">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">确认</el-button>
        <el-button type="primary" @click="dialogVisible = false;qualifiedVisible = true">反馈</el-button>
      </span>
    </el-dialog>
    <el-dialog title="不合格反馈" :visible="qualifiedVisible" width="50%" :show-close='false' :destroy-on-close='true'>
      <!-- 详细信息输入 -->
      <el-form :model="textareaForm" :rules="rules" ref="textref">
        <el-form-item prop="qualifiedtext">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="textareaForm.qualifiedtext" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 图片上传 -->
      <div class="imgupload">
        <el-upload action="http://111.75.252.147:8099/tupian" list-type="picture-card" ref="imgupload"
          :on-success='handleSuccess' :on-preview="handlePictureCardPreview" :auto-upload='false' multiple
          :with-credentials='true' :limit="3" :on-exceed="handleExceed" class="uploadstyle" :on-error='handleError'>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="imgdialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <span slot="footer">
        <el-button @click="qualifiedVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendqualified">确 定</el-button>
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
    getsdorm,
    checkdorm,
    feedteacher,
    changesread
  } from '@/network/student/dorm';
  export default {
    name: '',
    data() {
      return {
        value: '',
        datatime: [],
        isqualified: {
          value: ''
        },
        sDromData: [],
        s: 'success',
        d: 'danger',
        dialogVisible: false,
        dormtext: '',
        srcList: [],
        qualifiedVisible: false,
        textareaForm: {
          qualifiedtext: '', //不合格反馈,
        },
        dialogImageUrl: '',
        imgdialogVisible: false,
        // 反馈图片地址
        Dormrow: {},
        Picturepath: [],
        t: true,
        f: false,
        ishad: [],
        dormid: '',
        //  反馈表单校验
        rules: {
          qualifiedtext: [{
              required: true,
              message: '请输入反馈描述',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 100,
              message: '长度在 5 到 100 个字符',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    created() {
      connect()
     let sconntime = setInterval(() => {
        if (!client.connected) {
          this.$message.error('网络错误请刷新页面')
        }
      }, 2000);
      setTimeout(() => {
        if (client.connected) {
          clearInterval(sconntime)
        }
      }, 10000);
    },
    mounted() {
      let sid = window.sessionStorage.getItem('sid')
      getsdorm(sid).then(res => {
        if (res.code == 200) {
          // this.sDromData = res.data2
          res.data2.forEach(item => {
            this.sDromData.push(item)
          });
          this.datatime = res.data
          this.dormid = res.data2[0].dormNum
        } else {
          this.$message.error("登陆失效,请重新登陆")
        }
      })
    },
    methods: {
      timechange() {
        checkdorm(this.dormid, this.value, this.isqualified.value).then(res => {
          this.sDromData = res
        })
      },
      details(index, row) {
        this.dormtext = row.qualifiedDescribe
        if (row.qualifiedPicture == null) {
          this.srcList = []
        } else {
          this.srcList = row.qualifiedPicture.split(',')
        }
        this.Dormrow = row
        changesread(row.checkTime, row.dormNum, row.feedbackDescribe,
          row.feedbackPicture, row.id, row.readIt, row.state, row.stuReadIt,
          row.unqualifiedDescribe, row.unqualifiedPicture).then()
        if (row.stuReadIt == 'unread') {
          this.$store.state.count--
          this.ishad.push('')
          this.ishad[index] = true
        }
        if (this.$store.state.count == 0) {
          this.$store.state.ismess = false
          this.$store.state.isshowmess = true
        }
        setTimeout(() => {
          this.dialogVisible = true
        }, 100);
      },
      sendqualified() {
        this.$refs.textref.validate(valid => {
          if (valid) {
            this.dialogVisible = false;
            this.qualifiedVisible = false;
            this.$refs.imgupload.submit();
            this.Dormrow.feedbackDescribe = this.textareaForm.qualifiedtext
            setTimeout(() => {
              console.log(this.Picturepath);
              this.Dormrow.feedbackPicture = this.Picturepath.join(',')
              feedteacher(this.Dormrow.checkTime, this.Dormrow.dormNum, this.Dormrow.feedbackDescribe,
                  this.Dormrow.feedbackPicture, this.Dormrow.id, this.Dormrow.readIt, this.Dormrow.state,
                  this.Dormrow.stuReadIt, this.Dormrow.unqualifiedDescribe, this.Dormrow.unqualifiedPicture)
                .then(res => {
                  if (res.code === 200) {
                    this.$message.success("反馈成功")
                    this.Picturepath = []
                  } else {
                    this.$message.error("反馈失败,请重试")
                  }
                }),
                changesread(this.Dormrow.checkTime, this.Dormrow.dormNum, this.Dormrow.feedbackDescribe,
                  this.Dormrow.feedbackPicture, this.Dormrow.id, this.Dormrow.readIt, this.Dormrow.state,
                  this.Dormrow.stuReadIt, this.Dormrow.unqualifiedDescribe, this.Dormrow.unqualifiedPicture)
                .then(res => {
                  if (res.code === 200) {
                    this.Picturepath = []
                  }
                })
                 let colla = window.sessionStorage.getItem('collegeAbbreviation')
                 client.send(`dorm${colla}`,{},1)
                 }, 5000);
          } else this.$message.error("请输入反馈描述")
        }) 
         
      },
      handleSuccess(response) {
        this.Picturepath.push(response.data)
        // console.log(response.data);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.imgdialogVisible = true;
      },
      handleExceed(files) {
        this.$message.warning(`最多上传3张图片`);
      },
      handleError(err, file) {
        this.$message.error("图片上传失败,请重新登录后重试！")
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

  .imgupload {
    margin-top: 30px;
    width: 725px;
    height: 200px;
    border: solid 1px;
  }

  .dorming {
    display: inline-block;
    margin-top: 30px;
    margin-left: 5px;
  }

  .el-upload {
    float: left;
    height: 100px;
    width: 50px;

  }
</style>