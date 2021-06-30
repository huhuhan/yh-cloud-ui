<!-- 角色管理 -->
<template>
  <d2-container>
    <div class="page-style">
      <el-row>
        <el-col class="page-form">
          <!-- form表单筛选 -->
          <el-form :inline="true" :model="queryForm" ref="queryForms" size="mini">
            <el-form-item label="角色编号" prop="alias_^VRHK">
              <el-input v-model="queryForm['alias_^VRHK']"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="name_^VRHK">
              <el-input v-model="queryForm['name_^VRHK']"></el-input>
            </el-form-item>
            <!--            <el-form-item label="角色状态" prop="enabled_^VEQ">-->
            <!--              <el-select v-model="queryForm['enabled_^VEQ']" clearable>-->
            <!--                <el-option label="全部" value></el-option>-->
            <!--                <el-option label="禁用" value="0"></el-option>-->
            <!--                <el-option label="正常" value="1"></el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="getTableData">
                  <d2-icon name="search"/>
                  查询
                </el-button>
                <el-button type="default" @click="handleFormReset('queryForm')">
                  <d2-icon name="refresh"/>
                  重置
                </el-button>
              </el-button-group>
            </el-form-item>

            <div style="float: right">
              <el-form-item>
                <el-button-group>
                  <el-button type="danger" size="mini" @click="handleBatchDelete"
                             :disabled="multipleSelection.length <= 0">
                    <d2-icon name="plus"/>
                    删除
                  </el-button>
                  <el-button type="success" @click="openCreateRoleDialog">
                    <d2-icon name="plus"/>
                    新建
                  </el-button>
                  <el-button type="warning" v-show="showImportBtn" @click="openImportDialog"
                             icon="el-icon-upload2">
                    导入
                  </el-button>
                </el-button-group>
              </el-form-item>
            </div>

          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="page-table">
          <el-table ref="multipleTable" :data="table.list" v-loading="table.listLoading" tooltip-effect="dark"
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }" :row-style="{ background: '#fff' }"
                    style="width: 100%;" highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <template v-for="item in tableColumns">
              <el-table-column show-overflow-tooltip :sortable="item.sortable" :min-width="item.width" :key="item.label"
                               :prop="item.prop" :label="item.label">
                <template slot-scope="scope">
                  <span v-if="item.prop !== 'enabled'">{{ scope.row[item.prop] }}</span>
                  <div v-else>
                    <el-switch disabled :value="scope.row[item.prop] === '1'" active-color="#13ce66"
                               inactive-color="#23C6C8"></el-switch>
                  </div>
                </template>
              </el-table-column>
            </template>
            <el-table-column fixed="right" align="center" label="操作" min-width="300">
              <template slot-scope="scope">
                <el-tooltip content="编辑" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="openEditRoleDialog(scope.row)" icon="el-icon-edit"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="资源分配" placement="top" effect="light">
                  <el-button @click="openRoleResourceDialog(scope.row)" size="mini" type="primary"
                             icon="el-icon-setting" plain></el-button>
                </el-tooltip>
                <el-tooltip content="分配用户" placement="top" effect="light">
                  <el-button @click="openAssignUserDialog(scope.row)" size="mini" type="primary" icon="el-icon-user"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="handleDelete(scope.row)" icon="el-icon-delete"
                             plain></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

      </el-row>

      <!-- 新增|编辑 弹框 -->
      <dialog-modify-role
              :target="modifyRoleForm"
              :targetType="modifyRoleType"
              @refresh="handleRefreshTable"
              :visible.sync="modifyRoleDialogVisible"></dialog-modify-role>

      <!-- 导入 弹框 -->
      <dialog-import-role
              @refresh="handleRefreshTable"
              :visible.sync="importRoleDialogVisible"></dialog-import-role>

      <!-- 资源分配 弹框 -->
      <dialog-role-resource
              :target="roleResourceModifyId"
              @refresh="handleRefreshTable"
              :visible.sync="roleResourceDialogVisible"></dialog-role-resource>

      <!-- 用户分配 弹框 -->
      <dialog-assign-user
              :target="roleResourceModifyId"
              @refresh="handleRefreshTable"
              :visible.sync="assignUserDialogVisible"></dialog-assign-user>

    </div>

    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentPage"
              :current-page.sync="table.pageNum"
              :page-sizes="[10,20,30,50]"
              :page-size="table.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="table.total"
              style="margin: -10px;">
      </el-pagination>
    </template>

  </d2-container>
</template>

