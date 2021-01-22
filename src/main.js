import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import '@public/frame/bootstrap.min.css'
import '@public/frame/font-awesome.css'
import '@public/frame/bootstrap-extend.css'
import '@public/frame/bootstrap.bundle.min'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import storageUtil from '@utils/storageUtil'
import sysDictUtil from '@utils/sysDictUtil'

Vue.config.productionTip = false

Vue.use(ElementUI)

// 解决和后端session不同步的问题，让axios请求带上cookie
axios.defaults.withCredentials = true
// axios默认添加ajax请求头标识
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' }

// 全局注册对象，使用this.$x调用
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$storageUtil = storageUtil
Vue.prototype.$sysDictUtil = sysDictUtil

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
