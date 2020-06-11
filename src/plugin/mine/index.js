// eCharts
// import * as echarts from 'echarts'

// 时间插件
import moment from 'moment'

export default {
  async install(Vue, options) {
    // echarts
    // Vue.prototype.$echarts = echarts
    //moment
    Vue.prototype.$moment = moment
    moment.locale('zh-cn')
    Vue.use(moment)
  }
}
