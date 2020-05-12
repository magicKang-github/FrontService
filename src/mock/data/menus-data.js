/**
 * title: title标题
 * path: URL路径
 * icon: 当前菜单节点的icon
 * component: 当前节点的页面组件 组件在src/libs/components.list.js文件中声明
 * hideInMenu: 是否在菜单栏隐藏
 * notCache: 是否缓存
 */
export default {
  data: [
    {
      pid: 0,
      pname: '菜单',
      nodeKey: 1,
      path: '/join',
      name: 'QQ群菜单',
      icon: '_qq',
      title: 'QQ群菜单',
      component: 'main',
      children: [
        {
          pid: 1,
          pname: 'QQ群',
          nodeKey: 2,
          path: 'join_page',
          name: 'QQ群',
          icon: '_qq',
          title: 'QQ群',
          component: 'join',
          children: []
        }
      ]
    },
    {
      pid: 0,
      pname: '菜单',
      nodeKey: 3,
      path: '/sysManage',
      name: '系统管理',
      icon: 'md-cog',
      title: '系统管理',
      component: 'main',
      children: [
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'userManage',
          name: '用户管理',
          icon: 'md-person',
          title: '用户管理123',
          component: 'userManage',
          children: []
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 4,
          path: 'permissionManage',
          name: '角色管理',
          icon: 'ios-infinite',
          title: '角色管理',
          component: 'permissionManage',
          children: []
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 5,
          path: 'functionManage',
          name: '功能管理',
          icon: 'ios-infinite',
          title: '功能管理',
          component: 'functionManage',
          children: []
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 6,
          path: 'loginLog',
          name: '登录日志',
          icon: 'ios-infinite',
          title: '登录日志',
          component: 'loginLog',
          children: []
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 7,
          path: 'message_page',
          name: '消息中心',
          icon: 'md-notifications',
          title: '消息中心',
          component: 'message',
          children: []
        },
        {
          pid: 3,
          pname: '系统管理',
          nodeKey: 8,
          path: 'property',
          name: '系统属性',
          icon: 'md-notifications',
          title: '系统属性',
          component: 'property',
          children: []
        }
      ]
    }
  ]
}
