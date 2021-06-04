// import allFlow from './all-flow'

export default function () {
  let rootRoute = 'vue'
  return {
    path: `/${rootRoute}`,
    title: 'Vue插件',
    icon: 'puzzle-piece',
    children: (pre => [
      { path: `${pre}/index`, title: '首页', icon: 'home' },
      { path: `${pre}/sign`, title: '手写插件', icon: 'home' },
      // allFlow(pre),
    ])(`/${rootRoute}`)
  }
}
