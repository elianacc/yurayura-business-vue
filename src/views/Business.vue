<template>
  <div class="container p-0">

    <!-- 置顶导航 -->
    <nav class="navbar navbar-dark fixed-top bg-twitternav">
      <span class="navbar-brand">
        <img src="../assets/xiaomai.jpg"
             width="40"
             height="40"
             class="rounded" />
        <span class="ml-3">{{$storageUtil.getManagerMsg().managerName}}</span>
      </span>
      <form class="form-inline">
        <button class="btn btn-danger ml-2"
                type="button"
                @click="logoutManager">
          <i class="fa fa-sign-out"></i>&nbsp;&nbsp;注销
        </button>
      </form>
    </nav>

    <div class="row r1">
      <!-- 侧边导航col -->
      <div class="col-2 c1">
        <el-menu default-active="/business/index"
                 :default-openeds="['sys','comic','user']"
                 background-color="#1c2938"
                 text-color="#adb5bd"
                 active-text-color="#f8f9fa"
                 class="el-menu-vertical"
                 router>
          <el-menu-item index="/business/index">
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="submenu.index"
                      v-for="submenu in sideMenuData"
                      :key="submenu.index">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{submenu.title}}</span>
            </template>

            <el-menu-item :index="item.index"
                          v-for="item in submenu.item"
                          :key="item.index">
              <i :class="item.icon"></i>&nbsp;&nbsp;{{item.title}}
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </div>
      <!-- 主内容col -->
      <div class="col-10 pt-2">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Business',
  data () {
    return {
      sideMenu: [
        {
          title: '系统管理',
          index: 'sys',
          item: [
            {
              index: '/business/sys_dict',
              icon: 'fa fa-book fa-lg',
              title: '数据字典管理'
            },
            {
              index: '/business/sys_manager',
              icon: 'fa fa-user-secret fa-lg',
              title: '管理员管理'
            }
          ]
        },
        {
          title: '番剧管理',
          index: 'comic',
          item: [
            {
              index: '/business/comic_info',
              icon: 'fa fa-github-alt fa-lg',
              title: '番剧信息管理'
            }
          ]
        },
        {
          title: '用户管理',
          index: 'user',
          item: [
            {
              index: '/business/user_info',
              icon: 'fa fa-address-card fa-lg',
              title: '用户信息管理'
            }
          ]
        }
      ]
    }
  },
  methods: {
    logoutManager () {
      this.$confirm('确定要注销吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: `${this.$serviceUrl}/sys/manager/logout`,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          responseType: 'json'
        }).then(res => {
          if (res.data.code === 200) {
            this.$storageUtil.deleteManagerMsg()
            this.$router.push('/manager_login')
          } else if (res.data.code === 500) {
            this.$notify.error({
              title: '错误',
              message: res.data.msg,
              duration: 0
            })
          }
        })
      }).catch(() => { })
    }
  },
  computed: {
    sideMenuData () {
      if (!this.$storageUtil.getManagerMsg().managerPermission.includes('sys')) {
        return this.sideMenu.filter(subMenu => subMenu.index !== 'sys')
      }
      return this.sideMenu
    }
  }
}
</script>

<style scoped>
.container {
  width: 1920px;
}
.r1 {
  margin-top: 66px;
}
/* 推特色导航背景 */
.bg-twitternav {
  background-color: #1c2938;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 250px;
  min-height: calc(100vh);
}
.r1 .c1 /deep/ .el-menu {
  border-right: 0rem;
}
</style>
