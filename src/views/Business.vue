<template>
  <div class="container-fluid ps-0">

    <!-- 置顶导航 -->
    <nav class="navbar navbar-dark fixed-top bg-twitter-nav py-0 px-3">
      <span class="navbar-brand">
        <img src="~@assets/xiaomai.jpg"
             width="40"
             height="40"
             class="rounded" />
        <span class="ms-3"
              v-show="!sideMenuIsCollapse">{{$store.getters['manager/managerName']}}</span>
        <span :class="sideMenuIsCollapse? 'ms-3' : 'ms-uncollapse-span'"
              class="collapse-span"
              @click="sideMenuIsCollapse = !sideMenuIsCollapse">
          <i class="el-icon-s-fold font-size-28"
             v-if="sideMenuCollIconShow"
             v-show="!sideMenuIsCollapse"></i>
          <i class="el-icon-s-unfold font-size-28"
             v-if="sideMenuCollIconShow"
             v-show="sideMenuIsCollapse"></i>
        </span>
      </span>
      <form class="d-flex">
        <el-badge :value="newNoticeNum"
                  :max="99"
                  :hidden="noticeNumHide">
          <el-popover placement="bottom"
                      width="330"
                      trigger="hover"
                      @show="noticePopShow"
                      @hide="noticePopHide"
                      @after-leave="noticePopAfLeave">
            <button class="btn btn-primary"
                    type="button"
                    slot="reference">
              <i class="fa fa-bell-o me-2 ms-2 font-size-16"></i></button>

            <div class="notice-box">
              <div class="notice-item"
                   v-for="item in noticeList"
                   :key="item.id">
                <img src="~@assets/notice.png"
                     class="notice-image" />
                <div class="notice-text">
                  <p class="notice-detail"
                     :title="item.noticeContent">{{item.noticeContent}}</p>
                  <p class="font-size-12 text-black-50">{{item.noticeCreateTime}}</p>
                  <el-divider></el-divider>
                </div>
              </div>
            </div>

          </el-popover>
        </el-badge>
        <button class="btn btn-danger ms-2"
                type="button"
                @click="logoutManager">
          <i class="fa fa-sign-out me-2 ms-2 mt-1 font-size-18"></i>
        </button>
      </form>
    </nav>

    <!-- 侧边导航、标签导航、主内容row -->
    <div class="row r1">
      <!-- 侧边导航col -->
      <div :class="sideMenuIsCollapse? 'col-sidemenu-collapse': 'col-sidemenu-uncollapse'"
           class="c1">
        <el-menu :default-active="sideMenuDftActive"
                 :default-openeds="sideMenu.map(menu => menu.menuName)"
                 background-color="#15202b"
                 text-color="#ffffff"
                 active-text-color="#ffffff"
                 class="el-menu-vertical"
                 :collapse="sideMenuIsCollapse"
                 router
                 style="height: 100vh;">
          <el-scrollbar style="height: 100%;">
            <div style="height: 1200px;"
                 class="menu-container">
              <el-menu-item index="/business/index">
                <i class="el-icon-s-home text-white"></i>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-submenu :index="submenu.menuName"
                          v-for="submenu in sideMenu"
                          :key="submenu.menuName">
                <template slot="title">
                  <i :class="submenu.menuIconClass"></i>
                  <span slot="title">{{submenu.menuTitle}}</span>
                </template>

                <el-menu-item :index="item.menuIndex"
                              v-for="item in submenu.menuSubList"
                              :key="item.menuName">
                  <i :class="item.menuIconClass"
                     class="me-2"></i>{{item.menuTitle}}
                </el-menu-item>

              </el-submenu>
            </div>
          </el-scrollbar>
        </el-menu>
      </div>
      <!-- 标签导航和主内容col -->
      <div :class="sideMenuIsCollapse? 'col-tabandmain-collapse': 'col-tabandmain-uncollapse'"
           class="c2 pt-1 ps-0"
           style="height: 100vh;">

        <!-- 标签导航 -->
        <el-tabs v-model="editableTabsValue"
                 type="card"
                 closable
                 @tab-remove="removeTab"
                 @tab-click="tabClick">
          <el-tab-pane v-for="item in editableTabs"
                       :key="item.name"
                       :name="item.name">
            <span slot="label"><i class="fa fa-tag fa-lg me-2"></i>{{item.title}}</span>
          </el-tab-pane>
        </el-tabs>

        <el-scrollbar style="height: 100%;">
          <!-- 主内容 -->
          <router-view class="pb-12"></router-view>
          <!-- 返回顶部 -->
          <el-backtop target=".r1 .c2 .el-scrollbar__wrap"
                      :bottom="20">
            <div class="back-top rounded">
              <i class="el-icon-arrow-up"></i>
            </div>
          </el-backtop>
        </el-scrollbar>

      </div>
    </div>

  </div>
