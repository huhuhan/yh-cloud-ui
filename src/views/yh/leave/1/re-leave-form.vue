<template>
    <!-- 请假 弹框 -->
    <el-dialog title="调整申请"
               :visible.sync="visible"
               :before-close="close"
               width="600px">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">

            <el-form-item label="开始时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.beginTime"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="请假理由">
                <el-input type="textarea" v-model="form.reason"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toEnd('form', false, '取消申请')">取消申请</el-button>
            <el-button type="primary" @click="toUpdate('form', true, '调整申请')">调整申请</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { completeLeaveTask } from '../../../../api/yh.act.leave'

  export default {
    name: 're-leave-form',
    props: {
      taskId: String,
      visible: {
        type: Boolean,
        default: false
      },
      reForm: Object,
    },
    data () {
      return {
        restart: true,
        form: {
          beginTime: this.reForm.beginTime || undefined,
          endTime: this.reForm.endTime || undefined,
          reason: this.reForm.reason || undefined,
          id: this.reForm.id
        },
        rules: {},
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
      toEnd (formName, passFlag, checkMsg) {
        let param ={
          taskId: this.taskId,
          passFlag,
          checkMsg,
          restart: this.restart
        }
        completeLeaveTask(param).finally(() => {
          this.$message({
            type: 'success',
            message: '取消申请!'
          })
          this.close()
          this.refreshTable()
        })
      },
      toUpdate (formName, passFlag, checkMsg) {
        let param ={
          taskId: this.taskId,
          passFlag,
          checkMsg,
          restart: this.restart,
          form: this.$refs[formName].model
        }
        completeLeaveTask(param).then(res =>{
          this.$message({
            type: 'success',
            message: '重新申请成功!'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '重新申请失败!'
          })
        }).finally(() => {
          this.close()
          this.refreshTable()
        })
      },
    }
  }
</script>

<style scoped>

</style>
