<template>
  <div class="detail-content" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="handleStartWF">
          发起
        </el-button>
        <el-button type="primary" size="mini" @click="dialogDefImgVisible = true">
          流程图
        </el-button>
      </el-col>

      <el-col :span="12" style="text-align:right">
        <!--<el-button type="primary" size="mini" @click="handleDemoBtn">
          其他按钮
        </el-button>-->
      </el-col>
    </el-row>

    <el-row>
      <!--表单-->
      <asyncPage v-if="instanceData" ref="asyncPage" :name="instanceData.form.formValue" :bizObj="bizObj"
                 :flowObj="flowObj"></asyncPage>
    </el-row>


    <def-img-dialog v-if="definition" :definitionId="definition.id" :visible.sync="dialogDefImgVisible"
                    :isInnerDialog="true"></def-img-dialog>
  </div>
</template>

<script>
  import {BpmGetInstanceData, BpmInstanceDoAction} from '@/api/bpm/wf'
  import {BpmInstanceAction} from '@/api/bpm/constant'
  import asyncPage from '../../form/async-page'

  /**
   * 通用流程组件，尽量不要加入业务相关代码、写死业务逻辑
   */
  export default {
    name: 'definition-detail',
    components: {
      asyncPage,
      defImgDialog: () => import('../../components/bpm/definition-img'),
    },
    mixins: [],
    props: {
      definition: {
        type: Object,
        default: undefined
      }
    },
    data() {
      return {
        dialogDefImgVisible: false,
        instanceData: null,
        loading: false,
        //传入异步表单组件的对象
        bizObj: undefined,
        flowObj: undefined
      }
    },
    watch: {
      'definition.id'(newVal, oldVal) {
        this.$log.primary(`newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.initData()
        }
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        this.loading = true
        if (this.definition) {
          await BpmGetInstanceData(
            this.definition.id
          ).then(res => {
            this.instanceData = res.data
            this.flowObj = {
              ...{
                from: '流程',
                id: this.definition.id,
                definitionId: this.definition.id,
                nodeId: 'StartNoneEvent1',
                nodes: this.instanceData.nodes || [],
              }
            }
          })
        }
        this.loading = false
      },
      handleStartWF() {
        /**
         * 需要验证的表单，重写前置方法，返回true/false
         */
        let startValidate = this.$refs.asyncPage.toStartValidate()
        startValidate.then(r => {
          if (r) {
            return this.$refs.asyncPage.toSave()
          } else {
            return new Promise(resolve => resolve({
              ok: false,
              startBeforeValidateIsFalse: true
            }))
          }
        }).then(res => {
          console.log(`流程启动前验证结果：`, res)
          if (res.ok) {
            BpmInstanceDoAction({
              action: BpmInstanceAction.start.key,
              defId: this.definition.id,
              businessKey: res.data.businessKey,
              data: res.data
            }).then(res => {
              this.$log.default(`流程启动成功InstanceId：${res.data}`)
              this.$refs.asyncPage.toSaveCallBack(res.data)
              this.$message.success("流程启动成功")
              this.$emit('closeDialog')
            })
          } else {
            //message提示由前置方法给出，这里仅日志提示
            if (res.startBeforeValidateIsFalse) {
              this.$log.warning("表单已实现前置方法【startBeforeValidate】，验证不通过")
            } else {
              this.$log.warning("表单验证通过，但未保存成功！")
            }
          }
        })

      },
      handleDemoBtn() {
        this.$emit('closeDialog')
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
