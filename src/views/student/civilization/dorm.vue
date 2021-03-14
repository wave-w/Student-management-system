<template>
  <div>
    <div class="search">
      <el-card class="box-card">
        <el-select v-model="value" placeholder="查寝时间" clearable @change="timechange">
          <el-option v-for="(item,index) in datatime" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="isqualified.value" placeholder="寝室状态" @change="timechange" clearable>
           <el-option label="优秀" value="优秀"></el-option>
          <el-option label="良好" value="良好"></el-option>
          <el-option label="一般" value="一般"></el-option>
          <el-option label="较差" value="较差"></el-option>
          <el-option label="脏乱差" value="脏乱差"></el-option>
        </el-select>
         <!-- <el-select v-model="statenumber" placeholder="次数排序" @change="statenumberchange" clearable style="width:150px">
          <el-option label="优秀" value="优秀"></el-option>
          <el-option label="良好" value="良好"></el-option>
          <el-option label="一般" value="一般"></el-option>
          <el-option label="较差" value="较差"></el-option>
          <el-option label="脏乱差" value="脏乱差"></el-option>
        </el-select> -->
        <el-table :data="sDromData" border class="dromtab" stripe height="300"
          :default-sort="{prop: 'checkTime', order: 'descending'}">
          <el-table-column prop="dormNum" label="寝室号" align='center'>
          </el-table-column>
          <el-table-column prop="checkTime" label="查寝时间" align='center' sortable>
          </el-table-column>
          <el-table-column prop="state" label="状态" align='center'>
            <template slot-scope="scope">
               <el-tag :type="(scope.row.state=='优秀' || scope.row.state=='良好' || scope.row.state=='一般')?s:(scope.row.state=='较差'?w:d)"
               effect="dark">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDescribe" label="详情" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size='small' @click='details(scope.$index,scope.row)'>
                查看 <el-badge :is-dot="(scope.row.stuReadIt=='unread')?t:f" :hidden='ishad[scope.$index]'
                  style="position: absolute;top:.625rem"></el-badge>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="fdyFeedbackReadIt" label="反馈情况" align='center'>
            <template slot-scope="scope">
              <el-tag :type="(scope.row.fdyFeedbackReadIt=='read' )?s:d">
                {{(scope.row.fdyFeedbackReadIt=='unread' )?'老师未读':'老师已读'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
          style="margin-left: 17.5rem; margin-top: 1.25rem;">
        </el-pagination>
      </el-card>
    </div>
    <el-dialog title="寝室详情" :visible="dialogVisible" width="30%" :show-close='false'>
      <el-input type="textarea" autosize placeholder="暂无信息" v-model="dormtext" disabled></el-input>
      <div class="dorming" v-for="(item,index) in srcList" :key="index">
        <el-image style="width: 7.5rem; height: 7.5rem" :src="item" :preview-src-list="srcList">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">确认</el-button>
        <el-button type="primary" @click="dialogVisible = false;qualifiedVisible = true" :disabled='isovertime'>
          {{overtime}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="不合格反馈" :visible="qualifiedVisible" width="50%" :show-close='false' :destroy-on-close='true'>
      <el-alert title="警告" type="warning" description="正在发送反馈消息中.... ，请勿关闭页面" show-icon :closable='false' center
        v-if="isalert" style="position: fixed;top:1.25rem; left: 18.75rem; z-index: 99; width: 62.5rem;"></el-alert>
      <!-- 详细信息输入 -->
      <el-form :model="textareaForm" :rules="rules" ref="textref">
        <el-form-item prop="qualifiedtext">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="textareaForm.qualifiedtext" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 图片上传 -->
      <div class="imgupload">
        <el-upload action="https://cxcy.gmu.cn/score/tupian" list-type="picture-card" ref="imgupload"
          :on-success='handleSuccess' :on-preview="handlePictureCardPreview"  multiple
          :with-credentials='true' :limit="3" :on-exceed="handleExceed" class="uploadstyle" :on-error='handleError'>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="imgdialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <span slot="footer">
        <el-button @click="qualifiedVisible = false" :disabled='isquxiao'>取 消</el-button>
        <el-button type="primary" @click="sendqualified" :disabled='isdisablebtn'>{{showbotton}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import {sendmess,client} from "@/network/config/mqtt";
  import {getsdorm,checkdorm,feedteacher,changesread,uploadimg} from '@/network/student/dorm';
  export default {
    name: '',
    data() {
      return {
        value: '',
        datatime: [],
        isqualified: {
          value: ''
        },
        // statenumber: '',
        sDromData: [],
        s: 'success',
        d: 'danger',
        w:'warning',
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
        },
        showbotton: '确定',
        isdisablebtn: false,
        isquxiao: false,
        currentPage: 1,
        pagesize: 0,
        total: 0,
        pagesizes: [0, 6, 10, 20, 30, 40, 50],
        isalert: false,
        // 老师是否已读
        // istread:false,
        // istype:true,
        isovertime: false,
        overtime: '反馈'
      }
    },
    mounted() {
      let sid = window.sessionStorage.getItem('sid')
      getsdorm(sid).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.total = res.data2.length
          this.pagesize = res.data3
          this.pagesizes[0] = this.pagesize
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
        //  this.statenumber = ''
        checkdorm(this.dormid, this.value, this.isqualified.value, this.currentPage, this.pagesize).then(res => {
          this.sDromData = res.data2
          this.total = res.data
        })
      },
      details(index, row) {
        let feeddays = ((new Date(new Date().toLocaleDateString()).getTime()) -
          (new Date(new Date(row.checkTime).toLocaleDateString()).getTime())) / 86400000; // 当天0点
        if (feeddays >= 3) {
          this.isovertime = true
          this.overtime = '反馈期限已过'
        }
        this.dormtext = row.qualifiedDescribe
        if (row.qualifiedPicture == '' || row.qualifiedPicture == null) {
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
            this.isalert = true
            this.Dormrow.feedbackDescribe = this.textareaForm.qualifiedtext
            this.uploadfeeback()
          } else this.$message.error("请输入符合的反馈描述")
        })
      },
      uploadfeeback() {
        this.showbotton = '反馈中...'
        this.isdisablebtn = true
        this.isquxiao = true
        setTimeout(() => {
          // console.log(this.Picturepath);
          this.dialogVisible = false;
          this.qualifiedVisible = false;
          this.Dormrow.feedbackPicture = this.Picturepath.join(',')
          feedteacher(this.Dormrow.checkTime, this.Dormrow.dormNum, this.Dormrow.feedbackDescribe,
              this.Dormrow.feedbackPicture, this.Dormrow.id, this.Dormrow.readIt, this.Dormrow.state,
              this.Dormrow.stuReadIt, this.Dormrow.unqualifiedDescribe, this.Dormrow.unqualifiedPicture)
            .then(res => {
              // console.log(res);
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
                let colla = window.sessionStorage.getItem('collegeAbbreviation')
                //  this.istread = true
                //  this.istype = false
                //  sendmess(`feed${colla}`,'1').then()
                // client.send(`feed${colla}`, {}, 1)
                //  console.log("send");
                this.Picturepath = []
              }
            })

          this.isdisablebtn = false
          this.isquxiao = false
          this.isalert = false
          this.showbotton = '确定'
        }, 5000);
      },
      handleSuccess(response) {
        this.Picturepath.push(response.data)
        // console.log(response);
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
      handleSizeChange(size) {
        this.pagesize = size
        this.timechange()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.timechange()
      },
      // statenumberchange(){
      //   this.value = ''
      //   this.isqualified.value = ''
      // }
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

  .imgupload {
    margin-top: 1.875rem;
    width: 45.3125rem;
    height: 12.5rem;
    border: solid 1px;
  }

  .dorming {
    display: inline-block;
    margin-top: 1.875rem;
    margin-left: .3125rem;
  }

  .el-upload {
    float: left;
    height: 6.25rem;
    width: 3.125rem;

  }
</style>