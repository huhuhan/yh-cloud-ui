const userDB = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' },
  { username: 'adminDemo', password: '111111', uuid: 'adminDemo-uuid', name: 'AdminDemo', userId: '88888888' }
]

import JsEncrypt from 'jsencrypt'
import {PWD_PRIVATE_KEY} from "@/mock/api/constant"

export default [
  {
    path: '/api/login',
    method: 'post',
    handle ({ body }) {
      // RSA解密，实际后端服务也一样用RSA的私钥解密
      let encrypt = new JsEncrypt();
      encrypt.setPrivateKey(PWD_PRIVATE_KEY)
      let password = encrypt.decrypt(body.password)
      // 判断
      const user = userDB.find(e => e.username === body.username && e.password === password)
      if (user) {
        return {
          code: 0,
          msg: '登录成功',
          data: {
            ...user,
            token: '8dfhassad0asdjwoeiruty'
          }
        }
      } else {
        return {
          code: 401,
          msg: '用户名或密码错误',
          data: {}
        }
      }
    }
  }
]
