<template>
  <d2-container type="ghost">
    <d2-module-index-banner slot="header" v-bind="banner"/>
    <d2-module-index-menu :menu="menu"/>
  </d2-container>
</template>

<script>
  import menu from '@/menu/modules/vue'

  export default {
    data () {
      return {
        menu,
        banner: {
          title: 'Vue插件',
          subTitle: 'Vue插件示例'
        }
      }
    }
  }
</script>
