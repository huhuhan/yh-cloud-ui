<template>
  <!-- 资源弹框 -->
  <el-dialog :title="title === 'create' ? '添加资源' : '编辑资源'" :close-on-click-modal="false" :visible.sync="visible"
             @open="openInit" :before-close="close">
    <el-form :model="menuForm" ref="menuForm" :inline="true" label-width="130px" label-position="right" size="mini">
      <el-form-item prop="name" label="资源名称" :rules="{required: true, message: '资源名称不能为空', trigger: 'blur'}">
        <el-input v-model="menuForm.name" autocomplete="off" @blur="syncPinyin"></el-input>
      </el-form-item>
      <el-form-item prop="sn" label="排序">
        <el-input v-model="menuForm.sn" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="url" label="请求地址">
        <el-input v-model="menuForm.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型" :rules="{ required: true, message: '类型不能为空', trigger: 'change' }">
        <el-select v-model="menuForm.type" placeholder="类型" style="width: 185px;">
          <el-option label="首页" value="index"></el-option>
          <el-option label="菜单" value="menu"></el-option>
          <el-option label="按钮" value="button"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="菜单状态">
        <el-select v-model="menuForm.enable" placeholder="状态" style="width: 185px;">
          <el-option label="显示" value="0"></el-option>
          <el-option label="隐藏" value="1"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item prop="alias" label="权限标识" :rules="{ required: true, message: '权限标识不能为空', trigger: 'blur' }">
        <el-input v-model="menuForm.alias" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="parentId" label="上级Id">
        <el-input v-model="menuForm.parentId" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="systemId" label="系统id">
        <el-input v-model="menuForm.systemId" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <d2-icon-select v-model="menuForm.icon"/>
        <d2-icon-select v-model="menuForm.icon" :user-input="true"/>
      </el-form-item>
      <el-form-item class="single-line" prop="prop" label="附加参数">
        <el-input v-model="menuForm.prop" type="textarea" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 一级菜单显示上传图片的功能 -->
      <el-form-item label="资源图片" prop="imageFileId" v-if="this.parentId=='0'">
        <el-upload action class="avatar-uploader" ref="uploadFile" :show-file-list="false" name="file" accept="image/*"
                   :auto-upload="true" :http-request="uploadFiles" v-loading="uploadFileLoading">
          <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
    addMenu
  } from "@/api/bpm/org.resource"
  import d2iconselect from "@/components/d2-icon-select/index"
  import {
    GetPinyin, //得到名称拼音
  } from "@/api/bpm/sys.js"
  import {
    uploadFile, //上传
    sysTemImgUrl, //回显
  } from "@/api/bpm/sys"

  const initForm = {
    name: null,
    opened: "0",
    sn: 1,
    url: "",
    type: "",
    alias: "",
    enable: 1,
    title: "",
    parentId: "",
    systemId: "",
    icon: "",
    prop: "",
    imageFileId: "",
  }
  export default {
    name: "dialog-resource-menu",
    components: {
      "d2-icon-select": d2iconselect // //注册图标组件,"d2-icon-select"对象需与<d2-icon-select v-model="icon" />中d2-icon-select名保持一致
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'create'
      },
      parentId: String,
      systemId: String,
      target: {
        type: Object,
        default: undefined
      }
    },
    data() {
      return {
        menuForm: {...initForm},
        imageUrl: "", // 上传图片的路径
        uploadFileLoading: false, // 上传图片的loading
      }
    },
    watch: {
      "menuForm.imageFileId": {
        handler(newName, oldName) {
          if (!newName) {
            this.imageUrl = ""
          } else {
            this.imageUrl = sysTemImgUrl(newName)
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
        this.$emit('refresh', this.menuForm.systemId)
      },
      openInit() {
        if (this.title === 'edit') {
          this.menuForm = this.target
        }
        if (this.title === 'create') {
          this.menuForm = {...initForm}
        }
      },
      //点击新增弹框确定按钮
      submit() {
        this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            this.menuForm.parentId = this.parentId
            this.menuForm.systemId = this.systemId
            addMenu(this.menuForm).then(res => {
              this.$message.success("保存成功")
            }).finally(() => {
              this.$emit('refresh', this.menuForm.systemId)
              this.close()
            })
          } else {
            return false
          }
        })
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
          this.menuForm.imageFileId = res.data
          if (this.menuForm.imageFileId) {
            this.imageUrl = sysTemImgUrl(this.menuForm.imageFileId)
          }
        }).finally(() => {
          this.uploadFileLoading = false
        })
      },
      //输入名字以后自动获取编码-默认是名称全拼
      syncPinyin() {
        if (this.menuForm.name) {
          GetPinyin(
            {
              "chinese": this.menuForm.name,
              "type": 1 //全拼
            }).then(res => {
            this.menuForm.alias = res
          }).catch(err => console.log(err))
        }
      }
    }
  }

</script>

<style scoped>

</style>
