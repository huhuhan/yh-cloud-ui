import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

import allFlow from './all-flow'
import myFlow from './my-flow'
import flowFrom from './flow-form'
import base from './base'

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
          title: '我的首页'
        }
      },
      base(pre),
      allFlow(pre),
      myFlow(pre),
      flowFrom(pre)
    ])(`${rootRoute}`)
  }
}
