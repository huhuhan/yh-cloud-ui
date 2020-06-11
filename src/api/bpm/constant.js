

/**
 * 流程任务状态、事件
 * @type {{reject: string, agree: string}}
 */
export const BpmTaskAction = {
  start: {
    key: 'start',
    value: '发起'//'开始'
  },
  end: {
    key: 'end',
    value: '结束'
  },
  awaiting_check: {
    key: 'awaiting_check',
    value: '待办'
  },
  agree: {
    key: 'agree',
    value: '同意'
  },
  reject: {
    key: 'reject',
    value: '驳回'
  },
  turn: {
    key: 'turn',
    value: '转办'
  },
}


/**
 * 流程实例状态
 * @type {{reject: string, agree: string}}
 */
export const BpmInstanceStatus = {
  running: {
    key: 'running',
    value: '运行中'
  },
  end: {
    key: 'end',
    value: '已终止'
  },
  draft: {
    key: 'draft',
    value: '草稿'
  },
  back: {
    key: 'back',
    value: '驳回中'
  },
}
