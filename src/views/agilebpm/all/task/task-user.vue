<template>
    <el-dialog :append-to-body="isInnerDialog"
               key="taskHistoryDialog"
               :visible.sync="visible"
               :fullscreen="fullscreen"
               :before-close="close"
               width="700px"
               @open="openInit">
        <div slot="title" class="dialog-title">
            <span>用户筛选</span>
            <button
                    type="button"
                    class="el-dialog__headerbtn"
                    aria-label="Fullscreen"
                    @click="fullscreen = !fullscreen"
                    style="right: 50px;">
                <i class="el-dialog__close el-icon el-icon-full-screen"></i>
            </button>
        </div>
        <div>
            <el-form
                    :inline="true"
                    :model="queryForm"
                    ref="queryForm"
                    size="mini">

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
            >

                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.fullname_}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="账户">
                    <template slot-scope="scope">
                        <span>{{scope.row.account_}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="手机号">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile_}}</span>
                    </template>
                </el-table-column>

            </el-table>

            <!-- footer 分页条 -->
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentPage"
                    :current-page.sync="table.pageNum"
                    :page-sizes="[table.pageSize, 10,30]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.total"
                    style="margin-top:10px;">
            </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </div>

    </el-dialog>
</template>

<script>
  import { BpmTaskUserList } from '@/api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'task-user',
    components: {},
    mixins: [
      pageMixins,
    ],
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      isInnerDialog: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        //重写对象属性
        table: {
          pageSize: 5
        },
        // currentRow: null
      }
    },
    computed: {},
    methods: {
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      openInit () {
        this.getTableData()
        this.$log.default('初始化任务用户筛选弹窗')
      },
      getTableData () {
        this.table.listLoading = true
        BpmTaskUserList(this.getTableDataParam()).then(res => {
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
      handleConfirm () {
        this.$emit('confirmUser', this.currentRow)
        this.close()
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
