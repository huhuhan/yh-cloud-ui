<template>
    <div>
        <component :is="mode"></component>
    </div>
</template>

<script>
  export default {
    name: 'my-async-page',
    components: {},
    mixins: [],
    props: {
      dir: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: undefined
      },
      // style: {
      //   type: Object,
      //   default () {
      //     return {
      //       padding: '80px'
      //     }
      //   }
      // }
    },
    data () {
      return {
        mode: ''
      }
    },
    watch: {
      name (newVal, oldVal) {
        this.$log.primary(`newVal:${newVal},oldVal:${oldVal}`)
        if (newVal) {
          this.getComponent()
        }
      }
    },
    methods: {
      getComponent () {
        if (this.name == undefined) {
          this.mode = new Promise(
            function (resolve) {
              require([`@/components/my-async-page/form/default-demo`], resolve)
            }
          )
        } else {
          //ES6写法，同上
          //webpack不支持完全动态加载，所以不能直接填变量参数
          //需要预先加载某个模块，比如@/views，之后动态匹配该目录下的组件
          this.mode = () =>import(`@/views/${this.dir}${this.name}`)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

