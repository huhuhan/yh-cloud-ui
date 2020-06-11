import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

import myFlow from './my-flow'

export default function () {
  let rootRoute = 'bpm'
  return {
    path: `/${rootRoute}`,
    name: `${rootRoute}`,
    meta,
    redirect: { name: `${rootRoute}-index` },
    component: layoutHeaderAside,
    children: (pre => [
      {
        path: 'index',
        name: `${pre}-index`,
        component: _import(`${rootRoute}/index`),
        meta: {
          ...meta,
          title: '我的应用'
        }
      },
      myFlow(pre)
    ])(`${rootRoute}`)
  }
}