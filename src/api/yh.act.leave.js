import request from '@/plugin/axios'

const proxyPrefix = 'yh-act-leave'
export function postDemo (data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}

export function getDemo (params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}

export function addLeave (data) {
  return request({
    url: proxyPrefix + '/demo/user-leave/add',
    method: 'post',
    data
  })
}

export function userLeaveList (pageNum, pageSize) {
  return request({
    url: proxyPrefix + '/demo/user-leave/list',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function completeLeaveTask (data) {
  return request({
    url: proxyPrefix + '/demo/user-leave/complete',
    method: 'post',
    data
  })
}
