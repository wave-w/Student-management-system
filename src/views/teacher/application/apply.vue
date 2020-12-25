<template>
  <div>
    <el-table :data="tableData" border stripe height="550">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="sid" label="学号">
      </el-table-column>
      <el-table-column prop="headmaster" label="班主任">
      </el-table-column>
      <el-table-column prop="phone" label="联系电话">
      </el-table-column>
      <el-table-column prop="headphone" label="班主任电话">
      </el-table-column>
      <el-table-column prop="parphone" label="父母电话">
      </el-table-column>
      <el-table-column prop="adress" label="去向">
      </el-table-column>
      <el-table-column prop="region" label="请假原因">
      </el-table-column>
      <el-table-column prop="date" label="请假时间" width='180px'>
      </el-table-column>
      <el-table-column prop="applydays" label="天数">
      </el-table-column>
      <el-table-column prop="textarea" label="具体说明">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    client,
    connect
  } from "@/network/config/mqtt";
  export default {
    name: '',
    data() {
      return {
        tableData: []
      }
    },
    created() {
      connect()
        let tconntime = setInterval(() => {
        if (!client.connected) {
         this.$message.error("网络请求错误，请刷新页面")
        }
      }, 2000);
        setTimeout(() => {
         if (client.connected) {
              clearInterval(tconntime)
        }
      }, 10000);
    },
    mounted() {
         setTimeout(() => {
            client.subscribe('apply', msg => {
            this.tableData.push(JSON.parse(msg.body))
          }, {})
         }, 1000);
    },
    methods: {

    },
  }
</script>

<style scoped>
</style>