import request from '@/plugin/axios'

/**
 * 保存授权信息
 * @param rightsTarget
 * @param rightsObject
 * @param authorizationJson
 * @returns {AxiosPromise}
 * @constructor
 */
import Qs from 'qs'

const proxyPrefix = 'agile'
const agileBPMUI = process.env.VUE_APP_BPM_UI ? process.env.VUE_APP_BPM_UI : ''

/**
 * 登录接口
 * @param params
 * @constructor
 */
export function BpmLogin(account, password) {
  return request({
    url: proxyPrefix + '/org/login/valid',
    method: 'post',
    params: {
      account,
      password
    }
  })
}

/**
 * 退出登录
 * @param params
 * @constructor
 */
export function BpmLogout(params) {
  return request({
    url: proxyPrefix + '/logout',
    method: 'get',
    params
  })
}

/**
 * 当前登录用户信息
 * @param params
 * @constructor
 */
export function BpmUserInfo(params) {
  return request({
    url: proxyPrefix + '/org/userResource/userMsg',
    method: 'get',
    params
  })
}

/**
 * 流程定义列表
 * @param params
 * @constructor
 */
export function BpmDefinitionList(params) {
  return request({
    url: proxyPrefix + '/bpm/definition/listJson',
    method: 'get',
    params
  })
}

/**
 * 设置流程主版本号
 * @param definitionId
 * @constructor
 */
export function SetMainVersion(definitionId) {
  return request({
    url: proxyPrefix + '/bpm/definition/isMain',
    method: 'post',
    params: {
      definitionId
    }
  })
}

/**
 * 流程定义新建
 * @param name
 * @param key
 * @param desc
 * @constructor
 */
export function BpmDefinitionCreate(name, key, desc) {
  return request({
    url: proxyPrefix + '/bpm/definition/save',
    method: 'post',
    data: {
      name,
      key,
      desc,
      type: ''
    }
  })
}

/**
 * 流程定义复制
 * @param originKey
 * @param newName
 * @param newKey
 * @param newDesc
 * @returns {AxiosPromise}
 * @constructor
 */
export function BpmDefinitionCopy(originKey, newName, newKey, newDesc) {
  return request({
    url: proxyPrefix + '/bpm/definition/duplicate',
    method: 'post',
    data: {
      originKey,
      newName,
      newKey,
      newDesc,
      newTypeId: ''
    }
  })
}

/**
 * 流程定义删除
 * @param id
 * @constructor
 */
export function BpmDefinitionDelete(id) {
  return request({
    url: proxyPrefix + '/bpm/definition/remove',
    method: 'post',
    params: {
      id
    }
  })
}

/**
 * 流程实例列表
 * @param params
 * @constructor
 */
export function BpmInstanceList(params) {
  return request({
    url: proxyPrefix + '/bpm/instance/listJson',
    method: 'get',
    params
  })
}

/**
 * 流程实例意见列表
 * @param params
 * @constructor
 */
export function BpmInstanceOpinion(params) {
  return request({
    url: proxyPrefix + '/bpm/instance/getOpinion',
    method: 'get',
    params
  })
}

/**
 * 流程任务列表
 * @param params
 * @constructor
 */
export function BpmTaskList(params) {
  return request({
    url: proxyPrefix + '/bpm/task/listJson',
    method: 'get',
    params
  })
}

/**
 * 候选人列表，不同于用户列表，无需权限
 * @param params
 * @constructor
 */
export function BpmTaskUserList(params) {
  return request({
    url: proxyPrefix + '/form/formCustDialog/listData_userSelector',
    method: 'post',
    params
  })
}

/**
 * 指派候选人
 * @param userId
 * @param userName
 * @param taskId
 * @constructor
 */
export function BpmAssignTask(userId, userName, taskId) {
  return request({
    url: proxyPrefix + '/bpm/task/assignTask',
    method: 'post',
    params: {
      userId,
      userName,
      taskId
    }
  })
}

/**
 * 获取任务详情页信息，比如表单、按钮
 * @param taskId
 * @constructor
 */
export function BpmTaskData(taskId) {
  return request({
    url: proxyPrefix + '/bpm/task/getTaskData',
    method: 'get',
    params: {
      taskId
    }
  })
}

/**
 * 流程启动页的按钮、表单等数据
 defId: 415393684767375361
 flowKey:
 instanceId
 readonly: undefined
 */
export function BpmGetInstanceData(defId, nodeId, instanceId, readonly) {
  return request({
    url: proxyPrefix + '/bpm/instance/getInstanceData',
    method: 'get',
    params: {
      defId,
      nodeId,
      instanceId,
      readonly
    }
  })
}

// export function BpmInstanceAndChildren (instId) {
//   return request({
//     url: proxyPrefix+ '/bpm/instance/getInstanceAndChildren',
//     method: 'post',
//     params:{
//       id: instId
//     }
//   })
// }

