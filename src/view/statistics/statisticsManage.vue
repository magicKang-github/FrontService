<template>
  <card style="height: 100%" >
    <Tabs value="name1">
      <TabPane label="详细数据表" name="name1">
        <!-- 主页面数据 -->
        <!-- 查询框 -->
        <Form ref="findForm" :model="searchData" :label-width="80" inline style="margin-top: 20px;">
          <FormItem label="编号：" prop="id">
            <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 180px" />
          </FormItem>
          <FormItem label="名称：" prop="name">
            <Input  v-model="searchData.name" placeholder="请输入名称..." clearable style="width: 180px" />
          </FormItem>
          <FormItem label="IP地址：" prop="ip">
            <Input  v-model="searchData.ip" placeholder="请输入IP地址..." clearable style="width: 180px" />
          </FormItem>
          <FormItem label="访问页面：" prop="page">
            <Select v-model="searchData.page" placeholder="请选择访问页面..." clearable style="width:180px">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="访问时间：" prop="createtime">
            <DatePicker @on-change="changeDate" type="daterange" placement="bottom-end" placeholder="选择时间段..." style="width: 180px"></DatePicker>
          </FormItem>
          <FormItem>
            <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
            <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
          </FormItem>
        </Form>
        <!-- 数据表格 -->
        <Table :columns="tableColumns" :data="data" style="margin-top: 20px;">
          <div style="margin: 10px;overflow: hidden" slot="footer">
            <div style="float: right;">
              <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
            </div>
          </div>
        </Table>
      </TabPane>

      <!-- 统计折线图 -->
      <TabPane label="统计折线图" name="name2">
        <Form ref="lineChartsForm" :model="searchData" :label-width="100" inline style="margin-top: 20px;">
          <FormItem label="统计的页面：" prop="createtime">
            <Select v-model="checkedPages" multiple style="width:260px" placeholder="请选择统计的页面（支持多选）...">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="访问时间段：" prop="createtime">
            <Select v-model="checkedTime" style="width:260px" placeholder="请选择用户访问的时间段...">
              <Option value="0">本周</Option>
              <Option value="1">上一周</Option>
              <Option value="2">上上周</Option>
              <Option value="3">前三周</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('lineChartsForm')">查询</Button>
          </FormItem>
        </Form>
        <example ref="lineComponents" style="height: 400px;margin-top: 20px;" :chartData="series"/>
      </TabPane>

      <!-- 统计柱状图 -->
      <TabPane label="统计柱状图" name="name3">
        <Form ref="histogramForm" :model="searchData" :label-width="100" inline style="margin-top: 20px;">
          <FormItem label="统计的页面：" prop="page">
            <Select v-model="checkedPage" style="width:260px">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="访问时间段：" prop="createtime">
            <Select v-model="checkedPageTime" style="width:260px" placeholder="请选择用户访问的时间段...">
              <Option value="0">本周</Option>
              <Option value="1">上一周</Option>
              <Option value="2">上上周</Option>
              <Option value="3">前三周</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('histogramForm')">查询</Button>
          </FormItem>
        </Form>
        <chart-bar ref="histogram" style="height: 300px;margin-top: 20px;" :value="barData" text="每周用户活跃量"/>
      </TabPane>

      <!-- 统计圆饼图 -->
      <TabPane label="统计圆饼图" name="name4">
        <chart-pie style="height: 300px;margin-top: 20px;" :value="pieData" text="用户访问来源"></chart-pie>
      </TabPane>

      <!-- 统计数据表 -->
<!--      <TabPane label="统计数据表" name="name5">-->
<!--        统计数据表-->
<!--      </TabPane>-->
    </Tabs>
  </card>
</template>
<script>
import { ChartPie, ChartBar } from '_c/charts'
import Example from '../single-page/home/example'
import { findDataActionRequest, typeListRequest, getLineDataByPage, getHistogramDataByPage } from '../../api/statistics/statistics'
import config from '../../config/index'
import { colorList } from '../../libs/colorList'
const { pageSize } = config

export default {
  name: 'statisticsManage',
  components: {
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      total: 0,
      pageIndex: 1,
      pageSize: pageSize,
      searchData: {
        id: '',
        name: '',
        ip: '',
        page: ''
      },
      data: [],
      tableColumns: [
        {
          align: 'center',
          title: '编号',
          key: 'id'
        },
        {
          align: 'center',
          title: '姓名',
          key: 'name'
        },
        {
          align: 'center',
          title: 'IP地址',
          key: 'ip'
        },
        {
          align: 'center',
          title: '访问页面',
          key: 'page'
        },
        {
          align: 'center',
          title: '访问时间',
          key: 'createtime'
        }
      ],
      searchTime: {
        startTime: '',
        endTime: ''
      },
      typeList: [],
      series: [],

      submitRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '前台访问量', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '小程序访问量', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '累计访问量', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '互动量', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '总页面数', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {},

      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      checkedPages: [],
      checkedTime: 0,
      checkedPage: 0,
      checkedPageTime: 0
    }
  },
  created () {
    this.findDataAction()
    this.findTypeList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this[name]({})
        } else {
          this.$Message.error('表单数据验证失败')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.findDataAction()
    },
    changePage (pageNum) {
      this.pageIndex = pageNum
      this.findDataAction()
    },
    findForm () {
      this.findDataAction()
    },
    findDataAction () {
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        startTime: this.searchTime.startTime,
        endTime: this.searchTime.endTime
      }
      findDataActionRequest({ ...this.searchData, ...params }).then(({ data: { data: trueData } }) => {
        let { total, records, current, size } = trueData
        records.forEach((item, index) => {
          records[index].status = item.status ? 1 : 0
        })
        this.data = records
        this.total = total
        this.pageIndex = current
        this.pageSize = size
      })
    },
    findTypeList () {
      typeListRequest().then(({ data: { data: trueData } }) => {
        this.typeList = trueData
      })
    },
    lineChartsForm () {
      let params = {
        pageIds: this.checkedPages,
        week: this.checkedTime
      }
      getLineDataByPage(params).then(({ data: { data, status, msg } }) => {
        if (status) {
          this.series = []
          data.forEach((item, index) => {
            let lineData = {
              name: item.pageInfo.name,
              type: 'line',
              stack: '总量',
              areaStyle: { normal: { color: colorList[index] } },
              data: [item.week.Sun, item.week.Mon, item.week.Tue, item.week.Wed, item.week.Thu, item.week.Fri, item.week.Sat]
            }
            this.series.push(lineData)
          })
          this.$refs.lineComponents.drawCharts()
        } else {
          console.log(msg)
        }
      })
    },
    histogramForm () {
      let params = {
        pageId: this.checkedPage,
        week: this.checkedTime
      }
      getHistogramDataByPage({ ...params }).then(({ data: { data, status, msg } }) => {
        if (status) {
          this.barData = {
            '周日': data.Sun,
            '周一': data.Mon,
            '周二': data.Tue,
            '周三': data.Wed,
            '周四': data.Thu,
            '周五': data.Fri,
            '周六': data.Sat
          }
          this.$refs.histogram.drawCharts()
        } else {
          console.log(msg)
        }
      })
    },
    changeDate (time) {
      this.searchTime.startTime = time[0]
      this.searchTime.endTime = time[1]
    }
  }
}
</script>
<style>
  .demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
