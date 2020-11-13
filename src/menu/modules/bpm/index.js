import myFlow from './my-flow'
import allFlow from './all-flow'

export default function () {
  let rootRoute = 'bpm'
  return {
    path: `/${rootRoute}`,
    title: 'BPM系统',
    icon: 'flask',
    children: (pre => [
      { path: `${pre}/index`, title: '首页', icon: 'home' },
      allFlow(pre),
      myFlow(pre)
    ])(`/${rootRoute}`)
  }
}
