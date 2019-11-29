<template>
    <d2-container type="ghost">
        <!-- header 查询条件 -->
        <template slot="header">
            <el-form
                    :inline="true"
                    :model="listQuery"
                    size="mini"
                    style="margin-bottom: -18px;">
                <!--<el-form-item label="用户名" prop="username">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="用户名" v-model="listQuery.username" clearable>
                    </el-input>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
                </el-form-item>
            </el-form>
        </template>
        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.data"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">

            <el-table-column align="center" label="用户ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.firstName + ' ' + scope.row.lastName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="邮箱">
                <template slot-scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="所在组">
                <template slot-scope="scope">
                    <span @click="handleUpdateGroup(scope.row)">{{Object.keys(table.userGroupMap[scope.row.id]).length}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                               icon="el-icon-edit"></el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- table表格 -->

        <!-- 新增、编辑弹框 -->
        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="用户ID" prop="username">
                    <el-input v-model="form.id" placeholder="用户ID"></el-input>
                </el-form-item>

                <el-form-item label="姓" prop="username">
                    <el-input v-model="form.firstName" placeholder="姓"></el-input>
                </el-form-item>

                <el-form-item label="名" prop="username">
                    <el-input v-model="form.lastName" placeholder="名"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="username">
                    <el-input v-model="form.email" placeholder="邮箱"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="toCancel('form')" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="toUpdate('form')" icon="el-icon-check">修 改</el-button>
            </div>
        </el-dialog>

        <!-- footer 分页条 -->
        <template slot="footer">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="listQuery.pageNum"
                    :page-sizes="[10,20,30,50]"
                    :page-size="listQuery.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin: -10px;">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
  import { aUserList } from '../../../../api/yh.activiti'

  export default {
    data () {
      return {
        table: {
          key: 0,
          listLoading: false,
          data: [],
          userGroupMap: {}
        },
        form: {
          id: undefined,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        },
        rules: {

        },
        dialogFormVisible: false,

        total: null,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        aUserList(0, 999).then(res => {
          this.table.userGroupMap = res.userGroupMap
          this.table.data = res.userList
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      handleFilter(){

      },
      handleUpdate (row) {
        this.dialogFormVisible = true
        this.form = row
        console.log(row)
      },
      handleDelete (row) {
        console.log(row)
      },
      handleUpdateGroup (row) {
        console.log(row)
      },
      handleSizeChange () {
      },
      handleCurrentChange () {
      },
      toUpdate (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(valid)
            this.dialogFormVisible = false
          } else {
            return false
          }
        })
      },
      toCancel (formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
