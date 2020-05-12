import Mock from 'mockjs'
import { logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage, getOrgData, getTreeSelectData } from './data'
import { mock_userManage_userRoles, mock_userManage_roles, mock_permission_page, mock_permission_delete, mock_permission_modify, mock_permission_insert, mock_functionManage_page, getUserManagePage, mock_property_page, mock_property_modify, mock_property_insert, mock_loginLog_page, mock_userManage_delete, mock_userManage_modify, mock_userManage_insert } from './user'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
// Mock.mock(/\/login/, login)
// Mock.mock(/\/get_menu/, getMenus)
// Mock.mock(/\/getUserMenus/, getUserMenus)
Mock.mock(/\/userManage\/page/, getUserManagePage)
Mock.mock(/\/userManage\/delete/, mock_userManage_delete)
Mock.mock(/\/userManage\/modify/, mock_userManage_modify)
Mock.mock(/\/userManage\/insert/, mock_userManage_insert)
Mock.mock(/\/userManage\/roles/, mock_userManage_roles)
Mock.mock(/\/userManage\/userRoles/, mock_userManage_userRoles)
Mock.mock(/\/image\/upload/, uploadImage)

Mock.mock(/\/log_Login\/page/, mock_loginLog_page)

Mock.mock(/\/property\/page/, mock_property_page)
Mock.mock(/\/property\/modify/, mock_property_modify)
Mock.mock(/\/property\/insert/, mock_property_insert)

// Mock.mock(/\/functionManage\/components/, mock_functionManage_components)
// Mock.mock(/\/functionManage\/icons/, mock_functionManage_icons)
Mock.mock(/\/functionManage\/page/, mock_functionManage_page)

Mock.mock(/\/permission\/page/, mock_permission_page)
Mock.mock(/\/permission\/delete/, mock_permission_delete)
Mock.mock(/\/permission\/modify/, mock_permission_modify)
Mock.mock(/\/permission\/insert/, mock_permission_insert)

Mock.mock(/\/get_info/, getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')

// Mock.mock(/\/message\/init/, getMessageInit)
// Mock.mock(/\/message\/content/, getContentByMsgId)
// Mock.mock(/\/message\/has_read/, hasRead)
// Mock.mock(/\/message\/remove_readed/, removeReaded)
// Mock.mock(/\/message\/restore/, restoreTrash)
// Mock.mock(/\/message\/count/, messageCount)

Mock.mock(/\/get_org_data/, getOrgData)
Mock.mock(/\/get_tree_select_data/, getTreeSelectData)

export default Mock
