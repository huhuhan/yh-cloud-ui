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
                  @current-change="handleCurrentRow"
                  highlight-current-row
                  stripe
                  style="width: 100%">


            <el-table-column align="center" label="流程名称">
                <template slot-scope="scope">
                    <span :title="scope.row.name">{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="流程KEY">
                <template slot-scope="scope">
                    <span :title="scope.row.key">{{scope.row.key}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="描述">
                <template slot-scope="scope">
                    <span :title="scope.row.desc">{{scope.row.desc}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span :title="scope.row.createTime">{{scope.row.createTime}}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="dialogDefDetailVisible = true">启动
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
                    :page-sizes="[5,10,20,30,50]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.total"
                    style="margin: -10px;">
            </el-pagination>
        </template>


        <el-dialog
                :visible.sync="dialogDefDetailVisible"
                :fullscreen="true"
                custom-class="act-editor-dialog">
            <div slot="title" class="dialog-title">
                <span>启动流程窗口</span>
            </div>
            <definition-detail :definition="currentRow"
                               @closeDialog="dialogDefDetailVisible = false"></definition-detail>
        </el-dialog>

    </d2-container>
</template>

<script>
  import { MyDefinitionList } from '@/api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'my-definition-start',
    components: {
      definitionDetail: () => import('@/views/agilebpm/all/definition/definition-detail'),
    },
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
          pageSize: 5
        },

        dialogDefDetailVisible: false,
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        MyDefinitionList(this.getTableDataParam()).then(res => {
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
    }
  }
</script>

<style lang="scss" scoped>

</style>
