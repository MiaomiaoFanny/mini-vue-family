/* 
1. 实现插件 install
2. 解析路由配置 RouteConfig > RouteRecord + Location > Route
3. 监听URL变化 onhashchange onpopstate 动态match生成Route, 并更新
4. 实现全局组件 RouterLink RouterView
5. RouterLink 实现a标签, 进行导航
6. RouterView 动态渲染组件 依赖route变化进行更新
7. 实现route响应式
 */

import {HashHistory} from './history'
import {resolvePath} from './util'
import {install} from './install'

class VueRouter {
  constructor(options = {}) {
    const { routes, mode } = options
    const router = this
    this.mode = mode
    // history管理导航动作
    if(mode === 'hash') {
      this.history = new HashHistory(this, options)
    }
    // 解析路由配置, 用于生成route
    this.matcher = createMatcher(routes, router)

    // 监听URL变化
    setupListener(this)
  }
  init(vm) {
    if(this.app) {
      return
    }
    this.app = vm
    const router = this
    this.history.listen((route) => {
      this.app._route = route
    })
    router.history.transitionTo(router.history.getCurrentLocation(), () => {
      console.log(`First Transition to ${router.history.getCurrentLocation()} success`, 'current: ', router.app._route)
    }, () => {
      console.error(`First Transition to ${router.history.getCurrentLocation()} fail!`)
    })
  }
  match(raw) {
    return this.matcher.match(raw)
  }
  push() { }
  replace() { }
  go(n) { this.history.go(n) }
  forward() { this.history.go(1) }
  back() { this.history.go(-1) }
}

function createMatcher(routes, router) {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
  function match(raw) {
    const location = normalizeLocation(raw)
    let record
    if(location.path) {
      record = pathMap[location.path]
    }
    if(!record && location.name) {
      record = nameMap[location.name]
    }
    return createRoute(record || null, location)
  }

  function addRoutes() {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  return {
    match, addRoutes
  }
}
function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  const pathList = oldPathList || []
  const pathMap = oldPathMap || {}
  const nameMap = oldNameMap || {}
  routes.forEach(routeConfig => {
    addRouteRecord(routeConfig, pathList, pathMap, nameMap)
  })
  window.pathList = pathList
  window.pathMap = pathMap
  window.nameMap = nameMap
  return {
    pathList, pathMap, nameMap
  }
}
/* RouteConfig: { name, path, component, components, redirect, props, alias, children, beforeEnter, meta, caseSensitive, pathToRegexpOptions } */
/* RouteRecord: { name, path, regex, components, instance, redirect, beforeEnter, meta, matchAs, props, parent } */
function addRouteRecord(routeConfig, pathList, pathMap, nameMap, parent) {
  const record = {
    name: routeConfig.name,
    path: resolvePath(routeConfig.path, parent && parent.path),
    regex: null,
    component: routeConfig.component,
    components: null,
    instance: null,
    redirect: routeConfig.redirect,
    beforeEnter: routeConfig.beforeEnter,
    meta: routeConfig.meta || {},
    matchAs: null,
    props: null,
    parent,
  }
  const _record = Object.freeze(record)
  if(!pathMap[record.path]) {
    pathMap[record.path] = _record
    pathList.push(record.path)
  }
  if(!pathMap[record.name]) {
    nameMap[record.name] = _record
  }
  if(routeConfig.children instanceof Array) {
    routeConfig.children.forEach(item => {
      addRouteRecord(item, pathList, pathMap, nameMap, _record)
    })
  }
}
/* Route: {name, path, hash, query, params, meta, matched, fullPath, redirectedFrom } */
function createRoute(record, location) {
  const _record = record || {}
  const route = {
    name: location.name || _record.name,
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    meta: _record.meta || {},
    matched: record ? genMatchedRecord(record) : [],
    fullPath: null, // path + query + hash >>> path?key=value#hash
    redirectedFrom: null,
  }
  return Object.freeze(route)
}
/* route.matched = [{parentRecord}, {subRecord}] */
function genMatchedRecord(record) {
  const res = []
  let tmp = record
  while (tmp) {
    res.unshift(tmp)
    tmp = tmp.parent
  }
  return res  
}
/* xxx?k=v&k2=v2#hash >>> Location: {_normalized, path, query, hash } */
function normalizeLocation(path) {
  if (path._normalized || path.name) {
    return path
  }
  let query = {}, hash = ''
  let idx = path.indexOf('#')
  if(idx > -1) {
    hash = path.slice(idx)
    path = path.slice(0, idx)
  }
  idx = path.indexOf('?')
  if(idx > -1) {
    let queryStr = path.slice(idx+1)
    path = path.slice(0, idx)
    queryStr.split('&').reduce((query, item) => {
      const [key, value] = item.split('=')
      query[key] = value
      return query
    }, query)
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}

function setupListener(router) {
  const eventName = router.mode === 'hash' ? 'hashchange' : 'popstate'
  window.addEventListener(eventName, (event) => {
    router.history.transitionTo(router.history.getCurrentLocation(), () => {
      console.log(`Transition to ${router.history.getCurrentLocation()} success`, 'current: ', router.app._route)
    }, () => {
      console.error(`Transition to ${router.history.getCurrentLocation()} fail!`)
    })
  })
}

/* 实现插件 */
VueRouter.install = install

export default VueRouter
