<template>
  <d2-container>
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini">

      <el-form-item :label="table.columns.bizKey.label" :prop="`${table.columns.bizKey.prop}$VRHK`">
        <el-input v-model="queryForm[`${table.columns.bizKey.prop}$VRHK`]" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="办理时间大于" prop="approve_time_$VGE">
        <el-date-picker v-model="queryForm['approve_time_$VGE']" type="datetime" placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width:178px;"></el-date-picker>
      </el-form-item>

      <el-form-item :label="table.columns.approveStatus.label">
        <el-select v-model="queryForm[`${table.columns.approveStatus.prop}$VEQ`]" placeholder="请选择" clearable
                   style="width:178px;">
          <el-option v-for="action in bpmTaskAction" :label="action.value" :value="action.key"></el-option>
        </el-select>
      </el-form-item>

      <el-button-group>
        <el-form-item>
          <el-button type="primary" @click="getTableData">
            <d2-icon name="search"/>
            查询
          </el-button>
          <el-button type="default" @click="handleFormReset('queryForm')">
            <d2-icon name="refresh"/>
          </el-button>
        </el-form-item>
      </el-button-group>

      <div style="float: right">
      </div>

    </el-form>

    <!-- table表格 -->
    <el-table :key='table.key'
              :data="table.list"
              v-loading="table.listLoading"
              :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
              element-loading-text="拼命加载中..."
              @current-change="handleCurrentRow"
              highlight-current-row
              stripe
              style="width: 100%">

      <el-table-column v-for="(item, index) in Object.values(table.columns)"
                       :key="index"
                       align="center"
                       :label="item.label"
                       :width="item.width">
        <template slot-scope="scope">
          <!--业务数据-->
          <div v-if="item.key === 'bizData'">
            <span>{{ scope.row[item.key] ? JSON.parse(scope.row[item.key])[item.prop] : '' }}</span>
          </div>

          <!--流程节点通用数据-->
          <div v-else-if="item.key === 'status'">
            <el-tag v-for="instStatus in bpmInstanceStatus"
                    :type="instStatus.css"
                    v-if="scope.row.status === instStatus.key">
              {{instStatus.value}}
            </el-tag>
          </div>
          <div v-else-if="item.key === 'approveStatus'">
            <el-tag v-for="btAction in bpmTaskOpinionStatus"
                    :type="btAction.css"
                    v-if="scope.row.approveStatus === btAction.key">
              {{btAction.value}}
            </el-tag>
          </div>
          <div v-else-if="item.key === 'durMs'">
            <span v-if="scope.row[item.key] > 0">{{durationM(scope.row[item.key])}}</span>
            <!--<el-tag v-else>
              {{durationM(scope.row[item.key], scope.row.createTime)}}
            </el-tag>-->
          </div>
          <span v-else>{{ scope.row[item.key]}}</span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="dialogInstanceDetailVisible = true">详情</el-button>
          <el-button size="mini" type="primary"
                     @click="dialogTaskHistoryVisible = true; targetInstanceId = scope.row.id">历史
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentPage"
                     :current-page.sync="table.pageNum"
                     :page-sizes="[10,20,30,50]"
                     :page-size="table.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="table.total" style="margin: -10px;">
      </el-pagination>
    </template>

    <el-dialog :fullscreen="true"
               :visible.sync="dialogInstanceDetailVisible"
               custom-class="act-editor-dialog">
      <div slot="title" class="dialog-title">
        <!-- <span>实例详情</span> -->
      </div>
      <instanceDetail ref="instanceDetail"
                      :doneTask="currentRow"
                      @closeDialog="dialogInstanceDetailVisible = false"
                      @refresh="handleRefreshTable"></instanceDetail>
    </el-dialog>

    <taskHistoryDialog :instanceId="targetInstanceId"
                       :visible.sync="dialogTaskHistoryVisible"
                       :isInnerDialog="true"></taskHistoryDialog>

  </d2-container>
</template>

<script>
  import {MyApproveList} from '@/api/bpm/wf'
  import {BpmTaskAction, BpmInstanceStatus, BpmTaskOpinionStatus} from '@/api/bpm/constant'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'my-task-done-list',
    components: {
      instanceDetail: () => import('./instance-detail'),
      taskHistoryDialog: () => import("../../../components/bpm/task-history"),
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        bpmTaskAction: BpmTaskAction,
        bpmTaskOpinionStatus: BpmTaskOpinionStatus,
        bpmInstanceStatus: BpmInstanceStatus,

        queryForm: {
          //业务筛选条件时，范围数量
          zjdFilterCount: 999,
          applier: '',
          adName: ''
        },
        table: {
          columns: {
            // xm: {
            //   label: '申请人',
            //   key: 'bizData',
            //   prop: "xm"
            // },
            // adName: {
            //   label: '行政区划',
            //   key: 'bizData',
            //   prop: "adName"
            // },
            // businessKey: {
            //   label: '项目编号',
            //   key: 'bizData',
            //   prop: "businessKey"
            // },
            // creator: {
            //   label: '发起人',
            //   key: 'creator',
            // },
            bizKey: {
              label: '业务编号',
              key: 'bizKey',
              prop: "biz_key_"
            },
            subject: {
              label: '流程标题',
              key: 'subject',
            },
            // defName: {
            //   label: '流程名称',
            //   key: 'defName'
            // },
            nodeName: {
              label: '任务节点',
              key: 'nodeName',
              prop: 'task_name_'
            },
            status: {
              label: '流程状态',
              key: 'status',
              prop: "status_",
            },
            approveTime: {
              label: '办理时间',
              key: 'approveTime'
            },
            durMs: {
              label: '办理时间',
              key: 'durMs'
            },
            approveStatus: {
              label: '办理结果',
              key: 'approveStatus',
              prop: 'o.status_'
            },
            // opinion: {
            //   label: '备注',
            //   key: 'opinion'
            // },
          }
        },

        dialogInstanceDetailVisible: false,
        dialogTaskHistoryVisible: false,
        targetInstanceId: undefined
      }
    },
    created() {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData() {
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
      getTableDataParam() {
        // 默认分页参数
        let offset = (this.table.pageNum - 1) * this.table.pageSize
        let limit = this.table.pageSize
        //根据业务修改补充
        let otherParam = {}
        let newQueryForm = this.queryForm
        // 查询字段特殊处理
        // otherParam = Object.assign(otherParam, {
        // })

        // 业务触发筛选条件
        let zjdFilter = !!this.queryForm.xm || !!this.queryForm.adName
        if(zjdFilter){
          newQueryForm = Object.assign({
            // 插件不分页，手动分页
            noPage: zjdFilter ? 'noPage' : 'Page',
            zjdFilter,
            zjdOffset: offset,
            zjdLimit: limit
          }, this.queryForm)
        }


        return Object.assign({
          //参数重写
          offset: offset,
          limit: limit
        }, newQueryForm /*this.queryForm*/, otherParam)
      },
      durationM(duration) {
        return duration > 0 ? this.$moment.duration(duration).humanize() : ''
      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
