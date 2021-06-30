<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="400px">

    <el-select v-model="currentSystemId" placeholder="请选择" @change="roleSelectChange">
      <el-option v-for="item in subSystemOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>

    <el-tree :ref="ref"
             v-loading="treeLoading"
             :data="treeData"
             show-checkbox node-key="id"
             :default-checked-keys="treeDefaultCheckedIds"
             :props="treeProps"
             @check="handleCheckChange">

    </el-tree>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    SaveReRole,
    GetResRoleTreeList,
    GetSubsystemList
  } from "@/api/bpm/org.userole"

  export default {
    name: 'dialog-role-resource',
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
        default: "角色资源分配"
      },
      // 当前角色 ID
      target: {
        type: String,
        default: undefined
      },
    },
    data() {
      return {
        // 当前下拉框选择的子系统 ID
        currentSystemId: undefined,
        // 子系统 下拉选项
        subSystemOptions: [],

        // 资源菜单，树形结构
        treeLoading: false,
        ref: 'resourceTree',
        treeData: [],
        treeProps: {
          children: "children",
          label: "name"
        },
        // 回显用，默认选中的节点 ID 集合
        treeDefaultCheckedIds: [],
        // 选中的节点 ID 集合
        treeCheckedIds: [],
      }
    },
    created() {
      this.initResourceData()
    },
    methods: {
      // 角色资源管理平台改变
      roleSelectChange(val) {
        this.currentSystemId = val
        this.getResRoleTreeData()
      },
      // 节点选择触发
      handleCheckChange(data, checked) {
        this.treeCheckedIds = [...(checked.checkedKeys), ...(checked.halfCheckedKeys)]
      },
      // 根据当前角色获取资源菜单
      async getResRoleTreeData() {
        this.treeLoading = true
        await GetResRoleTreeList({
          roleId: this.target,
          systemId: this.currentSystemId
        }).then(res => {
          this.treeData = res.data
          this.treeDefaultCheckedIds = this.getTreeCheckedIds(res.data)
          this.treeLoading = false
        }).catch(err => console.log(err)).finally(() => {
        })
      },
      // 初始化子系统的资源列表，作为下拉框选项
      initResourceData() {
        GetSubsystemList().then(res => {
          this.subSystemOptions = res.rows
          this.currentSystemId = this.subSystemOptions[0].id
        }).catch(err => console.log(err)).finally(() => {
        })
      },
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        this.getResRoleTreeData()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        SaveReRole({
          resIds: this.treeCheckedIds.toString(),
          roleId: this.target,
          systemId: this.currentSystemId
        }).then(res => {
          if (res.code === '200') {
            this.$message.success(res.msg)
            this.close()
          } else {
            let str = res.msg.replace(/\s+|<br>|<\/br>/g, "")
            this.$message.error(str)
          }
        }).catch(err => console.log(err)).finally(() => {
        })
      },
      getTreeCheckedIds(data) {
        let arr = []
        data.forEach(i => {
          if (i.children === undefined || i.children.length === 0) {
            if (i.checked) {
              arr.push(i.id)
            }
          } else {
            arr = arr.concat(...this.getTreeCheckedIds(i.children))
          }
        })
        return arr
      },
    }
  }
</script>

<style scoped>

</style>