/**
 * 流程图设计器请求地址-前端静态文件
 * @param modelId
 * @returns {string}
 * @constructor
 */
export function BpmModelerUrl(modelId) {
  return `${agileBPMUI}/flow-editor/modeler.html?modelId=${modelId}`
}

/**
 * 流程图IO流请求地址
 * @param instId
 * @param defId
 * @returns {string}
 * @constructor
 */
export function BpmImgUrl(instId, defId) {
  return `/api/${proxyPrefix}/bpm/instance/flowImage?instId=${instId}&defId=${defId}`
}

/**
 启动流程
 action: "start"
 data: {test: "jeff"}
 test: "jeff"
 defId: "415390786290712577"
 formType: "FRAME"
 instanceId: ""
 nodeId: ""

 */
export function BpmStart(defId) {
  let data = {
    action: 'start',
    data: {test: 'd2admin Test'},
    test: 'd2admin Test',
    defId: defId,
    formType: 'FRAME',
    instanceId: '',
    nodeId: ''
  }
  return request({
    url: proxyPrefix + '/bpm/instance/doAction',
    method: 'post',
    data
  })
}

/**
 * 流程实例挂起激活
 * @param id
 * @param forbidden
 * @constructor
 */
export function BpmInstanceForbidden(id, forbidden) {
  return request({
    url: proxyPrefix + '/bpm/instance/toForbidden',
    method: 'post',
    params: {
      id,
      forbidden
    }
  })
}

/**
 * 流程实例删除
 * @param id
 * @constructor
 */
export function BpmInstanceDelete(id) {
  return request({
    url: proxyPrefix + '/bpm/instance/remove',
    method: 'post',
    params: {
      id
    }
  })
}

/**
 * 流程实例触发事件
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function BpmInstanceDoAction(data) {
  let data_ = Object.assign({
    formType: "FRAME",
    nodeId: '',
    data: {test: 'this is instance do action'},
    extendConf: {},
    defId: '',
    instanceId: '',
  }, data)
  console.log("instance doAction", data_)
  return request({
    url: proxyPrefix + '/bpm/instance/doAction',
    method: 'post',
    data: data_
  })
}

/**
 * 流程任务触发事件
 * @param data
 * @constructor
 */
export function BpmTaskDoAction(data) {
  let data_ = Object.assign({
    data: {test: 'd2admin Test'},
    formType: 'FRAME'
  }, data)
  return request({
    url: proxyPrefix + '/bpm/task/doAction',
    method: 'post',
    data: data_
  })
}

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

/**
 * 我的流程定义列表
 * @param params
 * @constructor
 */
export function MyDefinitionList(params) {
  return request({
    url: proxyPrefix + '/bpm/my/definitionList',
    method: 'post',
    params
  })
}

/**
 * 我发起的流程列表
 * @param params
 * @constructor
 */
export function MyApplyTaskList(params) {
  return request({
    url: proxyPrefix + '/bpm/my/applyTaskList',
    method: 'post',
    params
  })
}

/**
 * 我的任务列表
 * @param params
 * @constructor
 */
export function MyToDoTaskList(params) {
  return request({
    url: proxyPrefix + '/bpm/my/todoTaskList',
    method: 'post',
    // params
    data: Qs.stringify(params)
  })
}

/**
 * 我处理的任务列表
 * @param params
 * @constructor
 */
export function MyApproveList(params) {
  return request({
    url: proxyPrefix + '/bpm/my/approveList',
    method: 'post',
    // params
    data: Qs.stringify(params)
  })
}

/**
 * 目标对象的授权信息
 * @param rightsTarget
 * @param rightsObject
 * @returns {AxiosPromise}
 * @constructor
 */
export function TargetAuthorizations(rightsTarget, rightsObject) {
  return request({
    url: proxyPrefix + '/sys/authorization/getAuthorizations',
    method: 'post',
    params: {
      rightsTarget,
      rightsObject
    }
  })
}

export function SaveAuthorizations(rightsTarget, rightsObject, authorizationJson) {
  /* let formData = new FormData();
  formData.append('rightsTarget',rightsTarget);
  formData.append('rightsObject',rightsObject);
  formData.append('authorizationJson',authorizationJson); */
  return request({
    url: proxyPrefix + '/sys/authorization/saveAuthorization',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: // formData
      Qs.stringify({
        rightsTarget,
        rightsObject,
        authorizationJson
      })
  })
}

/**
 * 获取我的待办、我的已办、我的申请数量
 * @param params
 * @constructor
 */
export function GetMyFlowCounts() {
  return request({
    url: proxyPrefix + '/bpm/my/getMyFlowCounts',
    method: 'post'
  })
}

/**
 * 根据定义流程的id获取流程节点数据
 *
 * @export
 * @param {*} defId 流程定义时的id
 * @returns
 */
export function getFlowElements(defId) {
  return request({
    url: proxyPrefix + `/bpm/definition/flowElements?defId=${defId}`,
    method: 'get'
  })
}
