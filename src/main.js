import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import filter from './filter'
import qs from 'qs'
import api from '@api/baseRequest'
import apiUrl from '@api/baseUrl'
import sysDict from '@utils/sysDict'
import common from '@utils/common'
import '@utils/dialogDrag.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@static/bootstrap.nonAdaptive.min.css'
import '@static/font-awesome.css'
import '@static/bootstrap-extend.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

// 全局注册对象，使用this.$x调用
Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.prototype.$apiUrl = apiUrl
Vue.prototype.$sysDict = sysDict
Vue.prototype.$common = common

// 全局设置过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
