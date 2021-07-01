/**
 * 个人流程，子菜单
 * path路径直接拼接完整相对地址，即以【/】符号开头
 * @param prefix
 * @returns {{path: string, children: *, icon: string, title: string}}
 */
export default function (prefix = '') {
  let myPre = 'base'
  console.log(`bpm菜单，要求格式如'/yh'，传参前缀：${prefix}`)
  let pre = prefix.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix
  return {
    path: `/${myPre}`,
    title: '基础管理',
    icon:'list-ol ',
    children: (act => [
      {
        path: `${pre}/${act}/user`,
        title: '用户管理',
        icon:'list-alt ',
      },
      {
        path: `${pre}/${act}/role`,
        title: '角色管理',
        icon:'history',
      },
      {
        path: `${pre}/${act}/resource`,
        title: '资源管理',
        icon:'history',
      },
      {
        path: `${pre}/${act}/department`,
        title: '组织管理',
        icon:'history',
      },
    ])(`${myPre}`)
  }
}
