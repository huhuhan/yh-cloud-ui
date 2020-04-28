export default {
  path: '/agilebpm',
  title: 'agilebpm',
  icon: 'flask',
  children: (pre => [
    { path: `${pre}/index`, title: 'agilebpm', icon: 'home' },
    {
      path: `${pre}/all`,
      title: '后台管理',
      icon: 'table',
      children: (pre2 => [
        { path: `${pre}${pre2}/definition`, title: '流程列表' },
        { path: `${pre}${pre2}/instance`, title: '实例列表' },
        { path: `${pre}${pre2}/task`, title: '任务列表' },
      ])('/all')
    },
    {
      path: `${pre}/sys`,
      title: '系统管理',
      icon: 'table',
      children: (pre2 => [
        { path: `${pre}${pre2}/user`, title: '用户列表' },
      ])('/sys')
    },
    // {
    //   path: `${pre}/my`,
    //   title: '我的事项',
    //   icon: 'table',
    //   children: (pre2 => [
    //     { path: `${pre}${pre2}/definition`, title: '发起流程' },
    //     { path: `${pre}${pre2}/task`, title: '待办事项' },
    //   ])('/my')
    // },
    {
      path: `${pre}/my`,
      title: '我的事项',
      icon: 'table',
      children: (pre2 => [
        {
          path: `${pre}${pre2}/definition`,
          title: '事项发起',
          icon: 'table',
          children: (pre3 => [
            { path: `${pre}${pre2}${pre3}/start`, title: '发起流程' },
            { path: `${pre}${pre2}${pre3}/history`, title: '发起历史' },
          ])('/definition')
        },
        {
          path: `${pre}${pre2}/task`,
          title: '事项办理',
          icon: 'table',
          children: (pre3 => [
            { path: `${pre}${pre2}${pre3}/todo`, title: '待办事项' },
            { path: `${pre}${pre2}${pre3}/history`, title: '办理历史' },
          ])('/task')
        },
      ])('/my')
    },
    {
      path: `${pre}/form`,
      title: '业务表单',
      icon: 'table',
      children: (pre2 => [
        { path: `${pre}${pre2}/start`, title: '开始表单' },
        { path: `${pre}${pre2}/demo1`, title: '表单一' },
        { path: `${pre}${pre2}/demo2`, title: '表单二' },
        { path: `${pre}${pre2}/demo3`, title: '表单三' },
      ])('/form')
    },
  ])('/agilebpm')
}
