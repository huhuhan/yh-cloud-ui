<template>
  <d2-container>
    <div class="page-style">
      <el-row>
        <el-col class="page-form">
          <el-form
                  :inline="true"
                  :model="queryForm"
                  ref="queryForm"
                  size="mini">

            <el-form-item :label="table.columns.businessKey.label"
                          :prop="`${table.columns.businessKey.prop}`">
              <el-input v-model="queryForm[`${table.columns.businessKey.prop}`]" placeholder="请输入"></el-input>
            </el-form-item>


            <el-form-item :label="table.columns.name.label" :prop="`${table.columns.name.prop}$VRHK`">
              <el-input v-model="queryForm[`${table.columns.name.prop}$VRHK`]" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item :label="table.columns.assigneeNames.label" :prop="`${table.columns.assigneeNames.prop}$VLK`">
              <el-input v-model="queryForm[`${table.columns.assigneeNames.prop}$VLK`]" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="getTableData">
                  <d2-icon name="search"/>
                  查询
                </el-button>
                <el-button type="default" @click="handleFormReset('queryForm')">
                  <d2-icon name="refresh"/>
                  重置
                </el-button>
              </el-button-group>
            </el-form-item>

            <div style="float: right">
            </div>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="page-table">
          <!-- table表格 -->
          <el-table :key='table.key'
                    :data="table.list"
                    v-loading="table.listLoading"
                    element-loading-text="拼命加载中..."
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    stripe
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                    style="width: 100%">


            <el-table-column v-for="(item, index) in Object.values(table.columns)"
                             :key="index"
                             align="center"
                             :label="item.label"
                             :width="item.width">
              <template slot-scope="scope">
                <div v-if="item.key === 'bizData'">
                  <span>{{ scope.row[item.key] ? JSON.parse(scope.row[item.key])[item.prop] : ''}}</span>
                </div>

                <div v-else-if="item.key === 'status'">
                  <el-tag
                          v-for="btType in bpmTaskTypes"
                          :key="new Date().getTime()"
                          :type="btType.css"
                          v-if="scope.row.status === btType.key">
                    {{btType.value}}
                  </el-tag>
                </div>
                <div v-else-if="item.key === 'assigneeNames'">
                  <span v-if="scope.row.assigneeNames">{{scope.row.assigneeNames}}</span>
                  <span v-else>-</span>
                </div>
                <span v-else>{{ scope.row[item.key]}}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="300">
              <template slot-scope="scope">
                <el-tooltip content="指派" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogTaskUserVisible = !dialogTaskUserVisible"
                          icon="el-icon-user"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="流程图" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogDefImgVisible = true;dialog_instanceId = scope.row.instId;dialog_definitionId = scope.row.defId"
                          icon="el-icon-picture-outline"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="处理" placement="top" effect="light"  v-if="isSuperAdmin">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogTaskDetailVisible = true"
                          icon="el-icon-circle-check"
                          plain
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
    </div>
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

    <def-img-dialog
            :instanceId="dialog_instanceId"
            :definitionId="dialog_definitionId"
            :visible.sync="dialogDefImgVisible"></def-img-dialog>

  </d2-container>
</template>

<script>
  import {BpmTaskList, BpmAssignTask} from '@/api/bpm/wf'
  import {BpmTaskToDoType} from "@/api/bpm/constant"
  import pageMixins from '@/components/my-table-page/page-mixins'
  import {mapGetters} from "vuex"

  export default {
    name: 'all-task',
    components: {
      taskUserDialog: () => import('../../components/bpm/task-user'),
      taskDetail: () => import('./task-detail'),
      defImgDialog: () => import('../../components/bpm/definition-img')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        queryForm: {
          //业务筛选条件时，范围数量
          zjdFilterCount: 999,
          businessKey: ''
        },
        //重写对象属性
        table: {
          columns: {
            businessKey: {
              label: '业务编号',
              key: 'bizData',
              prop: 'businessKey'
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
            assigneeNames: {
              label: '候选人',
              key: 'assigneeNames',
              prop: 'assignee_names_'
            },
            status: {
              label: '节点状态',
              key: 'status',
            },
            createTime: {
              label: '创建时间',
              key: 'createTime',
            },
          }
        },

        bpmTaskTypes: BpmTaskToDoType,

        dialogTaskUserVisible: false,
        dialogTaskDetailViewFullscreen: true,
        dialogTaskDetailVisible: false,
        dialogDefImgVisible: false,
        dialog_definitionId: undefined,
        dialog_instanceId: undefined,
      }
    },
    created() {
      this.getTableData()
    },
    computed: {
      ...mapGetters("d2admin", {
        isSuperAdmin: "user/isSuperAdmin"
      }),
    },
    methods: {
      getTableData() {
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
      getTableDataParam() {
        //根据业务修改补充
        let otherParam = {}
        // 触发筛选条件
        let zjdFilter = !!this.queryForm.businessKey
        this.table.pageSize = zjdFilter ? this.queryForm.zjdFilterCount : this.table.pageSize
        let newQueryForm = Object.assign({
          zjdFilter: zjdFilter,
        }, this.queryForm)
        //...
        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, newQueryForm/*this.queryForm*/, otherParam)
      },
      confirmTaskUser(taskUser) {
        if (taskUser === undefined) {
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
