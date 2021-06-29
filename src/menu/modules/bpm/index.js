import allFlow from './all-flow'
import myFlow from './my-flow'
import flowForm from './flow-form'
import base from './base'

export default function () {
  let rootRoute = 'bpm'
  return {
    path: `/${rootRoute}`,
    title: 'BPM系统',
    icon: 'flask',
    children: (pre => [
      { path: `${pre}/index`, title: '首页', icon: 'home' },
      base(pre),
      allFlow(pre),
      myFlow(pre),
      flowForm(pre)
    ])(`/${rootRoute}`)
  }
}
