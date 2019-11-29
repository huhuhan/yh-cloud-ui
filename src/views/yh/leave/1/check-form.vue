<template>
    <!-- 审核 弹框 -->
    <el-dialog title="办理审核"
               :visible.sync="visible"
               :before-close="close"
               width="600px">
        <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="100px">

            <el-form-item label="审核意见">
                <el-input type="textarea" v-model="checkForm.checkMsg"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toComplete('checkForm', false)" icon="el-icon-check">不同意</el-button>
            <el-button type="primary" @click="toComplete('checkForm', true)" icon="el-icon-check">同 意</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { completeLeaveTask } from '../../../../api/yh.act.leave'

  export default {
    name: 'check-form',
    props: {
      taskId: String,
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        checkRules: {},
        checkForm: {
          checkMsg: '',
          taskId: this.taskId,
        },
      }
    },
    methods: {
      refreshTable () {
        this.$emit('refresh')
      },
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)

      },
      toComplete (formName, passFlag) {
        let param = Object.assign(this.$refs[formName].model, {
          passFlag,
        })
        console.log(param)
        completeLeaveTask(param).finally(() => {
          if (passFlag) {
            this.$message({
              type: 'success',
              message: '审批通过!'
            })
          } else {
            this.$message({
              type: 'info',
              message: '审批不通过'
            })
          }
          this.close()
          this.refreshTable()
        })
      },
    }
  }
</script>

<style scoped>

</style>
