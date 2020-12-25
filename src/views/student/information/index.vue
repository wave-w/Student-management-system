<template>
	<div class="mainsinf">
		<table border="1" width="100" height="550" align="center" cellspacing="0">
			<tr align="center">
				<td bgcolor="#ededef">姓名:</td>
				<td>{{stuinfor.name}}</td>
				<td bgcolor="#ededed">学号:</td>
				<td>{{stuinfor.stuNum}}</td>
				<td bgcolor="#ededed">性别:</td>
				<td>{{stuinfor.sex}}</td>
			</tr>
			<tr align="center">
				<td bgcolor="#ededed">民族:</td>
				<td>{{stuinfor.nation}}</td>
				<td bgcolor="#ededed">班级:</td>
				<td>{{stuinfor.className}}</td>
				<td bgcolor="#ededed">专业:</td>
				<td>{{stuinfor.major}}</td>
			</tr>
			<tr align="center">
				<td bgcolor="#ededed">入学年份:</td>
				<td>{{stuinfor.enrollmentYear}}</td>
				<td bgcolor="#ededed">班主任:</td>
				<td>{{stuinfor.headmasterName}}</td>
				<td bgcolor="#ededed">班主任电话:</td>
				<td>{{stuinfor.headmasterPhone}}</td>
			</tr>
			<tr align="center">
				<td bgcolor="#ededed">身份证号:</td>
				<td>{{stuinfor.idNumber}}</td>
				<td bgcolor="#ededed">出生年月:</td>
				<td>{{stuinfor.enrollmentYear}}</td>
				<td bgcolor="#ededed">父母电话:</td>
				<td>{{stuinfor.parentsPhone}}</td>
			</tr>
			<tr align="center">
				<td bgcolor="#ededed">省份:</td>
				<td>{{stuinfor.registeredResidence}}</td>
				<td bgcolor="#ededed">联系电话:</td>
				<td>{{stuinfor.phone}}</td>
				<td bgcolor="#ededed">学制:</td>
				<td>{{stuinfor.educationalSystem}}</td>
			</tr>
			<!-- <tr align="center">
				<td bgcolor="#ededed">自我评价</td>
				<td colspan="7"></td>
			</tr> -->
		</table>

	</div>
</template>
<script>
	import {
		getsinfor
	} from '@/network/student/sinfor';
	export default {
		data() {
			return {
				stuinfor: {}
			}
		},
		methods: {},
		created() {
			let sid = window.sessionStorage.getItem('sid')
			getsinfor(sid).then(res => {
				this.stuinfor = res.data
				this.$store.state.dormNum = res.data.dormNum
				window.sessionStorage.setItem('collegeAbbreviation',res.data.collegeAbbreviation)
			})
		},
	}
</script>

<style scoped>
	.mainsinf {
		position: relative;
		margin-left: 180px;
		top: 15px;
	}

	td {
		min-width: 100px;
	}
</style>