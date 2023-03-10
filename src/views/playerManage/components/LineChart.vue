<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
require('echarts/theme/macarons') // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // {xData:[], yData:[{Name:'',Data:[]},{}]}
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.dispose()
          this.chart = null
        }
        this.initChart()
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      const chartData = this.chartData
      const yNames = []
      const series = []
      const colors = ['#FF005A', '#3888fa']
      const yShow = chartData.hasOwnProperty('yShow') ? chartData.yShow : true
      for (const o in chartData.yData) {
        const ob = chartData.yData[o]
        yNames.push(ob.Name)
        series.push({
          name: ob.Name,
          itemStyle: {
            normal: {
              color: colors[o] || null,
              lineStyle: {
                color: colors[o] || null,
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: ob.Data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        })
      }

      this.chart.setOption({
        xAxis: {
          data: chartData.xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          show: yShow,
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          show: yShow,
          axisTick: {
            show: false
          }
        },
        legend: {
          data: yNames
        },
        series: series
      })
    }
  }
}
</script>
