import { getParams } from '@/libs/util'
const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

const USERS = {
  admin: {
    name: 'admin',
    id: '1',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    status: true
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return typeof USERS[req.userName] === 'undefined' ? { code: 200, data: [], status: false, message: '用户名密码错误' } : { code: 200, data: USERS[req.userName], status: true, message: '登录成功，加载系统中...' }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}
