import Vue from 'vue'
import Vuex from 'vuex'

import manager from './manager'
import menutab from './menutab'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    manager,
    menutab
  }
})