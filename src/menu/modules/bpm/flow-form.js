import demoForm from './form/demo'

/**
 * 流程表单，子菜单
 * path路径直接拼接完整相对地址，即以【/】符号开头
 * @param prefix
 * @returns {{path: string, children: *, icon: string, title: string}}
 */
export default function (prefix = '') {
  let myPre = 'components/form'
  console.log(`bpm菜单，要求格式如'/yh'，传参前缀：${prefix}`)
  let pre = prefix.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix
  return {
    path: `/${myPre}`,
    title: '流程表单',
    icon: 'list-ol ',
    children: (act => [
      {
        path: `${pre}/${act}/async-demo`,
        title: '默认表单',
        icon: '',
      },
      demoForm(`${pre}/${act}`)
    ])(`${myPre}`)
  }
}
