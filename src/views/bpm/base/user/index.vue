<template>
  <d2-container>
    <!-- main 视图区域 -->
    <div class="main page-style">
      <div class="right-table">
        <el-row>
          <el-col class="page-form">
            <!-- form表单筛选 -->
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini">
              <el-form-item label="昵称" prop="fullname_^VLK">
                <el-input v-model="queryForm['fullname_^VLK']"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile_^VLK">
                <el-input maxlength="11" v-model="queryForm['mobile_^VLK']"></el-input>
              </el-form-item>

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
                    <el-button type="success" @click="openAddUserDialog">
                      <d2-icon name="plus"/>
                      新建
                    </el-button>
                    <el-button type="success" v-show="showBatchCreateBtn" @click="departmentTreeDialogVisible = true">
                      <d2-icon name="audio-description"/>
                      自动创建
                    </el-button>
                    <el-button type="warning" v-show="showImportBtn" @click="importUserDialogVisible = true"
                               icon="el-icon-upload2">
                      导入
                    </el-button>
                  </el-button-group>
                </el-form-item>

                <el-form-item>
                  <el-button-group>
                    <el-button type="info" @click="tableColumnDrawerVisible = true">
                      <d2-icon name="th"/>
                      <d2-icon name="caret-right"/>
                    </el-button>
                  </el-button-group>
                </el-form-item>

              </div>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="page-table">
            <el-table ref="multipleTable" :data="tableData" v-loading="table.listLoading" tooltip-effect="dark"
                      :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                      :row-style="{ background: '#fff' }" style="width: 100%;" highlight-current-row border
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <template v-for="item in tableColumns">
                <el-table-column show-overflow-tooltip :sortable="item.sortable" :min-width="item.width"
                                 :key="item.label" :prop="item.prop" :label="item.label">
                  <template slot-scope="scope">
                    <span v-if="item.prop!='status'">{{ scope.row[item.prop] }}</span>
                    <div v-else>
                      <el-switch disabled @change="handleSwitchChange(scope.row)"
                                 :value="scope.row[item.prop]?true:false" active-color="#13ce66"
                                 inactive-color="#23C6C8"></el-switch>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column fixed="right" align="center" label="操作" min-width="300">
                <template slot-scope="scope">
                  <el-tooltip content="修改密码" placement="top" effect="light">
                    <el-button size="mini" type="primary" @click="handleModifyPassword(scope.row)" icon="el-icon-key"
                               plain></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top" effect="light">
                    <el-button size="mini" type="primary" @click="handleModifyUser(scope.row)" icon="el-icon-edit"
                               plain></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top" effect="light">
                    <el-button size="mini" type="primary" @click="handleDeleteUser(scope.row)" icon="el-icon-delete"
                               plain></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
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

    <!-- 选择table显示字段的抽屉组件 -->
    <el-drawer title="请勾选需要显示的字段" size="20%" :visible.sync="tableColumnDrawerVisible" direction="rtl">
      <div class="drawer-view">
        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
          <el-checkbox v-for="item in columns" :label="item.label" :key="item.prop">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-drawer>

    <!-- 修改密码 弹框 -->
    <dialog-modify-password
            :target="modifyPwdForm"
            :visible.sync="modifyPwdDialogVisible"></dialog-modify-password>

    <!-- 新增|编辑 弹框 -->
    <dialog-modify-user
            :target="modifyUserForm.id"
            :targetType="modifyUserType"
            @refresh="handleRefreshTable"
            :visible.sync="modifyUserDialogVisible"></dialog-modify-user>

    <!-- 导入 弹框 -->
    <dialog-import-user
            @refresh="handleRefreshTable"
            :visible.sync="importUserDialogVisible"></dialog-import-user>

    <!-- 自动创建用户归属组织选择弹窗 -->
    <dialog-department-tree
            @refresh="handleRefreshTable"
            :visible.sync="departmentTreeDialogVisible"></dialog-department-tree>

  </d2-container>
</template>

