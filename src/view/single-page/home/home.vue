<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="上周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example ref="lineComponents" style="height: 310px; " :chartData="series"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { countIndex } from '../../../api/statistics/statistics'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      lineData: {},
      series: [],
      barData: {}
    }
  },
  created () {
    this.countIndex()
  },
  methods: {
    countIndex () {
      countIndex().then(({ data: { data, status, msg } }) => {
        if (status) {
          this.inforCardData = [
            { title: '新增用户', icon: 'md-person-add', count: data.newUser, color: '#2d8cf0' },
            { title: '前台访问量', icon: 'md-locate', count: data.fontCount, color: '#19be6b' },
            { title: '小程序访问量', icon: 'md-help-circle', count: data.weChatCount, color: '#ff9900' },
            { title: '累计访问量', icon: 'md-share', count: data.totalCount, color: '#ed3f14' },
            { title: '互动量', icon: 'md-chatbubbles', count: data.messageCount, color: '#E46CBB' },
            { title: '总页面数', icon: 'md-map', count: data.pageTotal, color: '#9A66E4' }
          ]
          this.barData = {
            '周一': data.week.Mon,
            '周二': data.week.Tue,
            '周三': data.week.Wed,
            '周四': data.week.Thu,
            '周五': data.week.Fri,
            '周六': data.week.Sat,
            '周日': data.week.Sun
          }
          this.lineData.weekWeChatIndex = [data.weekWeChatIndex.Mon, data.weekWeChatIndex.Tue, data.weekWeChatIndex.Wed, data.weekWeChatIndex.Thu, data.weekWeChatIndex.Fri, data.weekWeChatIndex.Sat, data.weekWeChatIndex.Sun]
          this.lineData.weekWeChatProduct = [data.weekWeChatProduct.Mon, data.weekWeChatProduct.Tue, data.weekWeChatProduct.Wed, data.weekWeChatProduct.Thu, data.weekWeChatProduct.Fri, data.weekWeChatProduct.Sat, data.weekWeChatProduct.Sun]
          this.lineData.weekWeChatLogin = [data.weekWeChatLogin.Mon, data.weekWeChatLogin.Tue, data.weekWeChatLogin.Wed, data.weekWeChatLogin.Thu, data.weekWeChatLogin.Fri, data.weekWeChatLogin.Sat, data.weekWeChatLogin.Sun]
          this.lineData.weekWebIndex = [data.weekWebIndex.Mon, data.weekWebIndex.Tue, data.weekWebIndex.Wed, data.weekWebIndex.Thu, data.weekWebIndex.Fri, data.weekWebIndex.Sat, data.weekWebIndex.Sun]
          this.lineData.weekWebProduct = [data.weekWebProduct.Mon, data.weekWebProduct.Tue, data.weekWebProduct.Wed, data.weekWebProduct.Thu, data.weekWebProduct.Fri, data.weekWebProduct.Sat, data.weekWebProduct.Sun]
          this.series = [
            {
              name: '微信小程序/首页',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {
                color: '#2d8cf0'
              } },
              data: this.lineData.weekWeChatIndex
            },
            {
              name: '微信小程序/产品',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {
                color: '#10A6FF'
              } },
              data: this.lineData.weekWeChatProduct
            },
            {
              name: '微信小程序/授权登录',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {
                color: '#0C17A6'
              } },
              data: this.lineData.weekWeChatLogin
            },
            {
              name: '前台展示/首页',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {
                color: '#4608A6'
              } },
              data: this.lineData.weekWebIndex
            },
            {
              name: '前台展示/产品',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              areaStyle: { normal: {
                color: '#398DBF'
              } },
              data: this.lineData.weekWebProduct
            }
          ]
          this.$refs.lineComponents.drawCharts()
        } else {
          console.log(msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
