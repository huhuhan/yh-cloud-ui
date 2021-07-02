<template>
  <el-popover placement="bottom" trigger="click" popper-class="region-content">
    <region-tree @treeNodeClick="handleClickRegionTreeNode"></region-tree>
    <el-input slot="reference" :value="selectedValue.label" :placeholder="placeholder" clearable
              @clear="handleClearInput"></el-input>
  </el-popover>
</template>

<script>
  import {GetRegionById} from "@/api/bpm/org.region"

  export default {
    components: {
      regionTree: () => import('./region-tree'),
    },
    props: {
      value: {
        type: String,
        default: ""
      },
      defaultLabel: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      byCode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedValue: {
          label: this.defaultLabel,
          value: this.value
        }
      }
    },
    watch: {
      value() {
        this.initValue()
      }
    },
    methods: {
      initValue() {
        if (this.value && this.value.length > 0 && !this.byCode) {
          GetRegionById({id: this.value}).then(res => {
            if (res.data != null) {
              this.selectedValue.label = res.data.adName
              this.selectedValue.value = res.data.id
              this.selectedValue = Object.assign(this.selectedValue, res.data)
            }
          })
        } else {
          this.selectedValue.label = this.defaultLabel
        }
      },
      handleClickRegionTreeNode(data) {
        let hasChanged = false
        if (this.selectedValue.label !== data.adName) {
          hasChanged = true
        }
        this.selectedValue.label = data.adName
        this.selectedValue.value = this.byCode ? data.fwId : data.id

        this.selectedValue = Object.assign(this.selectedValue, data)
        // 外部使用v-model 必须使用$emit('input')完成双向绑定
        this.$emit('input', this.selectedValue.value)
        if (hasChanged) {
          this.handleChange()
        }
      },
      handleClearInput() {
        this.selectedValue = {
          label: "",
          value: ""
        }
        this.$emit('input', '')
      },
      handleChange() {
        this.$emit('change', this.selectedValue)
      },
    }
  }

</script>

<style>
  /* el-popper 与app.vue同级，这里不能使用scoped */
  .region-content {
    height: 247px;
    overflow: auto;
  }

</style>
