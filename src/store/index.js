import Vuex from '../vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 1,
    name: 'Fanny'
  },
  mutations: {
    increment(state, n = 1) {
      state.count += n
    }
  },
  actions: {
    increment({commit, dispatch, state}, n) {
      commit('increment', n)
    }
  },
  getters: {
    dbCount: state => state.count * 2,
    triCount: (state, getters) => {
      return getters.dbCount + state.count
    }
  },
  plugins: [
    store => {
      // mutation: {type, payload }
      store.subscribe((mutation, state) => {
        console.log('@@ mutation:', mutation.type, mutation.payload, 'count:', state.count)
      })
    },
    store => {
      store.subscribeAction((action, state) => {
        console.log('@ action:before-1', action.type, action.payload, 'count:', state.count)
      })
      store.subscribeAction({
        before: (action, state) => {
          console.log('@ action:before-2', action.type, action.payload, 'count:', state.count)
        },
        after: (action, state) => {
          console.log('@@@ action:after', action.type, action.payload, 'count:', state.count)
        },
      })
    },
  ]
})

export default store