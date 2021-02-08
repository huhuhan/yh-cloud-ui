<template>
  <d2-container>
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" style="margin-bottom: -25px;">

      <!--<el-form-item label="流程标题" prop="subject_$VRHK">
        <el-input v-model="queryForm['subject_$VRHK']" placeholder="请输入名称"></el-input>
      </el-form-item>-->
      <el-form-item label="项目编号" prop="biz_key_$VRHK">
        <el-input v-model="queryForm['biz_key_$VRHK']" placeholder="请输入编号"></el-input>
      </el-form-item>

      <!-- <el-form-item label="任务节点" prop="task_name_$VRHK">
        <el-input v-model="queryForm['task_name_$VRHK']" placeholder="请输入名称"></el-input>
      </el-form-item> -->

      <el-form-item label="办理时间大于" prop="approve_time_$VGE">
        <el-date-picker v-model="queryForm['approve_time_$VGE']" type="datetime" placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width:178px;"></el-date-picker>
      </el-form-item>

      <el-form-item label="办理结果" prop="approveStatus$VEQ">
        <el-select v-model="queryForm['approveStatus$VEQ']" placeholder="请选择" clearable style="width:178px;">
          <el-option v-for="action in bpmTaskAction" :label="action.value" :value="action.key"></el-option>
        </el-select>
      </el-form-item>

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
              :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
              element-loading-text="拼命加载中..."
              @current-change="handleCurrentRow"
              highlight-current-row
              stripe
              style="width: 100%">


      <el-table-column align="center" label="业务编号" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.bizKey}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="流程标题">
        <template slot-scope="scope">
          <span>{{scope.row.subject}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="流程名称">
        <template slot-scope="scope">
          <span>{{scope.row.defName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务节点">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流程状态">
        <template slot-scope="scope">
          <el-tag v-for="instStatus in bpmInstanceStatus" :type="instStatus.css" v-if="scope.row.status == instStatus.key">
            {{instStatus.value}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起人">
        <template slot-scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="办理时间" show-overflow-tooltip>
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
          <el-tag v-for="btAction in bpmTaskOpinionStatus"
                  :type="btAction.css"
                  v-if="scope.row.approveStatus == btAction.key">
            {{btAction.value}}
          </el-tag>
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
          order: 'ASC', //DESC
          //业务筛选条件时，范围数量
          zjdFilterCount: 999,
          applier: '',
          adName: ''
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
        //根据业务修改补充
        let otherParam = {}
        let newQueryForm = {}
        // 查询字段特殊处理
        otherParam = Object.assign(otherParam, {
          'o.status_$VEQ': this.queryForm['approveStatus$VEQ']
        })

        // 业务触发筛选条件
        /*let zjdFilter = !!this.queryForm.applier || !!this.queryForm.adName
        this.table.pageSize = zjdFilter ? this.queryForm.zjdFilterCount : this.table.pageSize
        newQueryForm = Object.assign({
          zjdFilter: zjdFilter,
        }, this.queryForm)*/

        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
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
