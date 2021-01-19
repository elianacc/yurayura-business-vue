const managerMsgKey = 'managerMsg'
const sideMenuActiveKey = 'sideMenuActive'
const editableTabsKey = 'editableTabs'
const editableTabsValueKey = 'editableTabsValue'
export default {
  setManagerMsg (msg) {
    localStorage.setItem(managerMsgKey, JSON.stringify(msg))
  },
  getManagerMsg () {
    return JSON.parse(localStorage.getItem(managerMsgKey))
  },
  deleteManagerMsg () {
    localStorage.removeItem(managerMsgKey)
  },
  setSideMenuActive (val) {
    localStorage.setItem(sideMenuActiveKey, val)
  },
  getSideMenuActive () {
    return localStorage.getItem(sideMenuActiveKey) || '/business/index'
  },
  deleteSideMenuActive () {
    localStorage.removeItem(sideMenuActiveKey)
  },
  setEditableTabs (tabs) {
    localStorage.setItem(editableTabsKey, JSON.stringify(tabs))
  },
  getEditableTabs () {
    return JSON.parse(localStorage.getItem(editableTabsKey)) || [
      {
        title: '首页',
        name: 'index',
        index: '/business/index'
      }
    ]
  },
  deleteEditableTabs () {
    localStorage.removeItem(editableTabsKey)
  },
  setEditableTabsValue (val) {
    localStorage.setItem(editableTabsValueKey, val)
  },
  getEditableTabsValue () {
    return localStorage.getItem(editableTabsValueKey) || 'index'
  },
  deleteEditableTabsValue () {
    localStorage.removeItem(editableTabsValueKey)
  }
}
