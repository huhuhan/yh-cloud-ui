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

            <el-form-item :label="table.columns.name.label" :prop="`${table.columns.name.prop}$VRHK`">
              <el-input v-model="queryForm[`${table.columns.name.prop}$VRHK`]" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item :label="table.columns.key.label" :prop="`${table.columns.key.prop}$VRHK`">
              <el-input v-model="queryForm[`${table.columns.key.prop}$VRHK`]" placeholder="请输入"></el-input>
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
                  <el-button type="success" @click="dialogDefCreateVisible = true; copyTarget = undefined">
                    <d2-icon name="plus"/>
                    新建
                  </el-button>
                </el-button-group>
              </el-form-item>
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
                    @current-change="handleCurrentRow"
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }"
                    highlight-current-row
                    stripe
                    style="width: 100%">

            <el-table-column v-for="(item, index) in Object.values(table.columns)"
                             :key="index"
                             align="center"
                             :label="item.label"
                             :width="item.width"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row[item.key]}}</span>
              </template>
            </el-table-column>


            <el-table-column fixed="right" align="center" label="操作" width="300">
              <template slot-scope="scope">
                <el-tooltip content="启动" placement="top" effect="light" v-if="isSuperAdmin">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogDefDetailVisible = true"
                          icon="el-icon-position"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleEdit(scope.row.actModelId, scope.row.name)"
                          icon="el-icon-edit"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="版本" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogDefVersionsVisible = true; versionTarget = scope.row"
                          icon="el-icon-folder-checked"
                          plain
                  ></el-button>
                </el-tooltip>
                <br>
                <el-tooltip content="复制" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleCopy(scope.row)"
                          icon="el-icon-copy-document"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="授权" placement="top" effect="light">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="dialogDefAuthorizeVisible = true; authorizeTarget = scope.row.key"
                          icon="el-icon-user"
                          plain
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light" v-if="isSuperAdmin">
                  <el-button
                          size="mini"
                          type="primary"
                          @click="handleDelete(scope.row)"
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


    <definitionCreate
            @createSuccess="handleEdit"
            :target="copyTarget"
            :targetType="createTargetType"
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

    <definition-versions :definition="versionTarget"
                         @refresh="handleRefreshTable"
                         :visible.sync="dialogDefVersionsVisible"></definition-versions>
  </d2-container>
</template>

<script>
  import {BpmDefinitionList, BpmModelerUrl, BpmDefinitionDelete} from '@/api/bpm/wf'
  import pageMixins from '@/components/my-table-page/page-mixins'
  import {mapGetters} from "vuex"

  export default {
    name: 'all-definition',
    components: {
      definitionCreate: () => import('./definition-create'),
      definitionDetail: () => import('./definition-detail'),
      definitionModeler: () => import('./definition-modeler'),
      definitionAuthorize: () => import('./definition-authorize'),
      definitionVersions: () => import('./definition-versions')
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
        table: {
          columns: {
            name: {
              label: '流程名称',
              key: 'name',
              prop: "name_"
            },
            key: {
              label: '流程KEY',
              key: 'key',
              prop: "key_"
            },
            desc: {
              label: '描述',
              key: 'desc'
            },
            version: {
              label: '当前版本',
              key: 'version'
            },
            createTime: {
              label: '创建时间',
              key: 'createTime',
            },
          }
        },

        dialogDefCreateVisible: false,
        copyTarget: undefined,
        createTargetType: "create",

        dialogDefDetailVisible: false,
        dialogDefModelerVisible: false,
        modelerSrc: '#',
        modelerTitle: '',

        dialogDefAuthorizeVisible: false,
        authorizeTarget: undefined,

        dialogDefVersionsVisible: false,
        versionTarget: undefined,
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
      handleCopy(row) {
        this.dialogDefCreateVisible = true
        let copyV = '_duplicate'
        this.createTargetType = "COPY"
        this.copyTarget = {
          name: row.name + copyV,
          key: row.key + copyV,
          desc: row.desc + copyV,
          originKey: row.key,
          originName: row.name,
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
