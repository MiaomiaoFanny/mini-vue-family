export let Vue
export function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        /* 实现响应式, _route的变化会触发所有关联的地方进行更新 */
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else if (this.$parent){
        this._routerRoot = this.$parent._routerRoot || this
      }
    }
  })
  // 挂载$router $route
  Object.defineProperty(Vue.prototype, '$router', {
    get() { return this._routerRoot._router },
    enumerable: true
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() { return this._routerRoot._route },
    enumerable: true
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
      /* eventHandler click */
      return h(this.tag, {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }
  })

  Vue.component('RouterView', {
    render(h) {
      let {matched} = this.$route
      let component = matched[matched.length - 1].component
      return h(component)
    }
  })
}
