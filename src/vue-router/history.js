
class History {
  constructor(router) {
    this.router = router
    this.current = null
    this.cb = null
    this.beforeEachHooks = []
    this.beforeResolveHooks = []
    this.afterEachHooks = []
  }
  transitionTo(location, onComplete, onError, onAbort) {
    const route = this.router.match(location, this.current)
    if (!route.matched || !route.matched.length) {
      onAbort && onAbort()
      this.transitionTo('*')
      return
    }
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      onComplete && onComplete()
      // onReady cb
    }, () => {
      onError && onError()
      // onReady errorCb
    })
  }
  confirmTransition(route, onComplete, onError) {
    // beforeRouteLeave
    // beforeEach
    // beforeRouteUpdate
    // beforeEnter
    // beforeRouteEnter
    // beforeResolve
    onComplete && onComplete()
    // beforeRouteEnter cb
  }
  updateRoute(route) {
    this.current = route
    this.cb && this.cb(route)
    // afterEach()
  }
  go(n) {
    window.history.go(n)
  }
  listen(fn) {
    this.cb = fn
  }
}

export class HashHistory extends History {
  constructor(options = {}) {
    super(options)
  }
  push() {}
  replace() {}
  getCurrentLocation() {
    return getHash()
  }
}

function getHash() {
  return window.location.hash.slice(1)
}

function getUrl() {
  return window.location.pathname
}
