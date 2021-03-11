import Vue from 'vue'
import App from './App.vue'
import router from './router'
import filter from './filter'
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
import commentUtil from '@utils/commentUtil'

Vue.config.productionTip = false


Vue.use(ElementUI)

// 解决和后端session不同步的问题，让axios请求带上cookie
axios.defaults.withCredentials = true
// axios默认添加ajax请求头标识
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json;charset=utf-8' }

// 全局注册对象，使用this.$x调用
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$storageUtil = storageUtil
Vue.prototype.$sysDictUtil = sysDictUtil
Vue.prototype.$commentUtil = commentUtil

// 全局设置过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
