<template>
  <d2-container>
    <div class="page-style">
      <el-row>
        <el-col class="page-form">
          <el-form :inline="true" size="mini">
            <el-form-item label="菜单名称">
              <el-input v-model="menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>

            <div style="float: right">
              <el-form-item>
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="只响应已加载的资源" placement="bottom">
                    <el-button type="primary" @click="expandOne">
                      <d2-icon name="search"/>
                      查询展开
                    </el-button>
                  </el-tooltip>
                  <el-button type="primary" @click="collapseAll">
                    <d2-icon name="caret-right"/>
                    收起全部
                  </el-button>
                  <el-button type="success" @click="handleAddSystem">
                    <d2-icon name="plus"/>
                    添加子系统
                  </el-button>
                </el-button-group>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="page-table">
          <el-table v-loading="listLoading" :data="tableData" style="width:100%;" row-key="id" ref="theTable"
                    :header-cell-style="{ background: '#F5F5F5', color: '#666666' }" border highlight-current-row lazy
                    :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column label="资源名称" width="220">
              <template slot-scope="scope">
                <d2-icon :name="scope.row.icon"/>
                <span style="margin-left: 6px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sn" label="排序"></el-table-column>
            <el-table-column prop="url" label="请求地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <el-tag size="mini" type="warning" effect="dark" v-if="scope.row.type === 'system'">子系统</el-tag>
                <el-tag size="mini" type="primary" effect="dark" v-else-if="scope.row.type === 'menu'">菜单</el-tag>
                <el-tag size="mini" type="success" effect="dark" v-else-if="scope.row.type === 'index'">首页</el-tag>
                <el-tag size="mini" v-else type="success" effect="dark">按钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="alias" label="权限标识"></el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-tooltip content="添加子级" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="handleAddMenu(scope.$index, scope.row)"
                             icon="el-icon-plus" plain></el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"
                             plain></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)"
                             icon="el-icon-delete" plain></el-button>
                </el-tooltip>
                <br>
                <el-tooltip v-if="scope.row.type === 'system'" content="导出" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="handleExport(scope.$index, scope.row)"
                             icon="el-icon-download" plain></el-button>
                </el-tooltip>
                <el-tooltip v-if="scope.row.type === 'system'" content="导入" placement="top" effect="light">
                  <el-button size="mini" type="primary" @click="importSysResource(scope.$index, scope.row)"
                             icon="el-icon-upload" plain></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <dialog-system :visible.sync="systemDialogVisible" :title="dialogTitle" @refresh="getTableTree"
                     :target="targetEdit"></dialog-system>

      <dialog-menu :visible.sync="menuDialogVisible" :title="dialogTitle" :parentId="menuParentId"
                   :systemId="targetSystemId" @refresh="nodeReload" :target="targetEdit"></dialog-menu>

      <dialog-import :visible.sync="importDialogVisible" @uploadFile="submitUploadFile" :destroyClose="true"
                     uploadTip="参考【系统管理】导出的数据模板" title="导入系统资源" fileSizeLimit="5" fileType="excel"
                     fileAccept=".xls,.xlsx"></dialog-import>
    </div>
  </d2-container>
</template>

