<template>
  <a-layout>
    <a-layout-content style="padding: 1rem 0; background: #fff;" :style="{minHeight: '100vh'}">
      <div :style="{ background: '#fff' }">
        <router-view/>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  name: 'PreviewLayout'
}
</script>

<style scoped>

</style>
