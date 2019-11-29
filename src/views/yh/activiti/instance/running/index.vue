<template>
    <d2-container type="ghost">
        <!-- header 查询条件 -->
        <template slot="header">
            <el-form
                    :inline="true"
                    :model="queryForm"
                    ref="queryForm"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item label="业务ID" prop="businessKey">
                    <el-input v-model="queryForm.businessKey"></el-input>
                </el-form-item>
                <el-form-item label="定义ID" prop="processDefinitionKey">
                    <el-input v-model="queryForm.processDefinitionKey"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="queryForm.state" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="激活" value="active"></el-option>
                        <el-option label="挂起" value="suspended"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTableData">
                        <d2-icon name="search"/>
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="default" @click="handleFormReset('queryForm')">
                        <d2-icon name="refresh"/>
                    </el-button>
                </el-form-item>
            </el-form>
        </template>
        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.list"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">

            <el-table-column align="center" label="实例ID">
                <template slot-scope="scope">
                    <span>{{scope.row.processInstanceBo.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="定义信息">
                <template slot-scope="scope">
                    <span>ID：{{scope.row.processInstanceBo.processDefinitionId}}</span><br>
                    <span>名称：{{scope.row.processInstanceBo.processDefinitionName}}</span><br>
                    <span>KEY：{{scope.row.processInstanceBo.processDefinitionKey}}</span><br>
                    <span>版本：{{scope.row.processInstanceBo.processDefinitionVersion}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="业务ID">
                <template slot-scope="scope">
                    <span>{{scope.row.processInstanceBo.businessKey}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="当前节点">
                <template slot-scope="scope" v-if="scope.row.taskBo">
                    <span>办理人ID：{{scope.row.taskBo.assignee}}</span><br>
                    <span>任务名称：
                        <a href="#" @click="handleTraceNode(scope.row.processInstanceBo.id)">{{scope.row.taskBo.name}}</a>
                    </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否挂起">
                <template slot-scope="scope">
                    <span>{{scope.row.processInstanceBo.suspended}}</span>
                    <span>|</span>
                    <a href="#" @click="handleStatus(false, scope.row.processInstanceBo.id)"
                       v-if="!scope.row.processInstanceBo.suspended">挂起</a>
                    <a href="#" @click="handleStatus(true, scope.row.processInstanceBo.id)" v-else>激活</a>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <!--<el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                               icon="el-icon-edit"></el-button>-->
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- table表格 -->

        <!--跟踪节点-->
        <traceDialog
                :processInstanceId="processInstanceId"
                :visible.sync="dialogTraceNodeVisible"></traceDialog>

        <!-- footer 分页条 -->
        <template slot="footer">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="table.pageNum"
                    :page-sizes="[5,10,20,30,50]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.total"
                    style="margin: -10px;">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
  import { runningPSList, updateInstance, deleteInstance } from '../../../../../api/yh.activiti'
  import traceDialog from './../trace-dialog'

  export default {
    components: {
      traceDialog
    },
    data () {
      return {
        table: {
          key: 0,
          listLoading: false,
          list: [],
          total: null,
          pageNum: 1,
          pageSize: 5,
          pages: null
        },
        queryForm: {
          businessKey: undefined,
          processDefinitionKey: undefined,
          state: undefined
        },
        dialogTraceNodeVisible: false,
        processInstanceId: null,

      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        runningPSList(this.table.pageNum - 1, this.table.pageSize, this.queryForm).then(res => {
          this.table.list = res.list
          this.table.total = res.total
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      handleSizeChange (pageSiz) {
        this.table.pageSize = pageSiz
        this.getTableData()
      },
      handleCurrentChange (pageNum) {
        this.table.pageNum = pageNum
        this.getTableData()
      },
      handleFormReset (formName) {
        this.$refs[formName].resetFields()
        this.getTableData()
      },
      handleUpdate (row) {
        console.log(row)
      },
      handleDelete (row) {
        this.$confirm('确定删除所选流程实例', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已删除!'
          })
          deleteInstance(row.processInstanceBo.id).finally(() => {
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
      handleStatus (status, psId) {
        let state = status ? 'active' : 'suspend'
        updateInstance(state, psId).finally(() => {
          this.getTableData()
        })
      },
      toUpdate (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(valid)
          } else {
            return false
          }
        })
      },
      toCancel (formName) {
        this.$refs[formName].resetFields()
      },
      handleTraceNode (psId) {
        this.dialogTraceNodeVisible = true
        this.processInstanceId = psId
      }
    }
  }
</script>
