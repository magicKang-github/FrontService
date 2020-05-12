/**
 * 角色管理VUEX
 */
import { findDataActionRequest, deleteFormDataRequest, updateFormDataRequest, insertFormDataRequest, submitTreeRequest } from '@/api/sysManage/permissionManageApi.js'
import { getUserMenuPromise, getAbleMenuPromise, moveMenu } from '@/libs/menuTools'
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
    status: ''
  },
  insertData: {
    name: '',
    introduce: '',
    status: 1
  },
  updateData: {
    id: '',
    name: '',
    introduce: '',
    status: 1
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
      title: '名称',
      align: 'center',
      key: 'name'
    },
    {
      title: '描述',
      align: 'center',
      key: 'introduce'
    },
    {
      title: '状态',
      align: 'center',
      key: 'status',
      render: (h, params) => {
        let re = ''
        if (params.row.status === 1) {
          re = '可用'
        } else {
          re = '不可用'
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
  ],
  haveMenuData: [
    {
      name: 'menu',
      title: '菜单',
      nodeKey: 0,
      expand: true,
      children: []
    }
  ],
  noneMenuData: [
    {
      name: 'menu',
      title: '菜单',
      nodeKey: 0,
      expand: true,
      children: []
    }
  ],
  haveIds: []
}

const mutations = {
  sethaveMenuData (state, menu) {
    state.haveMenuData[0].children = menu
  },
  setnoneMenuData (state, menu) {
    state.noneMenuData[0].children = menu
  },
  setHaveMenu (state, menu) {
    state.haveMenuData = menu
  },
  setNoneMenu (state, menu) {
    state.noneMenuData = menu
  },
  insertTreeNodeJs (state, currentNode) {
    let [userMenu, menus] = moveMenu(state.haveMenuData[0].children.slice(), state.noneMenuData[0].children.slice(), currentNode)
    state.haveMenuData[0].children = userMenu
    state.noneMenuData[0].children = menus
  },
  deleteTreeNodeJs (state, currentNode) {
    let [userMenu, menus] = moveMenu(state.noneMenuData[0].children.slice(), state.haveMenuData[0].children.slice(), currentNode)
    state.haveMenuData[0].children = menus
    state.noneMenuData[0].children = userMenu
  }
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
  deleteFormData ({ state }, { ids }) {
    return deleteFormDataRequest(ids)
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
  getModifyData ({ commit, state: { updateData }, getters: { getSelectionUpdateInfo } }) {
    let data_info = {}
    _.keys(updateData).forEach(key => {
      data_info[key] = getSelectionUpdateInfo[key]
    })
    commit('updateData', data_info)
    return Promise.resolve(getSelectionUpdateInfo)
  },
  findMenuData ({ commit }, uid) {
    return getUserMenuPromise(uid).then(result => {
      commit('sethaveMenuData', result)
      let ids = []
      result.forEach(item => {
        ids.push(item.id)
        item.children.forEach(it => {
          ids.push(it.id)
        })
      })
      commit('haveIds', ids)
      getAbleMenuPromise(uid).then(result => {
        commit('setnoneMenuData', result)
      })
    })
  },
  submitTreeData ({ state }, uid) {
    let ids = []
    state.haveMenuData[0].children.forEach(item => {
      ids.push(item.id)
      item.children.forEach(it => {
        ids.push(it.id)
      })
    })
    let oldIds = state.haveIds
    let delIds = []
    let addIds = []
    ids.forEach(id => {
      if (oldIds.indexOf(id) === -1) {
        addIds.push(id)
      }
    })
    oldIds.forEach(id => {
      if (ids.indexOf(id) === -1) {
        delIds.push(id)
      }
    })
    let params = {
      rid: [uid],
      delIds: delIds,
      addIds: addIds
    }
    return submitTreeRequest(params).then(({ data }) => data.status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