<script>
  import {
    DeleteRole,
    GetRoleTableList,
  } from "@/api/bpm/org.userole"
  import pageMixins from '@/components/my-table-page/page-mixins'

  const getTableColumns = () => {
    return [
      {sort: 0, label: "角色编号", prop: "alias", width: 120},
      {sort: 1, label: "角色名称", prop: "name", sortable: true, width: 200},
      {sort: 2, label: "角色描述", prop: "description", width: 200},
      {sort: 3, label: "角色状态", prop: "enabled", width: 100},
      {
        sort: 4,
        label: "创建时间",
        prop: "createTime",
        sortable: true,
        width: 200
      }
    ]
  }

  export default {
    name: "role-index",
    components: {
      dialogModifyRole: () => import('./modify-role'),
      dialogRoleResource: () => import('./role-resource'),
      dialogImportRole: () => import('./import-role'),
      dialogAssignUser: () => import('../user/assign-user')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        tableColumns: getTableColumns(),
        multipleSelection: [],
        modifyRoleType: "CREATE",
        modifyRoleDialogVisible: false,
        modifyRoleForm: {
          name: "",
          alias: "",
          enabled: "",
          description: ""
        },
        roleResourceDialogVisible: false,
        roleResourceModifyId: undefined,
        assignUserDialogVisible: false,
        importRoleDialogVisible: false,
        showImportBtn: true,
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.table.listLoading = true
        GetRoleTableList(this.getTableDataParam()).then(res => {
          res.rows.forEach(it => {
            it.enabled += ""
          })
          this.table.list = res.rows
          this.table.total = res.total
          this.table.pages = res.page
          this.table.pageSize = res.pageSize
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      getTableDataParam() {
        let otherParam = {}
        let newQueryForm = Object.assign({}, this.queryForm)
        return Object.assign(
          {
            offset: (this.table.pageNum - 1) * this.table.pageSize,
            limit: this.table.pageSize
          }, newQueryForm, otherParam
        )
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleDelete(row) {
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.toDeleteRole(row.id, ret => {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: ret.msg
            })
          })
        })
      },
      handleBatchDelete() {
        let _id = ""
        this.multipleSelection.forEach(item => {
          _id += `${item.id},`
        })
        _id = _id.substring(0, _id.length - 1)
        this.$confirm("批量操作不验证用户角色关系，确认删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.toDeleteRole(_id, () => {
            this.$message.success("批量删除成功!")
          })
        })

      },
      toDeleteRole(id, callback) {
        DeleteRole(id).then(res => {
          if (callback) callback(res)
          this.getTableData()
        }).catch(err => console.log(err)).finally(() => {
        })
      },
      openEditRoleDialog(row) {
        this.modifyRoleType = "EDIT"
        this.modifyRoleForm = row
        this.modifyRoleDialogVisible = true
      },
      openRoleResourceDialog(row) {
        this.roleResourceModifyId = row.id
        this.roleResourceDialogVisible = true
      },
      openAssignUserDialog(row) {
        this.assignUserDialogVisible = true
        this.roleResourceModifyId = row.id
      },
      openImportDialog() {
        this.importRoleDialogVisible = true
      },
      openCreateRoleDialog() {
        this.modifyRoleDialogVisible = true
        this.modifyRoleType = "CREATE"
        this.modifyRoleForm = undefined
      },
    }
  }

</script>

<style lang="scss" scoped>
  .table-select {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    /*padding: 20px;*/

    .table-btns {
      width: 100%;
      /*padding: 24px 0 14px;*/
      position: relative;

      .right-btn {
        display: flex;
        height: 26px;
        border-radius: 4px;
        border: 1px solid #676a6c;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 24px;

        p {
          flex-shrink: 0;
          margin: 0;
          padding: 0 10px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &:hover {
            background: #c8c8c8;

            .fa {
              color: #fff;
            }
          }
        }

        .refresh {
          .fa-refresh {
            font-size: 14px;
            color: #676a6c;
          }
        }

        .fa {
          font-size: 14px;
          color: #676a6c;

          &.fa-th {
            margin-right: 6px;
          }
        }
      }
    }
  }

</style>
<style lang="scss">
  .el-dialog {
    &.resource-role {
      width: 30%;
      max-height: 580px;

      .el-select {
        width: 100%;
      }

      .el-tree {
        max-height: 400px;
        overflow: auto;
      }

      .el-dialog__body {
        padding: 10px 20px;
      }
    }
  }

  .el-dialog__body {
    max-height: 500px;
    overflow-y: auto;

    .el-tree {
      padding: 14px 0 0;
    }

    .dialog-footer {
      padding-top: 14px;
      display: flex;
      justify-content: flex-end;
    }
  }

</style>
