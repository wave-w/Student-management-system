<template>
  <div>
    <el-card  v-if="isshowcard">
      <el-form ref="form" :model="nadoptform" label-width="80px" :rules="nadopt">
      <el-row>
          <el-col :span="10">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="nadoptform.username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="学号:" prop="stuNum">
              <el-input v-model="nadoptform.stuNum" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <el-row>
          <el-col :span="10">
            <el-form-item  label="原因:">
              <el-select v-model="nadoptform.reason" placeholder="请假原因"  disabled>
                <el-option label="因事" value="事假"></el-option>
                <el-option label="因病" value="病假"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="请假时间:" >
              <el-date-picker v-model="nadoptform.data" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="timestamp" disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
             <el-col :span="10">
            <el-form-item label="去向:" prop="whereabouts">
              <el-input v-model="nadoptform.whereabouts" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="具体原因:" prop="specificReasons">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" 
              v-model="nadoptform.specificReasons" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="销假说明:" prop="cancelExplain" label-width="100px">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" 
              v-model="nadoptform.cancelExplain" :disabled='isdisabled'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <div class="imgupload">
              <el-upload action="https://cxcy.gmu.cn/score/tupian" list-type="picture-card" ref="imgupload"
                :on-success='handleSuccess' :on-preview="handlePictureCardPreview" multiple  v-if='!isdisabled'
                :with-credentials='true' :limit="3" :on-exceed="handleExceed" :on-error='handleError'>
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="imgdialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
            <div class="dorming" v-for="(item,index) in path" :key='index'>
             <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="path" v-if="isdisabled">
          <div slot="placeholder">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary"  style="margin-top: 50px;" @click="addopt" :disabled='isdisabled'>{{applyadopt}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <p v-if="!isshowcard">暂无需要销假的假条信息</p>
  </div>
</template>

<script>
import {getsinfor} from '@/network/student/sinfor';
import { getnadoptapply,adoptapply } from '@/network/student/apply';
// import {sendmess,client} from "@/network/config/mqtt";
export default {
  name: '',
 data() {
   return {
      nadoptform:{
          username: '',
          stuNum: '',
          data: [],
          className: '',
          headmaster: '',
          phone: '123', 
          headmasterPhone: '234',
          reason: '',
          leavedays: 0,
          parentPhone: '123',
          specificReasons: '123',
          startdate: '',
          enddate:'',
          whereabouts:'',
          picture:'',
          date:'',
          cancelExplain:'',
          cancelPicture:''
      },
        isshowcard:false,
        isdisabled:false,
        imgdialogVisible: false,
        dialogImageUrl: "",
        Picturepath:[],
        username:'',
        stuNum:'',
        // 销假说明
        adoptteaxt:'',
        path:[],
        applyadopt:'申请销假',
        nadopt:{
           cancelExplain: [{
            required: true,
            message: '请输入反馈描述',
            trigger: 'blur'
          }],
   },
   colla : window.sessionStorage.getItem('collegeAbbreviation'),
   classs:window.sessionStorage.getItem('class'),
   }
 },
 created() {
  //  console.log(`nadopt${this.classs}`);
    let sid = window.sessionStorage.getItem('sid')
      getsinfor(sid).then(res => {
      this.username = res.data.name
      this.stuNum = res.data.stuNum
      // let className = res.data.className
      // let headmaster = res.data.headmasterName
      })
      getnadoptapply(this.stuNum,this.username).then(res=>{
        // console.log(res);
            if(res.data2.length !=0){
               this.isshowcard = true
              this.nadoptform = res.data2[0]
              let arr = []
              arr.push( new Date(res.data2[0].timeOffStart).getTime(),new Date(res.data2[0].timeOffEnd).getTime())
             this.nadoptform.data = arr
              if(res.data2[0].examineState=='canceling'){
               this.isdisabled = true
               this.applyadopt = '申请销假中....' 
               this.path = res.data2[0].cancelPicture.split(',')
              }
              if(res.data2[0].examineState=='uncancel'){
               this.$message('你的销假申请未通过.请重新申请')
               this.nadoptform.cancelExplain = '你的销假申请未通过.请重新申请'
              }
            }
    })
 },
 methods: {
      handleSuccess(response) {
        this.Picturepath.push(response.data)
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
  addopt(){
   this.$refs.form.validate(validate=>{
          if(validate){
           if(this.Picturepath.length != 0){
              this.nadoptform.cancelPicture = this.Picturepath.join(',')
          adoptapply(this.nadoptform.id,this.nadoptform.cancelExplain,this.nadoptform.cancelPicture, this.nadoptform.stuNum,this.nadoptform.username,this.nadoptform.className,this.collegename,this.nadoptform.phone,
          this.nadoptform.headmaster,this.nadoptform.headmasterPhone,this.nadoptform.whereabouts,this.nadoptform.parentPhone,this.nadoptform.reason,
          this.nadoptform.specificReasons,this.nadoptform.picture,this.nadoptform.timeOffStart,this.nadoptform.timeOffEnd,this.nadoptform.leavedays).then(res=>{
           if(res.code == 200){
             this.isdisabled = true
             this.applyadopt = '申请销假中....'
             this.path = this.Picturepath
            //  console.log(res);
            //  console.log(res.data2.whereabouts.substring(0,3) =='江西省');
             if(res.data2.leavedays<2 && res.data2.whereabouts.substring(0,3) =='江西省'){
              //  sendmess(`nadopt${this.classs}`,'1').then()
              //  client.send(`nadopt${this.classs}`, {}, 1)
             }else{
                // sendmess(`nadopt${this.colla}`,'1').then()
              //  client.send(`nadopt${this.colla}`, {}, 1)
             }
           }
          })
           }else this.$message.error('请上传寝室照片等证明已回校')
          }else return;
   })
      }
 },
}
</script>

<style  scoped>
 .imgupload {
    margin-bottom: 20px;
    margin-left: 100px;
  }
   .dorming {
    display: inline-block;
    margin-top: 0;
    margin-left: .3125rem;
  }
</style>