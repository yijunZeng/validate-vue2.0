import Vue from 'vue'
import App from './App.vue'
import validator from './lib/validate'
Vue.use(validator)
new Vue({
  el: '#app',
  render: h => h(App)
})
