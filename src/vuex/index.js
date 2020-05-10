let Vue
class Store {
  constructor(options = {}) {
    const { state, mutations, actions, getters, plugins } = options
    const store = this
    this._committing = false;
    this._mutations = mutations
    this._actions = actions
    // 实现响应式
    this._vm = new Vue({
      data: {
        $$state: state
      }
    })
    // 处理getters
    this.getters = {}
    if (getters && typeof getters === 'object') {
      Object.keys(getters).forEach(key => {
        Object.defineProperty(this.getters, key, {
          get() {
            // 这里的this 是 this.getters
            return getters[key](store.state, store.getters)
          },
          enumerable: true,
        })
      })
    }

    // 绑定commit, dispatch 的 this
    const { commit, dispatch } = this
    this.commit = commit.bind(this)
    this.dispatch = dispatch.bind(this)

    // 处理plugin
    this._mutationSubscribers = []
    this._actionSubscribers = []
    if (plugins && plugins instanceof Array) {
      plugins.forEach(plugin => {
        plugin.call(store, store)
      })
    }

    this._watcherVm = new Vue()
    this._vm.$watch('$data.$$state', (newV, oldV) => {
      if(!store._committing) {
        throw new Error('[vuex] please don\'t mutate state outside mutations')
      }
    }, {
      deep: true,
      sync: true,
      // immediate: true,
    })
  }

  /* state只读 */
  get state() {
    return this._vm._data.$$state
  }
  set state(val) {
    throw new Error(`[vuex] please don't replace state directly`)
  }
  /* 替换整个state */
  replaceState(state) {
    const committing = this._committing
    this._committing = true
    this._vm._data.$$state = state
    this._committing = committing
  }

  commit(type, payload) {
    const store = this
    this._mutationSubscribers.forEach(subscribeFn => {
      subscribeFn.call(store, {type, payload}, store.state)
    })
    const committing = this._committing
    this._committing = true
    this._mutations[type] && this._mutations[type].call(this, this.state, payload)
    this._committing = committing
  }
  dispatch(type, payload) {
    const store = this
    this._actionSubscribers.filter(item => item.before && typeof item.before === 'function')
      .forEach(item => {
        item.before.call(store, {type, payload}, store.state)
      })
    this._actions[type] && this._actions[type].call(this, {
      commit: this.commit,
      dispatch: this.dispatch,
      state: this.state
    }, payload)
    this._actionSubscribers.filter(item => item.after && typeof item.after === 'function')
      .forEach(item => {
        item.after.call(store, {type, payload}, store.state)
      })
  }

  subscribe(fn) {
    if(typeof fn === 'function') {
      this._mutationSubscribers.push(fn)
    }
  }
  subscribeAction(fn) {
    if(typeof fn === 'function' || (fn && typeof fn === 'object')) {
      this._actionSubscribers.push({
        before: typeof fn === 'object' ? fn.before : fn,
        after: typeof fn === 'object' ? fn.after : null,
      })
    }
  }
}

/* 实现插件 */
function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      /* 挂载$store */
      if(this.$options.store) {
        this.$store = this.$options.store
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    }
  })
}

function mapState(map) {
  const res = {}
  normalizeMap(map).forEach(item => {
    const {key, value} = item
    res[key] = function () {
      return this.$store.state[value]
    }
  })
  return res;
}

function mapMutations(map) {
  const res = {}
  normalizeMap(map).forEach(item => {
    const {key, value} = item
    res[key] = function (...args) { // 不能用箭头函数, 需要拿到$store
      this.$store.commit.call(this.$store, value, ...args)
    }
  })
  return res;
}

function mapActions(map) {
  const res = {}
  normalizeMap(map).forEach(item => {
    const {key, value} = item
    res[key] = function (...args) { // 不能用箭头函数, 需要拿到$store
      this.$store.dispatch.call(this.$store, value, ...args)
    }
  })
  return res;
}

function mapGetters(map) {
  const res = {}
  normalizeMap(map).forEach(item => {
    const {key, value} = item
    res[key] = function () {
      return this.$store.getters[value]
    }
  })
  return res;
}

/*
  ['a'] > [{key:'a', value: 'a'}]
  {'a': 'b'} > [{key:'a', value: 'b'}]
*/
function normalizeMap(map) {
  const res = []
  if (Array.isArray(map))  {
    map.forEach(key => res.push({key, value:key}))
  } else if (map && typeof map === 'object') {
    Object.keys(map).forEach(key => res.push({key, value: map[key]}))
  }
  return res
}

export default { install, Store, mapState, mapMutations, mapActions, mapGetters }