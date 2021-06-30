<template>
  <div>
    <h1>路由：/demo/fzcs.vue</h1>
    <el-form :model="demoForm" ref="demoForm" label-width="100px" class="demo-dynamic">
      <el-form-item label="下个节点分支">
        <el-select v-model="demoForm.value" placeholder="请选择下个节点分支">
          <el-option label="默认无分支" value="default"></el-option>
          <el-option label="相对分支一" value="first"></el-option>
          <el-option label="相对分支二" value="second"></el-option>
          <el-option label="相对分支三" value="third"></el-option>
          <el-option label="相对分支四" value="fourth"></el-option>
          <el-option label="相对分支五" value="fifth"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
  export default {
    data() {
      return {
        demoForm: {
          value: ''
        }
      }
    },
    methods: {
      /**
       * 流程变量-分支相对序号
       * 重写方法
       * @returns {string}
       */
      vsGetRelativeBranchSequence() {
        return this.demoForm.value === 'default' ? null : this.demoForm.value
      },
    }
  }
</script>
