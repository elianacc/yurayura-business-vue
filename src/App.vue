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
html {
  cursor: pointer;
}
/* 全局背景及禁用y轴滚动设置 */
body {
  cursor: default;
  background: #f7f9f9 !important;
  overflow-y: hidden;
  overflow-x: hidden;
}
/* 默认浏览器滚动条修改（Chrome内核有效） */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  position: relative;
  display: block;
  cursor: pointer;
  border-radius: 1rem;
  background-color: rgba(144, 147, 153, 0.3);
  transition: 0.3s background-color;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}

/* font-size default:12px */
.font-size-12 {
  font-size: 0.75rem;
}
.font-size-14 {
  font-size: 0.875rem;
}
.font-size-16 {
  font-size: 1rem;
}
.font-size-18 {
  font-size: 1.125rem;
}
.font-size-20 {
  font-size: 1.25rem;
}
.font-size-22 {
  font-size: 1.375rem;
}
.font-size-24 {
  font-size: 1.5rem;
}
.font-size-26 {
  font-size: 1.625rem;
}
.font-size-28 {
  font-size: 1.75rem;
}
.font-size-30 {
  font-size: 1.875rem;
}
.font-size-32 {
  font-size: 2rem;
}
.font-size-34 {
  font-size: 2.125rem;
}
.font-size-36 {
  font-size: 2.25rem;
}
.font-size-38 {
  font-size: 2.375rem;
}
.font-size-40 {
  font-size: 2.5rem;
}

/* bs5按钮聚焦重写（去除按钮聚焦时的边框） */
button:focus,
.btn:focus,
.btn:active:focus,
.btn.active:focus,
.btn.focus,
.btn:active.focus,
.btn.active.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
  color: #fff;
}

/* 推特色导航背景 */
.bg-twitter-nav {
  background-color: #15202b;
}

/* 推特色按钮 */
.btn-twitter {
  color: #fff;
  background-color: #15202b;
  border-color: #15202b;
}

/* vue v-cloak */
[v-cloak] {
  display: none;
}
</style>
