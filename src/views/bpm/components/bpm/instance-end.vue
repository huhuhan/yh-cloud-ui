<template>
  <!-- todo: 超管终止，未测试 -->
  <el-dialog
          :v-loading="loading"
          :append-to-body="isInnerDialog"
          key="taskHistoryDialog"
          :visible.sync="visible"
          :title="title"
          :before-close="close"
          @open="openInit">
    <!--<div slot="title" class="dialog-title">
      <span>{{title}}</span>
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
  import {BpmInstanceDoAction} from '@/api/bpm/wf'
  import {BpmInstanceAction} from '@/api/bpm/constant'

  export default {
    name: 'instance-end',
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
      },
      title: {
        type: String,
        default: '超管终止'
      }

    },
    data() {
      return {
        loading: false,
        form: {
          opinion: BpmInstanceAction.instanceEnd.defaultOpinion
        },
      }
    },
    watch: {
      instance(newVal, oldVal) {
        this.$log.primary(`流程【${this.title}】窗口-实例对象发生变化，new-id： ${newVal ? newVal.id : null}`)
      }
    },
    methods: {
      close() {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form.opinion = BpmInstanceAction.instanceEnd.defaultOpinion
        this.$log.default(`初始化【${this.title}】弹窗`)
      },
      handleConfirm() {
        this.loading = true
        let actionConfig = {
        }
        BpmInstanceDoAction({
          action: BpmInstanceAction.instanceEnd.key,
          extendConf: Object.assign({}, actionConfig),
          defId: this.instance.defId,
          instanceId: this.instance.id,
          opinion: this.form.opinion,
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
        }).finally(() => {
          this.loading = false
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

