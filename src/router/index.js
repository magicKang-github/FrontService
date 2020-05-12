import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, setTitle } from '@/libs/util'
import config from '@/config'
import _ from 'lodash'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

/**
 * 跳转处理
 * @param to
 * @param next
 */
const turnTo = (to, next) => {
  // console.info(to)
  // console.info(_.isEmpty(to.matched))
  // console.info(store.state.app.routes.length)
  if (store.state.app.routes.length <= 0) {
    // console.info('没有菜单时，加载菜单的路由跳转')
    store.dispatch('app/handlerUserRouter').then(() => {
      let routers = [...store.getters['app/dynamicRouters']]
      // TODO 除去重复的动态路由
      router.addRoutes(routers)
      _.isEmpty(to.matched) ? next(to.path) : next()
    })
  } else {
    // console.info('登录成功之后的操作')
    next()
  }
}

/**
 * 路由跳转前的处理
 */
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  // console.info('登录token:' + token + '  --路径：' + to.path)
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({ name: LOGIN_PAGE_NAME })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    next()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({ name: homeName })
  } else {
    turnTo(to, next)
  }
})

/**
 * 路由跳转后的处理
 */
router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
