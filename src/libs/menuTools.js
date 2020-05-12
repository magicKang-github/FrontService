import { getMenus, getUserMenus, getUserMenusByUid } from '@/api/user'

/**
 * 获取菜单的数据处理,组装成菜单树的数组结构
 * @param menuData
 * @returns {Array}
 */
export const getMenu = menuData => {
  let menu = []
  let menuChildrens = []
  let parentMenusMap = new Map()
  let index = 0
  menuData.forEach(item => {
    item.children = []
    if (item.pid === 0) {
      menu.push(item)
      parentMenusMap.set(item.id, index)
      index++
    } else {
      menuChildrens.push(item)
    }
  })
  menuChildrens.forEach(item => {
    if (parentMenusMap.has(item.pid)) {
      menu[parentMenusMap.get(item.pid)].children.push(item)
    }
  })
  return menu
}

/**
 * 获取菜单的请求
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getMenuRequest = () => getMenus().then(({ data: result }) => (result.status && result.code === 200) ? result.data : [])

/**
 * 获取菜单的对象
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getMenuPromise = () => getMenuRequest().then(result => getMenu(result))

/**
 * 获取ID为uid角色权限下的菜单请求
 * @param uid
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getUserMenuRequest = uid => getUserMenus(uid).then(({ data: result }) => (result.status && result.code === 200) ? result.data : [])

/**
 * 获取ID为uid角色权限下的菜单对象
 * @param uid
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getUserMenuPromise = uid => getUserMenuRequest(uid).then(result => getMenu(result))

/**
 * 获取ID为uid用户权限下的菜单请求
 * @param uid
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getUserMenuRequestByUid = uid => getUserMenusByUid(uid).then(({ data: result }) => (result.status && result.code === 200) ? result.data : [])

/**
 * 获取ID为uid用户权限下的菜单对象
 * @param uid
 * @returns {PromiseLike<Array | never> | Promise<Array | never>}
 */
export const getUserMenuPromiseByUid = uid => getUserMenuRequestByUid(uid).then(result => getMenu(result.sort((a, b) => a.id - b.id)))

/**
 * 获取ID为uid用户权限下，可以增加的权限菜单对象
 * @param uid
 */
export const getAbleMenuPromise = uid => {
  return getUserMenuRequest(uid).then(result => (result.length === 0) ? getMenuPromise() : getMenuRequest().then(menus => getAbleMenu(result, menus)))
}

/**
 * 获取可利用的菜单树
 * @param userMenu
 * @param menus
 * @returns {*}
 */
export const getAbleMenu = (userMenu, menus) => {
  if (userMenu.length === menus.length) {
    return getMenu([])
  }
  if (userMenu.length === 0) {
    return getMenu(menus)
  }
  let menu = []
  let userMenuChild = []
  let status = false
  // 查找子节点
  userMenu.forEach(item => {
    if (item.pid !== 0) {
      userMenuChild.push(item)
    }
  })
  // 剔除存在的子节点
  menus.forEach(item => {
    userMenuChild.forEach(itemChild => {
      if (item.id === itemChild.id) {
        status = true
      }
    })
    if (!status) {
      menu.push(item)
    }
    status = false
  })
  // 剔除不存在子节点的父节点
  let menuTreeCache = getMenu(menu)
  let menuTree = menuTreeCache.slice()
  menuTreeCache.forEach((item, index) => {
    if (item.children.length === 0) {
      menuTree.splice(index, 1)
    }
  })
  return menuTree
}

/**
 * 将权限功能树中的currentNode节点插入至用户权限树中
 * @param userMenu
 * @param menus
 * @param currentNode
 */
export const moveMenu = (userMenu, menus, currentNode) => {
  let _menus = []
  let userMenuFirstNodeMap = new Map()
  userMenu.forEach((item, index) => {
    userMenuFirstNodeMap.set(item.id, index)
  })
  if (currentNode.pid === 0) {
    menus.forEach(item => {
      if (item.nodeKey === currentNode.nodeKey) {
        if (userMenuFirstNodeMap.has(currentNode.id)) {
          item.children.forEach(it => {
            userMenu[userMenuFirstNodeMap.get(currentNode.id)].children.push(it)
          })
        } else {
          userMenu.push(item)
        }
      } else {
        _menus.push(item)
      }
    })
  } else {
    let isFind = 0
    let menuCache = []
    let menuData = menus.slice()
    menus.forEach((menu, index) => {
      menu.children.forEach(item => {
        if (item.nodeKey === currentNode.nodeKey) {
          if (userMenuFirstNodeMap.has(currentNode.pid)) {
            isFind = menu.children.length === 1 ? 1 : 2
            userMenu[userMenuFirstNodeMap.get(currentNode.pid)].children.push(item)
          } else {
            isFind = menu.children.length === 1 ? 1 : 2
            menuData[index].children = []
            menuData[index].children.push(item)
            let selectedData = JSON.parse(JSON.stringify(menuData[index]))
            selectedData.children[0].selected = false
            userMenu.push(selectedData)
          }
        } else {
          menuCache.push(item)
        }
      })
      if (isFind === 1) {

      } else if (isFind === 2) {
        menuData[index].children = menuCache
        _menus.push(menuData[index])
      } else {
        _menus.push(menuData[index])
      }
      isFind = 0
      menuCache = []
    })
  }
  return [ userMenu, _menus ]
}

export const treeToData = (tree) => {
  let data = []
  tree.forEach(item => {
    if (item.children && item.children.length > 1) {
      item.children.forEach(it => {
        delete it['children']
        data.push(it)
      })
      delete item['children']
      data.push(item)
    }
  })
  return data
}
