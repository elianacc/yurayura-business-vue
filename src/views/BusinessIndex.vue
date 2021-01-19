<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4">Hello, {{$storageUtil.getManagerMsg().managerName}}!</h1>
      <p class="lead">欢迎进入Yura~Yura~后端管理页面</p>
      <hr class="my-4">
      <p>YuraYura是一个兴趣使然的项目</p>
      <p class="lead github-btn-p">
        <a class="btn btn-primary btn-lg"
           :href="githubUrl"
           data-toggle="tooltip"
           data-placement="right"
           title="点击跳转到本项目前端Vue工程所在GitHub仓库"
           target="_blank"><i class="fa fa-github fa-lg"></i>&nbsp;&nbsp;了解更多</a>
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
/* bs4 jumbotron样式重写 */
.jumbotron {
  background-color: #1c2938;
  color: #fff;
  width: 60%;
}

.github-btn-p {
  position: relative;
  top: 2rem;
}
</style>
