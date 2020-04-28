<template>
    <div style="padding: 30px">
        <h1>当前表单：{{name}}</h1>
        <component :is="mode"></component>
    </div>
</template>

<script>
  export default {
    name: 'demo-async-page',
    components: {},
    mixins: [],
    props: {
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
    mounted(){
      //index组件引用task-detail组件（弹窗），再引用此组件，第一次watch无法监听到变化
      //index组件引用task-detail组件（弹窗），task-detail的watch第一次就能监听到变化
      this.getComponent()
    },
    watch: {
      name (newVal, oldVal) {
        this.$log.primary(`demo-async-page  newVal:${newVal},oldVal:${oldVal}`)
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
              require([`./async-demo`], resolve)
            }
          )
        } else {
          //ES6写法，同上
          this.mode = () =>import(`./${this.name}`)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

