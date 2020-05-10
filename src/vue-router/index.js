/* 
1. 实现响应式
2. 监听URL变化
 */

let Vue
class VueRouter {
  constructor(options = {}) {
    const { routes, mode } = options
    const router = this
    this.mode = mode
    if(mode === 'hash') {
      this.history = new HashHistory(this, options)
    }
    // 解析路由配置
    this.routePathMap = {}
    this.routePathList = []
    handleRoutes(this, routes)
    
    // 实现响应式
    this._route = {
      path: '/'
    }
    this._vm = new Vue({
      data: {
        $$route: router._route
      }
    })
    setupListener(this)
  }
  init() {

  }
  push() {

  }
  replace() {
    
  }
  go(n) {
    this.history.go(n)
  }
  forward() {
    this.history.go(1)
  }
  back() {
    this.history.go(-1)
  }
}

function handleRoutes(router, routes) {
  routes.forEach(route => {
    if (!router.routePathMap[route.path]) {
      router.routePathMap[route.path] = route
      router.routePathList.push(route.path)
    }
  });
}
function setupListener(router) {
  const eventName = router.mode === 'hash' ? 'hashchange' : 'popstate'
  const getPath = () => router.mode === 'hash' ? getHash() : getUrl()
  window.addEventListener(eventName, (event) => {
    router._vm._data.$$route.path = getPath()
  })
  router._route.path = getPath()
}
function getHash() {
  return window.location.hash.slice(1)
}
function getUrl() {
  return window.location.pathname
}
class History {
  constructor(options = {}) {
    this.current = {}
  }
  go(n) {
    window.history.go(n)
  }
}

class HashHistory extends History {
  constructor(options = {}) {
    super(options)
  }
  push() {

  }
  replace() {

  }

}

/* 实现插件 */
VueRouter.install = function installVueRouter(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      const router = this.$options.router
      if(router) {
        Vue.prototype.$router = router
        router.init()
        Object.defineProperty(Vue.prototype, '$route', {
          get() {
            return router._route
          }
        })
      }
    }
  })
  Vue.component('RouterLink', {
    props: {
      to: {
        type: String,
        required: true,
      },
      tag: {
        type: String,
        default: 'a'
      }
    },
    render(h) {
      return h(this.tag, {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }
  })

  Vue.component('RouterView', {
    render(h) {
      const path = this.$router._route.path || '*'
      const component = (this.$router.routePathMap[path] || this.$router.routePathMap['*']).component;
      return h(component)
    }
  })
}

export default VueRouter
