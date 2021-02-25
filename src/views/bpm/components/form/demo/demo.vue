<template>
  <div>
    <h1>路由：/demo/demo</h1>
    <el-form :model="demoForm" ref="demoForm" label-width="100px" class="demo-dynamic">

      <h3>常规表单填写</h3>
      <el-form-item
              label="年龄"
              prop="age"
              label-width="100px"
              :rules="[
      { required: true, message: '年龄不能为空'},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
      >
        <el-input type="age" v-model.number="demoForm.age" autocomplete="off"></el-input>
      </el-form-item>

      <h3>有分支网关情况下，功能演示</h3>
      <el-form-item label="下个节点分支">
        <el-select v-model="demoForm.relativeSeq" placeholder="请选择下个节点分支">
          <el-option label="默认无分支" value="default"></el-option>
          <el-option label="相对分支一" value="first"></el-option>
          <el-option label="相对分支二" value="second"></el-option>
          <el-option label="相对分支三" value="third"></el-option>
          <el-option label="相对分支四" value="fourth"></el-option>
          <el-option label="相对分支五" value="fifth"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm('demoForm')">自定义保存按钮</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
  export default {
    name: 'form-demo',
    data() {
      return {
        demoForm: {
          age: '',
          relativeSeq: ''
        },
        // 发起流程的业务对象
        flowData: {
          ok: false,
          data: {businessKey: undefined}
        },
      }
    },
    // 以下方法，可以考虑集成为mixins，通用JS
    methods: {
      /***********************************************************************************/
      /**
       * 流程【发起】按钮的前置方法一
       * 重写方法，可选
       *
       * @returns {Promise<any>}
       */
      startBeforeValidate() {
        return new Promise(async (resolve, reject) => {
          // 比如表单验证
          await this.$refs[this.formName].validate(valid => {
            resolve(true)
            // resolve(valid)
          })
        })
      },
      /**
       * 流程【发起】按钮的前置方法二
       * 重写方法，必须
       *
       * @returns {*} 业务数据
       */
      save() {
        return new Promise(resolve => {
          // todo: 表单保存
          // todo：或者，分按钮，先保存

          this.flowData.ok = true
          this.flowData.data = Object.assign(this.flowData.data, {
            // 唯一业务号
            businessKey: new Date().getTime(),
            // 其他业务数据
            info: '流程演示表单测试数据'
          })
          resolve(this.flowData)
        })
      },

      /**
       * 流程【发起】按钮的后置方法
       * 重写方法，可选
       * 一般集成在通用mixins中
       *
       * @param instanceId 流程实例ID
       */
      saveCallBack(instanceId) {
        this.$log.primary(`发起业务成功，关联流程实例: ${instanceId}`)
        // 比如，可以绑定到业务表中
      },
      /***********************************************************************************/
      /**
       * 流程【同意】弹窗组件的变量触发方法
       * 作用：存在分支网关时才用，返回设置的分支相对序号
       * 重写方法，可选
       *
       * @returns {string}
       */
      vsGetRelativeBranchSequence() {
        // 当前提供了5个相对分支序号，first到fifth
        return this.demoForm.relativeSeq === 'default' ? null : this.demoForm.relativeSeq
      },
      /***********************************************************************************/
      /**
       * 流程【同意】按钮的前置方法
       * 重写方法，可选
       *
       * @returns {Promise<any>}
       */
      agreeBeforeValidate() {
        return new Promise(async (resolve, reject) => {
          // 比如表单验证
          resolve(true)
        })
      },
      /**
       * 流程【同意】按钮的后置方法
       * 重写方法，可选
       *
       */
      agreeCallBack() {
        // 按需求实现
      },
      /***********************************************************************************/
      /**
       * 流程【驳回】按钮的后置方法
       * 重写方法，可选
       *
       */
      rejectCallBack() {
        // 按需求实现
      },
      /***********************************************************************************/
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          alert('验证结果：' + valid)
        })
      },
    }
  }
</script>