</template>

<script>
import { getSysSideMenu } from '@api/sysMenu'
import { sysManagerLogout, getCurrentSysManagerMsg } from '@api/sysManager'
import { getSysDictAll } from '@api/sysDict'
import { getSysNoticeRecentMonth } from '@api/sysNotice'

export default {
  name: 'Business',
  data () {
    return {
      sideMenuIsCollapse: false,
      sideMenuDftActive: this.$store.getters['menutab/sideMenuDftActive'],
      sideMenu: [],
      editableTabsValue: this.$store.getters['menutab/editableTabsValue'],
      editableTabs: this.$store.getters['menutab/editableTabs'],
      screenWidth: 0,
      sideMenuCollIconShow: true,
      newNoticeNum: this.$store.getters['notice/newNoticeNum'],
      noticeNumHide: this.$store.getters['notice/noticeNumHide'],
      noticeList: []
    }
  },
  methods: {
    getSideMenu () {
      getSysSideMenu(success => {
        this.sideMenu = success.data
      })
    },
    async logoutManager () {
      try {
        await this.$confirm('确定要注销吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await sysManagerLogout(() => {
          this.$store.commit('token/CLEAR_TOKEN')
          this.$store.commit('manager/CLEAR_MANAGER_MSG')
          this.$router.push('/manager_login')
        })
      } catch { }
    },
    removeTab (targetName) {
      let tabs = [...this.editableTabs]
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              this.$router.push(nextTab.index)
            } else {
              this.$router.push('/business')
            }
          }
        })
      }
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
      this.sideMenuDftActive = tabIndex
      this.editableTabsValue = newTabName
    },
    tabClick (target) {
      let nowTab = this.editableTabs.find(tab => tab.name === target.name)
      this.$router.push(nowTab.index)
    },
    getCurrentManagerMsg () {
      getCurrentSysManagerMsg(success => {
        this.$store.commit('manager/SET_MANAGER_MSG', success.data)
      })
    },
    getAllDict () {
      getSysDictAll(success => {
        this.$store.commit('dict/SET_DICT_LIST', success.data)
      }, warn => {
        this.$alert(warn.msg, '提示', {
          confirmButtonText: '确定'
        })
      })
    },
    noticePopShow () {
      getSysNoticeRecentMonth(success => {
        this.noticeList = success.data
      })
    },
    noticePopHide () {
      this.noticeNumHide = true
    },
    noticePopAfLeave () {
      this.newNoticeNum = 0
    }
  },
  watch: {
    $route: {
      deep: true,
      handler (to) {
        this.getCurrentManagerMsg()
        if (to.name === 'Business') {
          this.sideMenuDftActive = ''
          this.editableTabsValue = ''
        } else {
          this.getAllDict()
          this.addTab(to.meta.title, to.name, to.path)
        }
      },
      immediate: true
    },
    editableTabs: {
      deep: true,
      handler (tabs) {
        this.$store.commit('menutab/SET_EDITABLE_TABS', tabs)
      }
    },
    editableTabsValue (val) {
      this.$store.commit('menutab/SET_EDITABLE_TABS_VALUE', val)
    },
    sideMenuDftActive (val) {
      this.$store.commit('menutab/SET_SIDE_MENU_DFT_ACTIVE', val)
    },
    newNoticeNum (val) {
      this.$store.commit('notice/SET_NOTICE_NUM', val)
    },
    noticeNumHide (val) {
      this.$store.commit('notice/SET_NOTICE_NUM_HIDE', val)
    },
    screenWidth (val) {
      this.sideMenuIsCollapse = val <= 1267
      this.sideMenuCollIconShow = val >= 1267
    }
  },
  mounted () {
    // 监听mqtt接收消息
    this.$mqttSubClient.on('message', (topic, message) => {
      if (message) {
        if (topic === 'yura-business-vue/notice-plus') {
          let res = JSON.parse(message.toString())
          if (this.$store.getters['manager/managerOrg'] === 0
            || parseInt(res.noticeOrg) === this.$store.getters['manager/managerOrg']) {
            this.newNoticeNum = this.newNoticeNum + 1
            this.noticeNumHide = false
          }
        }
      }
    })
    this.getSideMenu()
    this.screenWidth = document.body.clientWidth
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  }
}
</script>

