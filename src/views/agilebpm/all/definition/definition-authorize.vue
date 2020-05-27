<template>
  <el-dialog title="授权流程图"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit"
             width="300px"
  >

    <el-form :model="form" :ref="ref">

      <el-form-item label="用户">
        <el-select v-model="users" multiple placeholder="请选择">
          <el-option
                  v-for="item in userOptions"
                  :key="item.id_"
                  :label="item.fullname_"
                  :value="item.id_">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="roles" multiple placeholder="请选择">
          <el-option
                  v-for="item in roleOptions"
                  :key="item.id_"
                  :label="item.name_"
                  :value="item.id_">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toDo" icon="el-icon-check">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {TargetAuthorizations, BpmFormSelectorList, SaveAuthorizations} from '@/api/agilebpm'

  export default {
    name: 'definition-authorize',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      target: String,
    },
    data() {
      let validatePass2 = (rule, value, callback) => {
        if (value && !/^[A-Z-a-z]$/.test(value.charAt(0))) {
          callback(new Error('必须以字母开头!'))
        } else {
          callback()
        }
      }
      return {
        ref: 'form',
        form: {},
        authorizeObject: 'FLOW',
        userOptions: [],
        roleOptions: [],
        users: [],
        roles: []
      }
    },
    created() {
      this.initOptions()
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
        this.clearOptions()
        this.clearSelected()
      },
      openInit() {
        this.initSelected()
        this.$log.default('初始化授权流程图弹窗')
      },
      initSelected() {
        TargetAuthorizations(this.target, this.authorizeObject).then(res => {
          if (res.isOk) {
            let list = res.data || res.row
            list.map(l => {
              if (l.rightsType == 'role') {
                this.roles.push(l.rightsIdentity)
              }
              if (l.rightsType == 'user') {
                this.users.push(l.rightsIdentity)
              }
            })
          }
        })
      },
      initOptions() {
        BpmFormSelectorList('userSelector').then(res => {
          if (res.isOk) {
            this.userOptions = res.rows
          }
        })
        BpmFormSelectorList('roleSelector').then(res => {
          if (res.isOk) {
            this.roleOptions = res.rows
          }
        })
      },
      clearSelected() {
        this.users = []
        this.roles = []
      },
      clearOptions() {
        this.userOptions = []
        this.roleOptions = []
      },
      toDo() {
        this.$refs[this.ref].validate(valid => {

          let authorizationJson = []
          this.userOptions.map(u => {
            if (this.users.includes(u.id_)) {
              authorizationJson.push({
                rightsType: 'user',
                rightsTarget: this.target,
                rightsIdentityName: u.fullname_,
                rightsIdentity: u.id_
              })
            }
          })
          this.roleOptions.map(r => {
            if (this.roles.includes(r.id_)) {
              authorizationJson.push({
                rightsType: 'role',
                rightsTarget: this.target,
                rightsIdentityName: r.name_,
                rightsIdentity: r.id_
              })
            }
          })
          if (valid) {
            SaveAuthorizations(this.target, this.authorizeObject, JSON.stringify(authorizationJson)).then(res => {
              if (res.isOk) {
                this.$message.success(res.msg)
                this.close()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
