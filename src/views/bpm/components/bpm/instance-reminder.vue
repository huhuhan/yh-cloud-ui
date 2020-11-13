<template>
  <el-dialog
          :v-loading="loading"
          :append-to-body="isInnerDialog"
          key="taskHistoryDialog"
          :visible.sync="visible"
          :before-close="close"
          @open="openInit">
    <div slot="title" class="dialog-title">
      <span>催办</span>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="催办提醒">
        <el-input type="textarea" v-model="form.opinion"></el-input>
        <el-alert
                title="subject 表示当前流程定义的标题"
                type="info"
                show-icon>
        </el-alert>
      </el-form-item>
      <el-form-item label="消息类型">
        <el-radio v-model="form.msgType" label="email">邮件</el-radio>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {BpmInstanceDoAction} from '@/api/bpm/wf'
  import {BpmInstanceAction} from '@/api/bpm/constant'

  export default {
    name: 'task-reminder',
    components: {},
    mixins: [],
    props: {
      instance: {
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
          msgType: 'email',
          opinion: BpmInstanceAction.reminder.defaultOpinion
        },
      }
    },
    watch: {
      instance(newVal, oldVal) {
        this.$log.primary(`流程催办窗口-实例对象发生变化，new-id： ${newVal ? newVal.id : null}`)
      }
    },
    methods: {
      close() {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form.opinion = BpmInstanceAction.reminder.defaultOpinion
        this.$log.default('初始化催办弹窗')
      },
      handleConfirm() {
        this.loading = true
        let actionConfig = {
          isUrgent: "true",
          msgType: this.form.msgType
        }
        BpmInstanceDoAction({
          action: BpmInstanceAction.reminder.key,
          extendConf: Object.assign({}, actionConfig),
          defId: this.instance.defId,
          instanceId: this.instance.id,
          opinion: this.form.opinion,
        }).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
            this.close()
            // this.$parent.close()
            // this.$parent.refresh()
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

