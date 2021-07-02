// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}
const emptyRoute = {
  component: () => import('@/components/my-empty-router')
}
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
  let myModule = 'base'
  return {
    path: `${myModule}`,
    name: `${namePre}-${myModule}`,
    meta: {
      ...meta,
      title: '我的流程设置'
    },
    redirect: {name: `${namePre}-${myModule}-user`},
    ...emptyRoute,
    //二级路由
    children: (act => [
      {
        path: 'user',
        name: `${namePre}-${act}-user`,
        component: _import(`${modulePre}/${act}/user`),
        meta: {
          ...meta,
          title: '用户管理'
        }
      },
      {
        path: 'role',
        name: `${namePre}-${act}-role`,
        component: _import(`${modulePre}/${act}/role`),
        meta: {
          ...meta,
          title: '角色管理'
        }
      },
      {
        path: 'resource',
        name: `${namePre}-${act}-resource`,
        component: _import(`${modulePre}/${act}/resource`),
        meta: {
          ...meta,
          title: '资源管理'
        }
      },
      {
        path: 'department',
        name: `${namePre}-${act}-department`,
        component: _import(`${modulePre}/${act}/department`),
        meta: {
          ...meta,
          title: '资源管理'
        }
      },
      {
        path: 'region',
        name: `${namePre}-${act}-region`,
        component: _import(`${modulePre}/${act}/region`),
        meta: {
          ...meta,
          title: '行政区划'
        }
      },
    ])(`${myModule}`)
  }
}
