/**
 * 用户管理VUEX
 */
import { findDataActionRequest, deleteFormDataRequest, updateFormDataRequest, insertFormDataRequest, getUserRolesRequest, getRolesRequest, submitRolesDataRequest } from '@/api/sysManage/userManageApi'
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
    account: '',
    status: ''
  },
  insertData: {
    name: '',
    account: '',
    password: '123456',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    status: 1
  },
  updateData: {
    id: '',
    name: '',
    account: '',
    password: '',
    avator: '',
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
      title: '姓名',
      align: 'center',
      key: 'name'
    },
    {
      title: '账户名',
      align: 'center',
      key: 'account'
    },
    {
      title: '头像',
      key: 'avator',
      align: 'center',
      render: (h, params) => {
        return h('Avatar', {
          props: {
            src: params.row.avator
          }
        })
      }
    },
    {
      title: '状态',
      align: 'center',
      key: 'status',
      render: (h, params) => {
        let re = ''
        if (params.row.status === 1) {
          re = '可用'
        } else if (params.row.status === 0) {
          re = '禁用'
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
  oldList: []
}

const mutations = {
  setAvator (state, avatorPath) {
    state.insertData.avator = avatorPath
    state.updateData.avator = avatorPath
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
    delete updateData['rePassword']
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
  getNoneRolesData ({ state }, result1) {
    return getRolesRequest().then(({ data: { data: { records: result } } }) => getRoles(JSON.stringify(result1), result))
  },
  getHaveRolesData ({ state, commit }, uid) {
    return getUserRolesRequest(uid).then(({ data: { data: trueData } }) => {
      commit('oldList', trueData)
      return trueData
    })
  },
  submitRolesData ({ state }, { list, uid }) {
    let oldIds = []
    state.oldList.forEach(item => oldIds.push(item.id))
    let newIds = []
    list.forEach(item => newIds.push(item.id))
    let delIds = []
    oldIds.forEach(item => {
      if (newIds.indexOf(item) === -1) {
        delIds.push(item)
      }
    })
    let addIds = []
    newIds.forEach(item => {
      if (oldIds.indexOf(item) === -1) {
        addIds.push(item)
      }
    })
    let params = {
      uid: [uid],
      delIds: delIds,
      addIds: addIds
    }
    return submitRolesDataRequest(params).then(data => data)
  }
}

const getRoles = (haveRole, allRoles) => {
  let haveRoles = JSON.parse(haveRole)
  let noneRoles = []
  let haveRoleMap = new Map()
  haveRoles.forEach(it => {
    haveRoleMap.set(it.id, it.name)
  })
  allRoles.forEach(item => {
    if (!haveRoleMap.has(item.id)) {
      noneRoles.push(item)
    }
  })
  return noneRoles
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
