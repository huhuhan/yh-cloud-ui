<template>
    <el-dialog
               class="flow-dialog"
               key="taskHistoryDialog"
               :visible.sync="visible"
               :title="title ? `${subject} -【${title}】` : subject"
               :fullscreen="true"
               :before-close="close"
               @open="openInit">

        <iframe class="flow-editor-frame" :src="src" frameborder="0" scrolling="auto"></iframe>

    </el-dialog>
</template>

<script>

  export default {
    name: 'definition-modeler',
    components: {},
    mixins: [],
    props: {
      title: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: '#'
      },
      visible: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        subject: '流程图设计器',
        filename: __filename
      }
    },
    watch: {
      // src (newVal, oldVal) {
      //   this.$log.primary(newVal)
      //   this.$log.default(oldVal)
      // }
    },
    methods: {
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit () {
        this.$log.default('初始化流程图设计器弹窗')
      },
    }
  }
</script>

<style lang="scss" >
    .flow-editor-frame {
        width: 100%;
        height: -webkit-fill-available;
    }
    //自定义样式
    .flow-dialog {
        .el-dialog__header {
            padding: 5px 5px 5px !important;
        }

        .el-dialog__headerbtn {
            top: 10px !important;
        }

        .el-dialog__body {
            padding: initial !important;
        }
    }
</style>

