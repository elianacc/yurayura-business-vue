<template>
  <div>
    <div class="jumbotron bg-twitter-content">
      <h1 class="display-4 text-center">Hello, {{$storageUtil.getManagerMsg().managerName}}!</h1>
      <p class="lead text-center">欢迎进入Yura~Yura~后端管理页面</p>
      <hr class="my-4">
      <p class="text-center">YuraYura是一个兴趣使然的项目</p>
      <p class="lead github-btn-p text-center">
        <a class="btn btn-primary btn-lg"
           :href="githubUrl"
           data-toggle="tooltip"
           data-placement="right"
           title="点击跳转到本项目前端Vue工程所在GitHub仓库"
           target="_blank"><i class="fa fa-github fa-lg mr-2"></i>了解更多</a>
      </p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'BusinessIndex',
  data () {
    return {
      githubUrl: 'https://github.com/elianacc/yurayura-business-vue'
    }
  },
  mounted () {
    $('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style scoped>
/* bs4 jumbotron重写 */
.jumbotron {
  color: #f8f9fa;
}

.github-btn-p {
  position: relative;
  top: 2rem;
}
</style>
