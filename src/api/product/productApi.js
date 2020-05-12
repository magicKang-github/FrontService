import axios from '../../libs/api.request'

/**
 * 获取全部的产品类型
 * @returns {*|never}
 */
export const getTypeListRequest = () => {
  return axios.request({
    url: 'product/type/list',
    method: 'get'
  })
}
/**
 * 获取全部的标签
 * @returns {*|never}
 */
export const getTagListRequest = () => {
  return axios.request({
    url: 'product/tag/list',
    method: 'get'
  })
}
/**
 * 获取全部的产品信息
 * @returns {*|never}
 */
export const findDataActionRequest = params => {
  return axios.request({
    url: 'product/page',
    params: params,
    method: 'get'
  })
}
/**
 * 根据产品ID获取更详细的参数
 * @param pid
 * @returns {*|never}
 */
export const getProductInfoByPid = pid => {
  return axios.request({
    url: 'product/info/ID/' + pid,
    method: 'get'
  })
}
/**
 * 提交添加产品请求
 * @param params
 * @returns {*|never}
 */
export const insertProductRequest = params => {
  return axios.request({
    url: 'product/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 提交更新产品请求
 * @param params
 * @returns {*|never}
 */
export const updateProductRequest = params => {
  return axios.request({
    url: 'product/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}
/**
 * 提交删除产品请求
 * @param params
 * @returns {*|never}
 */
export const deleteProductRequest = params => {
  console.info(params)
  return axios.request({
    url: 'product/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
/**
 * 提交添加产品参数请求
 * @param params
 * @returns {*|never}
 */
export const insertParamsRequest = params => {
  return axios.request({
    url: 'product/info/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 提交修改产品参数请求
 * @param params
 * @returns {*|never}
 */
export const updateParamsRequest = params => {
  return axios.request({
    url: 'product/info/modify',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}
/**
 * 导出product Excel
 */
export const exportFile = () => {
  return axios.request({
    url: 'product/export/product',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
/**
 * 下载Excel数据模板
 */
export const importTemplateFile = () => {
  return axios.request({
    url: 'product/importTemplate/product',
    method: 'get'
  })
}

/**
 * 关联标签
 * @param params
 * @returns {*|never}
 */
export const connectionTagRequest = params => {
  return axios.request({
    url: 'product/link/tag',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 获取已经关联的标签
 * @param params
 * @returns {*|never}
 */
export const getCheckedTagRequest = data => {
  return axios.request({
    url: 'product/link/tag/checked/' + data,
    method: 'get'
  })
}
/**
 * 关联纱网
 * @param params
 * @returns {*|never}
 */
export const connectionGauzeRequest = params => {
  return axios.request({
    url: 'product/link/gauze',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 获取已经关联的纱网
 * @param params
 * @returns {*|never}
 */
export const getCheckedGauzeRequest = data => {
  return axios.request({
    url: 'product/link/gauze/checked/' + data,
    method: 'get'
  })
}/**
 * 关联配件
 * @param params
 * @returns {*|never}
 */
export const connectionPartRequest = params => {
  return axios.request({
    url: 'product/link/part',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put'
  })
}

/**
 * 获取已经关联的配件
 * @param params
 * @returns {*|never}
 */
export const getCheckedPartRequest = data => {
  return axios.request({
    url: 'product/link/part/checked/' + data,
    method: 'get'
  })
}

/**
 * 获取产品图片列表
 */
export const getImagesListRequest = () => {
  return axios.request({
    url: 'product/images/list',
    method: 'get'
  })
}

/**
 * 根据产品ID获取产品图片列表
 */
export const getImagesListByIdRequest = id => {
  return axios.request({
    url: 'product/images/list/product/' + id,
    method: 'get'
  })
}
