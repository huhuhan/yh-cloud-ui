import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/yh/activiti',
  name: 'yh-activiti',
  meta,
  redirect: { name: 'yh-activiti-index' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      component: _import('yh/activiti/index'),
      meta: {
        ...meta,
        title: '工作流首页'
      }
    },
    {
      path: 'db-tables',
      name: `${pre}db-tables`,
      component: _import('yh/activiti/db-tables'),
      meta: {
        ...meta,
        title: '数据库'
      }
    },
    {
      path: 'model',
      name: `${pre}model`,
      component: _import('yh/activiti/model'),
      meta: {
        ...meta,
        title: '模型管理'
      }
    },
    {
      path: 'definition',
      name: `${pre}definition`,
      component: _import('yh/activiti/definition'),
      meta: {
        ...meta,
        title: '定义管理'
      }
    },
    {
      path: 'instance/running',
      name: `${pre}instance/running`,
      component: _import('yh/activiti/instance/running'),
      meta: {
        ...meta,
        title: '运行实例'
      }
    },
    {
      path: 'instance/history',
      name: `${pre}instance/history`,
      component: _import('yh/activiti/instance/history'),
      meta: {
        ...meta,
        title: '历史实例'
      }
    },
    {
      path: 'sys-user',
      name: `${pre}sys-user`,
      component: _import('yh/activiti/sys-user'),
      meta: {
        ...meta,
        title: '用户管理'
      }
    },
    {
      path: 'leave/1',
      name: `${pre}leave-1`,
      component: _import('yh/leave/1'),
      meta: {
        ...meta,
        title: '请假申请'
      }
    },

  ])('yh-activiti-')
}
