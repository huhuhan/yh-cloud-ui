<template>
  <div class="wrapper">
    <div class="left-wrapper panel-wrapper">
      <div class="panel-title">行政区划</div>
      <div class="panel-content">
        <region-tree :ref="regionTreeRef"
                     @treeDataInit="initTableData"
                     @treeNodeClick="handleClickRegionTreeNode"></region-tree>
      </div>
    </div>
    <div class="right-wrapper panel-wrapper">
      <div class="panel-top">
        <div class="panel-condition">
          <el-form :ref="queryFormRef" :model="queryForm" :inline="true" size="mini">
            <el-form-item prop="keyWord">
              <el-input v-model="queryForm['keyWord']" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="getTableData">
                  <d2-icon name="search"/>
                  查询
                </el-button>
                <el-button type="default" @click="handleRefresh">
                  <d2-icon name="refresh"/>
                  刷新
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="panel-tools">
          <el-button-group>
            <el-button type="primary" size="mini" @click="openImportDialogVisible" icon="el-icon-upload2">导入数据
            </el-button>
            <el-button type="primary" size="mini" @click="openCreateRegionDialog" icon="el-icon-plus">新增</el-button>
            <el-button type="primary" size="mini" @click="openEditRegionDialog" icon="el-icon-edit">编辑</el-button>
            <el-button type="primary" size="mini" @click="handleDelete" icon="el-icon-delete">删除</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="panel-content">
        <el-table lazy v-loading="table.loading" ref="regionTableTree" height="100%" :data="table.list"
                  highlight-current-row :load="loadNode" @current-change="handleCurrentRow" style="width: 100%;"
                  row-key="id" border :tree-props="tableTreeProps">
          <el-table-column label="行政区代码" prop="adCode"></el-table-column>
          <el-table-column label="行政区名称" prop="adName"></el-table-column>
          <el-table-column label="行政区级别">
            <template slot-scope="scope">{{regionLevelOptions[scope.row.level-1]}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增|编辑 弹框 -->
    <dialog-modify-region
            :target="modifyRegionId"
            :targetType="modifyRegionType"
            @refresh="handleRefresh"
            :visible.sync="modifyRegionDialogVisible"></dialog-modify-region>


    <!-- 导入 弹框 -->
    <dialog-import-region
            @refresh="handleRefreshTable"
            :visible.sync="importRegionDialogVisible"></dialog-import-region>


  </div>
</template>

<script>
  import {GetRegionTree, GetRegionData, DeleteRegion} from "@/api/bpm/org.region"
  import pageMixins from '@/components/my-table-page/page-mixins'

  export default {
    name: 'region-index',
    components: {
      regionTree: () => import('./region-tree'),
      dialogModifyRegion: () => import('./modify-region'),
      dialogImportRegion: () => import('./import-region')
    },
    mixins: [
      pageMixins,
    ],
    data() {
      return {
        regionLevelOptions: ["省", "市", "县", "乡/镇", "村/街道", "村小组"],
        modifyRegionType: "CREATE",
        modifyRegionId: undefined,
        modifyRegionDialogVisible: false,
        tableCache: [],
        tableTreeProps: {
          children: 'children',
          hasChildren: 'hasChildren'
        },
        queryForm: {
          keyWord: undefined
        },
        queryFormRef: "queryForm",
        regionTreeRef: "regionTree",
        importRegionDialogVisible: false,
      }
    },
    methods: {
      handleClickRegionTreeNode(data) {
        if (data.children && data.children.length > 0) {
          this.table.list = data.children
          this.table.list.forEach((item) => {
            item.hasChildren = false
          })
        } else {
          this.table.list = [data]
        }
      },
      initTableData(data) {
        this.table.list = data
        this.table.list.forEach((item) => {
          item.hasChildren = false
        })
        // 存一份初始化数据，用于重置
        this.tableCache = this.table.list
      },
      loadNode(row, node, resolve) {
        if (row.children && row.children.length > 0) {
          resolve(row.children)
        } else {
          GetRegionTree({fwCode: this.fwCode, id: row.id}).then(res => {
            let childrenData = res.data[0].children
            childrenData.forEach(element => {
              element.hasChildren = true
            })
            resolve(childrenData)
          })
        }
      },
      getTableData() {
        if (this.queryForm.keyWord) {
          GetRegionData({fwCode: '', keyWord: this.queryForm.keyWord}).then(data => {
            this.table.list = data.data
          })
        } else {
          this.table.list = this.tableCache
        }
      },
      openImportDialogVisible() {
        this.importRegionDialogVisible = true
      },
      openCreateRegionDialog() {
        this.modifyRegionType = "CREATE"
        this.modifyRegionDialogVisible = true
        this.modifyRegionId = undefined
      },
      openEditRegionDialog() {
        if (!this.currentRow) {
          this.$message.warning('请选择要编辑的数据！')
          return
        }
        this.modifyRegionType = "EDIT"
        this.modifyRegionDialogVisible = true
        this.modifyRegionId = this.currentRow.id
      },
      handleDelete() {
        if (!this.currentRow) {
          this.$message.warning('请选择要编辑的数据！')
          return
        }
        this.$confirm("确定删除选中的数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          DeleteRegion(this.currentRow.id).then(() => {
            this.$message.success('删除成功!')
            this.handleRefresh()
          })
        })
      },
      // 分组件，需要统一刷新
      handleRefresh() {
        this.$refs[this.queryFormRef].resetFields()
        this.getTableData()
        this.$refs[this.regionTreeRef].refresh()
      },
    }
  }

</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .panel-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid #c5c5c5;
    height: 98%;
    margin: 3px 3px 0 3px;

    .panel-title {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      border-bottom: 1px solid #c5c5c5;
      text-align: center;
    }

    .panel-content {
      flex: 1;
      height: 95%;
      overflow: auto;
    }

    .panel-top {
      height: 32px;
      line-height: 30px;
      border-bottom: 1px solid #c5c5c5;
      padding-left: 5px;
      padding-right: 5px;

      .panel-condition {
        float: left;
      }

      .panel-tools {
        float: right;
      }
    }
  }

  .left-wrapper {
    width: 200px;
  }

  .right-wrapper {
    flex: 1;
  }

</style>
