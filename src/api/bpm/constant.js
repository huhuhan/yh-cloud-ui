/**
 * 流程任务状态、事件
 */
export const BpmTaskAction = {
  start: {
    key: 'start',
    value: '发起',
    css: 'info'
  },
  end: {
    key: 'end',
    value: '结束',
    css: 'info'
  },
  awaiting_check: {
    key: 'awaiting_check',
    value: '待办',
    css: 'info'
  },
  agree: {
    key: 'agree',
    value: '同意',
    css: 'success'
  },
  reject: {
    key: 'reject',
    value: '驳回',
    css: 'danger'
  },
  turn: {
    key: 'turn',
    value: '转办',
    css: 'warning'
  },
  manualEnd: {
    key: 'manualEnd',
    value: '人工终止',
    css: 'danger',
    defaultOpinion: '流程人工终止，不可再操作'
  },
}

/**
 * 流程实例触发事件类型
 */
export const BpmInstanceAction = {
  start: {
    key: 'start',
    value: '发起',
    css: 'info'
  },
  reminder: {
    key: 'reminder',
    value: '催办',
    css: 'info',
    defaultOpinion: '您好，请您尽快处理任务：subject ！'
  },
  revoke: {
    key: 'revoke',//recover
    value: '撤销',
    css: 'danger',
    defaultOpinion: '流程撤销，不再运行！'
  },
}

export const BpmTaskOpinionStatus = {...BpmInstanceAction, ...BpmTaskAction}

/**
 * 流程实例状态
 */
export const BpmInstanceStatus = {
  running: {
    key: 'running',
    value: '运行中',
    // value: '审批中',
    css: 'success'
  },
  end: {
    key: 'end',
    value: '已结束',
    // value: '审批完成',
    css: 'info'
  },
  // draft: {
  //   key: 'draft',
  //   value: '草稿'
  // },
  back: {
    key: 'back',
    value: '驳回中',
    css: 'danger'
  },
  manualend: {
    key: 'manualend',
    value: '人工终止',
    css: 'danger'
  },
  revoke: {
    key: 'revoke',
    value: '撤销',
    css: 'danger'
  }
}


export const BpmTaskToDoType = {
  normal: {
    key: 'NORMAL',
    value: '普通',
    css: 'info'
  },
  designate: {
    key: 'DESIGNATE',
    value: '指派',
    css: 'success'
  },
  turn: {
    key: 'TURN',
    value: '转办',
    css: 'warning'
  },
}


