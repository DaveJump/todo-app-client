import Vue from 'vue'
import RouterFactory from './router'
import StoreFactory from './store'
import vant from 'vant'
import API from 'api'
import autoRegister from './auto-register'

import 'vant/lib/index.css'
import 'assets/scss/common.scss'
import 'assets/iconfont/iconfont.css'

import './registerServiceWorker'

Vue.use(vant)
Vue.use(autoRegister)

Vue.prototype.$API = API

export default class App {
  constructor ({
    el = '#app',
    root,
    routes,
    store
  }) {
    this.instance = null
    this.root = root
    this.el = el
    this.store = StoreFactory(store)
    this.router = RouterFactory(routes, this.store)
  }

  init () {
    this.instance = new Vue({
      render: h => h(this.root),
      router: this.router,
      store: this.store
    })
    this.instance.$mount(this.el)
  }
}
