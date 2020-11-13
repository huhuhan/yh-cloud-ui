import request from '@/plugin/axios'


/**
 * 用户组织接口
 */

import Qs from 'qs'

import {proxyPrefix} from './index'

/**
 * 用户列表
 * @param params
 * @constructor
 */
export function BpmUserList(params) {
  return request({
    url: proxyPrefix + '/org/user/listJson',
    method: 'post',
    params
  })
}

/**
 * 下拉筛选表单列表
 * @param params
 * @constructor
 */
export function BpmFormSelectorList(key, params) {
  return request({
    url: proxyPrefix + `/form/formCustDialog/listData_${key}`,
    method: 'get',
    params
  })
}

/**
 * 用户详细信息
 * @param params
 * @constructor
 */
export function BpmGetUserInfo(id) {
  return request({
    url: proxyPrefix + `/org/user/get?id=${id}`,
    method: 'get'
  })
}

/**
 * 保存用户
 * @param params
 * @constructor
 */
export function BpmSaveUser(params) {
  return request({
    url: proxyPrefix + '/org/user/save',
    method: 'post',
    data: params
  })
}

/**
 * 删除用户
 * @param params
 * @constructor
 */
export function BpmDeleteUser(id) {
  return request({
    url: proxyPrefix + `/org/user/remove?id=${id}`,
    method: 'post'
  })
}

/**
 * 角色列表
 * @param params
 * @constructor
 */
export function BpmRoleList(params) {
  return request({
    url: proxyPrefix + '/org/role/listJson',
    method: 'post',
    params
  })
}

/**
 * 角色列表
 * @param params
 * @constructor
 */
export function BpmRoleFormList(params) {
  return request({
    url: proxyPrefix + '/form/formCustDialog/listData_roleSelector',
    method: 'post',
    params
  })
}

/**
 * 角色详细信息
 * @param params
 * @constructor
 */
export function BpmGetRoleInfo(id) {
  return request({
    url: proxyPrefix + `/org/role/get?id=${id}`,
    method: 'get'
  })
}

/**
 * 保存角色
 * @param params
 * @constructor
 */
export function BpmSaveRole(params) {
  return request({
    url: proxyPrefix + '/org/role/save',
    method: 'post',
    data: params
  })
}

/**
 * 删除角色
 * @param params
 * @constructor
 */
export function BpmDeleteRole(id) {
  return request({
    url: proxyPrefix + `/org/role/remove?id=${id}`,
    method: 'post'
  })
}

/**
 * 根据角色id查询角色相关的用户
 * @param params
 * @constructor
 */
export function BpmOrgRelationList(params, id) {
  return request({
    url: proxyPrefix + `/org/orgRelation/roleJson?roleId=${id}`,
    method: 'post',
    params
  })
}

/**
 * 向角色中添加用户
 * @param params
 * @constructor
 */
export function BpmSaveUserByRole(params) {
  return request({
    url: proxyPrefix + '/org/orgRelation/saveRoleUsers',
    method: 'post',
    params
  })
}

/**
 * 删除角色中的某个用户
 * @param params
 * @constructor
 */
export function BpmDeleteUserByRole(id) {
  return request({
    url: proxyPrefix + `/org/orgRelation/remove?id=${id}`,
    method: 'post'
  })
}
