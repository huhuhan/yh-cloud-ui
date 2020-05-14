<template>
    <div class="detail-content">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="success" size="mini" @click="handleTaskAgreeDialog">
                    同意
                </el-button>
                <el-button type="danger" size="mini" @click="handleTaskRejectDialog">
                    驳回
                </el-button>
                <el-button type="warning" size="mini" @click="dialogTaskTurnVisible = true">
                    转办
                </el-button>
                <el-button type="primary" size="mini" @click="handleTaskHistoryDialog">
                    历史
                </el-button>
                <el-button type="primary" size="mini" @click="handleShowDefImgDialog">
                    流程图
                </el-button>
            </el-col>

            <el-col :span="12" style="text-align:right">
                <el-button type="primary" size="mini" @click="handleDemoBtn">
                    其他按钮
                </el-button>
            </el-col>
        </el-row>

        <el-row>
            <!--表单-->
            <asyncPage v-if="taskData"
                       :name="taskData.form.formValue"></asyncPage>
        </el-row>

        <agreeDialog
                :task="task"
                :visible.sync="dialogTaskAgreeVisible"
                :isInnerDialog="true"></agreeDialog>

        <rejectDialog
                :task="task"
                :visible.sync="dialogTaskRejectVisible"
                :isInnerDialog="true"></rejectDialog>

        <turnDialog
                :task="task"
                :visible.sync="dialogTaskTurnVisible"
                :isInnerDialog="true"></turnDialog>

        <taskHistoryDialog
                :instanceId="dialog_instanceId"
                :visible.sync="dialogTaskHistoryVisible"
                :isInnerDialog="true"></taskHistoryDialog>

        <def-img-dialog
                :instanceId="dialog_instanceId"
                :definitionId="dialog_definitionId"
                :visible.sync="dialogDefImgVisible"
                :isInnerDialog="true"></def-img-dialog>
    </div>
</template>

<script>
  import { BpmTaskData, BpmImgUrl, BpmStart } from '@/api/agilebpm'
  import asyncPage from '../../form/async-page'

  export default {
    name: 'task-detail',
    components: {
      asyncPage,
      agreeDialog: () => import('./task-agree'),
      rejectDialog: () => import('./task-reject'),
      turnDialog: () => import('./task-turn'),
      taskHistoryDialog: () => import('./task-history'),
      defImgDialog: () => import('../definition/definition-img')
    },
    mixins: [],
    props: {
      task: {
        type: Object,
        default: undefined
      }
    },

    data () {
      return {
        dialogTaskAgreeVisible: false,
        dialogTaskRejectVisible: false,
        dialogTaskTurnVisible: false,
        dialogTaskHistoryVisible: false,
        dialogDefImgVisible: false,
        dialog_instanceId: undefined,
        dialog_definitionId: undefined,
        taskData: null,

      }
    },
    watch: {
      task (newVal, oldVal) {
        this.$log.primary(`task newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.initData()
          this.dialog_instanceId = this.task.instId
          this.dialog_definitionId = this.task.id
        }
      }
    },
    methods: {
      initData () {
        BpmTaskData(this.task.id).then(res => {
          this.taskData = res.data
          console.log('任务详情页，初始化数据')
        })
      },
      handleTaskAgreeDialog () {
        this.dialogTaskAgreeVisible = true
      },
      handleTaskRejectDialog () {
        this.dialogTaskRejectVisible = true
      },
      handleTaskHistoryDialog () {
        this.dialogTaskHistoryVisible = true
      },
      handleShowDefImgDialog () {
        this.dialogDefImgVisible = true
      },
      handleDemoBtn () {
        this.$emit('closeDialog')
      },
      close () {
        this.$emit('closeDialog')
      },
      refresh () {
        this.$emit('refresh')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

