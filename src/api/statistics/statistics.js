import axios from '@/libs/api.request'

export const findDataActionRequest = params => {
  return axios.request({
    url: '/statistics/page',
    params: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}

export const countIndex = () => {
  return axios.request({
    url: '/statistics/index',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}

export const typeListRequest = () => {
  return axios.request({
    url: '/statistics/type/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}

export const getLineDataByPage = params => {
  let ids = params.pageIds
  return axios.request({
    url: '/statistics/charts/lineChart/' + params.week,
    data: ids,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

export const getHistogramDataByPage = params => {
  return axios.request({
    url: '/statistics/charts/histogram',
    params: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
}
