<template>
  <d2-container>
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" style="margin-bottom: -25px;">

      <el-form-item label="项目编号" prop="biz_key_$VRHK">
        <el-input v-model="queryForm['biz_key_$VRHK']" placeholder="请输入编号"></el-input>
      </el-form-item>

      <!--<el-form-item label="流程名称" prop="def_name_$VRHK">
        <el-input v-model="queryForm['def_name_$VRHK']" placeholder="请输入名称"></el-input>
      </el-form-item>-->

      <el-form-item label="发起时间大于" prop="create_time_$VGE">
        <el-date-picker v-model="queryForm['create_time_$VGE']" type="datetime" placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width:178px;"></el-date-picker>
      </el-form-item>

      <el-form-item label="流程状态" prop="status_$VEQ">
        <el-select v-model="queryForm['status_$VEQ']" placeholder="请选择" clearable style="width:178px;">
          <el-option v-for="instStatus in instanceStatus" :label="instStatus.value" :value="instStatus.key"></el-option>
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
          &lt;!&ndash; <span>{{scope.row.subject}}</span> &ndash;&gt;
          <span>{{ JSON.parse(scope.row.bizData)["xm"] }}宅基地申请</span>
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="流程名称">
        <template slot-scope="scope">
          <span>{{scope.row.defName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流程状态(是否挂起)">
        <template slot-scope="scope">
          <el-tag v-for="instStatus in instanceStatus" :type="instStatus.css" v-if="scope.row.status == instStatus.key">
            {{instStatus.value}} {{scope.row.isForbidden ? '（已禁用）' : ''}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="持续时间">
        <template slot-scope="scope">
          <span>{{durationM(scope.row.duration,scope.row.createTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="dialogInstanceDetailVisible = true">详情
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteInstance(scope.row)">删除
          </el-button>
          <el-button size="mini" type="warning" @click="handleToForbidden(scope.row)"
                     :disabled="scope.row.status == instanceStatus.end.key">
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
        table: {},

        instanceStatus: BpmInstanceStatus,
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
        let newdata = new Date() //当前时间
        let createTime1 = new Date(createTime.replace(/-/g, "/")) //流程发起时间
        let num = newdata - createTime1 //求出两个时间的时间差，这是毫秒数
        return duration > 0 ? this.$moment.duration(duration).humanize() : this.$moment.duration(num).humanize()
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
