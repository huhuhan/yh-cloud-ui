<template>
    <d2-container type="ghost">
        <!-- header 查询条件 -->
        <template slot="header">
            <el-form
                    :inline="true"
                    :model="listQuery"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item>
                    <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="default" @click="getTableData" icon="el-icon-refresh"></el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button @click="handleCreate" type="success" icon="el-icon-plus">请 假</el-button>
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

            <el-table-column align="center" label="ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="申请人ID">
                <template slot-scope="scope">
                    <span>{{scope.row.userId}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="开始时间">
                <template slot-scope="scope">
                    <span>{{scope.row.beginTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结束时间">
                <template slot-scope="scope">
                    <span>{{scope.row.endTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="当前节点">
                <template slot-scope="scope">
                    <a href="#" @click="handleTraceNode(scope.row)">{{scope.row.actTask.taskBo.name || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createDate}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="流程状态">
                <template slot-scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="warning" @click="handleClaim(scope.row.actTask.taskBo.id)"
                               v-if="!scope.row.actTask.taskBo.assignee">签收
                    </el-button>
                    <!--因为测试是同一个用户，所以多加个判断条件=== '调整申请'-->
                    <el-button size="mini" type="success" @click="handleReEdit(scope.row)"
                               v-else-if="!scope.row.showEditorBtn && scope.row.actTask.taskBo.name === '调整申请'">重申
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleComplete(scope.row.actTask.taskBo.id)"
                               v-else>办理
                    </el-button>

                    <el-button size="mini" type="primary" @click="handleCheckResult(scope.row)">审核结果
                    </el-button>
                    <!--<el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                               icon="el-icon-edit"></el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               icon="el-icon-delete"></el-button>-->
                </template>
            </el-table-column>

        </el-table>
        <!-- table表格 -->

        <!-- 请假 弹框 -->
        <leaveForm
                v-if="dialogFormVisible"
                v-on:refresh="getTableData"
                :visible.sync="dialogFormVisible"></leaveForm>

        <reLeaveForm
                v-if="dialogReFormVisible"
                v-on:refresh="getTableData"
                :reForm="reForm"
                :taskId="taskId"
                :visible.sync="dialogReFormVisible"></reLeaveForm>

        <!-- 审核 弹框 -->
        <checkFrom
                v-if="dialogCheckFormVisible"
                v-bind:taskId="taskId"
                v-on:refresh="getTableData"
                :visible.sync="dialogCheckFormVisible"></checkFrom>

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
                    :current-page.sync="listQuery.pageNum"
                    :page-sizes="[10,20,30,50]"
                    :page-size="listQuery.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin: -10px;">
            </el-pagination>
        </template>

        <el-dialog
                key="checkInfo"
                title="审核信息"
                :visible.sync="dialogCheckInfoVisible"
                width="600px">
            <el-timeline :reverse="reverse">
                <el-timeline-item
                        v-for="(checkInfo, index) in checkInfoList"
                        :key="index"
                        timestamp="2018/4/12">
                    <el-card>
                        <h4>{{checkInfo.userName}}</h4>
                        <p>{{checkInfo.checkMsg}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

    </d2-container>
</template>

<script>
  import { userLeaveList } from '../../../../api/yh.act.leave'
  import { claimTask } from '../../../../api/yh.activiti'
  import { mapState } from 'vuex'

  import leaveForm from './leave-form'
  import reLeaveForm from './re-leave-form'
  import checkFrom from './check-form'
  import traceDialog from '../../activiti/instance/trace-dialog'

  export default {
    components: {
      leaveForm,
      reLeaveForm,
      checkFrom,
      traceDialog
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    data () {
      return {
        table: {
          key: 0,
          listLoading: false,
          data: [],
        },
        total: null,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },

        dialogFormVisible: false,

        dialogReFormVisible: false,
        reForm:{},

        dialogCheckFormVisible: false,
        taskId: null,

        dialogTraceNodeVisible: false,
        processInstanceId: null,

        dialogCheckInfoVisible: false,
        reverse: false,
        checkInfoList: []
      }
    },
    created () {
      console.log(this.info)
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        userLeaveList(0, 999).then(res => {
          this.table.data = res
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      handleFilter () {
      },
      handleCreate () {
        this.dialogFormVisible = true
      },
      handleClaim (taskId) {
        this.$confirm('确定签收该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          claimTask(taskId, this.info.userId).then(()=>{
            this.$message({
              type: 'success',
              message: '已签收!'
            })
          }).finally(() => {
            this.getTableData()
          })
        }).catch(action => {
          console.log('action:' + action)
        })
      },
      handleReEdit(row){
        this.dialogReFormVisible= true
        this.taskId = row.actTask.taskBo.id
        this.reForm = row.actTask.variables.baseTask
      },
      handleComplete (id) {
        this.dialogCheckFormVisible = true
        this.taskId = id
      },
      handleCheckResult (row) {
        this.dialogCheckInfoVisible = true
        this.checkInfoList = row.actTask.variables.CHECK_MSG_LIST || []
      },
      handleUpdate (row) {
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
      handleTraceNode (row) {
        this.dialogTraceNodeVisible = true
        this.processInstanceId = row.processInstanceId
      }
    }
  }
</script>
