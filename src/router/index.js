import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import storageUtil from '@utils/storageUtil'
import ManagerLogin from '@views/ManagerLogin.vue'
import Business from '@views/Business.vue'
import BusinessIndex from '@views/BusinessIndex.vue'
import BusinessSysDict from '@views/BusinessSysDict.vue'
import BusinessSysManager from '@views/BusinessSysManager.vue'
import BusinessComicInfo from '@views/BusinessComicInfo.vue'
import BusinessUserInfo from '@views/BusinessUserInfo.vue'

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
      component: Business,
      children: [
        {
          path: '',
          name: 'Business',
          component: BusinessIndex
        },
        {
          path: 'index',
          name: 'BusinessIndex',
          component: BusinessIndex
        },
        {
          path: 'sys_dict',
          name: 'BusinessSysDict',
          component: BusinessSysDict
        },
        {
          path: 'sys_manager',
          name: 'BusinessSysManager',
          component: BusinessSysManager
        },
        {
          path: 'comic_info',
          name: 'BusinessComicInfo',
          component: BusinessComicInfo
        },
        {
          path: 'user_info',
          name: 'BusinessUserInfo',
          component: BusinessUserInfo
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'ManagerLogin' && to.name !== 'HomePage') {
    axios({
      method: 'post',
      url: '/api/sys/manager/judgeAuthen',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    }).then(res => {
      if (res.data.code === 200) {
        next()
      } else {
        storageUtil.deleteManagerMsg()
        next('/manager_login')
      }
    })
  } else {
    next()
  }
})

export default router
