<template>
	<div>
		<el-card>
			<el-select class='elselect' v-model="classvalue" placeholder="请选择班级" 
			clearable @change="selectchange" v-if="role!='ROLE_headmaster'">
          <el-option v-for="(item,index) in classarr" :key="index" :label="item" :value="item" >
          </el-option>
        </el-select>
		<el-select class='elselect' v-model="semestervalue" placeholder="请选择学年" clearable @change="selectchange">
          <el-option v-for="(item,index) in semesterarr" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
		 <el-select class='elselect' v-model="isvalue" placeholder="请选择提交状态"  @change="selectchange">
          <el-option label="已交" value="已交"></el-option>
		  <el-option label="未交" value="未交"></el-option>
        </el-select>
		 <el-link :href="downunpass" :underline='false'>
          <el-button type="success" plain style="margin-left: 1.875rem;margin-top: -0.3125rem;">导出未交名单</el-button>
        </el-link>
			<el-table :data="fiveonetable" border stripe style="width: 100%" height="400">
				<el-table-column prop="semester" label="学年" align='center'>
				</el-table-column>
				<el-table-column prop="name" label="姓名" align='center'>
				</el-table-column>
				<el-table-column prop="stuNum" label="学号" align='center'>
				</el-table-column>
				<el-table-column prop="className" label="班级" align='center'>
				</el-table-column>
				<el-table-column prop="headmasterName" label="班主任" align='center'>
				</el-table-column>
				<el-table-column prop="college" label="学院" align='center'>
				</el-table-column>
				<el-table-column prop="uploadTime" label="提交时间" align='center'>
				</el-table-column>
				<el-table-column label="作业" align='center'>
					<template slot-scope="scope">
						<el-link icon="el-icon-download" :href="scope.row.workAddress" 
						:disabled='!(scope.row.workAddress.length !=0)'>{{scope.row.workAddress.length !=0 ? '下载' : '未交'}}
						</el-link>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
      style="margin-left: 17.5rem; margin-top: 1.25rem;">
    </el-pagination>
		</el-card>
	</div>
</template>

<script>
import {getfiveone} from '@/network/teacher/fiveone';
	export default {
		name: '',
		data() {
			return {
				 role: window.sessionStorage.getItem('role'),
				 collegename: window.sessionStorage.getItem('college'),
				 classname: window.sessionStorage.getItem('className'),
				 newrole:'',
				 fiveonetable: [],
				 classarr:[],
				 semesterarr:[],
				 isvalue:'已交',
				 classvalue:'',
				 semestervalue:'',
				 downunpass:'',
				   // 分页
                 currentPage: 1,
                 pagesize: 5,
                 total: 0,
                 pagesizes: [5, 10, 20, 30, 40, 50],
			}
		},
		methods: {
				selectchange(){
					  if (this.role == 'ROLE_headmaster') {
          this.classvalue = this.classname
        }
					getfiveone(this.newrole,this.collegename,this.classvalue,this.semestervalue,
				 this.isvalue,this.currentPage,this.pagesize).then(res=>{
					//  console.log(res);
					 this.classarr = res.data
					 this.semesterarr = res.data3
					 this.fiveonetable = res.data2.records
					 this.total = res.data2.total
				 })
				//  console.log(this.newrole,this.collegename,this.classvalue,this.semestervalue,
				//  this.isvalue,this.currentPage,this.pagesize);
				},
	  			 // 分页
               handleSizeChange(size) {
                      this.pagesize = size
                      this.selectchange()
               },
              handleCurrentChange(page) {
                     this.currentPage = page
                      this.selectchange()
             }
			},
		created() {
			 let str = this.role;
             let reg = new RegExp("ROLE_", "g");
			 this.newrole = str.replace(reg, "");
			 if(this.role == 'ROLE_headmaster'){
						this.classvalue = this.classname
					}else {
						this.classvalue = ""
					}
			 this.downunpass = 
			 `http://111.75.252.147/score/updownload/downUnpass?position=${this.newrole}&className=${this.classvalue}&college=${this.collegename}`
			 this.selectchange()
			},	
	}
</script>

<style scoped>
.elselect{
	margin-right: 50px;
	margin-bottom: 30px;
}
</style>