import axios from '@/libs/api.request'

/**
 * 分页获取角色数据
 * @param params
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: '/sysRole/page',
    params: params,
    method: 'get'
  })
}

/**
 * 插入角色信息
 * @param params
 * @returns {*|never}
 */
export const insertFormDataRequest = params => {
  return axios.request({
    url: '/sysRole/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 更新角色信息
 * @param params
 * @returns {*|never}
 */
export const updateFormDataRequest = params => {
  return axios.request({
    url: '/sysRole/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}
/**
 * 删除角色信息
 * @param params
 * @returns {*|never}
 */
export const deleteFormDataRequest = params => {
  return axios.request({
    url: '/sysRole/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
/**
 * 提交分配的权限信息
 * @param params
 * @returns {*|never}
 */
export const submitTreeRequest = params => {
  return axios.request({
    url: '/sysRole/roleMenu',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
