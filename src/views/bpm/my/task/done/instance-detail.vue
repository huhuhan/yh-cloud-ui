<template>
  <div class="detail-content" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="dialogTaskHistoryVisible = true">历史</el-button>
        <el-button type="primary" size="mini" @click="dialogDefImgVisible = true">流程图</el-button>
      </el-col>

    </el-row>

    <el-row>
      <!--表单-->
      <asyncPage v-if="instanceData"
                 :name="instanceData.form.formValue"
                 :bizId="bizObj.id"
                 :bizObj="bizObj"
                 :flowObj="flowObj"></asyncPage>
    </el-row>

    <taskHistoryDialog v-if="instanceData"
                       :instanceId="instanceData.instance.id"
                       :visible.sync="dialogTaskHistoryVisible"
                       :isInnerDialog="true"></taskHistoryDialog>

    <def-img-dialog v-if="instanceData"
                    :instanceId="instanceData.instance.id"
                    :definitionId="instanceData.instance.defId"
                    :visible.sync="dialogDefImgVisible"
                    :isInnerDialog="true"></def-img-dialog>

  </div>
</template>

<script>
  import {BpmGetInstanceData} from "@/api/bpm/wf"
  import asyncPage from "../../../form/async-page"

  /**
   * 通用流程组件，尽量不要加入业务相关代码、写死业务逻辑
   */
  export default {
    name: "done-instance-detail",
    components: {
      asyncPage,
      taskHistoryDialog: () => import("../../../components/bpm/task-history"),
      defImgDialog: () => import("../../../components/bpm/definition-img"),
    },
    mixins: [],
    props: ['doneTask'],
    data() {
      return {
        dialogTaskHistoryVisible: false,
        dialogDefImgVisible: false,
        loading: false,
        instanceData: null,

        //传入异步表单组件的对象
        bizObj: {
          id: '', //业务对象主键
          disabled: false, //默认可编辑
        },
        flowObj: {
          from: '实例',
          id: undefined,
          taskId: undefined,
          nodeId: undefined,
          nodeName: undefined,
          definitionId: undefined,
          instanceId: undefined
        }
      }
    },
    mounted() {
      this.initData()
    },
    watch: {
      'doneTask.nodeId'(newVal) {
        this.$log.primary(`已办详情的任务节点发生变化，NODE_ID:  ${this.doneTask.nodeId}`)
        if (newVal) this.initData()
      }
    },
    methods: {
      async initData() {
        this.loading = true
        if (this.doneTask) {
          await BpmGetInstanceData(
            undefined,
            this.doneTask.nodeId,
            this.doneTask.id
          ).then(res => {
            this.instanceData = res.data
            this.$log.default("根据instanceId获取详情数据")

            this.bizObj = Object.assign({}, {
              id: this.instanceData.form.id, //业务对象主键
              disabled: true, //已办不可编辑
              isDetail: true //标识为详情查看
            })
            this.flowObj = {
              ...{
                id: this.instanceData.instance.id,
                taskId: this.doneTask.taskId,
                nodeId: this.doneTask.nodeId,
                nodeName: this.doneTask.nodeName,
                definitionId: this.instanceData.instance.defId,
                instanceId: this.instanceData.instance.id,
                nodes: this.instanceData.nodes || [],
              }
            }
          })
        }
        this.loading = false
      }
      ,
      handleDemoBtn() {
        this.$emit("closeDialog")
      }
      ,
      close() {
        this.$emit("closeDialog")
      }
      ,
      refresh() {
        this.$emit("refresh")
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
