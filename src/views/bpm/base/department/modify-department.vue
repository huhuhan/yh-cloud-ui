<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit">

    <el-form :model="form" :rules="rules" :ref="ref" :inline="true" label-width="100px" label-position="right"
             size="mini">
      <el-form-item label="组织名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" @blur="syncPinyin"></el-input>
      </el-form-item>
      <el-form-item label="组织编码" prop="code">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sn">
        <el-input v-model="form.sn" type="number" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级编号">
        <el-input v-model="form.parentId" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import {SaveDepartment, GetDepartment} from "@/api/bpm/org.group"
  import {GetPinyin} from "@/api/bpm/sys.js"

  const FORM_COLUMN = {
    name: undefined,
    code: undefined,
    sn: 1,
    parentId: '0', // 默认根组织下级
    adCode: undefined,
    adName: undefined
  }

  export default {
    name: 'dialog-modify-department',
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
    data() {
      return {
        ref: 'form',
        form: this.target,
        rules: {
          name: [{required: true, message: "请输入组织名称", trigger: "blur"}],
          code: [{required: true, message: "请输入组织编码", trigger: "blur"}],
          adCode: [{required: true, message: "请选择行政区划", trigger: "change"}]
        },
      }
    },
    computed: {
      targetTitle() {
        return this.targetType === 'CREATE' ? `新建组织` : '编辑组织'
      },
    },
    methods: {
      async initDepartment() {
        if (this.targetType === 'EDIT' && this.target.id) {
          await GetDepartment(this.target.id).then(res => {
            this.form = res.data
          })
        }
      },
      syncPinyin() {
        if (this.form.name) {
          GetPinyin({
            "chinese": this.form.name,
            "type": 1 //全拼
          }).then(res => {
            this.form.code = res
          })
        }
      },
      close() {
        this.form = FORM_COLUMN
        this.$refs[this.ref].resetFields()
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form = {...this.target}
        this.initDepartment()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$refs[this.ref].validate(async valid => {
          if (valid) {
            SaveDepartment(this.form).then(() => {
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
