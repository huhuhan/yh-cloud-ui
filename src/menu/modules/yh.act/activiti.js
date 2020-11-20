export default {
  path: '/yh/activiti',
  title: '工作流',
  icon: 'flask',
  children: (pre => [
    { path: `${pre}index`, title: '工作流', icon: 'home' },
    {
      path: `${pre}db-tables`,
      title: '数据库',
      icon: 'table'
    },
    {
      path: `${pre}model`,
      title: '模型管理',
      icon: 'table'
    },
    {
      path: `${pre}definition`,
      title: '定义管理',
      icon: 'table'
    },
    {
      path: `${pre}instance`,
      title: '实例管理',
      icon: 'table',
      children: [
        { path: `${pre}instance/running`, title: '运行实例' },
        { path: `${pre}instance/history`, title: '历史实例' },
      ]
    },
    {
      path: `${pre}sys-user`,
      title: '用户管理',
      icon: 'table'
    },
    {
      title: '请假Demo',
      icon: 'table',
      children: [
        { path: `${pre}leave/1`, title: '申请办理' },
      ]
    },
  ])('/yh/activiti/')
}
