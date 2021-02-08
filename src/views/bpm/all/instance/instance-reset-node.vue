<template>
  <el-dialog :append-to-body="isInnerDialog"
             key="taskHistoryDialog"
             :visible.sync="visible"
             :before-close="close"
             :title="title"
             :width="width"
             @open="openInit">
    <!--<div slot="title" class="dialog-title">
        <span>同意</span>
    </div>-->

    <el-form ref="form" :model="form">
      <el-form-item label="节点">
        <el-switch v-model="showSelectBtn"
                   active-text="选择节点"
                   inactive-text="下个节点"></el-switch>
      </el-form-item>
      <el-form-item label="选择节点" prop="nodeId" v-show="showSelectBtn">
        <el-select v-model="form.nodeId" placeholder="请选择" clearable style="width:178px;">
          <el-option v-for="node in nodes" :label="node.name"
                     :value="node.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {GetFlowElements, CheckToResetNode} from '@/api/bpm/wf'

  export default {
    name: 'reset-node',
    components: {},
    mixins: [],
    props: {
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
        default: '重置节点'
      },
      width: {
        type: String,
        default: '300px'
      },
      instanceId: String,
      definitionId: String,
    },
    data() {
      return {
        nodes: [],
        showSelectBtn: false,
        form: {
          nodeId: undefined,
        }
      }
    },
    watch: {},
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        this.form.nodeId = undefined
        this.showSelectBtn = false
        this.initFlowNodes()
      },
      initFlowNodes() {
        GetFlowElements(this.definitionId).then(res => {
          this.nodes = res.data
        })
      },
      handleConfirm() {
        if (this.showSelectBtn) {
          if (this.form.nodeId) {
            this.toRequest(this.form.nodeId)
          } else {
            this.$message.warning('请选择节点')
          }
        } else {
          this.toRequest(null)
        }
      },
      toRequest(nodeId) {
        CheckToResetNode(this.instanceId, nodeId).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg + " , 请刷新列表！")
          } else {
            this.$message.error(res.msg)
          }
          this.close()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

