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

            <el-form-item :label="table.columns.bizKey.label" :prop="`${table.columns.bizKey.prop}$VRHK`">
              <el-input v-model="queryForm[`${table.columns.bizKey.prop}$VRHK`]" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item :label="table.columns.status.label" :prop="`${table.columns.status.prop}$VEQ`">
              <el-select v-model="queryForm[`${table.columns.status.prop}$VEQ`]" placeholder="请选择" clearable
                         style="width:178px;">
                <el-option v-for="instStatus in bpmInstanceStatus" :label="instStatus.value"
                           :value="instStatus.key"></el-option>
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
                  重置
                </el-button>
              </el-button-group>
            </el-form-item>

            <div style="float: right">
              <el-form-item>
                <el-button-group>
                  <el-button type="success" @click="handleShowTableView(table_view_default)">正常实例</el-button>
                  <el-button type="warning" @click="handleShowTableView(table_view_abnormal)">异常实例</el-button>
                </el-button-group>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>

      <el-row v-show="showTableView === table_view_default">
        <el-col class="page-table">
          <!-- table表格 -->
          <el-table :key='table.key'
                    :data="table.list"
                    v-loading="table.listLoading"
                    element-loading-text="拼命加载中..."
                    @current-change="handleCurrentRow"
                    highlight-current-row
                    stripe
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                    style="width: 100%">

            <el-table-column v-for="(item, index) in Object.values(table.columns)"
                             :key="index"
                             align="center"
                             :label="item.label"
                             :width="item.width"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="item.key === 'isForbidden'">
                  <el-tag type="success" v-if="!scope.row[item.key]">正常</el-tag>
                  <el-tag type="danger" v-if="scope.row[item.key]">挂起</el-tag>
                </div>
                <div v-else-if="item.key === 'status'">
                  <el-tag v-for="instStatus in bpmInstanceStatus"
                          :type="instStatus.css"
                          v-if="scope.row[item.key] === instStatus.key">
                    {{instStatus.value}}
                  </el-tag>
                </div>
                <div v-else-if="item.key === 'duration'">
                  <span v-if="scope.row[item.key] > 0">{{durationM(scope.row[item.key])}}</span>
                  <el-tag v-else>
                    {{durationM(scope.row[item.key], scope.row.createTime)}}
                  </el-tag>
                </div>
                <span v-else>{{ scope.row[item.key]}}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="300">
              <template slot-scope="scope">
                <el-tooltip content="详情" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogInstanceDetailVisible = true;"
                          icon="el-icon-data-analysis"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="任务记录" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogTaskHistoryVisible = true;dialog_instanceId = scope.row.id"
                          icon="el-icon-tickets"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="流程图" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogDefinitionImgVisible = true;dialog_instanceId = scope.row.id;dialog_definitionId = scope.row.defId"
                          icon="el-icon-picture-outline"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="scope.row.isForbidden ? '激活' : '挂起'"
                            placement="top" effect="light"
                            v-if="scope.row.status === 'running'">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleToForbidden(scope.row)"
                          :icon="scope.row.isForbidden ? 'el-icon-video-play' : 'el-icon-video-pause'"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleDeleteInstance(scope.row)"
                          icon="el-icon-delete"
                          plain
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>

      <el-row v-show="showTableView === table_view_abnormal">
        <el-col class="page-table">
          <!-- table表格 -->
          <el-table :key='table.key'
                    :data="table.list"
                    v-loading="table.listLoading"
                    element-loading-text="拼命加载中..."
                    @current-change="handleCurrentRow"
                    highlight-current-row
                    stripe
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                    style="width: 100%">

            <el-table-column v-for="(item, index) in Object.values(table.columns)"
                             :key="index"
                             align="center"
                             :label="item.label"
                             :width="item.width">
              <template slot-scope="scope">
                <div v-if="item.key === 'isForbidden'">
                  <el-tag type="success" v-if="!scope.row[item.key]">正常</el-tag>
                  <el-tag type="danger" v-if="scope.row[item.key]">挂起</el-tag>
                </div>
                <div v-else-if="item.key === 'status'">
                  <el-tag v-for="instStatus in bpmInstanceStatus"
                          :type="instStatus.css"
                          v-if="scope.row[item.key] === instStatus.key">
                    {{instStatus.value}}
                  </el-tag>
                </div>
                <div v-else-if="item.key === 'duration'">
                  <span v-if="scope.row[item.key] > 0">{{durationM(scope.row[item.key])}}</span>
                  <el-tag v-else>
                    {{durationM(scope.row[item.key], scope.row.createTime)}}
                  </el-tag>
                </div>
                <span v-else>{{ scope.row[item.key]}}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="300">
              <template slot-scope="scope">
                <el-tooltip content="重置节点" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleResetTaskNode(scope.row.id, scope.row.defId)"
                          icon="el-icon-set-up"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="任务记录" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogTaskHistoryVisible = true;dialog_instanceId = scope.row.id"
                          icon="el-icon-tickets"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleDeleteInstance(scope.row)"
                          icon="el-icon-delete"
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

    <el-dialog :fullscreen="true"
               :visible.sync="dialogInstanceDetailVisible"
               custom-class="act-editor-dialog">
      <div slot="title" class="dialog-title">
        <span>实例详情</span>
      </div>
      <instanceDetail ref="instanceDetail"
                      :instance="currentRow"
                      @closeDialog="dialogInstanceDetailVisible = false"
                      @refresh="handleRefreshTable"></instanceDetail>
    </el-dialog>


    <taskHistoryDialog
            :showAssign="true"
            :instanceId="dialog_instanceId"
            :visible.sync="dialogTaskHistoryVisible"></taskHistoryDialog>

    <def-img-dialog
            :instanceId="dialog_instanceId"
            :definitionId="dialog_definitionId"
            :visible.sync="dialogDefinitionImgVisible"></def-img-dialog>

    <instance-reset-node
            :instanceId="dialog_instanceId"
            :definitionId="dialog_definitionId"
            :visible.sync="dialogResetNodeVisible"></instance-reset-node>

  </d2-container>
