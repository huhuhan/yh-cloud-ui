<template>
  <d2-container v-bind="$attrs" better-scroll>
    <iframe
      :class="clazz"
      :src="src"
      frameborder="0"/>
  </d2-container>
</template>

<script>
export default {
  name: 'd2-container-frame',
  props: {
    src: {
      type: String,
      required: false,
      default: 'https://fairyever.com/d2-admin/doc/zh/'
    },
    clazz: {
      type: String,
      required: false,
      default: 'd2-container-frame'
    }
  }
}
</script>

<style lang="scss" scoped>
.d2-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
