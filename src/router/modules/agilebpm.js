import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

/**
 * 子级path自动拼接父级path；‘/’前缀表示绝对路由
 */
export default {
  path: '/agilebpm',
  name: 'agilebpm',
  meta,
  redirect: { name: 'agilebpm-index' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      component: _import('agilebpm/index'),
      meta: {
        ...meta,
        title: 'agilebpm'
      }
    },
    {
      path: 'all/definition',
      name: `${pre}all-definition`,
      component: _import('agilebpm/all/definition'),
      meta: {
        ...meta,
        title: '流程列表'
      },
    },
    {
      path: 'all/instance',
      name: `${pre}all-instance`,
      component: _import('agilebpm/all/instance'),
      meta: {
        ...meta,
        title: '实例列表'
      },
    },
    {
      path: 'all/task',
      name: `${pre}all-task`,
      component: _import('agilebpm/all/task'),
      meta: {
        ...meta,
        title: '任务列表'
      },
    },

    {
      path: 'sys/user',
      name: `${pre}sys-user`,
      component: _import('agilebpm/sys/user'),
      meta: {
        ...meta,
        title: '用户列表'
      },
    },

    {
      path: 'my/definition/start',
      name: `${pre}my-definition-start`,
      component: _import('agilebpm/my/definition/start.vue'),
      meta: {
        ...meta,
        title: '发起流程'
      },
    },
    {
      path: 'my/definition/history',
      name: `${pre}my-definition-history`,
      component: _import('agilebpm/my/definition/history.vue'),
      meta: {
        ...meta,
        title: '发起历史'
      },
    },
    {
      path: 'my/task/todo',
      name: `${pre}my-task-todo`,
      component: _import('agilebpm/my/task/todo.vue'),
      meta: {
        ...meta,
        title: '待办事项'
      },
    },
    {
      path: 'my/task/history',
      name: `${pre}my-task-history`,
      component: _import('agilebpm/my/task/history.vue'),
      meta: {
        ...meta,
        title: '办理历史'
      },
    },

    {
      path: 'form/start',
      name: `${pre}form-start`,
      component: _import('agilebpm/form/start.vue'),
      meta: {
        ...meta,
        title: '开始表单'
      }
    },
    {
      path: 'form/demo1',
      name: `${pre}form-demo1`,
      component: _import('agilebpm/form/demo1.vue'),
      meta: {
        ...meta,
        title: '表单一'
      }
    },
    {
      path: 'form/demo2',
      name: `${pre}form-demo2`,
      component: _import('agilebpm/form/demo2.vue'),
      meta: {
        ...meta,
        title: '表单二'
      }
    },
    {
      path: 'form/demo3',
      name: `${pre}form-demo3`,
      component: _import('agilebpm/form/demo3.vue'),
      meta: {
        ...meta,
        title: '表单三'
      }
    },
  ])('agilebpm-')
}
