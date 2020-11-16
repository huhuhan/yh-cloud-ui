<template>
  <div style="padding: 0 30px ">
    <component :is="mode" :bizObj="bizObjX" :flowObj="flowObjX" ref="formPage"></component>
  </div>
</template>

<script>
  import asyncPageMixins from "./async-page-mixins"

  export default {
    name: 'demo-async-page',
    components: {},
    mixins: [asyncPageMixins],
    props: {
      name: {
        type: String,
        default: undefined
      },
    },
    data() {
      return {
        mode: ''
      }
    },
    mounted() {
      //index组件引用task-detail组件（弹窗），再引用此组件，第一次watch无法监听到变化
      //index组件引用task-detail组件（弹窗），task-detail的watch第一次就能监听到变化
      this.getComponent()
    },
    watch: {
      name(newVal, oldVal) {
        this.$log.primary(`demo-async-page  newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.getComponent()
        }
      }
    },
    methods: {
      /**
       * 流程实例【发起】请求前的前置方法
       * 调用业务表单验证
       * @returns {*}
       */
      toStartValidate() {
        try {
          return this.$refs.formPage.startBeforeValidate()
        } catch (e) {
          this.$log.warning('流程实例【发起】请求前的调用方法[startBeforeValidate]：失败或未实现！')
          return new Promise(resolve => resolve(true))
        }
      },
      /**
       * 流程实例【发起】请求前的调用方法
       * 发起页的业务表单必须实现[save]方法
       * @param p
       * @returns {*}
       */
      toSave(p) {
        try {
          return this.$refs.formPage.save(p)
        } catch (e) {
          this.$log.warning('流程实例【发起】请求前的调用方法[save]：失败！')
          return new Promise(resolve => resolve({
            ok: true,
            data: {
              businessKey: new Date().getTime(),
              info: '流程发起表单测试数据'
            }
          }))
        }
      },
      /**
       * 流程实例【发起】成功后回调方法
       * 发起页的业务表单按需实现[saveCallBack]方法
       * @param instanceId
       */
      toSaveCallBack(instanceId) {
        try {
          this.$refs.formPage.saveCallBack(instanceId)
        } catch (e) {
          this.$log.warning('流程实例【发起】成功后回调方法[saveCallBack]：失败！')
        }
      },
      /**
       * 流程任务【同意】成功后的回调方法
       * 业务表单按需实现[agreeCallBack]方法
       */
      toAgreeCallBack() {
        try {
          this.$refs.formPage.agreeCallBack()
        } catch (e) {
          this.$log.warning('流程任务【同意】成功后的回调方法[agreeCallBack]：失败或未实现！')
        }
      },
      /**
       * 流程任务【驳回】成功后的回调方法
       * 业务表单按需实现[rejectCallBack]方法
       */
      toRejectCallBack() {
        try {
          this.$refs.formPage.rejectCallBack()
        } catch (e) {
          this.$log.warning('流程任务【驳回】成功后的回调方法[rejectCallBack]：失败或未实现！')
        }
      },
      /**
       * 流程任务【同意】请求前的前置方法
       * @returns {Promise<any>|*}
       */
      toAgreeValidate() {
        try {
          return this.$refs.formPage.agreeBeforeValidate()
        } catch (e) {
          this.$log.warning('流程任务【同意】请求前的前置方法[agreeBeforeValidate]：失败或未实现！')
          return new Promise(resolve => resolve(true))
        }
      },
      getComponent() {
        if (this.name == undefined) {
          this.mode = new Promise(
            function (resolve) {
              require([`./async-demo`], resolve)
            }
          )
        } else {
          //ES6写法，同上
          let path = /^\//.test(this.name) ? this.name : '/' + this.name
          this.mode = () => import(`.${path}`)
        }
      },
      handleChangeBizObj(newVal) {
      },
      handleChangeFlowObj(newVal) {
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
