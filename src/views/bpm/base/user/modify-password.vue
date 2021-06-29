<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="400px">

    <el-form :model="form" :rules="rules" :ref="ref">

      <el-form-item label="旧密码" prop="oldPassword">
        <el-input placeholder="请输入旧密码" v-model="form.oldPassword" show-password autocomplete="new-password"
                  style="width: 240px;"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input placeholder="请输入新密码" v-model="form.newPassword" show-password autocomplete="new-password"
                  style="width: 240px;"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    ModifyUser,
  } from "@/api/bpm/org.userole"

  const FORM_COLUMN = {
    userId: undefined,
    newPassword: undefined,
    oldPassword: undefined
  }

  export default {
    name: 'dialog-modify-password',
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
        default: "修改密码"
      },
      target: {
        type: Object,
        default() {
          return FORM_COLUMN
        }
      }
    },
    data() {
      return {
        ref: 'form',
        form: this.target,
        rules: {
          oldPassword: [
            {required: true, message: "请输入旧密码", trigger: "blur"}
          ],
          newPassword: [
            {required: true, message: "请输入新密码", trigger: "blur"}
          ]
        },
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
        this.$refs[this.ref].resetFields()
      },
      openInit() {
        this.form = {...this.target}
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$refs[this.ref].validate(async valid => {
          if (valid) {
            ModifyUser(this.form).then(() => {
              this.$message.success("操作成功!")
            }).catch(err => console.log(err)).finally(() => {
              this.close()
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
