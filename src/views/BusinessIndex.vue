<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4 text-center">Hello, {{$store.getters['manager/managerName']}}!</h1>
      <p class="lead text-center">欢迎进入Yura~Yura~后端管理页面</p>
      <hr class="my-4 bg-secondary">
      <p class="text-center pb-5">当前时间： {{clock}}</p>
      <p class="text-center pb-3">YuraYura是一个兴趣使然的项目</p>
      <p class="github-btn-p text-center">
        <a class="btn btn-primary btn-lg"
           ref="getMoreLink"
           :href="githubUrl"
           data-bs-toggle="tooltip"
           data-bs-placement="right"
           title="点击跳转到本项目前端Vue工程所在GitHub仓库"
           target="_blank"><i class="fa fa-github fa-lg me-2"></i>了解更多</a>
      </p>
    </div>
  </div>
</template>

<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'

export default {
  name: 'BusinessIndex',
  data () {
    return {
      githubUrl: 'https://github.com/elianacc/yurayura-business-vue/tree/yurayura-cloud-business-vue',
      clock: ''
    }
  },
  methods: {
    updateTime () {
      // 每秒钟更新一次时钟
      setInterval(() => {
        let now = new Date()
        let year = now.getFullYear()
        // 月份从0开始，所以需要加1
        let month = now.getMonth() + 1
        let date = now.getDate()
        let hours = now.getHours().toString().padStart(2, '0')
        let minutes = now.getMinutes().toString().padStart(2, '0')
        let seconds = now.getSeconds().toString().padStart(2, '0')

        // 在时钟中显示当前时间
        this.clock = year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes + ':' + seconds
      }, 1000)
    }
  },
  mounted () {
    this.updateTime()
    new bootstrap.Tooltip(this.$refs.getMoreLink)
  }
}
</script>

<style scoped>
.jumbotron {
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  border-radius: 0.3rem;
  /* background-color: #15202b; */
}

.github-btn-p {
  position: relative;
  top: -1rem;
}
</style>
