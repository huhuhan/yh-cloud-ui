<template>
    <el-dialog :append-to-body="isInnerDialog"
               key="taskHistoryDialog"
               :visible.sync="visible"
               :fullscreen="fullscreen"
               :before-close="close"
               @open="openInit"
               :width="width">
        <div slot="title" class="dialog-title">
            <span>任务历史</span>
        </div>
        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.list"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  @current-change="handleCurrentRow"
                  highlight-current-row
                  stripe
                  style="width: 100%">

            <el-table-column align="center" label="任务名称">
                <template slot-scope="scope">
                    <span>{{scope.row.taskName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="处理时间">
                <template slot-scope="scope">
                    <span>{{scope.row.approveTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="待执行人">
                <template slot-scope="scope">
                    <span>{{getAssignInfoUser(scope.row.assignInfo)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="执行人">
                <template slot-scope="scope">
                    <span>{{scope.row.approverName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == actions.agree.key">{{actions.agree.value}}</el-tag>
                    <el-tag type="danger" v-if="scope.row.status == actions.reject.key">{{actions.reject.value}}</el-tag>
                    <el-tag type="warning" v-if="scope.row.status == actions.turn.key">{{actions.turn.value}}</el-tag>
                    <el-tag type="info" v-if="scope.row.status == actions.awaiting_check.key">{{actions.awaiting_check.value}}</el-tag>
                    <el-tag type="info" v-if="scope.row.status == actions.start.key">{{actions.start.value}}</el-tag>
                    <el-tag type="info" v-if="scope.row.status == actions.end.key">{{actions.end.value}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.opinion}}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" v-if="showAssign">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" v-if="scope.row.status == 'awaiting_check'"
                               @click="dialogTaskUserVisible = !dialogTaskUserVisible">指派
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <taskUserDialog v-if="showAssign"
                        @confirmUser="confirmTaskUser"
                        :visible.sync="dialogTaskUserVisible"
                        :isInnerDialog="true"></taskUserDialog>

    </el-dialog>
</template>

<script>
  import { BpmInstanceOpinion, BpmAssignTask } from '@/api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'
  import { BpmTaskAction } from '@/constant/agilebpm'

  export default {
    name: 'task-history',
    components: {
      taskUserDialog: () => import('./task-user')
    },
    mixins: [
      pageMixins
    ],
    props: {
      instanceId: {
        type: String,
        default: undefined
      },
      visible: {
        type: Boolean,
        default: false
      },
      isInnerDialog: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '800px'
      },
      showAssign: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        actions: BpmTaskAction,
        dialogTaskUserVisible: false
      }
    },
    mounted () {
      ////todo: 监听变化请求
      // this.getTableData()
    },
    watch: {
      instanceId (newVal, oldVal) {
        this.$log.primary(`流程任务历史窗口-实例ID发生变化，newVal：${newVal}，oldVal：${oldVal}`)
        //todo: 监听变化请求
        // this.getTableData()
      }
    },
    methods: {
      getTableData () {
        if (this.instanceId) {
          this.table.listLoading = true
          BpmInstanceOpinion({
            instId: this.instanceId
          }).then(res => {
            this.table.list = res.data
          }).catch(err => console.log(err)).finally(() => {
            this.table.listLoading = false
          })
        }
      },
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit () {
        //todo: 每次打开请求
        this.getTableData()
        this.$log.default('初始化任务历史弹窗')
      },
      getAssignInfoUser (a) {
        return a ? a.slice(a.indexOf('-') + 1, a.lastIndexOf('-')) : ''
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

