import Vue from 'vue'
import {
  Col, Button,
  Form, FormItem, Input, InputNumber, Select, Option, DatePicker, RadioGroup, Radio, Checkbox, CheckboxGroup, CheckboxButton, Upload,
  Table, TableColumn, Pagination, Badge, Tag, Tree,
  Menu, MenuItem, Submenu, Tabs, TabPane,
  Dialog, Popover, Divider, Scrollbar, Backtop,
  Loading, Message, MessageBox, Notification
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@assets/bootstrap.min.css'
import '@assets/font-awesome.min.css'
import App from './App.vue'
import store from './store'
import SysDictSelect from '@components/SysDictSelect.vue'
import SysDictRadioGroup from '@components/SysDictRadioGroup.vue'
import SysDictCheckboxBtnGroup from '@components/SysDictCheckboxBtnGroup.vue'
import SysAllOrgSelect from '@components/SysAllOrgSelect.vue'
import router, { loadBusinessRoutes } from './router'
import filter from './filter'
import './directive'
import { mqttSubClient, mqttPubClient } from '@utils/common'

Vue.config.productionTip = false

Vue.component('sys-dict-select', SysDictSelect)
Vue.component('sys-dict-radio-group', SysDictRadioGroup)
Vue.component('sys-dict-checkbox-btn-group', SysDictCheckboxBtnGroup)
Vue.component('sys-all-org-select', SysAllOrgSelect)

// Basic
Vue.use(Col)
Vue.use(Button)
// Form
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)
Vue.use(Upload)
// Data
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Badge)
Vue.use(Tag)
Vue.use(Tree)
// Navigation
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Tabs)
Vue.use(TabPane)
// Others
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Divider)
Vue.use(Scrollbar)
Vue.use(Backtop)

Vue.use(Loading.directive)

// 全局注册对象，使用this.$x调用
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.prototype.$mqttSubClient = mqttSubClient

// 全局设置过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

// 订阅client连接mqtt服务器, 成功后进行mqtt订阅
mqttSubClient.on('connect', e => {
  console.log('订阅client成功连接mqtt服务:', e)
  mqttSubClient.subscribe('yura-business-vue/#', { qos: 0 }, err => {
    if (!err) {
      console.log('订阅主题成功')
    } else {
      console.log('订阅主题失败！')
    }
  })
})

// 监听订阅client是否连接mqtt服务器失败
mqttSubClient.on('error', error => {
  console.log('订阅client连接mqtt失败：', error)
  mqttSubClient.end()
})

// 发布client连接mqtt服务器
mqttPubClient.on('connect', e => {
  console.log('发布client成功连接mqtt服务:', e)
})

// 监听发布client是否连接mqtt服务器失败
mqttPubClient.on('error', error => {
  console.log('发布client连接mqtt失败：', error)
  mqttPubClient.end()
})

async function initializeApp () {
  // 在 Vue 实例挂载前加载业务页面路由
  await loadBusinessRoutes()
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}

// 启动 Vue 应用
initializeApp()