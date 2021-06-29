<!--弹窗模板参考-->
<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="400px">

    <el-form :model="form" :rules="rules" :ref="ref">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="描述"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'template-dialog',
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
        default: "新建"
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
        rules: {},
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
            // Method(this.form).then(() => {
              this.$message.success("操作成功!")
            // }).catch(err => console.log(err)).finally(() => {
              this.close()
            // })
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