<style scoped>
@media (min-width: 1px) {
  .r1 .col-sidemenu-collapse {
    flex: 0 0 auto;
    max-width: 15%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 auto;
    max-width: 16.77%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 auto;
    max-width: 85%;
    width: 100%;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 auto;
    max-width: 83.23%;
    width: 100%;
  }
}
@media (min-width: 1367px) {
  .r1 .col-sidemenu-collapse {
    flex: 0 0 auto;
    max-width: 8.333333%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 auto;
    max-width: 15.95%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 auto;
    max-width: 91.666667%;
    width: 100%;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 auto;
    max-width: 84.05%;
    width: 100%;
  }
}
@media (min-width: 1681px) {
  .r1 .col-sidemenu-collapse {
    flex: 0 0 auto;
    max-width: 8.333333%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-sidemenu-uncollapse {
    flex: 0 0 auto;
    max-width: 14%;
    width: 100%;
    position: relative;
    right: 0.5rem;
  }
  .r1 .col-tabandmain-collapse {
    flex: 0 0 auto;
    max-width: 91.666667%;
    width: 100%;
  }
  .r1 .col-tabandmain-uncollapse {
    flex: 0 0 auto;
    max-width: 86%;
    width: 100%;
  }
}

/* 置顶导航-侧边导航展开图标 */
nav .collapse-span {
  cursor: pointer;
}
nav .ms-uncollapse-span {
  margin-left: 5.5rem;
}

/* 置顶导航-通知标记重写 */
nav /deep/ .el-badge__content.is-fixed {
  top: 8px;
  right: 20px;
}

/* 置顶导航-通知栏 */
.notice-box {
  overflow: auto;
  height: 400px;
  margin-bottom: 37px;
}
.notice-image {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 20%;
  left: 10px;
  margin-top: -20px;
}
.notice-item {
  width: 100%;
  height: 105px;
  position: relative;
}
.notice-text {
  display: inline-block;
  position: absolute;
  top: 5px;
  left: 65px;
}
.notice-detail {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 230px;
}

.r1 {
  margin-top: 50px;
}

/* el侧边导航重写（右白边清除） */
.r1 .c1 /deep/ .el-menu {
  border-right: 0rem;
}
/* el侧边导航宽 */
.r1 .c1 .el-menu-vertical:not(.el-menu--collapse) {
  width: 210px;
}

/* el侧边导航折叠时隐藏文字 */
.r1 .c1 .el-menu--collapse .el-submenu__title span {
  display: none;
}
/* el侧边导航折叠时隐藏 > */
.r1 .c1 /deep/ .el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

/* el标签页（选项卡）重写 */
.r1 .c2 /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: 3px solid #0d6efd;
}
.r1 .c2 /deep/ .el-tabs__item:hover {
  color: #0d6efd;
}
.r1 .c2 /deep/ .el-tabs__item.is-active {
  color: #0d6efd;
}

/* 主内容底部留白 */
.r1 .c2 .pb-12 {
  padding-bottom: 12rem;
}

/* 返回顶部 */
.r1 .c2 .back-top {
  height: 100%;
  width: 100%;
  background-color: #15202b;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 40px;
  color: #ffffff;
}
</style>
