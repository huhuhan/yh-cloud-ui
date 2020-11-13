<template>
    <el-dialog :append-to-body="isInnerDialog"
               key="taskHistoryDialog"
               :visible.sync="visible"
               :before-close="close"
               :title="title"
               @open="openInit">
        <!--<div slot="title" class="dialog-title">
            <span>同意</span>
        </div>-->

        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.opinion"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { BpmTaskDoAction } from '@/api/bpm/wf'
  import { BpmTaskAction } from '@/api/bpm/constant'

  export default {
    name: 'task-agree',
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
      },
      title: {
        type: String,
        default: '同意'
      }
    },
    data () {
      return {
        form: {
          opinion: ''
        }
      }
    },
    watch: {
      task (newVal, oldVal) {
        this.$log.primary(`流程同意窗口-任务对象发生变化，new-id： ${newVal ? newVal.id : null}`)
      }
    },
    methods: {
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit () {
        this.form.opinion = ''
        this.$log.default('初始化同意弹窗')
      },
      handleConfirm () {
        BpmTaskDoAction({
          action: BpmTaskAction.agree.key,
          defId: this.task.defId,
          instanceId: this.task.instId,
          nodeId: this.task.nodeId,
          opinion: this.form.opinion,
          taskId: this.task.id
        }).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
            this.toCallBack()
            this.close()
            this.$parent.close()
            this.$parent.refresh()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      toCallBack(){
        this.$emit('callBack')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

