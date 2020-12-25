<template>
  <el-upload
  ref="upload"
  action="http://123.57.131.175:8080/tupian"
  list-type="picture-card"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :auto-upload="false"
  :before-upload='bromove'
  :on-error='error'>
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
</template>
<script>
  export default {
    data() {
      return {
        header:{
   'Content-Type': 'multipart/form-data',
   }
      };
    },
    methods: {
      submitUpload(file) {
        this.$refs.upload.submit();
        console.log(file)
      },
      handleRemove(file) {
        console.log(file);
      },
      handlePreview(file) {
        console.log(file);
      },
      bromove(file){
        console.log('112',file);
      },
      error(err, file, fileList){
        console.log(err, file, fileList);
      }
    }
  }
</script>