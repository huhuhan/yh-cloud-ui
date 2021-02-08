<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  import util from '@/libs/util'

  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    watch: {
      '$i18n.locale': 'i18nHandle'
    },
    created() {
      this.i18nHandle(this.$i18n.locale)
    },
    methods: {
      i18nHandle(val, oldVal) {
        util.cookies.set('lang', val)
        document.querySelector('html').setAttribute('lang', val)
      },
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/style/public-class.scss';
</style>
