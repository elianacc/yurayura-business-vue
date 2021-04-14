<template>
  <div class="container">

    <div class="row mt-5">
      <div class="col-10 offset-1">
        <h1 class="text-white text-center">抱歉，您访问的页面不存在╮(′～‵〞)╭</h1>
        <img src="~@assets/404.png"
             class="mx-auto d-block mt-5"
             width="710"
             height="390" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Notfound',
  methods: {
    judgeBack () {
      this.$axios({
        method: 'post',
        url: '/api/sys/manager/judgeAuthen',
        responseType: 'json'
      }).then(res => {
        if (res.data.code === 200) {
          this.$router.go(-1)
        }
      })
    }
  },
  mounted () {
    this.judgeBack()
  }
}
</script>

<style scoped>
.container {
  width: 992px;
}
</style>