import axios from '@/libs/api.request'

export const findDataActionRequest = params => {
  return axios.request({
    url: '/api/news/page',
    params: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}

export const getTypeListRequest = () => {
  return axios.request({
    url: '/api/news/type/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}

export const insertFormDataRequest = params => {
  return axios.request({
    url: '/api/news/insert',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}

export const deleteFormDataRequest = params => {
  return axios.request({
    url: '/api/news/delete',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })
}
