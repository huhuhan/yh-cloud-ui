<template>
  <div>
    <!-- 文件上传弹框 -->
    <el-dialog :title="title" width="450px"
               :close-on-click-modal="false"
               :destroy-on-close="destroyClose"
               :visible.sync="visible">
      <el-upload class="upload-demo"
                 ref="upload"
                 drag
                 action
                 :auto-upload="false"
                 :http-request="uploadFiles"
                 :before-upload="beforeUpload"
                 :before-remove="beforeRemove"
                 :on-remove="handleRemove"
                 :on-exceed="handleExceed"
                 :on-preview="handlePreview"
                 :on-error="handleError"
                 :on-progress="handleProgress"
                 :on-success="handleSuccess"
                 :on-change="handleChange"
                 :limit="fileCountLimit"
                 v-loading="loading"
                 :accept="fileAccept"
                 style="text-align:center">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <p>将文件拖到此处，或点击上传</p>
          <p>{{uploadTip}}</p></div>
      </el-upload>

      <div class="dialog-footer">
        <el-button size="mini" type="primary" @click="submit">提交
        </el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
            :title="resultTitle"
            :visible.sync="resultDialogVisible"
            width="600px"
            center
            @close="resultDialogVisible = false">
      <div style="font-size: 13px" v-html="resultHTML"></div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="resultDialogVisible = false">关 闭</el-button>
         </span>
    </el-dialog>
  </div>
</template>

<script>
  const NO_LIMIT = "ALL"

  export default {
    name: "dialog-upload",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '文件上传弹窗'
      },
      resultTitle: {
        type: String,
        default: '结果'
      },
      destroyClose: {
        type: Boolean,
        default: false
      },
      uploadTip: {
        type: String,
        default: '文件上传弹窗提示语'
      },
      fileAccept: {
        type: String,
        default: '' //.xls,.xlsx
      },
      fileType: {
        type: String,
        default: NO_LIMIT //excel
      },
      fileSizeLimit: {
        type: String,
        default: 10 //单位MB
      },
      fileCountLimit: {
        type: Number,
        default: 1
      },
    },
    data() {
      return {
        loading: false,
        resultDialogVisible: false,
        resultHTML: '',
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
      //导入接口
      uploadFiles(params) {
        this.loading = true
        // 调用uploadFile执行上传处理
        this.$emit("uploadFile", params.file, callback => {
          Promise.resolve(callback).then(res => {
            if (res.success) {
              this.$message.success('导入成功')
            } else {
              this.$message.error("导入失败")
            }
            if (res.resultMsg) {
              this.resultHTML = res.resultMsg
              this.resultHTML = this.resultHTML.replace(/\s+|<br>|<\/br>/g, "")
              this.resultDialogVisible = true
            }
            this.close()
            this.loading = false
          })
        })

        /**
         *  父组件的uploadFile方法对象参考如下
         */
        /*submitUploadFile(file, callback) {
          callback(new Promise(resolve => {
          // 可放在请求接口响应后再resolve
            resolve({
                success: true,
                resultMsg: ''
              })
          }))
        }*/
      },
      beforeUpload(file) {
        // debugger
        // console.table(file)
        const NO_LIMIT = "ALL"
        if (NO_LIMIT !== this.fileType && !file.type.includes(this.fileType)) {
          this.$message.warning(`文件类型要求是 ${this.fileType.toLocaleUpperCase()}`)
          return false
        }
        let mbSize = this.fileSizeLimit * 1024 * 1024
        if (file.size > mbSize) {
          this.$message.warning(`文件大小不能超过 ${this.fileSizeLimit} MB`)
          return false
        }
        return true
      },
      handleExceed(files, fileList) {
        // console.table(files)
        // console.table(fileList)
        this.$message.warning(`要求最多选择 ${this.fileCountLimit} 个文件`)
      },
      beforeRemove(file, fileList) {
        return true //this.$confirm(`确定移除 ${file.name}？`)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList)
      },
      handlePreview(file) {
        debugger
        if (file.raw.type.includes("image")) {
          this.$open(file.url)
          return
        }
        this.$message.info(`文件不支持预览`)
      },
      handleSuccess(response, file, fileList) {
        console.log('on-success')
      },
      handleError(err, file, fileList) {
        console.log('on-error')
      },
      handleChange(file, fileList) {
        console.log('on-change')
      },
      handleProgress(event, file, fileList) {
        console.log('on-progress')
      },
      //提交
      submit() {
        this.$refs.upload.submit()
      },
    }
  }
</script>

<style scoped>

</style>
