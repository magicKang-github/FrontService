export default {
  main: () => import('@/components/main'),
  login: () => import('@/view/login/login.vue'),
  home: () => import('@/view/single-page/home'),
  join: () => import('@/view/join-page.vue'),

  /**
   * 系统设置
   */
  userManage: () => import('@/view/sysManage/userManage'),
  permissionManage: () => import('@/view/sysManage/permissionManage'),
  functionManage: () => import('@/view/sysManage/functionManage'),
  message: () => import('@/view/single-page/message/index'),
  loginLog: () => import('@/view/sysManage/loginLog'),
  property: () => import('@/view/sysManage/property'),
  sysImages: () => import('@/view/sysManage/sysImages'),

  /**
   * 产品中心
   */
  productManage: () => import('@/view/product/productManage'),
  productTag: () => import('@/view/product/productTag'),
  productType: () => import('@/view/product/productType'),
  productPart: () => import('@/view/product/productPart'),
  productGauze: () => import('@/view/product/productGauze'),

  /**
   * 新闻中心
   */
  newsManage: () => import('@/view/news/newsManage'),
  newsType: () => import('@/view/news/newsType'),

  /**
   * 统计中心
   */
  statisticsManage: () => import('@/view/statistics/statisticsManage')
}
