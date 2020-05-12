/**
 * 系统属性管理VUEX
 */
import { findDataActionRequest, updateFormDataRequest, insertFormDataRequest, deleteFormDataRequest } from '../../../api/news/newsTypeApi'
import config from '../../../config/index'
import _ from 'lodash'

const { pageSize } = config
const state = {
  total: 0,
  pageIndex: 1,
  pageSize: pageSize,
  searchData: {
    id: '',
    title: '',
    author: '',
    type: '',
    status: ''
  },
  insertData: {
    name: '',
    note: '',
    status: 1
  },
  updateData: {
    id: '',
    name: '',
    note: '',
    status: ''
  },
  data: [],
  selection: [],
  tableColumns: [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '编号',
      align: 'center',
      key: 'id'
    },
    {
      title: '类型名称',
      align: 'center',
      key: 'name'
    },
    {
      title: '类型简介',
      align: 'center',
      key: 'note',
      tooltip: true
    },
    {
      title: '类型状态',
      align: 'center',
      key: 'status',
      render: (h, params) => {
        let re = ''
        if (params.row.status === 1) {
          re = '可用'
        } else if (params.row.status === 0) {
          re = '禁用(已删除)'
        }
        return h('div', re)
      }
    },
    {
      title: '创建时间',
      align: 'center',
      key: 'createtime'
    },
    {
      title: '修改时间',
      align: 'center',
      key: 'updatetime'
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
  getSelectionUpdateInfo ({ selection }) {
    return selection.length > 0 ? selection[selection.length - 1] : false
  }
}

const actions = {
  insertFormData ({ state: { insertData } }) {
    return insertFormDataRequest(insertData)
  },
  updateFormData ({ state: { updateData } }) {
    return updateFormDataRequest(updateData)
  },
  findDataAction ({ commit, state }, { pageNum = 1, pageSize = state.pageSize }) {
    state.selection.length = 0
    return findDataActionRequest({ ...state.searchData, pageNum, pageSize }).then(({ data: { data: trueData } }) => {
      let { total, records, current, size } = trueData
      records.forEach((item, index) => {
        records[index].status = item.status ? 1 : 0
      })
      commit('data', records)
      commit('total', total)
      commit('pageIndex', current)
      commit('pageSize', size)
      return trueData
    })
  },
  deleteFormData ({ state }, { ids }) {
    return deleteFormDataRequest(ids)
  },
  getModifyData ({ commit, state: { updateData }, getters: { getSelectionUpdateInfo } }) {
    let data_info = {}
    _.keys(updateData).forEach(key => {
      data_info[key] = getSelectionUpdateInfo[key]
    })
    commit('updateData', data_info)
    return Promise.resolve(getSelectionUpdateInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
