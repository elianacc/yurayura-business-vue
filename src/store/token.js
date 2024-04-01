export default {
  namespaced: true,
  actions: {},
  mutations: {
    SET_TOKEN (state, value) {
      state.token = value
    },
    CLEAR_TOKEN (state) {
      state.token = ''
    }
  },
  state: {
    token: ''
  },
  getters: {
    token (state) {
      return state.token
    }
  }
}