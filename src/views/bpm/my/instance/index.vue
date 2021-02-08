<template>
  <d2-container>
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" style="margin-bottom: -25px;">

      <el-form-item :label="table.columns.bizKey.label" :prop="`${table.columns.bizKey.prop}$VRHK`">
        <el-input v-model="queryForm[`${table.columns.bizKey.prop}$VRHK`]" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="发起时间大于" prop="create_time_$VGE">
        <el-date-picker v-model="queryForm['create_time_$VGE']" type="datetime" placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width:178px;"></el-date-picker>
      </el-form-item>

      <el-form-item :label="table.columns.status.label" :prop="`${table.columns.status.prop}$VEQ`">
        <el-select v-model="queryForm[`${table.columns.status.prop}$VEQ`]" placeholder="请选择" clearable
                   style="width:178px;">
          <el-option v-for="instStatus in bpmInstanceStatus" :label="instStatus.value"
                     :value="instStatus.key"></el-option>
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

          <!--流程实例通用数据-->
          <div v-else-if="item.key === 'isForbidden'">
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
          <span v-else-if="item.key === 'duration'">{{durationM(scope.row[item.key])}}</span>
          <span v-else>{{ scope.row[item.key]}}</span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="dialogInstanceDetailVisible = true">详情
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteInstance(scope.row)">删除
          </el-button>
          <el-button size="mini" type="warning" @click="handleToForbidden(scope.row)"
                     :disabled="scope.row.status === bpmInstanceStatus.end.key">
            {{scope.row.isForbidden ? '激活' : '挂起'}}
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
        <span>实例详情</span>
      </div>
      <instanceDetail ref="instanceDetail"
                      :instance="currentRow"
                      @closeDialog="dialogInstanceDetailVisible = false"
                      @refresh="handleRefreshTable"></instanceDetail>
    </el-dialog>

  </d2-container>
</template>

<script>
  import {MyApplyTaskList, BpmInstanceDelete, BpmInstanceForbidden} from '@/api/bpm/wf'
  import pageMixins from '@/components/my-table-page/page-mixins'
  import {BpmInstanceStatus} from '@/api/bpm/constant'
  import {mapActions} from "vuex"

  export default {
    name: 'my-instance-list',
    components: {
      instanceDetail: () => import('./instance-detail')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
          applier: "",
        },
        //重写对象属性
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
            },
            createTime: {
              label: '创建时间',
              key: 'createTime'
            },
            duration: {
              label: '持续时间',
              key: 'duration'
            },
          }
        },

        bpmInstanceStatus: BpmInstanceStatus,
        dialogInstanceDetailVisible: false,
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
        MyApplyTaskList(this.getTableDataParam()).then(res => {
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
        //时间区间字段，调整
        let newQueryForm = Object.assign({}, this.queryForm)
        //...
        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, newQueryForm /*this.queryForm*/, otherParam)
      },
      durationM(duration, createTime) {
        return duration > 0 ? this.$moment.duration(duration).humanize() : ''
      },
      handleDeleteInstance(row) {
        this.$confirm('确定删除?', '提示', {
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
            this.renderRoute()
              .then(() => {
              })
            this.handleRefreshTable()
          })
        })
      },
      handleToForbidden(row) {
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
    }
  }

</script>

<style lang="scss" scoped>

</style>
