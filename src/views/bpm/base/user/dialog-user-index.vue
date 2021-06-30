<template>
  <el-dialog :append-to-body="isInnerDialog"
             :title="targetTitle"
             :visible.sync="visible"
             :fullscreen="fullscreen"
             :before-close="close"
             width="700px"
             @open="openInit">
    <el-row>
      <el-col class="page-form">
        <el-form :model="queryForm" ref="queryForm" :inline="true" size="mini">
          <el-form-item label="昵称" prop="fullname_^VRHK">
            <el-input v-model="queryForm['fullname_^VRHK']"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account_^VRHK">
            <el-input v-model="queryForm['account_^VRHK']"></el-input>
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
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.list"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  size="mini"
                  @selection-change="handleSelectionChange"
                  @current-change="handleCurrentRow">

          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="fullname" label="昵称"></el-table-column>
          <el-table-column prop="account" label="账号"></el-table-column>
        </el-table>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentPage"
                :current-page.sync="table.pageNum"
                :page-sizes="[5,10,20,30]"
                :page-size="table.pageSize"
                :pager-count="table.pageCount"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total"
                style="margin: 10px;">
        </el-pagination>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close" icon="el-icon-close">取 消</el-button>
      <el-button size="mini" type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {GetUserTableList} from "@/api/bpm/org.userole"
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'dialog-user-index',
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
      targetTitle: {
        type: String,
        default: "用户筛选"
      },
    },
    data() {
      return {
        fullscreen: false,
        table: {
          pageSize: 5,
        },
      }
    },
    methods: {
      getTableData() {
        this.table.listLoading = true
        GetUserTableList(this.getTableDataParam()).then(res => {
          this.table.list = res.rows
          this.table.total = res.total
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      getTableDataParam() {
        let otherParam = {}
        return Object.assign({
          offset: (this.table.pageNum - 1) * this.table.pageSize,
          limit: this.table.pageSize
        }, this.queryForm, otherParam)
      },
      close() {
        this.$emit('update:visible', false)
      },
      openInit() {
        this.getTableData()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$emit('selectedRows', this.selectedRows)
        this.$emit('currentRow', this.currentRow)
        this.close()
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
