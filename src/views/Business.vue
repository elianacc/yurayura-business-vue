<template>
  <div class="container pl-0">

    <!-- 置顶导航 -->
    <nav class="navbar navbar-dark fixed-top bg-twitternav">
      <span class="navbar-brand">
        <img src="~@assets/xiaomai.jpg"
             width="40"
             height="40"
             class="rounded" />
        <span class="ml-3">{{$storageUtil.getManagerMsg().managerName}}</span>
        <span :class="sideMenuIsCollapse? 'ml-3' : 'ml-uncollapse-span'"
              class="collapse-span"
              @click="sideMenuIsCollapse = !sideMenuIsCollapse">
          <i class="el-icon-s-fold font-size-28"
             v-show="!sideMenuIsCollapse"></i>
          <i class="el-icon-s-unfold font-size-28"
             v-show="sideMenuIsCollapse"></i>
        </span>
      </span>
      <form class="form-inline">
        <button class="btn btn-danger ml-2"
                type="button"
                @click="logoutManager">
          <i class="fa fa-sign-out mr-2"></i>注销
        </button>
      </form>
    </nav>

    <!-- 侧边导航、标签导航、主内容row -->
    <div class="row r1">
      <!-- 侧边导航col -->
      <div :class="sideMenuIsCollapse? 'col-sidemenu-collapse': 'col-sidemenu-uncollapse'"
           class="c1">
        <el-menu :default-active="sideMenuActive"
                 :default-openeds="['sys','comic','user']"
                 background-color="#1c2938"
                 text-color="#adb5bd"
                 active-text-color="#409eff"
                 class="el-menu-vertical"
                 :collapse="sideMenuIsCollapse"
                 router
                 style="height: 100vh;">
          <el-scrollbar style="height: 100%;">
            <div style="height: 1080px;">
              <el-menu-item index="/business/index"
                            @click="addTab('首页', 'index', '/business/index')">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-submenu :index="submenu.name"
                          v-for="submenu in sideMenuData"
                          :key="submenu.name">
                <template slot="title">
                  <i :class="submenu.icon"></i>
                  <span slot="title">{{submenu.title}}</span>
                </template>

                <el-menu-item :index="item.index"
                              v-for="item in submenu.item"
                              :key="item.name"
                              @click="addTab(item.title, item.name, item.index)">
                  <i :class="item.icon"
                     class="mr-2"></i>{{item.title}}
                </el-menu-item>

              </el-submenu>
            </div>
          </el-scrollbar>
        </el-menu>
      </div>
      <!-- 标签导航和主内容col -->
      <div :class="sideMenuIsCollapse? 'col-tabandmain-collapse': 'col-tabandmain-uncollapse'"
           class="c2 pt-2 pl-0"
           style="height: 100vh;">

        <!-- 标签导航 -->
        <el-tabs v-model="editableTabsValue"
                 type="card"
                 closable
                 @tab-remove="removeTab"
                 @tab-click="tabClick">
          <el-tab-pane v-for="item in editableTabs"
                       :key="item.name"
                       :label="item.title"
                       :name="item.name">

          </el-tab-pane>
        </el-tabs>

        <el-scrollbar style="height: 100%;">
          <!-- 主内容 -->
          <router-view class="pb-12"></router-view>
          <!-- 返回顶部 -->
          <template>
            <el-backtop target=".r1 .c2 .el-scrollbar__wrap"
                        :bottom="20">
              <div class="back-top rounded">
                UP
              </div>
            </el-backtop>
          </template>
        </el-scrollbar>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Business',
  data () {
    return {
      sideMenuIsCollapse: false,
      sideMenuActive: this.$storageUtil.getSideMenuActive(),
      sideMenu: [
        {
          title: '系统管理',
          name: 'sys',
          icon: 'el-icon-s-tools',
          item: [
            {
              index: '/business/sys_dict',
              icon: 'fa fa-book fa-lg',
              title: '数据字典管理',
              name: 'sys_dict'
            },
            {
              index: '/business/sys_manager',
              icon: 'fa fa-user-secret fa-lg',
              title: '管理员管理',
              name: 'sys_manager'
            }
          ]
        },
        {
          title: '番剧管理',
          name: 'comic',
          icon: 'el-icon-ship',
          item: [
            {
              index: '/business/comic_info',
              icon: 'fa fa-github-alt fa-lg',
              title: '番剧信息管理',
              name: 'comic_info'
            }
          ]
        },
        {
          title: '用户管理',
          name: 'user',
          icon: 'el-icon-user',
          item: [
            {
              index: '/business/user_info',
              icon: 'fa fa-address-card fa-lg',
              title: '用户信息管理',
              name: 'user_info'
            }
          ]
        }
      ],
      editableTabsValue: this.$storageUtil.getEditableTabsValue(),
      editableTabs: this.$storageUtil.getEditableTabs()
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
          url: '/api/sys/manager/logout',
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
    },
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.sideMenuActive = nextTab.index
              this.$router.push(nextTab.index)
            } else {
              this.sideMenuActive = ''
              this.$router.push('/business')
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    addTab (tabTitle, tabName, tabIndex) {
      let newTabName = tabName
      if (this.editableTabs.findIndex(tab => tab.name === newTabName) === -1) {
        this.editableTabs.push({
          title: tabTitle,
          name: newTabName,
          index: tabIndex
        })
      }
      this.sideMenuActive = tabIndex
      this.editableTabsValue = newTabName
    },
    tabClick (target) {
      let nowTab = this.editableTabs.find(tab => tab.name === target.name)
      this.sideMenuActive = nowTab.index
      this.$router.push(nowTab.index)
    }
  },
  computed: {
    sideMenuData () {
      if (!this.$storageUtil.getManagerMsg().managerPermission.includes('sys')) {
        return this.sideMenu.filter(subMenu => subMenu.name !== 'sys')
      }
      return this.sideMenu
    }
  },
  watch: {
    editableTabs: {
      deep: true,
      handler (tabs) {
        this.$storageUtil.setEditableTabs(tabs)
      }
    },
    editableTabsValue (val) {
      this.$storageUtil.setEditableTabsValue(val)
    },
    sideMenuActive (val) {
      this.$storageUtil.setSideMenuActive(val)
    }
  }
}
</script>

