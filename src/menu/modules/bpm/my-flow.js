/**
 * 个人流程，子菜单
 * path路径直接拼接完整相对地址，即以【/】符号开头
 * @param prefix
 * @returns {{path: string, children: *, icon: string, title: string}}
 */
export default function (prefix = '') {
  let myPre = 'my'
  console.log(`bpm菜单，要求格式如'/yh'，传参前缀：${prefix}`)
  let pre = prefix.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix
  return {
    path: `/${myPre}`,
    title: '个人流程',
    icon:'list-ol ',
    children: (act => [
      {
        path: `${pre}/${act}/definition`,
        title: '我的流程',
        icon:'list-alt ',
      },
      {
        path: `${pre}/${act}/task/todo`,
        title: '我的待办',
        icon:'history',
      },
      {
        path: `${pre}/${act}/task/done`,
        title: '我的已办',
        icon:'history',
      },
      {
        path: `${pre}/${act}/instance`,
        title: '我的实例',
        icon:'history',
      },

    ])(`${myPre}`)
  }
}
