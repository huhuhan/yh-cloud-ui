<template>
    <!--内嵌后端编辑器-->
  <d2-container-frame :src="`${$activiti}${url}`"/>
</template>

<script>
export default {
  props:['url'],
  data () {
    return {
      filename: __filename
    }
  }
}
</script>
