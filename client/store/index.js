import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {}

const mutations = {}

const actions = {
  fetch ({ commit }) {
    // commit('INCREMENT')
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
