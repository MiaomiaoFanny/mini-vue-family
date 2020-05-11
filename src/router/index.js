import VueRouter from '../vue-router'
import Vue from 'vue'
import Home from "../views/Home";
import About from "../views/About";
import NotFound from "../views/NotFound";

window.VueRouter = VueRouter
Vue.use(VueRouter)
const routes = [
  { path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'vegs',
        name: 'Vegs',
        component: Home,
      }, {
        path: '/fruits',
        name: 'Fruits',
        component: About,
      }
    ]
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
]
const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
