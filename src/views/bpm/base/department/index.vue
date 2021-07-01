<template>
  <d2-container>
    <div class="page-style">
      <el-row>
        <el-col class="page-table">
          <el-table v-loading="table.listLoading" :data="table.list" row-key="id" style="width:100%;" border
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="name" label="组织名称"></el-table-column>
            <el-table-column prop="code" label="组织编码"></el-table-column>
            <el-table-column prop="sn" label="排序"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-tooltip content="添加子级" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="openCreateDepartmentDialog(scope.$index, scope.row)"
                             icon="el-icon-plus"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="分配用户" placement="top" effect="light" v-if="scope.$index !== 0">
                  <el-button @click="openAssignUserDialog(scope.row)" size="mini" type="primary" icon="el-icon-user"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top" effect="light" v-if="scope.$index !== 0">
                  <el-button size="mini" type="primary" @click="openEditDepartmentDialog(scope.$index, scope.row)"
                             icon="el-icon-edit"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light" v-if="scope.$index !== 0">
                  <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)"
                             icon="el-icon-delete" plain></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>


      <!-- 新增|编辑 弹框 -->
      <dialog-modify-department
              :target="modifyDepartmentForm"
              :targetType="modifyDepartmentType"
              @refresh="handleRefreshTable"
              :visible.sync="modifyDepartmentDialogVisible"></dialog-modify-department>

      <!-- 用户分配 弹框 -->
      <dialog-assign-user
              :target="departmentModifyId"
              targetType="GROUP"
              @refresh="handleRefreshTable"
              :visible.sync="assignUserDialogVisible"></dialog-assign-user>

    </div>
  </d2-container>
</template>

<script>
  import {
    GetDepartmentTree,
    DeleteDepartment,
  } from "@/api/bpm/org.group"

  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    components: {
      dialogModifyDepartment: () => import("./modify-department"),
      dialogAssignUser: () => import("../user/assign-user")
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        modifyDepartmentDialogVisible: false,
        assignUserDialogVisible: false,
        departmentModifyId: undefined,
        modifyDepartmentForm: undefined,
        modifyDepartmentType: "CREATE",
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.table.listLoading = true
        GetDepartmentTree().then(res => {
          this.table.list = res.data
        }).finally(() => {
          this.table.listLoading = false
        })
      },
      handleDelete(index, row) {
        this.$confirm("确定删除这条组织信息吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          DeleteDepartment(row.id).then(res => {
            if (res.msg.indexOf("请先移除以下关系") !== -1) {
              let str = res.msg.replace(/\s+|<br>|<\/br>/g, "")
              this.$message.error(str)
            } else {
              this.$message.success(res.msg)
            }
            this.getTableData()
          })
        })
      },
      openCreateDepartmentDialog(index, row) {
        this.modifyDepartmentDialogVisible = true
        this.modifyDepartmentType = 'CREATE'
        this.modifyDepartmentForm = {
          parentId: row.id
        }
      },
      openEditDepartmentDialog(index, row) {
        this.modifyDepartmentDialogVisible = true
        this.modifyDepartmentType = 'EDIT'
        this.modifyDepartmentForm = row
      },
      openAssignUserDialog(row) {
        this.departmentModifyId = row.groupId
        this.assignUserDialogVisible = true
      },
    }
  }

</script>

<style scoped>
</style>
