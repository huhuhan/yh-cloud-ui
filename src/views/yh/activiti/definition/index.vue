<template>
    <d2-container type="ghost">
        <!-- header 查询条件 -->
        <template slot="header">
            <el-form
                    :inline="true"
                    :model="listQuery"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item style="float: right">
                    <el-button type="default" @click="getTableData" icon="el-icon-refresh"></el-button>
                </el-form-item>
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

            <el-table-column align="center" label="定义ID">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="部署ID">
                <template slot-scope="scope">
                    <span>{{scope.row.deployment.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.deployment.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="定义KEY">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.key}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="版本号">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.version}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="XML">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.resourceName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="图片">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.diagramResourceName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="部署时间">
                <template slot-scope="scope">
                    <span>{{scope.row.deployment.deploymentTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否挂起">
                <template slot-scope="scope">
                    <span>{{scope.row.processDefinition.suspended}}</span>
                    <span>|</span>
                    <a href="#" @click="handleStatus(false, scope.row.processDefinition.id)"
                       v-if="!scope.row.processDefinition.suspended">挂起</a>
                    <a href="#" @click="handleStatus(true, scope.row.processDefinition.id)" v-else>激活</a>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleConvert(scope.row)"
                    >转模型
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- table表格 -->

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
  import { deploymentList, updateDeployment, deleteDeployment, convertDeployment } from '../../../../api/yh.activiti'

  export default {
    data () {
      return {
        table: {
          key: 0,
          listLoading: false,
          data: [],
        },
        form: {
          id: undefined,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        },
        rules: {},
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
        deploymentList(0, 999).then(res => {
          this.table.data = res
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      handleFilter () {

      },
      handleConvert (row) {
        this.$confirm('确定将定义转为模型', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          convertDeployment(row.processDefinition.id).then(res => {
            this.$message({
              type: 'success',
              message: '转化成功!'
            })
          }).finally(() => {
            this.getTableData()
          })
        }).catch(action => {
          console.log('action:' + action)
        })
      },
      handleDelete (row) {
        this.$confirm('确定删除所选定义部署', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已删除!'
          })
          deleteDeployment(row.processDefinition.deploymentId).finally(() => {
            this.getTableData()
          })
        }).catch(action => {
          console.log('action:' + action)
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      },
      handleStatus (status, pdId) {
        let state = status ? 'active' : 'suspend'
        updateDeployment(state, pdId).finally(() => {
          this.getTableData()
        })
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
