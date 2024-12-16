export default {
  namespaced: true,
  actions: {
    resetNoticeNum (context) {
      context.commit('RESET_NOTICE_NUM')
      context.commit('RESET_NOTICE_NUM_HIDE')
    }
  },
  mutations: {
    SET_NOTICE_NUM (state, value) {
      state.newNoticeNum = value
    },
    SET_NOTICE_NUM_HIDE (state, value) {
      state.noticeNumHide = value
    },
    RESET_NOTICE_NUM (state) {
      state.newNoticeNum = 0
    },
    RESET_NOTICE_NUM_HIDE (state) {
      state.noticeNumHide = true
    }
  },
  state: {
    newNoticeNum: 0,
    noticeNumHide: true
  },
  getters: {
    newNoticeNum (state) {
      return state.newNoticeNum
    },
    noticeNumHide (state) {
      return state.noticeNumHide
    }
  }
}