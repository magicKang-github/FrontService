import axios from '@/libs/api.request'

/**
 * 查询
 * @param params
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: '/product/gauze/page',
    params: params,
    method: 'get'
  })
}

/**
 * 修改
 * @param params
 * @returns {*|never}
 */
export const updateFormDataRequest = params => {
  return axios.request({
    url: '/product/gauze/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 添加
 * @param params
 * @returns {*|never}
 */
export const insertFormDataRequest = params => {
  return axios.request({
    url: '/product/gauze/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 删除
 * @param params
 * @returns {*|never}
 */
export const deleteFormDataRequest = params => {
  return axios.request({
    url: '/product/gauze/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
