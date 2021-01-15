const managerMsgKey = 'managerMsg'
export default {
  setManagerMsg (msg) {
    localStorage.setItem(managerMsgKey, JSON.stringify(msg))
  },
  getManagerMsg () {
    return JSON.parse(localStorage.getItem(managerMsgKey) || '{}')
  },
  deleteManagerMsg () {
    localStorage.removeItem(managerMsgKey)
  }
}
