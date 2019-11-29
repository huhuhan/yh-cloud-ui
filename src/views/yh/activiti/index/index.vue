<template>
    <d2-container type="ghost">
        <d2-module-index-banner slot="header" v-bind="banner"/>
        <d2-module-index-menu :menu="menu"/>
    </d2-container>
</template>

<script>
  import menu from '@/menu/modules/yh-activiti'

  export default {
    data () {
      return {
        menu,
        banner: {
          title: 'DEMOS',
          subTitle: '工作流Demo参考'
        }
      }
    }
  }
</script>
