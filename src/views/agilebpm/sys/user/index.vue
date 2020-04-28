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
                  stripe
                  style="width: 100%">


            <el-table-column align="center" label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.fullname}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="账户">
                <template slot-scope="scope">
                    <span>{{scope.row.account}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="手机号">
                <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span >{{scope.row.createTime}}</span>
                </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情
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

    </d2-container>
</template>

<script>
  import { BpmUserList } from '../../../../api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'sys-user',
    components: {},
    mixins: [
      pageMixins,
    ],
    data () {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        //重写对象属性
        table: {
        },
      }
    },
    created () {
      this.getTableData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        BpmUserList(this.getTableDataParam()).then(res => {
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
      handleDetail (row) {
      },
      handleUpdate (row) {
      },
      handleCheck (row) {
      },

    }
  }
</script>

<style lang="scss" scoped>

</style>
