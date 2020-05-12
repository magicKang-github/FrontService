import axios from '@/libs/api.request'

/**
 * 获取全部系统用户信息
 * @param params
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: '/sysUser/page',
    params: params,
    method: 'get'
  })
}
/**
 * 文件上传地址
 * @type {string}
 */
export const uploadFile = 'http://localhost:9090/api/upload/file'
/**
 * 删除请求
 * @param params
 * @returns {*|never}
 */
export const deleteFormDataRequest = params => {
  console.info(params)
  return axios.request({
    url: '/sysUser/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
/**
 * 更新请求
 * @param params
 * @returns {*|never}
 */
export const updateFormDataRequest = params => {
  console.info(JSON.stringify(params))
  return axios.request({
    url: '/sysUser/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}
/**
 * 插入请求
 * @param params
 * @returns {*|never}
 */
export const insertFormDataRequest = params => {
  console.info(JSON.stringify(params))
  return axios.request({
    url: '/sysUser/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 获取全部角色信息
 * @returns {*|never}
 */
export const getRolesRequest = () => {
  return axios.request({
    url: '/sysRole/page',
    params: {
      pageNum: 1,
      pageSize: 50
    },
    method: 'get'
  })
}
/**
 * 获取用户拥有的角色信息
 * @param params
 * @returns {*|never}
 */
export const getUserRolesRequest = uid => {
  return axios.request({
    url: '/sysRole/user/' + uid,
    method: 'get'
  })
}
/**
 * 提交用户角色信息的修改
 * @param params
 */
export const submitRolesDataRequest = params => {
  console.info(JSON.stringify(params))
  return axios.request({
    url: '/sysUser/userRole',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
