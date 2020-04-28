<template>
    <el-dialog :append-to-body="isInnerDialog"
               key="defImgDialog"
               title="流程图"
               :visible.sync="visible"
               :before-close="close"
               @open="openInit">
        <div slot="title" class="dialog-title">
            <span>流程图</span>
        </div>
        <el-image :src="imgRequest()">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
    </el-dialog>
</template>

<script>
  import { BpmImgUrl } from '@/api/agilebpm'

  export default {
    name: 'definition-img',
    props: {
      //可选，没有实例时，为全局流程图；有实例为节点跟踪图
      instanceId: {
        type: String,
        default: ''
      },
      //必需
      definitionId: {
        type: String,
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
    data () {
      return {}
    },
    methods: {
      imgRequest () {
        return BpmImgUrl(this.instanceId, this.definitionId)
      },
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit () {
        this.$log.default('初始化流程图弹窗')
      }
    }
  }
</script>

<style scoped>

</style>
