<template>
  <d2-container>
    <el-form
            :inline="true"
            :model="queryForm"
            ref="queryForm"
            size="mini"
            style="margin-bottom: -25px;"
    >
      <!--<el-form-item label="流程标题" prop="subject_$VRHK">
        <el-input v-model="queryForm['subject_$VRHK']" placeholder="请输入名称"></el-input>
      </el-form-item>-->
      <el-form-item label="项目编号" prop="biz_key_$VRHK">
        <el-input v-model="queryForm['biz_key_$VRHK']" placeholder="请输入编号"></el-input>
      </el-form-item>

      <!-- <el-form-item label="任务节点" prop="task_name_$VRHK">
        <el-input v-model="queryForm['task_name_$VRHK']" placeholder="请输入名称"></el-input>
      </el-form-item> -->

      <el-form-item label="创建时间大于" prop="create_time_$VGE">
        <el-date-picker
                v-model="queryForm['create_time_$VGE']"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:178px;"
        ></el-date-picker>
      </el-form-item>

      <!-- <el-form-item label="待办类型">
        <el-select v-model="queryForm['task.status_$VGE']" placeholder="请选择">
          <el-option v-for="BTtype in bpmTaskTypes" :label="BTtype.value" :value="BTtype.key"></el-option>
        </el-select>
      </el-form-item> -->

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
    <el-table
            :key="table.key"
            :data="table.list"
            v-loading="table.listLoading"
            element-loading-text="拼命加载中..."
            highlight-current-row
            @current-change="handleCurrentRow"
            stripe
            style="width: 100%"
    >
      <el-table-column align="center" label="业务编号" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.bizKey}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流程标题">
        <template slot-scope="scope">
          <span>{{scope.row.subject}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前节点">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="待办类型">
        <template slot-scope="scope">
          <el-tag
                  v-for="btType in bpmTaskTypes"
                  :key="new Date().getTime()"
                  :type="btType.css"
                  v-if="scope.row.status == btType.key"
          >{{btType.value}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="dialogTaskDetailVisible = true">处理</el-button>
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
              style="margin: -10px;"
      ></el-pagination>
    </template>

    <el-dialog :fullscreen="true"
               :visible.sync="dialogTaskDetailVisible"
               custom-class="act-editor-dialog">
      <div slot="title" class="dialog-title">
        <!-- <span>任务详情</span> -->
      </div>
      <taskDetail
              ref="taskDetail"
              :task="currentRow"
              @closeDialog="taskDetailCloseDialog"
              @refresh="handleRefreshTable"
      ></taskDetail>
    </el-dialog>
  </d2-container>
</template>

<script>
  import {MyToDoTaskList} from '@/api/bpm/wf'
  import {BpmTaskType} from '@/api/bpm/constant'
  import pageMixins from '@/components/my-table-page/page-mixins'
  import {mapActions} from "vuex"

  export default {
    name: 'my-task',
    components: {
      taskDetail: () => import('./task-detail')
    },
    mixins: [pageMixins],
    data() {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
          //业务筛选条件时，范围数量
          zjdFilterCount: 999,
          applier: '',
          adName: ''
        },
        bpmTaskTypes: BpmTaskType,
        dialogTaskDetailVisible: false,
      }
    },
    created() {
      this.getTableData()
    },
    computed: {},
    methods: {
      ...mapActions("d2admin/account", ["renderRoute"]),
      getTableData() {
        this.table.listLoading = true
        MyToDoTaskList(this.getTableDataParam()).then(res => {
          console.log(res.rows)
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
        // 触发筛选条件
        let zjdFilter = !!this.queryForm.applier || !!this.queryForm.adName
        this.table.pageSize = zjdFilter ? this.queryForm.zjdFilterCount : this.table.pageSize
        let newQueryForm = Object.assign({
          zjdFilter: zjdFilter,
        }, this.queryForm)
        //...
        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, newQueryForm /*this.queryForm*/, otherParam)
      },
      jflxChange(jflx) {
        switch (jflx) {
          case "1":
            return "原址新建"
          case "2":
            return "改扩建"
          case "3":
            return "异址新建"
          case "4":
            return "宅基地流转"
          case "5":
            return "宅基地退出"
          default:
            return ""
        }
      },
      /**
       * 重写表单重置
       * 备注：prop不支持xx.xx的属性，会被解析成对象
       * @param formName
       */
      /*handleFormReset(formName) {
        this.queryForm['task.status_$VGE'] = undefined
        this.$refs[formName].resetFields()
        this.getTableData()
      },*/
      // 点击操作按钮触发关闭任务详情时触发
      taskDetailCloseDialog() {
        this.dialogTaskDetailVisible = false
      }
    },

  }

</script>

<style lang="scss" scoped>
</style>
