<template>
  <div>
    <div class="top"></div>
    <el-card class="box-card">
      <el-form ref="applyref" :model="applyform" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:">
              <el-input v-model="applyform.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号:">
              <el-input v-model="applyform.sid" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班级:">
              <el-input v-model="applyform.class" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班主任:">
              <el-input v-model="applyform.headmaster" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话:">
              <el-input type='number' v-model="applyform.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班主任电话:">
              <el-input type='number' v-model="applyform.headphone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父母电话:">
              <el-input type='number' v-model="applyform.parphone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="去向:">
              <el-input type='text' v-model="applyform.adress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="applyform.region" placeholder="请假原因">
                <el-option label="因事" value="Cause"></el-option>
                <el-option label="因病" value="illness"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请假时间:">
              <el-date-picker v-model="applyform.data" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="具体原因:">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="applyform.textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="send">申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import {
    client,
    connect
  } from "@/network/config/mqtt";
  import {
    getsinfor
  } from '@/network/student/sinfor';
  export default {
    name: 'sapply',
    data() {
      return {
        applyform: {
          name: '',
          sid: '',
          data: [],
          class: '',
          headmaster: '',
          phone: '123',
          headphone: '234',
          region: '',
          applydays: '',
          parphone: '123',
          adress: 'asas',
          textarea: '123',
          date: ''
        },
      }
    },
    methods: {
      send() {
        this.applyform.applydays = (this.applyform.data[1] - this.applyform.data[0]) / 86400000,
          this.applyform.date = this.formatDate(this.applyform.data[0]) + '-' + this.formatDate(this.applyform.data[1])
        client.send('apply', {}, JSON.stringify(this.applyform))
      },
      formatDate(date) {
        var date = new Date(date);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return YY + MM + DD;
      }
    },
    created() {
      connect()
      let sconntime = setInterval(() => {
        if (!client.connected) {
          this.$message.error('网络错误请刷新页面')
        }
      }, 2000)
      setTimeout(() => {
         if (client.connected) {
              clearInterval(sconntime)
        }
      }, 10000);
      let sid = window.sessionStorage.getItem('sid')
      getsinfor(sid).then(res => {
        this.applyform.name = res.data.name
        this.applyform.sid = res.data.stuNum
        this.applyform.class = res.data.className
        this.applyform.headmaster = res.data.headmasterName
      })
    },
    mounted() {
     
    }
  }
</script>

<style scoped>
  .top {
    height: 30px;
  }
</style>