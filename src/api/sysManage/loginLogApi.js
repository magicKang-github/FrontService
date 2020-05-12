import axios from '@/libs/api.request'

export const findDataActionRequest = params => {
  return axios.request({
    url: '/sysLoginLog/page',
    params: params,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}
