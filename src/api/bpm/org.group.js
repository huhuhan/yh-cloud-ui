/**
 * 组织
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'


// 获取表格数据
export function GetDepartmentTree() {
  return request({
    url: proxyPrefix + '/org/group/getTreeData',
    method: 'get'
  })
}

// 删除
export function deleteDepartment(id) {
  return request({
    url: proxyPrefix + '/org/group/remove',
    method: 'post',
    params: {
      id
    }
  })
}

// 新增
export function addDepartment(params) {
  return request({
    url: proxyPrefix + '/org/group/save',
    method: 'post',
    headers: {
      'content-type': 'application/json;'
    },
    data: params
  })
}

// 编辑
export function getIdDepartment(id) {
  return request({
    url: proxyPrefix + '/org/group/get',
    method: 'get',
    params: {
      id
    }
  })
}
