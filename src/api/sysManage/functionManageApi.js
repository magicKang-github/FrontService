import axios from '@/libs/api.request'

/**
 * 查找系统菜单分页的数据
 * @param params
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: '/sysMenu/page',
    params: params,
    method: 'get'
  })
}

/**
 * 添加菜单数据
 * @param params
 * @returns {*|never}
 */
export const insertFormDataRequest = params => {
  return axios.request({
    url: '/sysMenu/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}

/**
 * 修改菜单数据
 * @param params
 * @returns {*|never}
 */
export const updateFormDataRequest = params => {
  return axios.request({
    url: '/sysMenu/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 删除菜单数据
 * @param params
 * @returns {*|never}
 */
export const deleteFormDataRequest = params => {
  return axios.request({
    url: '/sysMenu/delete',
    data: params,
    method: 'delete'
  })
}
