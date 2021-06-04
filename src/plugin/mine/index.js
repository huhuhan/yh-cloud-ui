// eCharts
// import * as echarts from 'echarts'

// 时间插件
import moment from 'moment'

// 手写签名
import VueSignaturePad from 'vue-signature-pad'

export default {
  async install(Vue, options) {
    // echarts
    // Vue.prototype.$echarts = echarts
    //moment
    Vue.prototype.$moment = moment
    moment.locale('zh-cn')
    Vue.use(moment)

    Vue.use(VueSignaturePad)
  }
}
