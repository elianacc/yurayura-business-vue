import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import ManagerLogin from '@views/ManagerLogin.vue'
import Business from '@views/Business.vue'
import Notfound from '@views/Notfound.vue'
import axios from 'axios'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: ManagerLogin
    },
    {
      path: '/manager_login',
      name: 'ManagerLogin',
      component: ManagerLogin
    },
    {
      path: '/business',
      name: 'business',
      component: Business,
      children: []
    },
    {
      path: '*',
      name: 'Notfound',
      component: Notfound
    }
  ],
  scrollBehavior () {
    // 页面刷新回到页面顶部的方法
    return {
      x: 0,
      y: 0
    }
  }
})

// 动态加载 business 下的子路由
export async function loadBusinessRoutes () {
  try {

    const response = await axios.get('/api/sys/menuSub/getVueRouter')
    const businessRoutes = response.data.data

    // 动态添加路由
    businessRoutes.forEach(route => {
      router.addRoute('business', {
        path: route.path,
        name: route.name,
        component: () => import(`@views/${route.component}`) // 动态导入组件
      })
    })

  } catch (error) {
    console.error('加载业务路由失败:', error)
  }
}

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.name !== 'ManagerLogin' && to.name !== 'HomePage' && to.name !== 'Notfound') {
    // 非登入、404页
    if (store.getters['token/token'] === '') {
      next('/manager_login')
    }
    next()
  } else {
    if (to.name !== 'Notfound') {
      // 登入页
      if (store.getters['token/token'] !== '') {
        next('/business/index')
      }
      next()
    }
    next()
  }
})

// 解决重复访问相同路由时浏览器报错（虽然不影响）
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
