<template>
  <el-dialog :title="targetTitle"
             :visible.sync="visible"
             :before-close="close"
             @open="openInit">

    <el-form :model="form" :rules="rules" :ref="ref" :inline="true" label-width="130px" label-position="right"
             size="mini">
      <el-form-item label="昵称" prop="fullname">
        <el-input placeholder="请输入昵称" v-model="form.fullname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input placeholder="请输入账号" v-model="form.account" autocomplete="off"
                  :disabled="targetType === 'EDIT'"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="targetType === 'CREATE'">
        <el-input placeholder="请输入密码" v-model="form.password" show-password autocomplete="off"
                  style="width:178px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input maxlength="11" placeholder="请输入手机号码" v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" style="width: 180px;">
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属组织" prop="deptName">
        <el-input placeholder="请选择归属组织" @focus="openDepartmentDialog" v-model="formGroupName"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别" style="width: 180px;">
          <el-option label="未知" value="未知"></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色选择" prop="roleSelect">
        <el-select v-model="selectedRoles" multiple collapse-tags placeholder="请选择" style="width:180px;">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input placeholder="请输入地址" v-model="form.address" autocomplete="off" style="width: 507px;"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="toConfirm" icon="el-icon-check">确 定</el-button>
    </div>


    <dialog-department-tree
            @returnData="handleReturnDepartment"
            :target="selectedDepartments"
            :isInnerDialog="true"
            :visible.sync="showDepartmentDialog"></dialog-department-tree>
  </el-dialog>

</template>

<script>
  import {SaveUser, getRoleList, GetOrgRelation} from "@/api/bpm/org.userole"

  const FORM_COLUMN = {
    fullname: undefined,
    account: undefined,
    email: undefined,
    mobile: undefined,
    password: undefined,
    address: undefined,
    sex: undefined,
    status: 1,
  }

  export default {
    name: 'dialog-modify-user',
    components: {
      dialogDepartmentTree: () => import('./department-tree')
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      targetType: {
        typ: String,
        default: "CREATE"
      },
      // 用户ID
      target: {
        type: String,
        default: undefined
      },
    },
    created() {
      this.initRoles()
    },
    data() {
      let userEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
          callback()
          return
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error("请输入正确的邮箱格式"))
          }
        }, 100)
      }
      return {
        ref: 'form',
        form: FORM_COLUMN,
        rules: {
          fullname: [{required: true, message: "请输入昵称", trigger: "blur"}],
          account: [{required: true, message: "请输入账号", trigger: "blur"}],
          password: {required: true, message: "请输入密码", trigger: "blur"},
          status: [{required: true, message: "请选择状态", trigger: "change"}],
          email: [{validator: userEmail, trigger: "blur"}],
          // deptName: [
          //   {required: true, message: "请选择归属组织", trigger: "blur"}
          // ]
        },
        roleOptions: [],
        selectedRoles: [],

        // 用户组织，后端支持多个组织，保存回显，这里默认控制在一个组织
        // formGroupName: '',
        showDepartmentDialog: false,
        selectedDepartments: []
      }
    },
    computed: {
      targetTitle() {
        return this.targetType === 'CREATE' ? `新建用户` : '编辑用户'
      },
      formGroupName() {
        return this.selectedDepartments.length > 0 ? this.selectedDepartments[0].groupName : ''
      }
    },
    methods: {
      handleReturnDepartment(data) {
        this.selectedDepartments = data
      },
      openDepartmentDialog() {
        this.showDepartmentDialog = true
      },
      // 回显用户数据
      async initUserOrgRelation() {
        if (this.target) {
          await GetOrgRelation({id: this.target}).then(res => {
            this.form = res.data
            this.form.orgRelationList.forEach(m => {
              // 组织
              if (m.type === 'groupUser') {
                this.selectedDepartments.push({
                  groupId: m.groupId,
                  groupName: m.groupName,
                  type: "groupUser"
                })
              }
              // 角色
              if (m.type === 'userRole') {
                this.selectedRoles.push(m.roleId)
              }
            })
          })
        }
      },
      initRoles() {
        getRoleList().then(res => {
          this.roleOptions = res.data
        }).catch(err => console.log(err)).finally(() => {
        })
      },
      close() {
        this.form = FORM_COLUMN
        this.$emit('update:visible', false)
        this.selectedRoles = []
        this.selectedDepartments = []
      },
      openInit() {
        this.initUserOrgRelation()
        this.$log.default(`初始化${this.targetTitle}弹窗`)
      },
      toConfirm() {
        this.$refs[this.ref].validate(async valid => {
          if (valid) {
            // 通过orgRelationList参数请求服务端保存数据
            this.form.orgRelationList = []

            // 角色
            let roles = this.selectedRoles.map(t => {
              return {roleId: t, type: "userRole"}
            })
            this.form.orgRelationList.push(...roles)
            // 组织
            this.form.orgRelationList.push(...this.selectedDepartments)

            SaveUser(this.form).then(() => {
              this.$message.success("操作成功!")
            }).catch(err => console.log(err)).finally(() => {
              this.close()
              this.$emit('refresh')
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
