<template>
  <el-dialog
          :visible.sync="visible"
          :before-close="close"
          :fullscreen="fullscreen"
          @open="openInit"
          width="1000px">
    <div slot="title" class="dialog-title">
      <span>{{targetTitle}}</span>
      <button
              type="button"
              class="el-dialog__headerbtn"
              aria-label="Fullscreen"
              @click="fullscreen = (!fullscreen)"
              style="right: 50px;">
        <i class="el-dialog__close el-icon el-icon-full-screen"></i>
      </button>
    </div>

    <div class="page-style">
      <el-row>
        <el-col class="page-form">
          <el-form :model="queryForm" ref="queryForm" :inline="true" size="mini">
            <el-form-item label="昵称" prop="fullname_^VRHK">
              <el-input v-model="queryForm['fullname_^VRHK']"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account_^VRHK">
              <el-input v-model="queryForm['account_^VRHK']"></el-input>
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
                  <el-button type="success" @click="openAddUserDialog">
                    <d2-icon name="plus"/>
                    新增
                  </el-button>
                </el-button-group>
              </el-form-item>
            </div>

          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="page-table">
          <el-table :data="table.list" v-loading="table.listLoading" size="mini" style="width:100%;" border>
            <el-table-column prop="userName" label="昵称" width="220"></el-table-column>
            <el-table-column prop="userAccount" label="账号"></el-table-column>
            <el-table-column prop="createTime" label="操作时间"></el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDeleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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


    <!-- 新增用户 弹框 -->
    <dialog-user-index
            :selectData="{roleId: this.selectRoleId}"
            :addMethodsType="'role'"
            @refresh="handleRefreshTable"
            @selectedRows="handleAddUser"
            :isInnerDialog="true"
            :visible.sync="addUserDialogVisible"></dialog-user-index>

  </el-dialog>
</template>

<script>
  import {
    GetGroupUser,
    RemoveRoleUser,
    SaveRoleUsers,
    SaveGroupUserRel
  } from "@/api/bpm/org"
  import pageMixins from '@/components/my-table-page/page-mixins'

  export const ASSIGN_FROM_ROLE = "ROLE"
  export const ASSIGN_FROM_GROUP = "GROUP"

  export default {
    name: 'template-dialog',
    mixins: [
      pageMixins,
    ],
    components: {
      dialogUserIndex: () => import("./dialog-user-index"),
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      // 角色或组织 分配用户
      targetType: {
        type: String,
        default: ASSIGN_FROM_ROLE
      },
      targetTitle: {
        type: String,
        default: "管理用户"
      },
      // 当前角色或组织 ID
      target: {
        type: String,
        default: undefined
      },
    },
    data() {
      return {
        fullscreen: false,
        rules: {},
        selectRoleId: "",
        addUserDialogVisible: false
      }
    },
    methods: {
      handleDeleteUser(row) {
        this.$confirm("确定删除这个用户吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          RemoveRoleUser(row.id).then(res => {
            this.$message.success(res.msg)
          })
        }).finally(() => {
          this.getTableData()
        })
      },
      handleAddUser(selectedRows) {
        let data = {
          userIds: selectedRows.map(item => item.id).join(",")
        }
        if (this.targetType === ASSIGN_FROM_GROUP) {
          SaveGroupUserRel(Object.assign({groupId: this.target}, data)).then(res => {
            this.$message.success(res.msg)
          }).catch(err => console.log(err)).finally(() => {
            this.getTableData()
          })
        } else if (this.targetType === ASSIGN_FROM_ROLE) {
          SaveRoleUsers(Object.assign({roleId: this.target}, data)).then(res => {
            this.$message.success(res.msg)
          }).catch(err => console.log(err)).finally(() => {
            this.getTableData()
          })
        }
      },
      openAddUserDialog() {
        this.addUserDialogVisible = true
      },
      handleFormReset(ref) {
        this.$refs[ref].resetFields()
        this.getTableData()
      },
      getTableData() {
        this.table.listLoading = true
        GetGroupUser(this.getTableDataParam()).then(res => {
          this.table.list = res.rows
          this.table.total = res.total
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      getTableDataParam() {
        let otherParam = {
          roleId: this.target
        }
        return Object.assign({
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, this.queryForm, otherParam)
      },
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        this.getTableData()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
    }
  }
</script>

<style scoped>

</style>
