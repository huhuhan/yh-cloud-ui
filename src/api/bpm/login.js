import request from '@/plugin/axios'

import { proxyPrefix } from './index'

/**
 * 登录接口
 * @param params
 * @constructor
 */
export function BpmLogin (account, password) {
  return request({
    url: proxyPrefix + '/org/login/valid',
    method: 'post',
    params: {
      account,
      password
    }
  })
}

/**
 * 退出登录
 * @param params
 * @constructor
 */
export function BpmLogout (params) {
  return request({
    url: proxyPrefix + '/logout',
    method: 'get',
    params
  })
}

/**
 * 当前登录用户信息
 * @param params
 * @constructor
 */
export function BpmUserInfo (params) {
  return request({
    url: proxyPrefix + '/org/userResource/userMsg',
    method: 'get',
    params
  })
}
