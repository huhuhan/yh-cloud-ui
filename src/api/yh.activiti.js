import request from '@/plugin/axios'

const proxyPrefix = 'yh-act'

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

export function aUserList (pageNum, pageSize) {
  return request({
    url: proxyPrefix + '/management/identity/user/list',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function modelList (pageNum, pageSize) {
  return request({
    url: proxyPrefix + '/workflow/model/list',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function createModel (key, name, description) {
  return request({
    url: proxyPrefix + '/workflow/model/create',
    method: 'post',
    params: {
      key,
      name,
      description
    },
  })
}

export function deleteModel (modelId) {
  return request({
    url: proxyPrefix + '/workflow/model/delete',
    method: 'post',
    params: {
      modelId
    },
  })
}

export function deployModel (modelId) {
  return request({
    url: proxyPrefix + '/workflow/model/deploy/' + modelId,
  })
}

export function deploymentList (pageNum, pageSize) {
  return request({
    url: proxyPrefix + '/workflow/process-definition/list',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function updateDeployment (state, processDefinitionId) {
  return request({
    url: proxyPrefix + '/workflow/process-definition/update/state',
    method: 'post',
    params: {
      state,
      processDefinitionId
    },
  })
}

export function deleteDeployment (deploymentId) {
  return request({
    url: proxyPrefix + '/workflow/process-definition/delete',
    method: 'post',
    params: {
      deploymentId
    },
  })
}

export function convertDeployment (processDefinitionId) {
  return request({
    url: proxyPrefix + '/workflow/process-definition/convert',
    method: 'post',
    params: {
      processDefinitionId
    },
  })
}

export function runningPSList (pageNum, pageSize, params) {
  return request({
    url: proxyPrefix + '/workflow/process-instance/running-list',
    method: 'get',
    params: Object.assign({
      pageNum,
      pageSize
    }, params)
  })
}

export function historyPSList (pageNum, pageSize, params) {
  return request({
    url: proxyPrefix + '/workflow/process-instance/history-list',
    method: 'get',
    params: Object.assign({
      pageNum,
      pageSize
    }, params)
  })
}

export function updateInstance (state, processInstanceId) {
  return request({
    url: proxyPrefix + '/workflow/process-instance/update/state',
    method: 'post',
    params: {
      state,
      processInstanceId
    },
  })
}

export function deleteInstance (processInstanceId) {
  return request({
    url: proxyPrefix + '/workflow/process-instance/delete',
    method: 'post',
    params: {
      processInstanceId
    },
  })
}

export function traceNodeImg (processInstanceId) {
  return request({
    url: proxyPrefix + '/act/oa/trace-img',
    method: 'get',
    params: {
      processInstanceId,
    }
  })
}

/**
 * 不建议直接调用完成，走业务接口可以存储额外信息，再后端调用
 * @param taskId
 * @param variables
 */
export function completeTask (taskId, variables) {
  return request({
    url: proxyPrefix + '/act/oa/task/complete',
    method: 'post',
    data: {
      taskId,
      variables
    }
  })
}

export function claimTask (taskId, userId) {
  return request({
    url: proxyPrefix + '/act/oa/task/claim',
    method: 'post',
    params: {
      taskId,
      userId
    }
  })
}

