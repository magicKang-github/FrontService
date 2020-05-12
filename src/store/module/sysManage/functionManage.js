/**
 * 角色管理VUEX
 */
import { findDataActionRequest, deleteFormDataRequest, updateFormDataRequest, insertFormDataRequest } from '@/api/sysManage/functionManageApi.js'
import { getMenuPromise } from '@/libs/menuTools'
import { components } from '@/libs/my-componments-list'

import config from '../../../config/index'
import _ from 'lodash'

const { pageSize } = config
const state = {
  total: 0,
  pageIndex: 1,
  pageSize: pageSize,
  menuData: [
    {
      name: 'menu',
      id: '0',
      title: '菜单',
      nodeKey: 0,
      expand: true,
      children: []
    }
  ],
  componentList: [],
  iconList: [],
  searchData: {
    id: '',
    name: '',
    status: ''
  },
  insertData: {
    pid: '',
    pname: '',
    name: '',
    path: '',
    icon: '',
    component: '',
    childrenName: '',
    childrenPath: '',
    childrenIcon: '',
    childrenComponent: ''
  },
  updateData: {
    id: '',
    name: '',
    path: '',
    icon: '',
    title: '',
    status: 1,
    component: ''
  },
  data: [],
  tableColumns: [
    {
      title: '编号',
      key: 'id',
      align: 'center'
    },
    {
      title: '名称',
      align: 'center',
      key: 'name'
    },
    {
      title: '路径',
      key: 'path',
      align: 'center',
      tooltip: true
    },
    {
      title: '图标',
      align: 'center',
      key: 'icon'
    },
    {
      title: '组件',
      align: 'center',
      key: 'component'
    },
    {
      title: '父节点ID',
      align: 'center',
      key: 'pid'
    },
    {
      title: '父节点名称',
      align: 'center',
      key: 'pname'
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
  setMenuData (state, menu) {
    state.menuData[0].children = menu
  },
  setParentNode (state, currentSelectedNode) {
    state.insertData.pid = currentSelectedNode.id
    state.insertData.pname = currentSelectedNode.title
  },
  setTableData (state, data) {
    state.data = data
  },
  setUpdateData (state, currentNode) {
    state.updateData.id = currentNode.id
    state.updateData.name = currentNode.name
    state.updateData.path = currentNode.path
    state.updateData.icon = currentNode.icon
    state.updateData.component = currentNode.component
    state.updateData.title = currentNode.name
  }
}

_.keys(state).forEach((item) => {
  mutations[item] = function (state, payload) {
    state[item] = payload
  }
})

const getters = {
}

const actions = {
  insertFormData ({ state: { insertData } }, isFirstMenu) {
    let data = []
    if (isFirstMenu) {
      let parent = {}
      let children = {}
      parent.pid = insertData.pid
      parent.pname = insertData.pname
      parent.name = insertData.name
      parent.path = '/' + insertData.path
      parent.icon = insertData.icon
      parent.title = insertData.name
      parent.component = insertData.component
      parent.status = 1
      children.pname = insertData.name
      children.name = insertData.childrenName
      children.path = insertData.childrenPath
      children.icon = insertData.childrenIcon
      children.title = insertData.childrenName
      children.component = insertData.childrenComponent
      children.status = 1
      data.push(parent, children)
    } else {
      let node = {}
      node.pid = insertData.pid
      node.pname = insertData.pname
      node.name = insertData.name
      node.path = insertData.path
      node.icon = insertData.icon
      node.title = insertData.name
      node.component = insertData.component
      node.status = 1
      data.push(node)
    }
    return insertFormDataRequest(data)
  },
  updateFormData ({ state: { updateData } }) {
    updateData.title = updateData.name
    return updateFormDataRequest(updateData)
  },
  deleteFormData ({ state }, { ids }) {
    return deleteFormDataRequest(ids)
  },
  findDataAction ({ commit, state }, { pageNum = 1, pageSize = state.pageSize }) {
    return findDataActionRequest({ ...state.searchData, pageNum, pageSize }).then(({ data: { data: trueData } }) => {
      let { total, records, current, size } = trueData
      commit('data', records)
      commit('total', total)
      commit('pageIndex', current)
      commit('pageSize', size)
      return trueData
    })
  },
  findMenuData ({ commit }) {
    return getMenuPromise().then(data => {
      commit('setMenuData', data)
    })
  },
  findComponentsData ({ commit }) {
    commit('componentList', components)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
