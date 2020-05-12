<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  props: {
    chartData: Array,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    drawCharts () {
      this.$nextTick(() => {
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            top: '3%',
            left: '1.2%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: this.chartData
        }
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.drawCharts()
  },
  watch: {
    chartData () {
      this.drawCharts()
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
