<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局背景及禁用y轴滚动设置 */
body {
  background: #0d1117 !important;
  overflow-y: hidden;
}
</style>
