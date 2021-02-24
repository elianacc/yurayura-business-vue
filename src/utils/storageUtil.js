const managerMsgKey = 'managerMsg'
const sideMenuDftActiveKey = 'sideMenuDftActive'
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
  setSideMenuDftActive (val) {
    localStorage.setItem(sideMenuDftActiveKey, val)
  },
  getSideMenuDftActive () {
    return localStorage.getItem(sideMenuDftActiveKey) || '/business/index'
  },
  deleteSideMenuDftActive () {
    localStorage.removeItem(sideMenuDftActiveKey)
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
