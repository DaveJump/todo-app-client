const home = () => import(/* webpackChunkName: "index-home" */ './views/index.vue')
const todoDetail = () => import(/* webpackChunkName: "todo-detail" */ './views/todos/add.vue')
const settings = () => import(/* webpackChunkName: "settings" */ './views/settings/index.vue')
const changePwd = () => import(/* webpackChunkName: "change-pwd" */ './views/settings/change-pwd.vue')
const login = () => import(/* webpackChunkName: "login" */ './views/users/login.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/todo/:todoId',
    name: 'todoDetail',
    component: todoDetail,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/settings/change-pwd',
    name: 'changePwd',
    component: changePwd,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
]

export default routes
