<template>
  <div>
    <div class="maincadrestable">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:876px"
        @selection-change="handleSelectionChange" border stripe height="400px">
        <el-table-column type="selection" width="55px" align="center">
        </el-table-column>
        <el-table-column label="id"  prop="id"  width="120" align='center'>
          <!-- <template #default="scope">{{ scope.row.id }}</template> -->
        </el-table-column>
        <el-table-column prop="stuNum" label="账号" width="150" align='center'>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="150" align='center'>
        </el-table-column>
        <el-table-column prop="college" label="学院" width="200px" show-overflow-tooltip align='center'>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btnbox">
        <el-button type="success" @click="dialogVisible = true" style="margin:20px">添加账号</el-button>
        <el-button type="danger" @click="deletedialogVisible = true" style="margin:20px">删除账号</el-button>
      </div>
    </div>

    <div class="eldigo">
      <el-dialog title="添加学生干部账号" :visible="dialogVisible" width="50%" :show-close='false'>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" c>
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="truepassword">
            <el-input v-model="ruleForm.truepassword" type="password"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false;ruleForm = {}">取 消</el-button>
            <el-button type="primary" @click="addcadres">确 定</el-button>
          </span>
        </template>
      </el-dialog>

          <el-dialog title="确认删除账号" :visible="deletedialogVisible" width="50%" :show-close='false'>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deletedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deletecadres">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getcadrescount,
    addcadrescount,deletecadrescount
  } from '@/network/teacher/cadres'
  export default {
    name: '',
    data() {
      return {
        college: '',
        tableData: [],
        dialogVisible: false,
        deletedialogVisible:false,
        deletearr:[],
        ruleForm: {
          username: '',
          name: '',
          password: '',
          truepassword: ''
        },
        rules:{
           username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
            name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
            password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
            truepassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.college = window.sessionStorage.getItem('college')
    },
    mounted() {
      this.tocadrescount()
    },
    methods: {
      tocadrescount(){
         getcadrescount(this.college, 1, 10000).then(res => {
        this.tableData = res.data2
        // console.log(res);
      })
      },
      handleSelectionChange(val) {
        // console.log(val)
        this.deletearr = []
        val.forEach(item=>{
          this.deletearr.push(item.id)
        })
      },
      handleEdit() {
        console.log("编辑");
      },
      addcadres() {
        // console.log(111);
        this.$refs.ruleForm.validate(validate=>{
          if(validate){
          if(this.ruleForm.password!=this.ruleForm.truepassword){
            this.$message.error("两次密码输入不一致")
          }else{
            // console.log(111);
              addcadrescount(this.ruleForm.username,this.ruleForm.name,
            this.college,this.ruleForm.truepassword).then(res=>{
              if(res.code==200){
                this.tocadrescount()
                this.$message.success("添加学生干部账号成功")
                this.ruleForm = {}
                this.dialogVisible = false
              }
            })
          }
          } else return;
        })
      },
      deletecadres() {
        let deletevalue = JSON.stringify(this.deletearr).substring(1, JSON.stringify(this.deletearr).length-1)
        //  console.log(deletevalue);
        deletecadrescount(deletevalue).then(res=>{
          // console.log(res);
          if(res.code==200){
            this.$message.success("删除学生账号成功")
            this.deletedialogVisible = false
            this.tocadrescount()
          }else{
            this.$message.error("删除学生账号失败")
             this.deletedialogVisible = false
            this.tocadrescount()
          }
        })
      }
    },
  }
</script>

<style scoped>
  .maincadrestable {
    margin: 100px;
    margin-top: 70px;
    /* background: red; */
  }

  .btnbox {
    position: absolute;
    top: 130px;
    right: 160px;
  }

  /* .eldigo{
    position: absolute;
    height: 200px;
    width: 200px;
    top: 100px;
    left: 400px;
    z-index: 999;
  } */
</style>