<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
require('echarts/theme/macarons') // echarts theme

export default {
	name: 'SlotsLineChart',
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
      const yNames = chartData.yNames
      const series = chartData.xSeries
      const selected = {};
      for(let i=0;i<yNames.length;i++){
      	selected[yNames[i]] = false;
      	if(i === 0){
      		selected[yNames[i]] = true;
      	}
      }
      this.chart.setOption({
        xAxis: {
          data: chartData.xDate,
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
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          show: true,
          axisTick: {
            show: false
          }
        },
        legend: {
          data: yNames,
          selected:selected//默认选中第一个
        },
        series: series
      })
    }
  }
}
</script>
