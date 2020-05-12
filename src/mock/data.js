import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
import orgData from './data/org-data'
import { treeData } from './data/tree-select'
import { virtualMenuData, userMenuData } from '../mock/data/virtualMenuData'

const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const uploadImage = req => {
  // return req.body.get('croppedImg')
  return '/image/123.png'
}

export const getOrgData = req => {
  return orgData
}

export const getTreeSelectData = req => {
  return treeData
}

export const getMenus = req => {
  return {
    code: 200,
    status: true,
    data: virtualMenuData
  }
}

export const getUserMenus = req => {
  return {
    code: 200,
    status: true,
    data: userMenuData
  }
}
