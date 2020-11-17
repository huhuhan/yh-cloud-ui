<template>
  <div class="detail-content" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="dialogTaskHistoryVisible = true">历史</el-button>
        <el-button type="primary" size="mini" @click="dialogDefImgVisible = true">流程图</el-button>
        <el-button type="primary" size="mini" @click="dialogInstanceReminderVisible = true">催办</el-button>
        <!--<el-button type="primary" size="mini" @click="dialogInstanceEndVisible = true">终止</el-button>-->
        <el-button type="primary" size="mini" @click="dialogInstanceRevokeVisible = true">撤销</el-button>
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
                       :isInnerDialog="true"
                       :showAssign="true"></taskHistoryDialog>

    <def-img-dialog v-if="instanceData"
                    :instanceId="instanceData.instance.id"
                    :definitionId="instanceData.instance.defId"
                    :visible.sync="dialogDefImgVisible"
                    :isInnerDialog="true"></def-img-dialog>

    <instance-reminder-dialog v-if="instanceData"
                              :instance="instanceData.instance"
                              :visible.sync="dialogInstanceReminderVisible"
                              :isInnerDialog="true"></instance-reminder-dialog>

    <!--<instance-end-dialog v-if="instanceData"
                         :instance="instanceData.instance"
                         :visible.sync="dialogInstanceEndVisible"
                         :isInnerDialog="true"></instance-end-dialog>-->
    <instance-revoke-dialog v-if="instanceData"
                            :instance="instanceData.instance"
                            :visible.sync="dialogInstanceRevokeVisible"
                            :isInnerDialog="true"></instance-revoke-dialog>
  </div>
</template>

<script>
  import {BpmGetInstanceData} from '@/api/bpm/wf'
  import asyncPage from '../../components/form/async-page'

  export default {
    name: 'instance-detail',
    components: {
      asyncPage,
      taskHistoryDialog: () => import('../../components/bpm/task-history'),
      defImgDialog: () => import('../../components/bpm/definition-img'),
      instanceReminderDialog: () => import('../../components/bpm/instance-reminder'),
      // instanceEndDialog: () => import('../../components/bpm/instance-end'),
      instanceRevokeDialog: () => import('../../components/bpm/instance-revoke'),
    },
    mixins: [],
    props: {
      instance: {
        type: Object,
        default: undefined
      },
    },
    data() {
      return {
        dialogTaskHistoryVisible: false,
        dialogDefImgVisible: false,
        dialogInstanceReminderVisible: false,
        dialogInstanceEndVisible: false,
        dialogInstanceRevokeVisible: false,
        loading: false,
        instanceData: null,

        //传入异步表单组件的对象
        bizObj: {
          id: '',//业务对象主键
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
      instance(newVal, oldVal) {
        this.$log.primary(`实例详情 instance 发生变化`)
        if (newVal) this.initData()
      }
    },
    methods: {
      async initData() {
        this.loading = true
        if (this.instance) {
          await BpmGetInstanceData(
            undefined,
            undefined,
            this.instance.id
          ).then(res => {
            this.instanceData = res.data
            this.$log.default("根据instanceId获取详情数据")

            this.bizObj = Object.assign({}, {
              id: this.instanceData.form.id,//业务对象主键
              disabled: true, //已办不可编辑
              isDetail: true//标识为详情查看
            })
            this.flowObj = {
              ...{
                id: this.instanceData.instance.id,
                taskId: undefined,
                nodeId: undefined,
                nodeName: undefined,
                definitionId: this.instanceData.instance.defId,
                instanceId: this.instanceData.instance.id,
                nodes: this.instanceData.nodes || [],
              }
            }
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
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
