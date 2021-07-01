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
export function DeleteDepartment(id) {
  return request({
    url: proxyPrefix + '/org/group/remove',
    method: 'post',
    params: {
      id
    }
  })
}

// 新增
export function SaveDepartment(params) {
  return request({
    url: proxyPrefix + '/org/group/save',
    method: 'post',
    headers: {
      'content-type': 'application/json;'
    },
    data: params
  })
}

export function GetDepartment(id) {
  return request({
    url: proxyPrefix + '/org/group/get',
    method: 'get',
    params: {
      id
    }
  })
}