<script>
  import {
    getMenuTree,
    deleteMenu,
    SysResourceExportURL,
    SysResourceUploadExcel
  } from "@/api/bpm/org.resource"

  export default {
    name: 'resource-index',
    data() {
      return {
        menuName: "",
        menuState: "",
        listLoading: false,
        tableData: [],
        expandRowKeys: [],
        tableMaps: new Map(),

        targetEdit: undefined,
        dialogTitle: "create",
        //菜单
        menuParentId: '',
        targetSystemId: '',
        menuDialogVisible: false,
        //子系统
        systemDialogVisible: false,

        importDialogVisible: false,
        importTarget: undefined,
      }
    },
    components: {
      dialogSystem: () => import('./resource-system'),
      dialogMenu: () => import('./resource-menu'),
      dialogImport: () => import('@/components/my-element/dialog-upload.vue')
    },
    mounted() {
      this.getTableTree()
    },
    methods: {
      forArr(arr, isExpand) {
        arr.forEach(i => {
          this.$refs.theTable.toggleRowExpansion(i, isExpand)
          if (i.children) {
            this.forArr(i.children, isExpand)
          }
        })
      },
      collapseAll() {
        this.forArr(this.tableData, false)
      },
      filterSome(arr, key) {
        let childResult = []
        let result = arr.filter(a => {
          if (a.children) {
            let cArr = this.filterSome(a.children, key)
            if (cArr.length > 0) {
              childResult.push(a)
            }
            childResult = [...childResult, ...cArr]
          }
          return a.name.trim() === key.trim()
        })
        return [...result, ...childResult]
      },
      expandOne() {
        this.collapseAll()
        let expandRows = this.filterSome(this.tableData, this.menuName)
        expandRows.forEach(a => {
          this.$refs.theTable.toggleRowExpansion(a, true)
        })
      },
      load(row, treeNode, resolve) {
        if (row.id !== row.systemId) {
          // 系统菜单直接加载
          resolve(row.children)
        } else {
          // 第一次请求加载系统资源
          getMenuTree(row.systemId, false, false).then(res => {
            row.children = res.data
            resolve(res.data)
          }).finally(() => {
          })
          // 缓存数据，用于后续更新
          this.tableMaps.set(row.id, {row, treeNode, resolve})
        }
      },
      nodeReload(systemId) {
        const {row, treeNode, resolve} = this.tableMaps.get(systemId)
        this.$set(this.$refs.theTable.store.states.lazyTreeNodeMap, systemId, [])
        this.load(row, treeNode, resolve)
      },
      getTableTree() {
        this.listLoading = true
        //只请求子系统
        getMenuTree(null, true, true).then(res => {
          this.tableData = res.data
          this.tableData.map(m => {
            m.hasChildren = true
          })
        }).finally(() => {
          this.listLoading = false
        })
      },
      //点击删除按钮
      handleDelete(index, row) {
        if (row.type === "system") {
          this.$confirm("确定删除这系统和子级菜单吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            //接口支持子系统+菜单递归删除
            deleteMenu(row.systemId).then(() => {
              this.getTableTree()
              this.$message.success("删除成功")
            })
          }).catch(() => {
          })
        } else {
          this.$confirm("确定删除这菜单和子级菜单吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            deleteMenu(row.id).then(() => {
              this.nodeReload(row.systemId)
              this.$message.success("删除成功")
            })
          }).catch(() => {
          })
        }
      },
      //点击添加菜单按钮
      handleAddMenu(index, row) {
        this.dialogTitle = "create"
        this.menuDialogVisible = true
        // id和systemId相等的时候，是直接在子系统下添加菜单,需要将parentId赋值为0
        this.menuParentId = row.id === row.systemId ? "0" : row.id
        this.targetSystemId = row.systemId
        this.targetEdit = undefined
      },
      //点击添加子系统按钮
      handleAddSystem() {
        this.dialogTitle = "create"
        this.systemDialogVisible = true
        this.targetEdit = undefined
      },
      //点击编辑按钮
      handleEdit(index, row) {
        this.dialogTitle = 'edit'
        if (row.type === 'system') {
          this.systemDialogVisible = true
        } else {
          this.menuDialogVisible = true
          this.menuParentId = row.parentId
          this.targetSystemId = row.systemId
        }
        this.targetEdit = row
      },
      handleExport(index, row) {
        this.$open(SysResourceExportURL(row.id))
      },
      importSysResource(index, row) {
        this.importDialogVisible = true
        this.importTarget = row
      },
      submitUploadFile(file, callback) {
        callback(new Promise(resolve => {
          SysResourceUploadExcel(this.importTarget.id, file).then(() => {
            resolve({
              success: true,
              resultMsg: ''
            })
          }).catch(() => {
            resolve({
              success: false,
              resultMsg: ''
            })
          })
        }))
      }

    }
  }

</script>

<style lang="scss" scoped>
  .el-divider--horizontal {
    display: block;
    height: 0.01rem;
    width: 100%;
    margin-top: 0.1em;
    margin-bottom: 0.1rem;
  }

  /*::v-deep*/ .el-form--inline .single-line {
    display: flex;

    .el-form-item__content {
      flex: 1;
    }
  }

  /*::v-deep*/ .page-style .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  /*::v-deep*/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  /*::v-deep*/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  /*::v-deep*/ .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
