/**
 * 登录日志管理VUEX
 */
import { findDataActionRequest } from '@/api/sysManage/loginLogApi.js'
import config from '../../../config/index'
import _ from 'lodash'

const { pageSize } = config
const state = {
  total: 0,
  pageIndex: 1,
  pageSize: pageSize,
  sysUser: {
    name: '',
    account: ''
  },
  searchData: {
    id: '',
    sysUser: {},
    cip: '',
    cname: ''
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
      title: '账户名',
      key: 'account'
    },
    {
      align: 'center',
      title: 'IP地址',
      key: 'cip'
    },
    {
      align: 'center',
      title: '城市位置',
      key: 'cname'
    },
    {
      align: 'center',
      title: '创建时间',
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
    let params = {
      pageNum: pageNum,
      pageSize: pageSize,
      id: state.searchData.id,
      cip: state.searchData.cip,
      cname: state.searchData.cname,
      'sysUser.name': typeof state.searchData.sysUser.name === 'undefined' ? '' : state.searchData.sysUser.name,
      'sysUser.account': typeof state.searchData.sysUser.account === 'undefined' ? '' : state.searchData.sysUser.account
    }
    return findDataActionRequest(params).then(({ data: { data: trueData } }) => {
      let { total, records, current, size } = trueData
      records.forEach((item, index) => {
        let it = JSON.parse(JSON.stringify(item))
        delete it.sysUser
        it.name = item.sysUser.name
        it.account = item.sysUser.account
        records[index] = it
      })
      commit('data', records)
      commit('total', total)
      commit('pageIndex', current)
      commit('pageSize', size)
      return trueData
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
