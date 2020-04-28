<template>
    <div class="detail-content">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="primary" size="mini" @click="handleStartWF">
                    启动
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


        <def-img-dialog v-if="definition"
                        :definitionId="definition.id"
                        :visible.sync="dialogDefImgVisible"
                        :isInnerDialog="true"></def-img-dialog>
    </div>
</template>

<script>
  import { BpmGetInstanceData, BpmStart } from '../../../../api/agilebpm'
  import asyncPage from '../../form/async-page'

  export default {
    name: 'definition-detail',
    components: {
      asyncPage,
      formStart: () => import('../../form/start'),
      defImgDialog: () => import('./definition-img')
    },
    mixins: [],
    props: {
      definition: {
        type: Object,
        default: undefined
      }
    },
    data () {
      return {
        dialogDefImgVisible: false,
        instanceData: null
      }
    },
    watch:{
      'definition.id'(newVal, oldVal){
        this.$log.primary(`newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.initData()
        }
      }
    },
    methods: {
      initData(){
        BpmGetInstanceData(
          this.definition.id
        ).then(res => {
          this.instanceData = res.data
        })
      },
      handleStartWF () {
        BpmStart(this.definition.id).then(res => {
          console.log('流程启动成功，res：' + res)
          this.$message.success("流程启动成功")
          this.$emit('closeDialog')
        })
      },
      handleDemoBtn () {
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

