<template>
  <el-dialog :title="targetTitle"
             :append-to-body="isInnerDialog"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="500px">

    <div class="el-dialog-div">
      <el-tree default-expand-all
               v-loading="false"
               :data="depTree"
               show-checkbox node-key="id"
               :ref="ref"
               :props="treeProps"
               @check="handleCheckChange">

      </el-tree>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {GetDepartmentTree} from "@/api/bpm/org.group"

  export default {
    name: 'dialog-department-tree',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        type: String,
        default: "CREATE"
      },
      targetTitle: {
        type: String,
        default: "用户组织"
      },
      target: {
        type: Array,
        default: () => []
      },
      isInnerDialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        ref: 'departmentTree',
        depTree: [],
        treeProps: {
          children: "children",
          label: "name"
        },
        checkedData: {},
        checkedLength: 0,
      }
    },
    created() {
      this.initDepartment()
    },
    methods: {
      handleCheckChange(data, checked) {
        this.checkedData = data
        this.checkedLength = checked.checkedKeys.length
        // 重置值，保证只单选！
        this.$refs[this.ref].setCheckedKeys([data.groupId])
      },
      initDepartment() {
        GetDepartmentTree(this.showIcon, this.systemId).then(res => {
          this.depTree = res.data
        })
      },
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        try {
          let groupIds = Array.from(this.target).map(m => m.groupId)
          this.$refs[this.ref].setCheckedKeys(groupIds)
        } catch (e) {
        }
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        let resultData = []
        if (this.checkedLength > 0) {
          resultData.push({
            groupId: this.checkedData.groupId,
            groupName: this.checkedData.groupName,
            type: "groupUser"
          })
        }
        this.close()
        this.$emit("returnDatass", resultData)
      },
    }
  }
</script>

<style scoped>

</style>
