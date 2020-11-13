// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}
const emptyRoute = {
  component: () => import('@/components/my-empty-router')
}

import demoForm from './form/demo'

/**
 * 作为某菜单左侧一级菜单路由
 * path路径由VueRouter自动拼接完整相对地址，即不以【/】符号开头
 * @param prefix
 * @returns {{component}&{redirect: {name: string}, path: string, children: *, meta: ({auth}&{title: string}), name: string}}
 */
export default function (prefix = '') {
  console.log(`bpm路由，要求格式如'yh'，传参前缀：${prefix}`)
  prefix = prefix.endsWith('-') ? prefix.substring(0, prefix.length - 1) : prefix
  let namePre = prefix
  let modulePre = prefix.split('-').join('/')
  let myModule = 'components/form'
  return {
    path: `${myModule}`,
    name: `${namePre}-${myModule}`,
    meta: {
      ...meta,
      title: '流程表单'
    },
    redirect: {name: `${namePre}-${myModule}-form`},
    ...emptyRoute,
    //二级路由
    children: (act => [
      {
        path: 'async-demo',
        name: `${namePre}-${act}-async-demo`,
        component: _import(`${modulePre}/${act}/async-demo`),
        meta: {
          ...meta,
          title: '默认表单'
        }
      },
      demoForm(`${namePre}-${act}`)
    ])(`${myModule}`)
  }
}
