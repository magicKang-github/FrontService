import axios from '@/libs/api.request'

/**
 * 登录
 * @param userName
 * @param password
 * @returns {*|never|AxiosPromise<any>|void}
 */
export const login = ({ userName, password }) => {
  return axios.request({
    url: 'sysUser/login',
    data: {
      userName: userName,
      password: password
    },
    method: 'post'
  })
}

/**
 * 获取系统中全部的菜单信息
 * @returns {*|never}
 */
export const getMenus = () => {
  return axios.request({
    url: 'sysMenu/menus',
    method: 'get'
  })
}

/**
 * 根据角色ID（uid）获取该用户权限下的菜单请求
 * @param uid
 * @returns {*|never}
 */
export const getUserMenus = uid => {
  return axios.request({
    url: 'sysMenu/role/' + uid,
    method: 'get'
  })
}

/**
 * 根据用户ID（uid）获取该用户权限下的菜单请求
 * @param uid
 * @returns {*|never}
 */
export const getUserMenusByUid = uid => {
  return axios.request({
    url: 'sysMenu/user/' + uid,
    method: 'get'
  })
}

/**
 * 获取用户IP信息，这里需要跨域，不使用此方法
 * @returns {*|never|AxiosPromise<any>|void}
 */
export const getIPCity = () => {
  return axios.request({
    url: 'http://pv.sohu.com/cityjson',
    method: 'get'
  })
}

/**
 * 请求后端记录登录成功之后的日志信息
 * @param data
 * @returns {*|never|AxiosPromise<any>|void}
 */
export const recordLoginLog = data => {
  return axios.request({
    url: 'sysLoginLog/log/' + data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

/**
 * 获取未读消息的记录数
 * @returns {*|never}
 */
export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

/**
 * 获取全部消息
 * @returns {*|never}
 */
export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

/**
 * 根据消息ID获取消息内容
 * @param msg_id
 * @returns {*|never}
 */
export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

/**
 * 根据消息ID将消息设置为已读
 * @param msg_id
 * @returns {*|never}
 */
export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'get',
    params: {
      msg_id
    }
  })
}

/**
 * 根据消息ID将已读消息放至回收站
 * @param msg_id
 * @returns {*|never}
 */
export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'get',
    params: {
      msg_id
    }
  })
}

/**
 * 将回收站消息恢复至已读
 * @param msg_id
 * @returns {*|never}
 */
export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'get',
    params: {
      msg_id
    }
  })
}
