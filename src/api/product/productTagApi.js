import axios from '@/libs/api.request'

/**
 * 查询系统属性值
 * @param params
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: '/product/tag/page',
    params: params,
    method: 'get'
  })
}

/**
 * 修改系统属性值
 * @param params
 * @returns {*|never}
 */
export const updateFormDataRequest = params => {
  return axios.request({
    url: '/product/tag/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 添加系统属性值
 * @param params
 * @returns {*|never}
 */
export const insertFormDataRequest = params => {
  return axios.request({
    url: '/product/tag/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 删除系统属性值
 * @param params
 * @returns {*|never}
 */
export const deleteFormDataRequest = params => {
  return axios.request({
    url: '/product/tag/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
