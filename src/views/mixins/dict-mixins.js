import {mapState} from 'vuex'

export default {
  components: {},
  mounted() {
  },
  beforeDestroy() {
  },
  computed: {
    // ...mapState('d2admin/dict', [
    //   'dictList'
    // ])
  },
  methods: {
    // getDicts(keyName) {
    //   return this.dictList.filter(dict => dict.keyName == keyName)
    // },
    //
    // getDictByOptCode(keyName, optCode) {
    //   let dict = this.dictList.find(dict => dict.keyName == keyName && dict.optCode == optCode)
    //   if (dict == undefined) {
    //     this.$message({
    //       message: '数据字典不存在',
    //       type: 'warning'
    //     })
    //   }
    //   return dict
    // },
    //
    // getDictByOptName(keyName, optName) {
    //   let dict = this.dictList.find(dict => dict.keyName == keyName && dict.optName == optName)
    //   if (dict == undefined) {
    //     this.$message({
    //       message: '数据字典不存在',
    //       type: 'warning'
    //     })
    //   }
    //   return dict
    //
    // },
    //
    // getOptName(keyName, optCode) {
    //   let dict = this.dictList.find((value, index, arr) => value.keyName == keyName && value.optCode == optCode)
    //   return dict ? dict.optName :  ''
    // },
    //
    // getOptCode(keyName, optName) {
    //   let dict = this.dictList.find(t => t.keyName === keyName && t.optName === optName)
    //   return dict ? dict.optCode :  ''
    // }
  }
}
