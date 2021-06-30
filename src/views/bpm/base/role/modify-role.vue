<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit">

    <el-form :model="form" :rules="rules" :ref="ref" :inline="true" label-width="100px" label-position="right"
             size="mini">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name" autocomplete="off" @blur="syncPinyin"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="alias">
        <el-input placeholder="请输入编码" v-model="form.alias" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="form.enabled" placeholder="请选择状态" style="width: 180px;">
          <el-option label="禁用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input style="width: 466px;" type="textarea" :rows="2" placeholder="请输入内容"
                  v-model="form.description"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import {SaveRole} from "@/api/bpm/org.userole"
  import {GetPinyin} from "@/api/bpm/sys.js"

  const FORM_COLUMN = {
    name: undefined,
    alias: undefined,
    enabled: undefined,
    description: undefined
  }

  export default {
    name: 'dialog-modify-role',
    components: {},
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        typ: String,
        default: "CREATE"
      },
      target: {
        type: Object,
        default: function () {
          return FORM_COLUMN
        }
      },
    },
    created() {
    },
    data() {
      return {
        ref: 'form',
        form: this.target,
        rules: {
          name: [{required: true, message: "请输入名称", trigger: "blur"}],
          alias: [{required: true, message: "请输入编码", trigger: "blur"}],
          enabled: [{required: true, message: "请选择状态", trigger: "blur"}]
        },
      }
    },
    computed: {
      targetTitle() {
        return this.targetType === 'CREATE' ? `新建角色` : '编辑角色'
      },
    },
    methods: {
      syncPinyin() {
        if (this.form.name) {
          GetPinyin({
            "chinese": this.form.name,
            "type": 1 //全拼
          }).then(res => {
            this.form.alias = res
          }).catch(err => console.log(err)).finally(() => {
          })
        }
      },
      close() {
        // this.form = FORM_COLUMN;
        this.$refs[this.ref].resetFields()
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form = {...this.target}
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$refs[this.ref].validate(async valid => {
          if (valid) {
            SaveRole(this.form).then(() => {
              this.$message.success("操作成功!")
            }).catch(err => console.log(err)).finally(() => {
              this.close()
              this.$emit('refresh')
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
