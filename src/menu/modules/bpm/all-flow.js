/**
 * 个人流程，子菜单
 * path路径直接拼接完整相对地址，即以【/】符号开头
 * @param pre
 * @returns {{path: string, children: *, icon: string, title: string}}
 */
export default function (prefix = '') {
  let myPre = 'all'
  console.log(`bpm菜单，要求格式如'/yh'，传参前缀：${prefix}`)
  let pre = prefix.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix
  return {
    path: `/${myPre}`,
    title: '全局流程',
    icon:'list-ol ',
    children: (act => [
      {
        path: `${pre}/${act}/definition`,
        title: '全局流程',
        icon:'list-alt ',
      },
      {
        path: `${pre}/${act}/instance`,
        title: '全局实例',
        icon:'history',
      },
      {
        path: `${pre}/${act}/task`,
        title: '全局任务',
        icon:'history',
      },

    ])(`${myPre}`)
  }
}
