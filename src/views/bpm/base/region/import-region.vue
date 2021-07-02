<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="400px">

    <h3 style="text-align:center">请按照模板格式进行填写</h3>
    <el-upload class="upload-demo"
               ref="upload"
               drag action
               :auto-upload="false"
               :http-request="uploadFiles"
               :limit="1"
               v-loading="loading"
               accept=".xls,.xlsx"
               style="text-align:center">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip" style="font-size:14px">只能上传xls/xlsx文件，点击
        <el-link type="primary" download="行政区数据模板.xlsx" :underline="false" href="/bpm/down-template/行政区数据模板.xlsx"><em>下载模板</em>
        </el-link>
      </div>
    </el-upload>

    <div v-show="showResult" class="el-upload-dragger" style="font-size: 13px" v-html="resultHtml"></div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">关 闭</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">上 传</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    ImportRegion
  } from "@/api/bpm/org.region"

  export default {
    name: 'dialog-import-region',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        type: String,
        default: "CREATE"
      },
      targetTitle: {
        type: String,
        default: "导入行政区划"
      },
      target: {
        type: Object,
        default() {
          return {
            name: undefined,
            key: undefined,
            desc: undefined
          }
        }
      }
    },
    data() {
      return {
        ref: 'form',
        form: this.target,
        loading: false,
        resultHtml: "",
        showResult: false
      }
    },
    methods: {
      close() {
        this.$emit('refresh')
        this.$emit('update:visible', false)
      },
      openInit() {
        this.resultHtml = ""
        this.showResult = false
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      uploadFiles(param) {
        this.loading = true
        ImportRegion(param.file).then(res => {
          if (res.isOk) {
            this.$message.success('导入成功')
            this.resultHtml = res.msg
            this.showResult = true
          } else {
            let str = res.msg.replace(/\s+|<br>|<\/br>/g, "")
            this.$message.error(str)
          }
        }).finally(() => {
          this.loading = false
          this.$refs.upload.clearFiles()
        })
      },
      toConfirm() {
        this.$refs.upload.submit()
      },
    }
  }
</script>

<style scoped>

</style>
