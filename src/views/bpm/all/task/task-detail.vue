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
      <asyncPage v-if="taskData" ref="asyncPage"
                 :bizId="bizObj.id" :bizObj="bizObj" :flowObj="flowObj"
                 :name="taskData.form.formValue"></asyncPage>
    </el-row>

    <agreeDialog
            :task="task"
            :relativeBranchSequence="dialogTaskAgreeRelativeBranchSequence"
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
  import {BpmTaskData, BpmImgUrl, BpmStart} from '@/api/bpm/wf'
  import asyncPage from '../../form/async-page'

  export default {
    name: 'task-detail',
    components: {
      asyncPage,
      agreeDialog: () => import('../../components/bpm/task-agree'),
      rejectDialog: () => import('../../components/bpm/task-reject'),
      turnDialog: () => import('../../components/bpm/task-turn'),
      taskHistoryDialog: () => import('../../components/bpm/task-history'),
      defImgDialog: () => import('../../components/bpm/definition-img')
    },
    mixins: [],
    props: {
      task: {
        type: Object,
        default: undefined
      }
    },

    data() {
      return {
        dialogTaskAgreeVisible: false,
        dialogTaskAgreeRelativeBranchSequence: undefined,
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
      task(newVal, oldVal) {
        this.$log.primary(`task newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.initData()
          this.dialog_instanceId = this.task.instId
          this.dialog_definitionId = this.task.id
        }
      }
    },
    methods: {
      initData() {
        BpmTaskData(this.task.id).then(res => {
          this.taskData = res.data
          console.log('任务详情页，初始化数据')
        })
      },
      handleTaskAgreeDialog() {
        // this.dialogTaskAgreeVisible = true

        /**
         * 需要验证的表单，重写前置方法，返回true/false
         */
        let agreeValidate = this.$refs.asyncPage.toAgreeValidate()
        agreeValidate.then(r => {
          // 流程变量：分支、条件并行的分支相对序号
          this.dialogTaskAgreeRelativeBranchSequence = this.$refs.asyncPage.toGetRelativeBranchSequence()
          if (r) {
            this.dialogTaskAgreeVisible = true
          } else {
            //message提示由前置方法给出，这里仅日志提示
            this.$log.warning("表单已实现前置方法【agreeBeforeValidate】，验证不通过")
          }
        })
      },
      handleTaskRejectDialog() {
        this.dialogTaskRejectVisible = true
      },
      handleTaskHistoryDialog() {
        this.dialogTaskHistoryVisible = true
      },
      handleShowDefImgDialog() {
        this.dialogDefImgVisible = true
      },
      handleDemoBtn() {
        this.$emit('closeDialog')
      },
      close() {
        this.$emit('closeDialog')
      },
      refresh() {
        this.$emit('refresh')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

