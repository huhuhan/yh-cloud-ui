/**
 * 流程表单-演示表单
 * path路径直接拼接完整相对地址，即以【/】符号开头
 * @param pre
 * @returns {{path: string, children: *, icon: string, title: string}}
 */
export default function (prefix = '') {
  let myPre = 'demo'
  console.log(`bpm菜单，要求格式如'/yh'，传参前缀：${prefix}`)
  let pre = prefix.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix
  return {
    path: `/${myPre}`,
    title: '演示表单',
    icon:'list-ol ',
    children: (act => [
      {
        path: `${pre}/${act}/demo1`,
        title: '表单一',
        icon:'list-alt ',
      },
      {
        path: `${pre}/${act}/demo2`,
        title: '表单二',
        icon:'history',
      },
      {
        path: `${pre}/${act}/demo3`,
        title: '表单三',
        icon:'history',
      },

    ])(`${myPre}`)
  }
}