<script>
  import {
    GetUserTableList,
    DeleteUser,
  } from "@/api/bpm/org.userole"
  import pageMixins from '@/components/my-table-page/page-mixins'

  const getTableColumns = () => {
    return [
      {sort: 0, label: "用户ID", prop: "userId", width: 20},
      {sort: 1, label: "账号", prop: "account", sortable: true, width: 120},
      {sort: 2, label: "昵称", prop: "fullname", width: 120},
      {sort: 6, label: "性别", prop: "sex", width: 100},
      {sort: 4, label: "手机", prop: "mobile", width: 120},
      {sort: 5, label: "邮箱", prop: "email", width: 100},
      {sort: 3, label: "角色", prop: "roleNames", width: 200},
      {sort: 7, label: "组织", prop: "groupNames", width: 200},
      {sort: 8, label: "状态", prop: "status", width: 50},
      {
        sort: 9,
        label: "创建时间",
        prop: "createTime",
        sortable: true,
        width: 200
      }
    ]
  }

  export default {
    name: "user-index",
    components: {
      dialogModifyPassword: () => import('./modify-password'),
      dialogModifyUser: () => import('./modify-user'),
      dialogImportUser: () => import('./import-user'),
      dialogDepartmentTree: () => import('./department-tree')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        modifyUserType: "CREATE", // EDIT
        columns: getTableColumns(),
        tableColumns: getTableColumns().filter(
          c => !["用户ID", "状态", "性别", "邮箱", "手机"].includes(c.label)
        ),
        checkedColumns: [],
        tableData: [],
        multipleSelection: [],
        tableColumnDrawerVisible: false,
        modifyUserDialogVisible: false,
        modifyPwdDialogVisible: false,
        importUserDialogVisible: false,
        modifyUserForm: {},
        modifyPwdForm: {},
        // 是否显示导入按钮
        showImportBtn: true,
        // 是否显示自动创建按钮
        showBatchCreateBtn: false,
        departmentTreeDialogVisible: false,
      }
    },
    created() {
      this.getTableData()
    },
    mounted() {
      let fields = []
      this.tableColumns.forEach(item => {
        fields.push(item.label)
      })
      this.checkedColumns = fields
    },
    methods: {
      getTableData() {
        this.table.listLoading = true
        GetUserTableList(this.getTableDataParam()).then(res => {
          let rawData = res.rows
          rawData.map(t => {
            t.groupNames = ""
            t.roleNames = ""
            // 新增组织字段，拼接名称显示
            if (t.orgRelationMap && t.orgRelationMap.groupUser) {
              let groups = t.orgRelationMap.groupUser.map(g => g.groupName)
              t.groupNames = groups ? groups.join(",") : ""
            }
            // 新增角色字段，拼接名称显示
            if (t.orgRelationMap && t.orgRelationMap.userRole) {
              let roles = t.orgRelationMap.userRole.map(g => g.roleName)
              t.roleNames = roles ? roles.join(",") : ""
            }
          })
          this.tableData = rawData
          this.table.total = res.total
          this.table.pages = res.page
          this.table.pageSize = res.pageSize
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      toDeleteUser(id, callback) {
        DeleteUser(id).then(() => {
          this.getTableData()
        }).catch(err => console.log(err)).finally(() => {
          if (callback) callback()
        })
      },
      getTableDataParam() {
        let otherParam = {}
        let newQueryForm = Object.assign({}, this.queryForm)
        return Object.assign({
            offset: (this.table.pageNum - 1) * this.table.pageSize,
            limit: this.table.pageSize
          }, newQueryForm, otherParam
        )
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSwitchChange(row) {
        let msg = ""
        if (row.status) {
          msg = "确认要停用用户吗？"
        } else {
          msg = "确认要启用用户吗？"
        }
        this.$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let _tableData = this.tableData
          _tableData.forEach(it => {
            if (it.id === row.id) {
              it.status = !row.status
            }
          })
          this.tableData = _tableData
          this.$message.success("操作成功!")
        })
      },
      handleCheckedColumnsChange(value) {
        this.checkedColumns = value
        let _value = []
        for (let it of value) {
          for (let p of this.columns) {
            if (it === p.label) {
              _value.push(p)
            }
          }
        }
        this.tableColumns = _value.sort((a, b) => {
          return a.sort - b.sort
        })
      },
      handleDeleteUser(row) {
        let id = row.id
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.toDeleteUser(id, () => {
            this.$message.success("删除成功!")
          })
        })
      },
      handleBatchDelete() {
        let _id = ""
        this.multipleSelection.forEach(item => {
          _id += `${item.id},`
        })
        _id = _id.substring(0, _id.length - 1)
        this.toDeleteUser(_id, () => {
          this.$message.success("批量删除成功!")
        })
      },
      handleModifyUser(row) {
        this.modifyUserType = 'EDIT'
        this.modifyUserForm = row
        this.modifyUserDialogVisible = true
      },
      handleModifyPassword(row) {
        this.modifyPwdForm.userId = row.id
        this.modifyPwdDialogVisible = true
      },
      openAddUserDialog() {
        this.modifyUserType = 'CREATE'
        this.modifyUserDialogVisible = true
        this.modifyUserForm = {}
      },
    }
  }

</script>

<style lang="scss" scoped>
  .main {
    width: 100%;
    min-width: 1000px;
    height: auto;
    display: flex;

    .left-select {
      width: 12px;
      flex-shrink: 0;
      position: relative;
      top: 0;
      bottom: 0;
      left: 0;
      transition: width 0.3s ease-in-out;
      overflow: hidden;

      &.l-width {
        width: 200px;
      }

      .tree-title {
        width: 100%;
        height: 3%;
        border-bottom: 1px solid #97a0b3;
        padding: 0 14px;
        margin-bottom: 14px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 14px;
          color: #97a0b3;
        }

        .btns {

          .fa-chevron-down,
          .fa-refresh {
            font-size: 14px;
            color: #97a0b3;
            margin-right: 8px;
          }
        }
      }

      .tree-ele {
        height: 96%;
        overflow: auto;
      }

      .tabar {
        width: 12px;
        margin: 0;
        background: #fafafa;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;

        .bar {
          display: flex;
          width: 100%;
          height: 64px;
          background: #eeeeee;
          align-items: center;
          justify-content: center;

          .fa-caret-left,
          .fa-caret-right {
            font-size: 12px;
          }
        }
      }
    }

    .right-table {
      flex-grow: 1;
      min-width: 800px;
      /*background: #f3f3f4;*/
      /*padding: 14px;*/
      box-sizing: border-box;

      .table-select {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: #fff;
        /*padding: 14px;*/

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
            top: 0px;

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
              border-right: 1px solid #676a6c;

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
    }
  }

  .drawer-view {
    padding: 0 14px 0;

    .el-checkbox-group {
      display: flex;
      flex-direction: column;

      .el-checkbox {
        padding: 14px 0;
      }
    }
  }

  .main {
    .left-select {
      .el-tree {
        min-width: 300px;
      }
    }
  }

  .el-dialog-div {
    height: 400px;
    overflow: auto;
  }

</style>
