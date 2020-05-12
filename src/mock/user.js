import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'

const Random = Mock.Random

export const getMessageInit = () => {
  let unreadList = []
  doCustomTimes(3, () => {
    unreadList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  let readedList = []
  doCustomTimes(4, () => {
    readedList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  let trashList = []
  doCustomTimes(2, () => {
    trashList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  console.log({
    unread: unreadList,
    readed: readedList,
    trash: trashList
  })
  return {
    unread: unreadList,
    readed: readedList,
    trash: trashList
  }
}

export const getContentByMsgId = () => {
  return `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Random.csentence(100, 200)}</p></divcourier>`
}

export const hasRead = () => {
  return true
}

export const removeReaded = () => {
  return true
}

export const restoreTrash = () => {
  return true
}

export const messageCount = () => {
  return 3
}

export const getUserManagePage = () => {
  return {
    code: 200,
    message: '成功',
    data: {
      total: 6,
      pageSize: 3,
      pageIndex: 1,
      list: [
        {
          id: '1',
          name: 'adminName',
          account: 'admin',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          password: 'password',
          avator: 'avator',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        }
      ]
    }
  }
}
export const mock_userManage_delete = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_userManage_modify = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_userManage_insert = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_userManage_roles = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: [
      {
        id: '1',
        name: 'adminName1'
      },
      {
        id: '2',
        name: 'adminName2'
      },
      {
        id: '3',
        name: 'adminName3'
      },
      {
        id: '4',
        name: 'adminName4'
      }
    ]
  }
}
export const mock_userManage_userRoles = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: [
      {
        id: '1',
        name: 'adminName1'
      }
    ]
  }
}
export const mock_loginLog_page = () => {
  return {
    code: 200,
    message: '成功',
    data: {
      total: 2,
      pageSize: 6,
      pageIndex: 1,
      list: [
        {
          id: '1',
          name: 'adminName',
          account: 'admin',
          ip: '10.8.10.10',
          city: '北京',
          createtime: new Date()
        },
        {
          id: '2',
          name: 'test',
          account: 'test',
          ip: '10.8.10.10',
          city: '天津',
          createtime: new Date()
        }
      ]
    }
  }
}

export const mock_property_page = () => {
  return {
    code: 200,
    message: '成功',
    data: {
      total: 2,
      pageSize: 6,
      pageIndex: 1,
      list: [
        {
          id: '1',
          key: 'adminName',
          value: 'admin',
          note: '10.8.10.10',
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          key: 'test',
          value: 'test',
          note: '10.8.10.10',
          createtime: new Date(),
          updatetime: new Date()
        }
      ]
    }
  }
}
export const mock_property_modify = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_property_insert = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_functionManage_page = () => {
  return {
    code: 200,
    message: '成功',
    data: {
      total: 2,
      pageSize: 6,
      pageIndex: 1,
      list: [
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'userManage',
          name: '用户管理',
          icon: 'md-person',
          title: '用户管理123',
          component: 'userManage'
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'permissionManage',
          name: '角色管理',
          icon: 'ios-infinite',
          title: '角色管理',
          component: 'permissionManage'
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'functionManage',
          name: '功能管理',
          icon: 'ios-infinite',
          title: '功能管理',
          component: 'functionManage'
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'loginLog',
          name: '登录日志',
          icon: 'ios-infinite',
          title: '登录日志',
          component: 'loginLog'
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'message_page',
          name: '消息中心',
          icon: 'md-notifications',
          title: '消息中心',
          component: 'message'
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'property',
          name: '系统属性',
          icon: 'md-notifications',
          title: '系统属性',
          component: 'property'
        }
      ]
    }
  }
}

export const mock_permission_page = () => {
  return {
    code: 200,
    message: '成功',
    data: {
      total: 3,
      pageSize: 3,
      pageIndex: 1,
      list: [
        {
          id: '1',
          name: 'adminName',
          introduce: 'admin',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '2',
          name: 'admin',
          introduce: 'admintest',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        },
        {
          id: '3',
          name: 'test',
          introduce: 'test',
          status: 1,
          createtime: new Date(),
          updatetime: new Date()
        }
      ]
    }
  }
}
export const mock_permission_delete = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_permission_modify = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
export const mock_permission_insert = () => {
  return {
    code: 200,
    message: '成功',
    status: true,
    data: {}
  }
}
