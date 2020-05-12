import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import userManage from './module/sysManage/userManage'
import functionManage from './module/sysManage/functionManage'
import permissionManage from './module/sysManage/permissionManage'
import loginLog from './module/sysManage/loginLog'
import property from './module/sysManage/property'
import sysImages from './module/sysManage/sysImages'

import product from './module/product/productManage'
import productTag from './module/product/productTag'
import productType from './module/product/productType'
import productPart from './module/product/productPart'
import productGauze from './module/product/productGauze'

import newsType from './module/news/newsType'
import newsManage from './module/news/newsManage'

import statistics from './module/statistics/statisticsManage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    userManage,
    functionManage,
    permissionManage,
    loginLog,
    property,
    product,
    productTag,
    productType,
    sysImages,
    newsType,
    productPart,
    statistics,
    productGauze,
    newsManage
  }
})
