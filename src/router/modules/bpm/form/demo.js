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
  let myModule = 'demo'
  return {
    path: `${myModule}`,
    name: `${namePre}-${myModule}`,
    meta: {
      ...meta,
      title: '测试表单'
    },
    redirect: {name: `${namePre}-${myModule}-demo`},
    ...emptyRoute,
    //二级路由
    children: (act => [
      {
        path: 'demo1',
        name: `${namePre}-${act}-demo1`,
        component: _import(`${modulePre}/${act}/demo1`),
        meta: {
          ...meta,
          title: '表单一'
        }
      },
      {
        path: 'demo2',
        name: `${namePre}-${act}-demo2`,
        component: _import(`${modulePre}/${act}/demo2`),
        meta: {
          ...meta,
          title: '表单二'
        }
      },
      {
        path: 'demo3',
        name: `${namePre}-${act}-demo3`,
        component: _import(`${modulePre}/${act}/demo3`),
        meta: {
          ...meta,
          title: '表单三'
        }
      },
    ])(`${myModule}`)
  }
}
