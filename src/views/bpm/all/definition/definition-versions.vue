<template>
  <el-dialog :append-to-body="isInnerDialog"
             key="defVersionsDialog"
             title="流程版本"
             :visible.sync="visible"
             v-loading="table.loading"
             :before-close="close"
             @open="openInit">

    <!-- table表格 -->
    <el-table :key='table.key' :data="table.list" v-loading="table.listLoading" element-loading-text="拼命加载中..."
              @current-change="handleCurrentRow" highlight-current-row stripe>

      <el-table-column
              v-for="(item, index) in table.columns"
              :key="index"
              align="center"
              :prop="item.prop"
              :label="item.label">
        <template slot-scope="scope">
          <el-switch v-if="item.prop === 'isMain'"
                     @change="handleIsMain(scope.row)"
                     :value="scope.row[item.prop] === 'Y'">
          </el-switch>
          <span v-else :title="scope.row[item.prop]">{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top" effect="light">
            <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.row.actModelId, scope.row.name)"
                    icon="el-icon-edit"
                    plain
            ></el-button>
          </el-tooltip>
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

  </el-dialog>
</template>

<script>
  import {BpmDefinitionList, BpmModelerUrl, SetMainVersion} from '@/api/bpm/bpm'
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'definition-versions',
    props: {
      //必需
      definition: {
        type: Object,
      },
      visible: {
        type: Boolean,
        default: false
      },
      isInnerDialog: {
        type: Boolean,
        default: false
      }
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        table: {
          columns: [
            {
              label: '流程名称',
              prop: 'name'
            },
            {
              label: '描述',
              prop: 'desc'
            },
            {
              label: '是否主版本',
              prop: 'isMain'
            },
            {
              label: '版本号',
              prop: 'version'
            },
            {
              label: '创建时间',
              prop: 'createTime'
            },
          ]
        },
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
        this.$emit('refresh')
      },
      openInit() {
        this.getTableData()
      },
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
        let otherParam = {
          isVersions$V: true,
          key_$VEQ: this.definition ? this.definition.key : '###',
        }
        //时间区间字段，调整
        let newQueryForm = Object.assign({}, this.queryForm)
        //...
        return Object.assign({
          //参数重写
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, newQueryForm/*this.queryForm*/, otherParam)
      },
      handleIsMain(row) {
        this.$confirm('确定设置为主版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          SetMainVersion(row.id).then(res => {
            if (res.isOk) {
              this.$message.success('更新成功！')
              this.getTableData()
            } else {
              this.$message.error('更新失败！')
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

<style scoped>

</style>
