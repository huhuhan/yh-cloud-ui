/**
 * BPM填写的表单，即通过async-page引用的组件，必须要引入这个mixins
 */
export default {
  components: {},
  data() {
    return {}
  },
  /**
   * 不要直接用props的对象，页面中用下面computed计算属性
   */
  props: {
    // 业务对象
    bizObj: {
      type: Object
    },
    // 流程对象
    flowObj: {
      type: Object
    }
  },
  /**
   * 计算属性
   */
  computed: {
    bizObjX() {
      return Object.assign({
        id: '', // 业务对象主键
        disabled: false, // 默认可编辑
        showRightDialog: true, //业务弹窗
      }, this.bizObj)
    },
    flowObjX() {
      return Object.assign({
        from: '', // 流程、实例、任务
        id: '', // 当前对象的id
        definitionId: undefined,
        definitionName: undefined,
        instanceId: undefined,
        subject: undefined,
        taskId: undefined,
        nodeId: undefined,
        nodeName: undefined
      }, this.flowObj)
    }
  },
  watch: {
    bizObj(newVal, oldVal) {
      this.handleChangeBizObj(newVal)
    },
    flowObj(newVal, oldVal) {
      this.handleChangeFlowObj(newVal)
    }
  },
  methods: {
    /**
     * 重写方法，日志【按需】修改为表单组件路径，如【/ny/sq】，参考 "./ny/sq"
     * @param newVal
     */
    handleChangeBizObj(newVal) {
      this.$log.primary(`流程表单窗口-业务对象发生变化，表单组件【按需】重写方法，当前业务对象：${this.bizObj.id}`)
    },
    handleChangeFlowObj(newVal) {
      this.$log.primary(`流程表单窗口-流程对象发生变化，表单组件【按需】重写该方法，当前流程对象：${this.flowObj.from}|${this.flowObj.id}`)
    },

    /**
     * 在不改变原有BizObj对象的情况下，修改编辑状态
     * isDisabled为true,修改为不可编辑，为false修改为可编辑
     */
    changeBizObjDisabled(isDisabled) {
      return Object.assign({}, this.bizObjX, {disabled: isDisabled})
    }
  }
}
