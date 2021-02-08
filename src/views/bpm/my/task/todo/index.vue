<template>
  <d2-container>
    <el-form
            :inline="true"
            :model="queryForm"
            ref="queryForm"
            size="mini"
    >
      <el-form-item :label="table.columns.bizKey.label" :prop="`${table.columns.bizKey.prop}$VRHK`">
        <el-input v-model="queryForm[`${table.columns.bizKey.prop}$VRHK`]" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item :label="table.columns.name.label" :prop="`${table.columns.name.prop}$VRHK`">
        <el-input v-model="queryForm[`${table.columns.name.prop}$VRHK`]" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item :label="`${table.columns.createTime.label}大于`">
        <el-date-picker
                v-model="queryForm[`${table.columns.createTime.prop}$VGE`]"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:178px;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item :label="table.columns.status.label">
        <el-select v-model="queryForm[`${table.columns.status.prop}$VEQ`]" placeholder="请选择">
          <el-option v-for="btType in bpmTaskToDoType" :label="btType.value" :value="btType.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button type="primary" @click="getTableData">
            <d2-icon name="search"/>
            查询
          </el-button>
          <el-button type="default" @click="handleFormReset('queryForm')">
            <d2-icon name="refresh"/>
          </el-button>
        </el-button-group>
      </el-form-item>

      <div style="float: right">
      </div>

    </el-form>

    <!-- table表格 -->
    <el-table
            :key="table.key"
            :data="table.list"
            v-loading="table.listLoading"
            element-loading-text="拼命加载中..."
            highlight-current-row
            :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
            @current-change="handleCurrentRow"
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
            <el-tag v-for="btType in bpmTaskToDoType"
                    :key="new Date().getTime()"
                    :type="btType.css"
                    v-if="scope.row.status === btType.key">
              {{btType.value}}
            </el-tag>
          </div>
          <span v-else>{{ scope.row[item.key]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="超时时间" sortable="custom" prop="task.create_time_">
        <template slot-scope="scope">
          <el-tag v-if="$moment().diff(scope.row.createTime, 'days') >= taskWarningTime" type="danger">
            {{$moment().diff(scope.row.createTime, 'days')}}天
          </el-tag>
          <span v-else>{{$moment().diff(scope.row.createTime, 'days')}}天</span>
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
  import {BpmTaskToDoType} from '@/api/bpm/constant'
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
          //业务筛选条件时，范围数量
          zjdFilterCount: 999,
          applier: '',
          adName: ''
        },
        table: {
          columns: {
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
            bizKey: {
              label: '业务编号',
              key: 'bizKey',
              prop: "biz_key_"
            },
            subject: {
              label: '流程标题',
              key: 'subject',
            },
            name: {
              label: '任务节点',
              key: 'name',
              prop: 'name_'
            },
            status: {
              label: '待办类型',
              key: 'status',
              prop: "task.status_",
            },
            createTime: {
              label: '创建时间',
              key: 'createTime',
              prop: 'task.create_time_'
            },

          }
        },

        bpmTaskToDoType: BpmTaskToDoType,
        dialogTaskDetailVisible: false,
      }
    },
    created() {
      this.getTableData()
    },
    computed: {
      taskWarningTime() {
        // 实际获取，可以参考store或后端的配置
        return 7
      }
    },
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
        // 默认分页参数
        let offset = (this.table.pageNum - 1) * this.table.pageSize
        let limit = this.table.pageSize
        //根据业务修改补充
        let otherParam = {}
        let newQueryForm = this.queryForm

        // 业务触发筛选条件
        let zjdFilter = !!this.queryForm.xm || !!this.queryForm.adName
        if (zjdFilter) {
          newQueryForm = Object.assign({
            // 插件不分页，手动分页
            noPage: zjdFilter ? 'noPage' : 'Page',
            zjdFilter,
            zjdOffset: offset,
            zjdLimit: limit
          }, this.queryForm)
        }

        //...
        return Object.assign({
          //参数重写
          offset: offset,
          limit: limit
        }, newQueryForm /*this.queryForm*/, otherParam)
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
