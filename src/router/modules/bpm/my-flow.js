// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}
const emptyRoute = {
  component: () => import('@/components/my-empty-router')
}
/**
 * 作为某菜单左侧一级菜单
 * path路径由VueRouter自动拼接完整相对地址，即不以【/】符号开头
 * @param prefix
 * @returns {{component}&{redirect: {name: string}, path: string, children: *, meta: ({auth}&{title: string}), name: string}}
 */
export default function (prefix = '') {
  console.log(`bpm路由，要求格式如'yh'，传参前缀：${prefix}`)
  prefix = prefix.endsWith('-') ? prefix.substring(0, prefix.length - 1) : prefix
  let namePre = prefix
  let modulePre = prefix.split('-').join('/')
  let myModule = 'my'
  return {
    path: `${myModule}`,
    name: `${namePre}-${myModule}`,
    meta: {
      ...meta,
      title: '我的流程设置'
    },
    redirect: {name: `${namePre}-${myModule}-definition`},
    ...emptyRoute,
    //二级路由
    children: (act => [
      {
        path: 'definition',
        name: `${namePre}-${act}-definition`,
        component: _import(`${modulePre}/${act}/definition`),
        meta: {
          ...meta,
          title: '我的流程'
        }
      },
      {
        path: 'task/todo',
        name: `${namePre}-${act}-task`,
        component: _import(`${modulePre}/${act}/task/todo`),
        meta: {
          ...meta,
          title: '我的待办'
        }
      },
      {
        path: 'task/done',
        name: `${namePre}-${act}-task`,
        component: _import(`${modulePre}/${act}/task/done`),
        meta: {
          ...meta,
          title: '我的已办'
        }
      },
      {
        path: 'instance',
        name: `${namePre}-${act}-instance`,
        component: _import(`${modulePre}/${act}/instance`),
        meta: {
          ...meta,
          title: '我的实例'
        }
      },
    ])(`${myModule}`)
  }
}
