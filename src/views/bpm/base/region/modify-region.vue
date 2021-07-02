<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit">

    <el-form :model="form" :rules="rules" :ref="ref" :inline="true" label-width="130px" label-position="right"
             size="mini">
      <el-form-item label="行政区代码" prop="adCode">
        <el-input placeholder="请输入行政区代码" v-model="form.adCode" autocomplete="off" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="行政区名称" prop="adName">
        <el-input placeholder="请输入行政区名称" v-model="form.adName" autocomplete="off" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="上级行政区" prop="parentId">
        <region-tree-select
                v-model="form.parentId"
                placeholder="请选择上级行政区"></region-tree-select>
      </el-form-item>
      <el-form-item label="行政区级别" prop="level">
        <el-select v-model="form.level" placeholder="请选择行政区级别" style="width:200px;">
          <el-option v-for="(item,i) in regionLevelOptions" :key="i" :label="item" :value="i">
          </el-option>
        </el-select>
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
    GetRegionById,
    SaveRegion,
  }
    from "@/api/bpm/org.region"

  const FORM_COLUMN = {
    id: undefined,
    adCode: undefined,
    adName: undefined,
    level: undefined,
    parentId: undefined,
    children: [],
    enable: 1,
    fwId: undefined,
    remark: undefined
  }

  export default {
    name: 'dialog-modify-region',
    components: {
      regionTreeSelect: () => import('./region-tree-select')
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        typ: String,
        default: "CREATE"
      },
      // 行政区划ID
      target: {
        type: String,
        default: undefined
      },
    },
    data() {
      return {
        ref: 'form',
        form: FORM_COLUMN,
        rules: {
          adName: [{required: true, message: "请输入行政区名称", trigger: "blur"}],
          adCode: [
            {required: true, message: "请输入行政区代码", trigger: "blur"},
            {validator: this.validateForm, trigger: 'blur'}
          ],
          level: [{required: true, message: "请选择行政区级别", trigger: "change"}]
        },
        regionLevelOptions: ["省", "市", "县", "乡/镇", "村/街道", "村小组"],
        showRegionTreeSelect: false
      }
    },
    computed: {
      targetTitle() {
        return this.targetType === 'CREATE' ? `新建行政区划` : '编辑行政区划'
      },
    },
    methods: {
      async initRegion() {
        if (this.target) {
          await GetRegionById({id: this.target}).then(res => {
            this.form = res.data
            this.form.level = res.data.level - 1
            this.form.parentId = res.data.parentId
          })
        }
      },
      close() {
        this.form = FORM_COLUMN
        this.$refs[this.ref].resetFields()
        this.$emit('update:visible', false)
      },
      openInit() {
        this.initRegion()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$refs[this.ref].validate(async valid => {
          if (valid) {
            // 省级（level=0）以外需要上级关联
            if (this.form.level !== 0 && !this.form.parentId) {
              this.$message.warning('请选择上级行政区')
              return
            }

            let param = Object.assign({}, this.form)
            param.level += 1
            param.fwId = param.adCode
            SaveRegion(param).then((res) => {
              if (res.isOk) {
                this.$message.success('保存成功!')
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      validateForm(rule, value, callback) {
        //行政区代码校验，只能输入2、4、6、9、12位数字
        const reg = /(^\d{2}$)|(^\d{4}$)|(^\d{6}$)|(^\d{9}$)|(^\d{12}$)|(^\d{14}$)/
        if (value === '' || value === undefined || value === null) {
          callback()
        } else {
          if ((!reg.test(value)) && value !== '') {
            callback(new Error('请输入正确的行政区代码'))
          } else {
            callback()
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
