/**
 * 用户组织，关联接口
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'


// 根据角色id获取该角色下的用户
export function getGroupUser(params) {
  return request({
    url: proxyPrefix + '/org/orgRelation/roleJson',
    method: 'get',
    params
  })
}

// 分配用户保存
export function addRoleUser(params) {
  return request({
    url: proxyPrefix + '/org/orgRelation/saveRoleUsers',
    method: 'post',
    params
  })
}

// 分配用户删除
export function removeRoleUser(id) {
  return request({
    url: proxyPrefix + '/org/orgRelation/remove',
    method: 'post',
    params: {
      id
    }
  })
}

// 组织管理中分配用户
// 根据组织id获取该组织下的用户
export function getUserbyGroup(params) {
  return request({
    url: proxyPrefix + '/org/orgRelation/queryGroupUser',
    method: 'get',
    params
  })
}

// 分配用户保存
export function addGroupUser(params) {
  return request({
    url: proxyPrefix + '/org/orgRelation/saveGroupUserRel',
    method: 'post',
    params
  })
}
