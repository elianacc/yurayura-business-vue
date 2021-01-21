<template>
  <div class="container p-0">

    <!-- 置顶导航 -->
    <nav class="navbar navbar-dark fixed-top bg-twitternav">
      <span class="navbar-brand">
        <img src="~@assets/xiaomai.jpg"
             width="40"
             height="40"
             class="rounded" />
        <span class="ml-3">{{$storageUtil.getManagerMsg().managerName}}</span>
        <span class="ml-8 collapse-span"
              @click="sideMenuIsCollapse = !sideMenuIsCollapse;sideMenuCol = sideMenuIsCollapse? 'col-1': 'col-2';tabAndMainCol = sideMenuIsCollapse? 'col-11': 'col-10'">
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
          <i class="fa fa-sign-out"></i>&nbsp;&nbsp;注销
        </button>
      </form>
    </nav>

    <div class="row r1">
      <!-- 侧边导航col -->
      <div :class="sideMenuCol"
           class="c1">
        <el-menu :default-active="sideMenuActive"
                 :default-openeds="['sys','comic','user']"
                 background-color="#1c2938"
                 text-color="#adb5bd"
                 active-text-color="#409eff"
                 class="el-menu-vertical"
                 :collapse="sideMenuIsCollapse"
                 router>
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
              <i :class="item.icon"></i>&nbsp;&nbsp;{{item.title}}
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </div>
      <!-- 标签导航和主内容col -->
      <div :class="tabAndMainCol"
           class="c2 pt-2">

        <!-- 标签导航 -->
        <el-tabs v-model="editableTabsValue"
                 type="card"
                 closable
                 @tab-remove="removeTab"
                 @tab-click="tabClick"
                 style="position: relative; right: 4%;">
          <el-tab-pane v-for="item in editableTabs"
                       :key="item.name"
                       :label="item.title"
                       :name="item.name">

          </el-tab-pane>
        </el-tabs>

        <!-- 主内容 -->
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
      sideMenuIsCollapse: false,
      sideMenuCol: 'col-2',
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
      tabAndMainCol: 'col-10',
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
        return this.sideMenu.filter(subMenu => subMenu.index !== 'sys')
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
.container {
  width: 1920px;
}

/* 置顶导航样式 */
.bg-twitternav {
  background-color: #1c2938;
}
.ml-8 {
  margin-left: 8rem;
}
.collapse-span {
  cursor: pointer;
}

.r1 {
  margin-top: 66px;
}

/* el侧边导航宽高 */
.el-menu-vertical {
  width: 65px;
  min-height: calc(100vh);
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 250px;
}
/* el侧边导航右白边清除 */
.r1 .c1 /deep/ .el-menu {
  border-right: 0rem;
}

/* el标签页（选项卡）样式重写 */
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
</style>
