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

            <!--<el-table-column align="center" label="流程名称">
                <template slot-scope="scope">
                    <span>{{scope.row.defName}}</span>
                </template>
            </el-table-column>-->

            <el-table-column align="center" label="任务节点">
                <template slot-scope="scope">
                    <span>{{scope.row.nodeName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="流程状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == instanceStatus.running.key">
                        {{instanceStatus.running.value}}
                    </el-tag>
                    <el-tag type="info" v-if="scope.row.status == instanceStatus.end.key">
                        {{instanceStatus.end.value}}
                    </el-tag>
                    <el-tag type="warning" v-if="scope.row.status == instanceStatus.draft.key">
                        {{instanceStatus.draft.value}}
                    </el-tag>
                    <el-tag type="danger" v-if="scope.row.status == instanceStatus.back.key">
                        {{instanceStatus.back.value}}
                    </el-tag>
                </template>
            </el-table-column>

            <!--<el-table-column align="center" label="发起人">
                <template slot-scope="scope">
                    <span>{{scope.row.creator}}</span>
                </template>
            </el-table-column>-->


            <el-table-column align="center" label="办理时间">
                <template slot-scope="scope">
                    <span>{{scope.row.approveTime}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="办理时长">
                <template slot-scope="scope">
                    <span>{{durationM(scope.row.durMs)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="办理结果">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.approveStatus == actions.agree.key">{{actions.agree.value}}
                    </el-tag>
                    <el-tag type="danger" v-if="scope.row.approveStatus == actions.reject.key">
                        {{actions.reject.value}}
                    </el-tag>
                    <el-tag type="warning" v-if="scope.row.approveStatus == actions.turn.key">{{actions.turn.value}}
                    </el-tag>
                    <el-tag type="info" v-if="scope.row.approveStatus == actions.awaiting_check.key">
                        {{actions.awaiting_check.value}}
                    </el-tag>
                    <el-tag type="info" v-if="scope.row.approveStatus == actions.start.key">{{actions.start.value}}
                    </el-tag>
                    <el-tag type="info" v-if="scope.row.approveStatus == actions.end.key">{{actions.end.value}}</el-tag>
                </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShowInstanceDetail(scope.row)">详情
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

        <el-dialog
                :visible.sync="dialogInstanceDetailVisible"
                :fullscreen="true"
                custom-class="act-editor-dialog">
            <div slot="title" class="dialog-title">
                <span>实例详情</span>
            </div>
            <!--            <instanceDetail ref="instanceDetail"-->
            <!--                            :instanceId="currentInstanceId"-->
            <!--                            @closeDialog="dialogInstanceDetailVisible = false"-->
            <!--                            @refresh="handleRefreshTable"-->
            <!--            ></instanceDetail>-->
        </el-dialog>

    </d2-container>
</template>

<script>
  import { MyApproveList } from '@/api/bpm/bpm'
  import { BpmTaskAction, BpmInstanceStatus } from '@/api/bpm/constant'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'my-task-history',
    components: {
      // instanceDetail: () => import('@/views/agilebpm/all/instance/instance-detail')
    },
    mixins: [
      pageMixins,
    ],
    data () {
      return {
        actions: BpmTaskAction,
        instanceStatus: BpmInstanceStatus,
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        dialogInstanceDetailVisible: false,
        currentInstanceId: undefined
      }
    },
    created () {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData () {
        this.table.listLoading = true
        MyApproveList(this.getTableDataParam()).then(res => {
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
      durationM(duration) {
        return duration > 0 ? this.$moment.duration(duration).humanize() : ''
      },
      handleShowInstanceDetail (row) {
        this.currentInstanceId = row.id
        this.dialogInstanceDetailVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
