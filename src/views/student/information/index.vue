<template>
    <div>
        <el-card>
            <table border='1' style="margin:auto;" width="800px">
                <tbody>
                    <tr height="50" style="text-align: center;">
                        <td>姓名</td>
                        <td width="100">{{stuinfor.name}}</td>
                        <td width="100">性别</td>
                        <td width="100">{{stuinfor.sex}}</td>
                        <td>班主任</td>
                        <td>{{stuinfor.headmasterName}}</td>
                        <td rowspan="3" width="120">照片</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>学号</td>
                        <td colspan='2'>{{stuinfor.stuNum}}</td>
                        <td>学院</td>
                        <td colspan='2'>{{stuinfor.college}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>班级</td>
                        <td colspan="2">{{stuinfor.className}}</td>
                        <td>专业</td>
                        <td colspan="2">{{stuinfor.major}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>籍贯</td>
                        <td colspan="2">{{stuinfor.registeredResidence}}</td>
                        <td>入学年份</td>
                        <td>{{stuinfor.enrollmentYear}}</td>
                        <td>寝室</td>
                        <td>{{stuinfor.dormNum}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>身份证号码</td>
                        <td colspan="3">{{stuinfor.idNumber}}</td>
                        <td>联系电话</td>
                        <td colspan="2">{{stuinfor.phone}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>父母电话</td>
                        <td colspan="3">{{stuinfor.parentsPhone}}</td>
                        <td>班主任电话</td>
                        <td colspan="2">{{stuinfor.headmasterPhone}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>政治面貌</td>
                        <td colspan="3">{{stuinfor.politicalOutlook}}</td>
                        <td>出身年月</td>
                        <td colspan="2">{{stuinfor.birthday}}</td>
                    </tr>
                    <tr height="50" style="text-align: center;">
                        <td>教育制度</td>
                        <td>{{stuinfor.educationalSystem}}</td>
                        <td>国籍</td>
                        <td>{{stuinfor.homeAddress}}</td>
                        <td>电子邮箱</td>
                        <td colspan="2">{{stuinfor.militaryParticipation}}</td>
                    </tr>
                    <tr>
                        <td colspan="7" align="center" height='30'><strong>个人评价</strong></td>
                    </tr>
                     <tr>
                         <td colspan="7" height="100">
                         </td>
                     </tr>
                </tbody>
            </table>
        </el-card>
    </div>
</template>
<script>
    import {getsinfor} from '@/network/student/sinfor';
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
                // console.log(res);
                this.stuinfor = res.data
                window.sessionStorage.setItem('collegeAbbreviation', res.data.collegeAbbreviation)
                window.sessionStorage.setItem('sdormnum', res.data.dormNum)
                window.sessionStorage.setItem('college', res.data.college)
                window.sessionStorage.setItem('class', res.data3)
            })
        },
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
    }

    table,
    td.th {
        border: 1px solid blue;
    }
</style>