</template>

<script>
  import {BpmInstanceList, BpmInstanceForbidden, BpmInstanceDelete, BpmInstanceAbnormalList} from '@/api/bpm/wf'
  import {BpmInstanceStatus} from "@/api/bpm/constant"
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'all-instance-list',
    components: {
      instanceDetail: () => import('./instance-detail'),
      taskHistoryDialog: () => import('../../components/bpm/task-history'),
      defImgDialog: () => import('../../components/bpm/definition-img'),
      instanceResetNode: () => import('./instance-reset-node')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        //重写对象属性
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        table: {
          columns: {
            bizKey: {
              label: '业务编号',
              key: 'bizKey',
              prop: "biz_key_"
            },
            subject: {
              label: '流程标题',
              key: 'subject',
            },
            defName: {
              label: '流程名称',
              key: 'defName'
            },
            isForbidden: {
              label: '是否挂起',
              key: 'isForbidden'
            },
            status: {
              label: '流程状态',
              key: 'status',
              prop: "status_",
              width: 120
            },
            createTime: {
              label: '创建时间',
              key: 'createTime'
            },
            creator: {
              label: '创建人',
              key: 'creator'
            },
            duration: {
              label: '持续时间',
              key: 'duration'
            },
          }
        },
        bpmInstanceStatus: BpmInstanceStatus,
        dialogInstanceDetailVisible: false,
        dialogTaskHistoryVisible: false,
        dialogDefinitionImgVisible: false,

        dialog_instanceId: undefined,
        dialog_definitionId: undefined,
        // 异常实例
        table_view_default: 'default',
        table_view_abnormal: 'abnormal',
        showTableView: 'default',
        dialogResetNodeVisible: false
      }
    },
    created() {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData() {

        if (this.showTableView === this.table_view_default) {
          this.table.listLoading = true
          BpmInstanceList(this.getTableDataParam()).then(res => {
            this.table.list = res.rows
            this.table.total = res.total
            this.table.pages = res.page
          }).catch(err => console.log(err)).finally(() => {
            this.table.listLoading = false
          })
        } else {
          this.table.listLoading = true
          BpmInstanceAbnormalList(this.getTableDataParam()).then(res => {
            this.table.list = res.rows
            this.table.total = res.total
            this.table.pages = res.page
          }).catch(err => console.log(err)).finally(() => {
            this.table.listLoading = false
          })
        }


      },
      //其他参数
      getTableDataParam() {
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
      durationM(duration, createTime) {
        if (duration > 0) {
          return this.$moment.duration(duration).humanize()
        } else {
          if (createTime) {
            let createTimeDate = new Date(createTime.replace(/-/g, "/")) //流程发起时间
            let num = new Date() - createTimeDate //求出两个时间的时间差，这是毫秒数
            return this.$moment.duration(num).humanize()
          }
          return ''
        }
      },
      handleToForbidden(row) {
        BpmInstanceForbidden(row.id, !row.isForbidden).then(res => {
          if (res.isOk) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.handleRefreshTable()
        })
      },
      handleDeleteInstance(row) {
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
      },
      handleShowTableView(type) {
        this.showTableView = type
        this.getTableData()
      },
      handleResetTaskNode(instId, definitionId) {
        this.dialogResetNodeVisible = true
        this.dialog_instanceId = instId
        this.dialog_definitionId = definitionId
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
