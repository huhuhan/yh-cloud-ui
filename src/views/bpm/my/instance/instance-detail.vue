<template>
    <div class="detail-content">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="primary" size="mini" @click="dialogTaskHistoryVisible = true">
                    历史
                </el-button>
                <el-button type="primary" size="mini" @click="dialogDefImgVisible = true">
                    流程图
                </el-button>
            </el-col>

            <el-col :span="12" style="text-align:right">
                <el-button type="primary" size="mini" @click="handleDemoBtn">
                    其他按钮
                </el-button>
            </el-col>
        </el-row>

        <el-row>
            <!--表单-->
            <asyncPage v-if="instanceData"
                       :name="instanceData.form.formValue"></asyncPage>
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
  import { BpmGetInstanceData } from '@/api/bpm/bpm'
  import asyncPage from '../../components/form/async-page'

  export default {
    name: 'instance-detail',
    components: {
      asyncPage,
      taskHistoryDialog: () => import('../../components/bpm/task-history'),
      defImgDialog: () => import('../../components/bpm/definition-img')
    },
    mixins: [],
    props: {
      instanceId: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        dialogTaskHistoryVisible: false,
        dialogDefImgVisible: false,

        instanceData: null,
      }
    },
    mounted () {
      this.$log.primary(`first instanceId`)
      this.initData()
    },
    watch: {
      instanceId (newVal, oldVal) {
        this.$log.primary(`instanceId   newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.initData()
        }
      }
    },
    methods: {
      initData () {
        BpmGetInstanceData(
          undefined,
          undefined,
          this.instanceId
        ).then(res => {
          this.instanceData = res.data
          this.$log.default('根据instanceId获取详情数据')
        })
      },
      handleDemoBtn () {
        this.$emit('closeDialog')
      },
      close () {
        this.$emit('closeDialog')
      },
      refresh () {
        this.$emit('refresh')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

