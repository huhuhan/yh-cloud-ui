<template>
  <!-- 子系统弹框 -->
  <el-dialog :title="title === 'create' ? '添加子系统' : '编辑子系统'" width="900px" :close-on-click-modal="false"
             :visible.sync="visible" @open="openInit" :before-close="close">
    <el-form ref="systemForm" :model="systemForm" :inline="true" label-width="130px" label-position="right" size="mini">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="systemForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input value="子系统" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="systemForm.alias" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源地址" prop="url">
        <el-input v-model="systemForm.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源图片" prop="imageFileId">
        <el-upload action class="avatar-uploader" ref="uploadFile" :show-file-list="false" name="file" accept="image/*"
                   :auto-upload="true" :http-request="uploadFiles" v-loading="uploadFileLoading">
          <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="height:30px;width:auto;">tips：1、图片大小不超过1兆</span>
      </el-form-item>
      <el-form-item label="系统背景图" prop="imageFileId">
        <el-upload action class="avatar-uploader" ref="uploadFile" :show-file-list="false" name="file" accept="image/*"
                   :auto-upload="true" :http-request="uploadFiles1" v-loading="uploadFileLoadingBg">
          <img v-if="imageUrlBg" :src="imageUrlBg" class="avatar" style="width:300px;"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="height:30px;width:auto;">tips：1、推荐图片像素1921*940;2、图片大小不超过5兆</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    addSystem,
  } from "@/api/bpm/org.resource"
  import {
    uploadFile,
    sysTemImgUrl,
  } from "@/api/bpm/sys"

  const initForm = {
    alias: "",
    config: "",
    desc: "",
    enabled: 1,
    isDefault: 0,
    name: "",
    type: "system",
    url: "",
    imageFileId: null,
    bgImageFileId: null
  }

  export default {
    name: "dialog-resource-system",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'create'
      },
      target: {
        type: Object,
        default: undefined
      }
    },
    data() {
      return {
        systemForm: initForm,
        imageUrl: "", // 上传图片的路径
        uploadFileLoading: false, // 上传图片的loading
        imageUrlBg: "", //上传系统背景图片
        uploadFileLoadingBg: false, // 上传系统背景图片的loading
      }
    },
    watch: {
      "systemForm.imageFileId": {
        handler(newName, oldName) {
          if (!newName) {
            this.imageUrl = ""
          } else {
            this.imageUrl = sysTemImgUrl(newName)
          }
        },
        immediate: true,
        deep: true
      },
      //系统背景图片
      "systemForm.bgImageFileId": {
        handler(newName, oldName) {
          if (!newName) {
            this.imageUrlBg = ""
          } else {
            this.imageUrlBg = sysTemImgUrl(newName)
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        if (this.title === 'edit') {
          this.systemForm = this.target
        }
        if (this.title === 'create') {
          this.systemForm = initForm
        }
      },
      //上传资源图片
      uploadFiles(param) {
        let imgNames = "jpg,png,jpeg"
        const isLt2M = param.file.size / 1024 / 1024 < 1
        if (!isLt2M) {
          this.$message.error("上传资源图片大小不能超过 1MB!")
          return
        }
        let name = param.file.name.split(".")
        let imgName = name[name.length - 1]
        if (imgNames.indexOf(imgName.toLowerCase()) === -1) {
          this.$message.error("上传资源图片只能是 JPG/png/jpeg 格式!")
          return
        }
        this.uploadFileLoading = true
        uploadFile(param.file).then(res => {
          this.systemForm.imageFileId = res.data
          if (this.systemForm.imageFileId) {
            this.imageUrl = sysTemImgUrl(this.systemForm.imageFileId)
          }
        }).finally(() => {
          this.uploadFileLoading = false
        })
      },
      //上传系统背景图片
      uploadFiles1(param) {
        let imgNames = "jpg,png,jpeg"
        const isLt2M = param.file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error("上传系统背景图片大小不能大于5MB!")
          return
        }
        let name = param.file.name.split(".")
        let imgName = name[name.length - 1]
        if (imgNames.indexOf(imgName.toLowerCase()) === -1) {
          this.$message.error("上传资源图片只能是 JPG/png/jpeg 格式!")
          return
        }
        this.uploadFileLoadingBg = true
        uploadFile(param.file).then(res => {
          this.systemForm.bgImageFileId = res.data
          if (this.systemForm.bgImageFileId) {
            this.imageUrlBg = sysTemImgUrl(this.systemForm.bgImageFileId)
          }
        }).finally(() => {
          this.uploadFileLoadingBg = false
        })
      },
      //点击新增弹框确定按钮
      submit() {
        addSystem(this.systemForm).then(res => {
          this.$refs["systemForm"].resetFields()
          this.systemForm.imageFileId = ""
          this.systemForm.bgImageFileId = ""
          this.imageUrl = ""
          this.imageUrlBg = ""
          this.$message.success("保存成功")
        }).finally(() => {
          this.close()
          this.$emit('refresh')
        })
      },
    }
  }

</script>

<style scoped>

</style>
