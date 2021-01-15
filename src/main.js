import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import '@public/frame/bootstrap.min.css'
import '@public/frame/font-awesome.css'
import '@public/frame/bootstrap-extend.css'
import '@public/frame/bootstrap.bundle.min'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Properties from '@/properties'
import storageUtil from '@utils/storageUtil'

Vue.config.productionTip = false

Vue.use(ElementUI)

// 解决和后端session不同步的问题
axios.defaults.withCredentials = true

// 全局注册对象，使用this.$x调用
Vue.prototype.$axios = axios
Vue.prototype.$serviceUrl = Properties.serviceUrl
Vue.prototype.$storageUtil = storageUtil

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
