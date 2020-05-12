import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  getCookie
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
import config from '@/config'
import { getUserMenuPromiseByUid } from '@/libs/menuTools'
import componentList from '@/libs/components.list'
const { homeName, homeRoutePath } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

/**
 * 根据服务器菜单生成对应的路由
 * @param meuns
 * @param componentsList
 * @returns {Array}
 */
const checkUserMenuRouter = (meuns, componentsList) => {
  return meuns ? meuns.map(item => {
    let { path, name, title, icon, component, children = [] } = item
    return {
      path,
      name,
      meta: {
        title: title,
        icon: icon
      },
      component: componentList[component],
      children: checkUserMenuRouter(children, componentsList)
    }
  }) : []
}

export default {
  namespaced: true,
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    routes: [],
    proto_menus: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters, rootState) => {
      return getMenuByRouter(state.routes, rootState.user.access)
    },
    errorCount: state => state.errorList.length,
    dynamicRouters: state => checkUserMenuRouter(state.proto_menus, componentList)
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setRoutes (state, routes) {
      state.routes = []
      state.routes = routes
    },
    setProtoMenus (state, menu) {
      state.proto_menus = menu
    },
    setHomeRoute (state, routes) {
      let homeRouteChild = getHomeRoute(routes, homeName)
      homeRouteChild.path = homeRoutePath
      state.homeRoute = homeRouteChild
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    handlerUserRouter ({ commit }) {
      let uid = JSON.parse(getCookie('user')).id
      return getUserMenuPromiseByUid(uid).then((data) => {
        commit('setProtoMenus', data)
        commit('setRoutes', checkUserMenuRouter(data, componentList))
      })
    }
  }
}
