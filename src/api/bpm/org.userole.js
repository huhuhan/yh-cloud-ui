/**
 * 用户管理 角色管理
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'


// 获取用户管理table列表数据
export function GetUserTableList(params) {
  return request.get(proxyPrefix + '/org/user/listJson', {
    params: params
  })
}

// 删除用户
export function DeleteUser(params) {
  return request.post(proxyPrefix + '/org/user/remove?id=' + params)
}

// 新增用户
export function SaveUser(params) {
  return request.post(proxyPrefix + '/org/user/save', params)
}

// 修改用户密码
export function ModifyUser(params) {
  let {userId, oldPassword, newPassword} = params
  return request({
    url: proxyPrefix + '/org/user/updateUserPassWorld',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: // formData
      Qs.stringify({
        userId,
        oldPassword,
        newPassword
      })
  })
}

// 当前用户根据主键id查询分配的部门以及分配的角色
export function GetOrgRelation(params) {
  return request.get(proxyPrefix + '/org/user/get', {
    params: params
  })
}

// 获取角色管理table列表数据
export function getRoleTableList(params) {
  return request.get(proxyPrefix + '/org/role/listJson', {
    params: params
  })
}

// 获取角色数据,不分页，新增或者编辑用户时选择角色时列出所有角色
export function getRoleList(params) {
  return request.get(proxyPrefix + '/org/role/list', {
    params: params
  })
}

// 移除角色
export function deleteRole(params) {
  return request.post(proxyPrefix + '/org/role/remove?id=' + params)
}

// 新增角色
export function addRole(params) {
  return request.post(proxyPrefix + '/org/role/save', params)
}

// 获取角色资源管理平台列表
export function getResRoleList() {
  return request.get(proxyPrefix + '/org/subsystem/listJson', {
    params: {
      noPage: 'noPage'
    }
  })
}

// 获取角色资源管理树形数据
export function getResRoleTreeList(params) {
  return request.get(proxyPrefix + '/org/resRole/getTreeData', {
    params: params
  })
}

// 保存角色资源管理树型数据
export function saveReRoleTreeId(params) {
  return request.post(proxyPrefix + '/org/resRole/save', params)
}

// 获取系统日志管理table列表数据
export function getSysLogTableList(params) {
  return request.get(proxyPrefix + '/sys/sysLogErr/listJson', {
    params: params
  })
}

// 删除系统日志
export function deleteSysLog(params) {
  return request.post(proxyPrefix + '/sys/sysLogErr/remove?id=' + params)
}

/**
 * 导入角色数据
 *
 * @export
 * @param {*} upLoadFiles
 * @returns
 */
export function importRole(upLoadFiles) {
  let uploadData = new FormData()
  uploadData.append('file', upLoadFiles)
  return request({
    url: proxyPrefix + '/org/role/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: uploadData
  })
}

/**
 * 导入用户数据
 *
 * @export
 * @param {*} upLoadFiles
 * @returns
 */
export function importUser(upLoadFiles) {
  let uploadData = new FormData()
  uploadData.append('file', upLoadFiles)
  return request({
    url: proxyPrefix + '/org/user/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: uploadData
  })
}