<style scoped>
@media (min-width: 1px) {
  .container {
    width: 1366px;
  }
  .r1 .col-sidemenu-collapse {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 16.77%;
    max-width: 16.77%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 83.23%;
    max-width: 83.23%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
}
@media (min-width: 1367px) {
  .container {
    width: 1440px;
  }
  .r1 .col-sidemenu-collapse {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 15.95%;
    max-width: 15.95%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 84.05%;
    max-width: 84.05%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
}
@media (min-width: 1441px) {
  .container {
    width: 1680px;
  }
  .r1 .col-sidemenu-collapse {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 13.7%;
    max-width: 13.7%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 86.3%;
    max-width: 86.3%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
}
@media (min-width: 1681px) {
  .container {
    width: 1920px;
  }
  .r1 .col-sidemenu-collapse {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 12%;
    max-width: 12%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 88%;
    max-width: 88%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
}

/* 置顶导航 */
.bg-twitternav {
  background-color: #1c2938;
}
/* 置顶导航-侧边导航展开图标 */
nav .collapse-span {
  cursor: pointer;
}
nav .ml-uncollapse-span {
  margin-left: 5.5rem;
}

.r1 {
  margin-top: 66px;
}

/* el侧边导航重写（右白边清除） */
.r1 .c1 /deep/ .el-menu {
  border-right: 0rem;
}
/* el侧边导航宽高 */
.r1 .c1 .el-menu-vertical {
  width: 65px;
}
.r1 .c1 .el-menu-vertical:not(.el-menu--collapse) {
  width: 210px;
}

/* el侧边导航折叠时隐藏文字 */
.r1 .c1 .el-menu--collapse .el-submenu__title span {
  display: none;
}
/* el侧边导航折叠时隐藏 > */
.r1 .c1 .el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

/* el标签页（选项卡）重写 */
.r1 .c2 /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
.r1 .c2 /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left: none;
}
.r1 .c2 /deep/ .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  border-radius: 0.25rem;
  background-color: #1c2938;
}
.r1 .c2 /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #409eff;
}
.r1 .c2 /deep/ .el-tabs__item .el-icon-close:hover {
  background-color: #10171e;
}
.r1 .c2 /deep/ .el-tabs__item {
  color: #adb5bd;
}
.r1 .c2 /deep/ .el-tabs__item:hover {
  color: #409eff;
  cursor: pointer;
}
.r1 .c2 /deep/ .el-tabs__item.is-active {
  color: #409eff;
}

/* 主内容底部留白 */
.r1 .c2 .pb-12 {
  padding-bottom: 12rem;
}

/* 返回顶部 */
.r1 .c2 .back-top {
  height: 100%;
  width: 100%;
  background-color: #1c2938;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 40px;
  color: #ffffff;
}
</style>
