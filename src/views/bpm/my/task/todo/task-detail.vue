<template>
  <div class="detail-content" v-loading="loading">
    <!--<flow-nodes-map :actname="flowObj.nodeName"></flow-nodes-map>-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="success" size="mini" @click="taskAgree">{{isLastTaskNode ? '归档' : '同意'}}</el-button>
        <el-button type="danger" size="mini" @click="dialogTaskRejectVisible = true">驳回</el-button>
        <el-button type="warning" size="mini" @click="dialogTaskTurnVisible = true">转办</el-button>
        <el-button type="primary" size="mini" @click="dialogTaskHistoryVisible = true">历史</el-button>
        <el-button type="primary" size="mini" @click="dialogDefImgVisible = true">流程图</el-button>
        <el-button type="danger" size="mini" @click="dialogTaskManualEndVisible = true">人工终止</el-button>
      </el-col>

    </el-row>

    <el-row>
      <!--表单-->
      <asyncPage v-if="taskData" ref="asyncPage" :name="taskData.form.formValue" :bizId="bizObj.id" :bizObj="bizObj"
                 :flowObj="flowObj"></asyncPage>
    </el-row>

    <agreeDialog :task="task"
                 :title="isLastTaskNode ? '归档' : '同意'"
                 @callBack="handleAgreeCallBack"
                 :visible.sync="dialogTaskAgreeVisible"
                 :isInnerDialog="true"></agreeDialog>

    <rejectDialog :task="task"
                  @callBack="handleRejectCallBack"
                  :visible.sync="dialogTaskRejectVisible"
                  :isInnerDialog="true"></rejectDialog>

    <turnDialog :task="task"
                :visible.sync="dialogTaskTurnVisible"
                :isInnerDialog="true"></turnDialog>

    <taskHistoryDialog :instanceId="flowObj.instanceId"
                       :visible.sync="dialogTaskHistoryVisible"
                       :isInnerDialog="true"></taskHistoryDialog>

    <def-img-dialog :instanceId="flowObj.instanceId"
                    :definitionId="flowObj.definitionId"
                    :visible.sync="dialogDefImgVisible"
                    :isInnerDialog="true"></def-img-dialog>

    <task-manual-end-dialog :task="task"
                            @callBack="handleManualEndCallBack"
                            :visible.sync="dialogTaskManualEndVisible"
                            :isInnerDialog="true"></task-manual-end-dialog>

  </div>
</template>

<script>
  import {BpmTaskData} from '@/api/bpm/wf'
  import asyncPage from '../../../components/form/async-page'

  /**
   * 通用流程组件，尽量不要加入业务相关代码、写死业务逻辑
   */
  export default {
    name: 'todo-task-detail',
    components: {
      asyncPage,
      agreeDialog: () => import('../../../components/bpm/task-agree'),
      rejectDialog: () => import('../../../components/bpm/task-reject'),
      turnDialog: () => import('../../../components/bpm/task-turn'),
      taskHistoryDialog: () => import('../../../components/bpm/task-history'),
      defImgDialog: () => import('../../../components/bpm/definition-img'),
      taskManualEndDialog: () => import('../../../components/bpm/task-manual-end'),
    },
    mixins: [],
    props: {
      task: {
        type: Object,
        default: undefined
      },
    },

    data() {
      return {
        /**
         * 通用流程弹窗属性
         */
        dialogTaskAgreeVisible: false,
        dialogTaskRejectVisible: false,
        dialogTaskTurnVisible: false,
        dialogTaskHistoryVisible: false,
        dialogDefImgVisible: false,
        dialogTaskManualEndVisible: false,
        taskData: null,
        loading: false,

        //传入异步表单组件的对象
        bizObj: {
          id: '', //业务对象主键
          disabled: false, //默认可编辑
          xzqdm: ''
        },
        flowObj: {
          from: '任务',
          id: undefined,
          taskId: undefined,
          nodeId: undefined,
          nodeName: undefined,
          definitionId: undefined,
          instanceId: undefined,
          nodes: [],
        },
      }
    },
    watch: {
      task(newVal, oldVal) {
        this.$log.primary(`任务详情 task 对象发生变化`)
        if (newVal) this.initData()
      }
    },
    computed: {
      isLastTaskNode() {
        return this.flowObj.nodes.length !== 0 ? this.flowObj.nodes[this.flowObj.nodes.length - 1].id === this.flowObj.nodeId : false
      }
    },
    methods: {
      async initData() {
        console.log(this.task)
        this.loading = true
        if (this.task) {
          await BpmTaskData(this.task.id).then(res => {
            this.taskData = res.data
            let taskXzqdm = ""
            if (this.task.bizData) {
              taskXzqdm = JSON.parse(this.task.bizData).adCode
            }
            this.bizObj = Object.assign({}, {
              id: res.data.form.id, //业务对象主键
              disabled: false, //待办可编辑
              xzqdm: taskXzqdm
            })
            this.flowObj = Object.assign(
              this.flowObj, {
                id: this.task.id,
                taskId: this.task.id,
                nodeId: this.task.nodeId,
                nodeName: this.task.name,
                definitionId: this.task.defId,
                instanceId: this.task.instId,
                nodes: this.taskData.nodes || [],
              }
            )
            console.log('任务详情页，初始化数据')
          })
        }
        this.loading = false
      },
      handleDemoBtn() {
        this.$emit('closeDialog')
      },
      close() {
        this.$emit('closeDialog')
      },
      refresh() {
        this.$emit('refresh')
      },
      handleAgreeCallBack() {
        this.$refs.asyncPage.toAgreeCallBack()
      },
      handleRejectCallBack() {
        this.$refs.asyncPage.toRejectCallBack()
      },
      handleManualEndCallBack() {
        this.$refs.asyncPage.toManualEndCallBack()
      },
      taskAgree() {
        /**
         * 需要验证的表单，重写前置方法，返回true/false
         */
        let agreeValidate = this.$refs.asyncPage.toAgreeValidate()
        agreeValidate.then(r => {
          if (r) {
            this.dialogTaskAgreeVisible = true
          } else {
            //message提示由前置方法给出，这里仅日志提示
            this.$log.warning("表单已实现前置方法【agreeBeforeValidate】，验证不通过")
          }
        })
      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
