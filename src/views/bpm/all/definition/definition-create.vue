<template>
  <el-dialog :title="targetType === 'COPY' ? `复制【${target.originName}】` : '新建流程图' "
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="400px">

    <el-form :model="form" :rules="rules" :ref="ref">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item label="KEY" prop="key">
        <el-input v-model="form.key" placeholder="KEY"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="描述"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toCreate" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {BpmDefinitionCreate, BpmDefinitionCopy} from '@/api/bpm/wf'

  export default {
    name: 'definition-create',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        type: String,
        default: "CREATE"
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
      let validatePass2 = (rule, value, callback) => {
        if (value && !/^[A-Z-a-z]$/.test(value.charAt(0))) {
          callback(new Error('必须以字母开头!'))
        } else {
          callback()
        }
      }
      return {
        ref: 'form',
        form: this.target,
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          key: [
            {required: true, message: '请输入秘钥', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
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
        this.$log.default('初始化新建流程图弹窗')
      },
      toCreate() {
        this.$refs[this.ref].validate(valid => {
          if (valid) {
            if (this.targetType === "COPY") {
              BpmDefinitionCopy(this.target.originKey, this.form.name, this.form.key, this.form.desc).then(res => {
                if (res.isOk) {
                  this.$message.success(res.msg)
                  this.$emit('createSuccess', res.data)
                  this.close()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              BpmDefinitionCreate(this.form.name, this.form.key, this.form.desc).then(res => {
                if (res.isOk) {
                  this.$message.success(res.msg)
                  this.$emit('createSuccess', res.data)
                  this.close()
                } else {
                  this.$message.error(res.msg)
                }
              })
            }

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
