<template>
    <d2-container type="ghost">
        <div v-if="showUserInfo">
            <h4>账户：{{user.account}}</h4>
            <h4>姓名：{{user.fullname}}</h4>
            <el-button type="primary" @click="Logout">注销</el-button>
        </div>
        <div style="width:500px" v-if="showLoginForm">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="账户">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>

        <d2-module-index-banner slot="header" v-bind="banner"/>
        <d2-module-index-menu :menu="menu"/>
    </d2-container>
</template>

<script>
  import menu from '@/menu/modules/agilebpm'
  import { BpmLogin, BpmLogout, BpmUserInfo } from '@/api/agilebpm'
  import util from '@/libs/util'

  export default {
    data () {
      return {
        menu,
        banner: {
          title: 'DEMOS',
          subTitle: 'Agilebpm'
        },
        form: {
          account: '',
          password: '',
        },
        user: null,
        showUserInfo: false,
        showLoginForm: false
      }
    },
    created () {
      this.initUser()
    },
    methods: {
      onSubmit () {
        BpmLogin(this.form).then(res => {
          // 登录表单校验失败
          this.$message.success(res.msg)
          if (res.isOk) {
            util.cookies.set('token', `Bearer-${res.data}`)
            this.initUser()
          }
        })
      },
      initUser () {
        BpmUserInfo().then(res => {
          if (res.isOk) {
            this.user = res.data.user
            this.showUserInfo = true
            this.showLoginForm = false
          } else {
            this.$message.warning('请登录')
          }
        }).catch(() => {
          this.showLoginForm = true
          this.showUserInfo = false
        })
      },
      Logout () {
        BpmLogout()
        this.showUserInfo = false
        this.showLoginForm = true
      },
    }
  }
</script>
