<template>
    <d2-container>
        <el-form
                :inline="true"
                :model="queryForm"
                ref="queryForm"
                size="mini"
                style="margin-bottom: -25px;">


            <div style="float: right">
                <el-form-item>
                    <el-button type="primary" @click="getTableData">
                        <d2-icon name="search"/>
                        查询
                    </el-button>
                    <el-button type="default" @click="handleFormReset('queryForm')">
                        <d2-icon name="refresh"/>
                    </el-button>
                </el-form-item>
            </div>
        </el-form>

        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.list"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  @current-change="handleCurrentRow"
                  stripe
                  style="width: 100%">


            <el-table-column align="center" label="流程标题">
                <template slot-scope="scope">
                    <span>{{scope.row.subject}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="任务名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="候选人">
                <template slot-scope="scope">
                    <span v-if="scope.row.assigneeNames">{{scope.row.assigneeNames}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag type="info" v-if="scope.row.status == 'NORMAL'">普通</el-tag>
                    <el-tag type="success" v-if="scope.row.status == 'DESIGNATE'">指派</el-tag>
                    <el-tag type="warning" v-if="scope.row.status == 'TURN'">转办</el-tag>
                </template>
            </el-table-column>


            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary"
                               @click="dialogTaskUserVisible = !dialogTaskUserVisible">指派
                    </el-button>
                    <el-button size="mini" type="primary" @click="dialogTaskDetailVisible = true">处理
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

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

        <taskUserDialog @confirmUser="confirmTaskUser"
                        :visible.sync="dialogTaskUserVisible"></taskUserDialog>

        <el-dialog
                :visible.sync="dialogTaskDetailVisible"
                :fullscreen="true"
                custom-class="act-editor-dialog">
            <div slot="title" class="dialog-title">
                <span>任务详情</span>
            </div>
            <taskDetail ref="taskDetail"
                        :task="currentRow"
                        @closeDialog="dialogTaskDetailVisible = false"
                        @refresh="handleRefreshTable"
            ></taskDetail>
        </el-dialog>

    </d2-container>
</template>

<script>
  import { BpmTaskList, BpmAssignTask } from '../../../../api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'all-task',
    components: {
      taskUserDialog: () => import('./task-user'),
      taskDetail: () => import('./task-detail')
    },
    mixins: [
      pageMixins,
    ],
    data () {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        dialogTaskUserVisible: false,

        dialogTaskDetailViewFullscreen: true,
        dialogTaskDetailVisible: false
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        BpmTaskList(this.getTableDataParam()).then(res => {
          this.table.list = res.rows
          this.table.total = res.total
          this.table.pages = res.page
          this.table.pageSize = res.pageSize
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      //其他参数
      getTableDataParam () {
        //根据业务修改补充
        let otherParam = {}
        //时间区间字段，调整
        let newQueryForm = Object.assign({}, this.queryForm)
        //...
        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, newQueryForm/*this.queryForm*/, otherParam)
      },
      confirmTaskUser (taskUser) {
        if (taskUser == undefined) {
          this.$message.warning('请选择用户')
          return
        }
        BpmAssignTask(
          taskUser.id_,
          taskUser.fullname_,
          this.currentRow.taskId
        ).then(() => {
          this.$message.success('指派成功')
          this.dialogTaskUserVisible = false
          this.handleRefreshTable()
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
