<template>
	<div>
		<el-upload class="upload-demo" drag action="http://111.75.252.147/score/sendFiveOne" with-credentials :limit='1'
			:disabled='isupload' :on-error='erroruplaod' :on-progress='progressupload' :on-success='successupload'>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			  <div class="el-upload__tip" slot="tip">请将所有五个一作业以一个压缩包的形式提交</div>
		</el-upload>
		<el-button :disabled='isdisabled' type="success" @click="upload">提交</el-button>
	</div>
</template>

<script>
	import {sendmess,client} from "@/network/config/mqtt";
	import {getsinfor} from '@/network/student/sinfor';
	import {submitfiveone} from '@/network/student/fiveone';
	export default {
		name: 'index',
		data() {
			return {
				username: '',
				stuNum: '',
				className: '',
				headmaster: '',
				enrollmentYear: '',
				over: '',
				semester: '',
				year: '',
				month: '',
				fiveonepath: '',
				date: '',
				uploadTime: '',
				isdisabled: true,
				isupload:false
			}
		},
		created() {
			let sid = window.sessionStorage.getItem('sid')
			getsinfor(sid).then(res => {
				// console.log(res);
				this.username = res.data.name
				this.stuNum = res.data.stuNum
				this.className = res.data.className
				this.headmaster = res.data.headmasterName
				this.enrollmentYear = res.data.enrollmentYear
				this.college = res.data.college
			})
			this.year = new Date().getFullYear()
			this.month = new Date().getMonth() + 1
			this.date = new Date().getDate()
		},
		methods: {
			successupload(res) {
				this.fiveonepath = res.data
				this.isupload = true
				this.isdisabled = false
			},
			erroruplaod(){
				this.$message.error("上传失败")
			},
			progressupload(){
				this.isupload = true
			},
			upload() {
				this.uploadTime = `${this.year}-${this.month}-${this.date}`
				if (this.month <= 7) {
					this.semester = '上学期'
				} else {
					// this.year = this.year+1
					this.semester = '下学期'
				}
				// this.year= this.year+1
				if (this.year - this.enrollmentYear == 1) {
					this.over = '一'
				} else if (this.year - this.enrollmentYear == 2) {
					this.over = '二'
				} else if (this.year - this.enrollmentYear == 3) {
					this.over = '三'
				} else if (this.year - this.enrollmentYear == 4) {
					this.over = '四'
				} else if (this.year - this.enrollmentYear == 5) {
					this.over = '五'
				} else if (this.year - this.enrollmentYear == 6) {
					this.over = '六'
				} else this.over = 'niu'
				let syeardate = `大${this.over}${this.semester}`
				// console.log(this.username, this.stuNum, this.className, this.college,
				// 	this.headmaster, this.uploadTime, this.fiveonepath,syeardate);
				// console.log(this);
				submitfiveone(this.username,this.stuNum,this.className,this.college,
				this.headmaster,this.uploadTime,this.fiveonepath,syeardate).then(res=>{
					console.log(res);
					if(res.code == 200){
						this.$message.success("提交作业成功")
						this.isdisabled = true
					}
				})
			}
		},
	}
</script>

<style scoped>
	.upload-demo{
	margin-left: 300px;
	margin-top: 150px;
	}
</style>