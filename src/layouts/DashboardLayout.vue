<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <div class="logo">
      </div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item>
          英文翻译
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 1em">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>英文翻译</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <router-view/>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2020 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  name: 'DashboardLayout'
}
</script>

<style scoped>

</style>
