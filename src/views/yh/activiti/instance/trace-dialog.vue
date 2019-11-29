<template>
    <!--跟踪节点-->
    <el-dialog
            key="traceDialog"
            title="跟踪节点"
            :visible.sync="visible"
            :before-close="close"
            @open="initImg"
            width="600px">
        <div class="block">
            <el-image v-show="traceChange" :src="processImg1"></el-image>
            <el-image v-show="!traceChange" :src="processImg2"></el-image>
        </div>
    </el-dialog>
</template>

<script>
  import { traceNodeImg} from '../../../../api/yh.activiti'

  export default {
    name: 'leave-form',
    props: {
      processInstanceId: String,
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        traceTimer: null,
        traceChange: true,
        processImg1: null,
        processImg2: null,
      }
    },
    created () {
      // debugger
    },
    methods: {
      refreshTable () {
        this.$emit('refresh')
      },
      close () {
        clearInterval(this.traceTimer)
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      initImg () {
        console.log('initImg')
        traceNodeImg(this.processInstanceId).then(res => {
          let base64ImgPrefix = 'data:image/png;base64,'
          this.processImg1 = base64ImgPrefix + res.imageCurrentNode
          this.processImg2 = base64ImgPrefix + res.imageNoCurrentNode

          this.traceChange = true
          let _that = this
          this.traceTimer = setInterval(function () {
            if (_that.traceChange) {
              _that.traceChange = false
            } else {
              _that.traceChange = true
            }
          }, 1000)

        }).catch(err => console.log(err))
      }

    }
  }
</script>

<style scoped>

</style>
