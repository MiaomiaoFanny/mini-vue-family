import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './styles/main.css'
Vue.config.productionTip = false

window.store = store
window.router = router
window.vm = new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
