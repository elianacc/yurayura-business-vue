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
    }
  },
  state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).manager : {
    managerMsg: {
      managerName: '',
      managerPermission: ''
    }
  },
  getters: {
    managerName (state) {
      return state.managerMsg.managerName
    },
    managerPermission (state) {
      return state.managerMsg.managerPermission
    }
  }
}