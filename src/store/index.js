import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // dorm
    count: 0,
    ismess: false,
    isshowmess:true,
    // applyapply
    applycount:0,
    applyismess: false,
    applyisshowmess:true,
    nadoptcount:0,
    nadoptismess: false,
    nadoptisshowmess:true,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
