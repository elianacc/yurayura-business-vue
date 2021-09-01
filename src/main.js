import Vue from 'vue'
import App from './App.vue'
import router from './router'
import filter from './filter'
import axios from 'axios'
import qs from 'qs'
import api from '@api/baseRequest'
import apiUrl from '@api/baseUrl'
import '@static/bootstrap.min.css'
import '@static/font-awesome.css'
import '@static/bootstrap-extend.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import storage from '@utils/storage'
import sysDict from '@utils/sysDict'
import common from '@utils/common'
import '@utils/dialogDrag.js'

Vue.config.productionTip = false


Vue.use(ElementUI)

// 解决和后端session不同步的问题，让axios请求带上cookie
axios.defaults.withCredentials = true
// axios默认添加ajax请求头标识
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json;charset=utf-8' }

// 全局注册对象，使用this.$x调用
Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.prototype.$apiUrl = apiUrl
Vue.prototype.$storage = storage
Vue.prototype.$sysDict = sysDict
Vue.prototype.$common = common

// 全局设置过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
