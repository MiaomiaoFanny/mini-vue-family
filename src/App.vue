<template>
  <div id="app">
    <h1>Vue Router Demo</h1>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <p>$route: {{$route && $route.path}}</p>
    <hr/>
    <router-view></router-view>
    <img alt="Vue logo" src="./assets/logo.png">
    <hr/>
    <VuexDemo></VuexDemo>
    <hr/>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import VuexDemo from './components/Vuex.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld, VuexDemo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
