<template>
  <el-dialog
          :v-loading="loading"
          :append-to-body="isInnerDialog"
          key="taskHistoryDialog"
          :visible.sync="visible"
          :before-close="close"
          @open="openInit">
    <div slot="title" class="dialog-title">
      <span>驳回</span>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.opinion"></el-input>
      </el-form-item>
      <el-form-item label="回收" v-show="showRecycleBtn">
        <span>并行的其他待办任务</span>
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {BpmTaskDoAction} from '@/api/bpm/wf'
  import {BpmTaskAction} from '@/api/bpm/constant'

  export default {
    name: 'task-reject',
    components: {},
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
      }
    },
    data() {
      return {
        loading: false,
        form: {
          opinion: '',
          delivery: false
        },
        showRecycleBtn: false
      }
    },
    watch: {
      task(newVal, oldVal) {
        this.$log.primary(`流程驳回窗口-任务对象发生变化，new-id： ${newVal ? newVal.id : null}`)
      }
    },
    methods: {
      close() {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form.opinion = ''
        this.form.delivery = false
        this.showRecycleBtn = false
        this.$log.default('初始化驳回弹窗')
      },
      handleConfirm() {
        let param = {
          // destination: 'UserTask2',
          // destination: 'ParallelGateway2',
          extendConf: {
            confirmRecycle: this.form.delivery
          },
          action: BpmTaskAction.reject.key,
          defId: this.task.defId,
          instanceId: this.task.instId,
          nodeId: this.task.nodeId,
          opinion: this.form.opinion,
          taskId: this.task.id
        }
        this.loading = true
        this.confirmToSubmit(param)
      },
      confirmToSubmit(param) {
        BpmTaskDoAction(param).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
            this.close()
            this.toCallBack()
            this.$parent.close()
            this.$parent.refresh()
          } else {
            this.$message.error(res.msg)
          }
          this.loading = true
        }).catch((error) => {
          if (error.message.indexOf('需要回收') !== -1) {
            this.showRecycleBtn = true
          }
        }).finally(() => {
          this.loading = true
        })
      },
      toCallBack() {
        this.$emit('callBack')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

