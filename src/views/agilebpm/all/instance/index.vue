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
                  @current-change="handleCurrentRow"
                  highlight-current-row
                  stripe
                  style="width: 100%">

            <el-table-column align="center" label="流程标题">
                <template slot-scope="scope">
                    <span :title="scope.row.subject">{{scope.row.subject}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="流程名称">
                <template slot-scope="scope">
                    <span :title="scope.row.defName">{{scope.row.defName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否挂起">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="!scope.row.isForbidden">正常</el-tag>
                    <el-tag type="danger" v-if="scope.row.isForbidden">挂起</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == 'running'">运行中</el-tag>
                    <el-tag type="info" v-if="scope.row.status == 'end'">终止</el-tag>
                    <el-tag type="warning" v-if="scope.row.status == 'draft'">草稿</el-tag>
                    <el-tag type="danger" v-if="scope.row.status == 'back'">驳回</el-tag>
                </template>
            </el-table-column>


            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span :title="scope.row.createTime">{{scope.row.createTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建人">
                <template slot-scope="scope">
                    <span :title="scope.row.creator">{{scope.row.creator}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="持续时间">
                <template slot-scope="scope">
                    <span :title="scope.row.duration">{{durationM(scope.row.duration)}}</span>
                </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleTaskDetail(scope.row)">任务历史
                    </el-button>
                    <el-button size="mini" type="primary" v-if="scope.row.status == 'running'"
                               @click="handleToForbidden(scope.row)">
                        {{scope.row.isForbidden ? '激活' : '挂起'}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleDeleteInstance(scope.row)">删除
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


        <taskHistoryDialog
                :showAssign="true"
                :instanceId="dialog_instanceId"
                :visible.sync="dialogTaskHistoryDialogVisible"
                :fullscreen="true"></taskHistoryDialog>

    </d2-container>
</template>

<script>
  import { BpmInstanceList, BpmInstanceForbidden, BpmInstanceDelete } from '../../../../api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'all-instance',
    components: {
      taskHistoryDialog: () => import('../task/task-history')
    },
    mixins: [
      pageMixins,
    ],
    data () {
      return {
        //重写对象属性
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        table: {},

        dialogTaskHistoryDialogVisible: false,
        dialog_instanceId: undefined

      }
    },
    created () {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData () {
        this.table.listLoading = true
        BpmInstanceList(this.getTableDataParam()).then(res => {
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
      handleTaskDetail (row) {
        this.dialogTaskHistoryDialogVisible = true
        this.dialog_instanceId = row.id
      },
      durationM (duration) {
        return duration > 0 ? this.$moment.duration(duration).humanize(true) : ''
      },
      handleToForbidden (row) {
        let forbidden = row.isForbidden ? false : true
        BpmInstanceForbidden(row.id, forbidden).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.handleRefreshTable()
        })
      },
      handleDeleteInstance (row) {
        this.$confirm('确定删除该实例(相关数据一并删除)?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BpmInstanceDelete(row.id).then(res => {
            if (res.isOk) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          }).finally(() => {
            this.handleRefreshTable()
          })
        })

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
