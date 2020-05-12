/**
 * 登录日志管理VUEX
 */
import { findDataActionRequest } from '../../../api/statistics/statistics'
import config from '../../../config/index'
import _ from 'lodash'

const { pageSize } = config
const state = {
  total: 0,
  pageIndex: 1,
  pageSize: pageSize,
  searchData: {
    id: '',
    name: '',
    ip: '',
    page: '',
    createtime: ''
  },
  data: [],
  tableColumns: [
    {
      align: 'center',
      title: '编号',
      key: 'id'
    },
    {
      align: 'center',
      title: '姓名',
      key: 'name'
    },
    {
      align: 'center',
      title: 'IP地址',
      key: 'ip'
    },
    {
      align: 'center',
      title: '访问页面',
      key: 'page'
    },
    {
      align: 'center',
      title: '访问时间',
      key: 'createtime'
    }
  ]
}

const mutations = {
}

_.keys(state).forEach((item) => {
  mutations[item] = function (state, payload) {
    state[item] = payload
  }
})

const getters = {
}

const actions = {
  findDataAction ({ commit, state }, { pageNum = 1, pageSize = state.pageSize }) {
    // return findDataActionRequest({ ...state.searchData, pageNum, pageSize }).then(({ data: { data: trueData } }) => {
    //   let { total, records, current, size } = trueData
    //   commit('data', records)
    //   commit('total', total)
    //   commit('pageIndex', current)
    //   commit('pageSize', size)
    //   return trueData
    // })
    commit('data', findDataActionRequest({ ...state.searchData, pageNum, pageSize }))
    commit('total', 5)
    commit('pageIndex', 1)
    commit('pageSize', 6)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
