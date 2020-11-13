/**
 * 系統其他接口：工具接口
 */
import request from '@/plugin/axios'
import Qs from 'qs'
import {proxyPrefix} from './index'

// 上传文件
export function uploadFile(upLoadFiles) {
  let uploadData = new FormData()
  uploadData.append('file', upLoadFiles)
  return request({
    url: proxyPrefix + '/sys/sysFile/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: uploadData
  })
}

/**
 * 图片文件请求地址
 * @param imageFileId
 * @returns {string}
 * @constructor
 */
export function sysTemImgUrl(imageFileId) {
  return `/api/${proxyPrefix}/sys/sysFile/download?fileId=${imageFileId}`
}
