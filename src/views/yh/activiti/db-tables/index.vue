<template>
    <d2-container type="ghost">
        <d2-module-index-banner slot="header" v-bind="banner"/>
    </d2-container>
</template>

<script>
  export default {
    data () {
      return {
        banner: {
          title: 'DEMOS',
          subTitle: '工作流Demo参考'
        }
      }
    }
  }
</script>
