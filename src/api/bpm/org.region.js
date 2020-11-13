/**
 * 行政区划管理
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'

export function getRegions(params) {
  return request.get(proxyPrefix + '/qsdw', {
    params: params
  })
}

/**
 * 返回行政区划树
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getRegionTree(params) {
  return request.get(proxyPrefix + '/org/region/listJson', {
    params: params
  })
}

/**
 * 根据id查询行政区划数据
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getRegionById(params) {
  return request.get(proxyPrefix + '/org/region/get', {
    params: params
  })
}

/**
 * 根据条件查询行政区划数据
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getRegionByQuery(params) {
  return request.get(proxyPrefix + '/org/region/query', {
    params: params
  })
}

/**
 *根据id删除行政区划树数据
 *
 * @export
 * @param {*} params
 * @returns
 */
export function deleteXzqh(params) {
  return request({
    url: proxyPrefix + `/org/region?id=${params}`,
    method: 'delete'
  })
}

/**
 * 添加行政区划数据
 *
 * @export
 * @param {*} params
 * @returns
 */
export function addXzqh(data) {
  return request.post(proxyPrefix + '/org/region', data)
}

/**
 * 导入行政区数据
 *
 * @export
 * @param {*} upLoadFiles
 * @returns
 */
export function importXzqh(upLoadFiles) {
  let uploadData = new FormData()
  uploadData.append('file', upLoadFiles)
  return request({
    url: proxyPrefix + '/org/region/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: uploadData
  })
}
