<template>
    <el-dialog :append-to-body="isInnerDialog"
               key="taskHistoryDialog"
               :visible.sync="visible"
               :before-close="close"
               @open="openInit">
        <div slot="title" class="dialog-title">
            <span>转办</span>
        </div>

        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.opinion"></el-input>
            </el-form-item>
        </el-form>

        <el-form ref="form" :model="form.user" label-width="80px">
            <el-form-item label="用户">
                <span>{{form.user.fullname_}}</span>
                <el-button type="primary" @click="dialogTaskUserVisible = true">选择用户</el-button>
            </el-form-item>
        </el-form>

        <taskUserDialog @confirmUser="confirmTaskUser"
                        :visible.sync="dialogTaskUserVisible"
                        :fullscreen="dialogTaskUserFullscreen"
                        :isInnerDialog="true"></taskUserDialog>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import {BpmTaskDoAction} from '@/api/bpm/bpm'
  import {BpmTaskAction} from '@/api/bpm/constant'

  export default {
    name: 'task-turn',
    components: {
      taskUserDialog: () => import('./task-user')
    },
    mixins: [],
    props: {
      task: {
        type: Object,
        default: undefined
      },
      visible: {
        type: Boolean,
        default: false
      },
      isInnerDialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        form: {
          opinion: '',
          user: {}
        },
        dialogTaskUserFullscreen: false,
        dialogTaskUserVisible: false,
      }
    },
    watch: {
      task(newVal, oldVal) {
        this.$log.primary(`流程转办窗口-任务对象发生变化，new-id： ${newVal ? newVal.id : null}`)
      }
    },
    methods: {
      close() {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form = {
          opinion: '',
          user: {}
        }
        this.$log.default('初始化转办弹窗')
      },
      handleConfirm() {
        if (this.form.user.id_ == undefined) {
          this.$message.warning('请选择用户')
          return
        }
        let nodeUsers = {}
        nodeUsers[`${this.task.nodeId}`] = [{
          id: this.form.user.id_,
          name: this.form.user.fullname_,
          type: 'user'
        }]
        BpmTaskDoAction({
          action: BpmTaskAction.turn.key,
          defId: this.task.defId,
          instanceId: this.task.instId,
          nodeId: this.task.nodeId,
          opinion: this.form.opinion,
          taskId: this.task.id,
          nodeUsers
        }).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.close()
          this.$parent.refresh()
          this.$parent.close()
        })
      },
      confirmTaskUser(taskUser) {
        if (taskUser == undefined) {
          this.$message.warning('请选择用户')
          return
        }
        this.form.user = taskUser
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

