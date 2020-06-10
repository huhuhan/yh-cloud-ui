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
                    <el-button type="success" @click="dialogDefCreateVisible = true">新建
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
                    <el-button size="mini" type="primary" @click="dialogDefAuthorizeVisible = true; authorizeTarget = scope.row.key">授权
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleEdit(scope.row.actModelId, scope.row.name)">编辑
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleDelete(scope.row)">删除
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

        <definitionCreate
                @createSuccess="handleEdit"
                :visible.sync="dialogDefCreateVisible"></definitionCreate>

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

        <definition-modeler :src="modelerSrc"
                            :title="modelerTitle"
                            :visible.sync="dialogDefModelerVisible"></definition-modeler>

        <definition-authorize :target="authorizeTarget"
                              :visible.sync="dialogDefAuthorizeVisible"></definition-authorize>
    </d2-container>
</template>

<script>
  import {BpmDefinitionList, BpmModelerUrl, BpmDefinitionDelete} from '../../../../api/agilebpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'all-definition',
    components: {
      definitionCreate: () => import('./definition-create'),
      definitionDetail: () => import('./definition-detail'),
      definitionModeler: () => import('./definition-modeler'),
      definitionAuthorize: () => import('./definition-authorize')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        queryForm: {
          id: undefined,
          order: 'ASC', //DESC
        },
        //重写对象属性
        table: {},

        dialogDefCreateVisible: false,

        dialogDefDetailVisible: false,
        dialogDefModelerVisible: false,
        modelerSrc: '#',
        modelerTitle: '',

        dialogDefAuthorizeVisible: false,
        authorizeTarget: undefined
      }
    },
    created() {
      this.getTableData()
    },
    computed: {},
    methods: {
      getTableData() {
        this.table.listLoading = true
        BpmDefinitionList(this.getTableDataParam()).then(res => {
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
        }, newQueryForm/*this.queryForm*/, otherParam)
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BpmDefinitionDelete(row.id).then(res => {
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
      handleEdit(id, name) {
        //改用新窗口加载设计器（另外静态项目）
        this.$open(BpmModelerUrl(id))
        //内置存在多层嵌套窗口交互跨域或获取不到窗口对象等问题
        // this.modelerSrc = BpmModelerUrl(id)
        // this.modelerTitle = name || ''
        // this.dialogDefModelerVisible = true
      },

    }
  }
</script>

<style lang="scss" scoped>

</style>
