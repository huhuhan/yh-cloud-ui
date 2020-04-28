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
                  @current-change="handleCurrentRow"
                  stripe
                  style="width: 100%">


            <el-table-column align="center" label="测试字段">
                <template slot-scope="scope">
                    <span :title="scope.row.id">{{scope.row.id}}</span>
                </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDetail(scope.row)">查看详情
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
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'template-table-page',
    components: {},
    mixins: [
      pageMixins,
    ],
    data () {
      return {
        queryForm: {
          id: undefined,
        },
        //重写对象属性
        table: {
          key: new Date().getTime(),
          pageNum: 1,
          pageSize: 2,
        },
      }
    },
    created () {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData () {
        this.table.listLoading = true
        // HadDone(this.getTableDataParam()).then(res => {
        //   this.table.list = res.records || res.list || res.data
        //   this.table.total = res.total
        // }).catch(err => console.log(err)).finally(() => {
        //   this.table.listLoading = false
        // })
      },
      //其他参数
      getTableDataParam () {
        //根据业务修改补充
        let otherParam = {
          loginName: this.info.username
        }
        //时间区间字段，调整
        let newQueryForm = Object.assign({}, this.queryForm)
        //...
        return Object.assign({
          pageNum: this.table.pageNum,
          pageSize: this.table.pageSize
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
