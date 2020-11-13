/**
 * 资源管理：子系统、子系统资源
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'

// 获取树形数据
export function getMenuTree(systemId, isRoot, included) {
  return request({
    url: proxyPrefix + '/org/sysResource/getTreeData',
    method: 'get',
    params: {
      systemId,
      isRoot,
      included
    }
  })
}

// 删除
export function deleteMenu(id) {
  return request({
    url: proxyPrefix + '/org/sysResource/remove',
    method: 'post',
    params: {
      id
    }
  })
}

// 新增
export function addMenu(params) {
  return request({
    url: proxyPrefix + '/org/sysResource/save',
    method: 'post',
    headers: {
      'content-type': 'application/json;'
    },
    data: params
  })
}

// 编辑
export function getIdMenu(id) {
  return request({
    url: proxyPrefix + '/org/sysResource/get',
    method: 'get',
    params: {
      id
    }
  })
}

// 导出
export function SysResourceExportURL(systemId) {
  return `/api${proxyPrefix}/org/sysResource/export-xls?systemId=${systemId}`
}

// 导入
export function SysResourceUploadExcel(systemId, file) {
  let uploadData = new FormData()
  uploadData.append("systemId", systemId)
  uploadData.append('file', file)
  return request({
    url: proxyPrefix + '/org/sysResource/import-xls',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: uploadData
  })
}

/***************子系统*********************/

// 列表
export function ListSystem(params) {
  return request({
    url: proxyPrefix + '/org/subsystem/listJson',
    method: 'get',
    params: params
  })
}

// 新增
export function addSystem(params) {
  return request({
    url: proxyPrefix + '/org/subsystem/save',
    method: 'post',
    headers: {
      'content-type': 'application/json;'
    },
    data: params
  })
}

// 编辑
export function getIdSystem(id) {
  return request({
    url: proxyPrefix + '/org/subsystem/get',
    method: 'get',
    params: {
      id
    }
  })
}

// 删除
export function deleteSystem(id) {
  return request({
    url: proxyPrefix + '/org/subsystem/remove',
    method: 'post',
    params: {
      id
    }
  })
}


export function getDictData(params) {
  return request({
    url: proxyPrefix + '/dict',
    method: 'get',
    params
  })
}

