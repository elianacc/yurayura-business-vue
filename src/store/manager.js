export default {
  namespaced: true,
  actions: {},
  mutations: {
    SET_MANAGER_MSG (state, value) {
      state.managerMsg = { ...value }
    },
    CLEAR_MANAGER_MSG (state) {
      state.managerMsg.managerName = ''
      state.managerMsg.managerPermission = ''
      state.managerMsg.managerOrg = -1
    }
  },
  state: {
    managerMsg: {
      managerName: '',
      managerPermission: '',
      managerOrg: -1
    }
  },
  getters: {
    managerName (state) {
      return state.managerMsg.managerName
    },
    managerPermission (state) {
      return state.managerMsg.managerPermission
    },
    managerOrg (state) {
      return state.managerMsg.managerOrg
    }
  }
}