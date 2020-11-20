<template>
    <d2-container type="ghost">
        <!-- header 查询条件 -->
        <template slot="header">
            <el-form
                    :inline="true"
                    :model="listQuery"
                    size="mini"
                    style="margin-bottom: -18px;">
                <el-form-item>
                    <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="default" @click="getTableData" icon="el-icon-refresh"></el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button @click="handleCreate" type="success" icon="el-icon-plus">新 建</el-button>
                </el-form-item>
            </el-form>
        </template>
        <!-- table表格 -->
        <el-table :key='table.key'
                  :data="table.data"
                  v-loading="table.listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">

            <el-table-column align="center" label="ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="KEY">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="版本">
                <template slot-scope="scope">
                    <span>{{scope.row.version}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="更新时间">
                <template slot-scope="scope">
                    <span>{{scope.row.lastUpdateTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="元信息">
                <template slot-scope="scope">
                    <span>{{scope.row.metaInfo}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDeploy(scope.row)">部署
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                               icon="el-icon-edit"></el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- table表格 -->

        <!-- 弹框 -->
        <el-dialog title="新建模型" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>

                <el-form-item label="KEY" prop="key">
                    <el-input v-model="form.key" placeholder="KEY"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" placeholder="描述"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="toCancel('form')" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="toCreate('form')" icon="el-icon-check">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog destroy-on-close
                   :visible.sync="drawer" width="90%" top="5vh"
                   :fullscreen="dialogFullscreen"
                   custom-class="act-editor-dialog">
            <div slot="title" class="dialog-title">
                <span>工作流 编辑器</span>
                <button
                        type="button"
                        class="el-dialog__headerbtn"
                        aria-label="Fullscreen"
                        @click="dialogFullscreen = !dialogFullscreen"
                        style="right: 50px;">
                    <i class="el-dialog__close el-icon el-icon-full-screen"></i>
                </button>
            </div>
            <iframe
                    class="act-editor-frame"
                    :src="`act${editorUrl}`"
                    frameborder="0"/>
        </el-dialog>
        <!--<el-drawer
                title="我是标题"
                :visible.sync="drawer"
                direction="btt"
                size="80%"
                :destroy-on-close="true"
                :before-close="handleCloseDrawer">
            <editor :url="editorUrl"></editor>
        </el-drawer>-->

        <!-- footer 分页条 -->
        <template slot="footer">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="listQuery.pageNum"
                    :page-sizes="[10,20,30,50]"
                    :page-size="listQuery.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin: -10px;">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
  import { modelList, createModel, deleteModel, deployModel } from '@/api/yh.act/activti5'
  // import editor from './editor'

  export default {
    components: {
      // editor
    },
    data () {
      return {
        table: {
          key: 0,
          listLoading: false,
          data: [],
        },
        form: {
          key: undefined,
          name: undefined,
          description: undefined,
        },
        rules: {
          name: [
            { required: true, message: '请输入模型名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          key: [
            { required: true, message: '请输入模型秘钥', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入模型描述', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ]
        },
        dialogFormVisible: false,
        drawer: false,
        dialogFullscreen: false,
        editorUrl: '#',

        total: null,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.table.listLoading = true
        modelList(0, 999).then(res => {
          this.table.data = res
        }).catch(err => console.log(err)).finally(() => {
          this.table.listLoading = false
        })
      },
      handleFilter () {

      },
      handleUpdate (row) {
        this.editorUrl = '/modeler.html?modelId=' + row.id
        this.drawer = true
      },
      handleCreate () {
        this.dialogFormVisible = true
      },
      toCreate (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            createModel(this.form.key, this.form.name, this.form.description).then(res => {
              this.editorUrl = res.redirectUrl
            }).catch(err => console.log(err)).finally(() => {
              this.dialogFormVisible = false
              this.getTableData()
              this.drawer = true
            })
          } else {
            return false
          }
        })
      },
      handleDelete (row) {
        this.$confirm('确定删除所选模型', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已删除!'
          })
          deleteModel(row.id).finally(() => {
            this.getTableData()
          })
        }).catch(action => {
          console.log('action:' + action)
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      },
      handleDeploy (row) {
        deployModel(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '部署成功!'
          })
        }).catch(action => {
          console.log('action:' + action)
          this.$message({
            type: 'error',
            message: '部署失败'
          })
        }).finally(() => {
          this.getTableData()
        })
      },
      handleSizeChange () {
      }
      ,
      handleCurrentChange () {
      }
      ,
      toUpdate (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(valid)
            this.dialogFormVisible = false
          } else {
            return false
          }
        })
      }
      ,
      toCancel (formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
      ,
    }
  }
</script>
<style lang="scss" scoped>
    .act-editor-frame {
        width: 100%;
        height: -webkit-fill-available;
        margin-top: -20px;
    }
</style>
