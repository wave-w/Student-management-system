<template>
  <div>
    <el-card class="box-card">
      <el-form ref="applyref" :model="applyform" :rules="apprules" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="applyform.username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="学号:" prop="stuNum">
              <el-input v-model="applyform.stuNum" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="班级:" prop="className">
              <el-input v-model="applyform.className" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="班主任:" prop="headmaster">
              <el-input v-model="applyform.headmaster" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="联系电话:" prop="phone">
              <el-input type='number' v-model="applyform.phone" :disabled='isdisabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="班主任电话:" prop="headmasterPhone">
              <el-input type='number' v-model="applyform.headmasterPhone"  :disabled='isdisabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父母电话:" prop="parentPhone">
              <el-input type='number' v-model="applyform.parentPhone"  :disabled='isdisabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="去向:">
                 <v-distpicker @selected='citychange' :province="select.province" 
                 :city="select.city" :area="select.area"   v-if='!isdisabled'></v-distpicker>
                  <el-input type="text" v-model="applyform.whereabouts" disabled  v-if='isdisabled'>
              </el-input>
              <!-- <el-input type='text' v-model="applyform.adress"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item>
              <el-select v-model="applyform.reason" placeholder="请假原因"  :disabled='isdisabled'>
                <el-option label="因事" value="事假"></el-option>
                <el-option label="因病" value="病假"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="请假时间:" >
              <el-date-picker v-model="applyform.data" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="timestamp" @change='timechange' :disabled ='isdisabled'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="具体原因:" prop="specificReasons">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" 
              v-model="applyform.specificReasons"   :disabled='isdisabled'>
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
              <el-button type="primary" @click="send" style="margin-top: 50px;" :disabled ='isdisabled'>{{applytext}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  // import {sendmess,client} from "@/network/config/mqtt";
  import {getsinfor} from '@/network/student/sinfor';
  import VDistpicker from 'v-distpicker'
import { sendapply,getapply,getnadoptapply } from '@/network/student/apply';
  export default {
    name: 'sapply',
    components: {VDistpicker},
    data() {
      return {
        applyform: {
          username: '',
          stuNum: '',
          data: [],
          className: '',
          headmaster: '',
          phone: '', 
          headmasterPhone: '',
          reason: '',
          leavedays: 0,
          parentPhone: '',
          specificReasons: '',
          startdate: '',
          enddate:'',
          whereabouts:'',
          picture:'',
          date:''
        },
        select: { province: '', city: '', area: '' },
        apprules: {
          phone: [{
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          }],
          headmasterPhone: [{
            required: true,
            message: '请输入班主任电话',
            trigger: 'blur'
          }],
          parentPhone: [{
            required: true,
            message: '请输入父母电话',
            trigger: 'blur'
          }],
          whereabouts: [{
            required: true,
            message: '请输入去向',
            trigger: 'blur'
          }],
          specificReasons: [{
            required: true,
            message: '请输入说明',
            trigger: 'blur'
          }]
        },
        imgdialogVisible: false,
        dialogImageUrl: "",
        // 图片路径保存
        Picturepath:[],
        college:window.sessionStorage.getItem('collegeAbbreviation'),
        collegename: window.sessionStorage.getItem('college'),
        classs:window.sessionStorage.getItem('class'),
        isdisabled:false,
        path:[],
        applytext:'申请'
      }
    },       

    methods: {
      send() { 
        // this.select.province = '江西省'
        // this.select.city = '九江市'
        // this.select.area = '永修县'
        this.applyform.picture = this.Picturepath.join(',')
        if(this.applyform.leavedays<=0 || this.applyform.reason.length == 0 || this.applyform.whereabouts.length == 0){
          this.$message.warning('请填写完申请表')
        }else if(this.applyform.reason == '病假' && this.Picturepath.length ==0){
           this.$message.warning('病假请上传图片证明')
        }else{
        sendapply(this.applyform.stuNum,this.applyform.username,this.applyform.className,this.collegename,this.applyform.phone,
          this.applyform.headmaster,this.applyform.headmasterPhone,this.applyform.whereabouts,this.applyform.parentPhone,this.applyform.reason,
          this.applyform.specificReasons,this.applyform.picture,this.applyform.startdate,this.applyform.enddate,this.applyform.leavedays).then(res=>{
             if(res.code == 200){
              //  sendmess(`apply${this.classs}`,'hh').then()
              //  sendmess(`apply${this.classs}`,1).then()
                //  client.send(`apply${this.classs}`, {}, 1)
                //  client.send(`apply1${this.classs}`, {}, JSON.stringify(this.applyform))
                  this.isdisabled = true
                  this.applytext = '申请中...'
                  this.path = this.Picturepath
               this.$message.success("发送请假申请成功,等待老师审核")
             }
           })
        }
      },
      formatDate(date) {  
        var date = new Date(date);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return YY + MM + DD;
      },
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
      // 选择城市
      citychange(data){
         this.applyform.whereabouts = `${data.province.value}${data.city.value}${data.area.value}`
      },
      // 请假时间改变
      timechange(){
        this.applyform.leavedays = ((this.applyform.data[1] - this.applyform.data[0]) / 86400000)+1,
        this.applyform.startdate = this.formatDate(this.applyform.data[0])
        this.applyform.enddate = this.formatDate(this.applyform.data[1])
        this.applyform.date = `${this.applyform.startdate}至${this.applyform.startdate}`
      }
    },
    created() {
      let sid = window.sessionStorage.getItem('sid')
      getsinfor(sid).then(res => {
        this.applyform.username = res.data.name
        this.applyform.stuNum = res.data.stuNum
        this.applyform.className = res.data.className
        this.applyform.headmaster = res.data.headmasterName
      })
      getapply(this.applyform.stuNum,this.applyform.username).then(res=>{
        // console.log(res);
       if(res.data2.length !=0){
          this.isdisabled = true
           this.applytext = '申请中...'
        this.applyform = res.data2[0]
        let arr = []
        arr.push( new Date(res.data2[0].timeOffStart).getTime(),new Date(res.data2[0].timeOffEnd).getTime())
        this.applyform.data = arr
              if (res.data2[0].picture == '' || res.data2[0].picture == null || res.data2[0].picture == "null") {
          this.path = []
        } else {
          this.path = res.data2[0].picture.split(',')
        }
       }
      })
       getnadoptapply(this.applyform.stuNum,this.applyform.username).then(res=>{
        //  console.log(res);
         if(res.data2.length!= 0){
            if(res.data2[0].examineState=='canceling' ||res.data2[0].examineState=='pass' ){
               this.isdisabled = true
               this.applytext = '你还有未注销的请假记录' 
              }
         }
       })
    },
  }
</script>

<style scoped>
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