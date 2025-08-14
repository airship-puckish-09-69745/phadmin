<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import LineChart from '../../playerManage/components/LineChart'
import { $libShow } from '@/utils/common'
import store from '@/store'

function NewPlaying() {
  return {
    xData: [],
    yData: [
      { Name: '今日', Data: [] },
    ],
    yShow: true
  }
}

export default {
  name: 'OnlineData',
  // eslint-disable-next-line vue/no-unused-components
  components: { LineChart },
  data() {
    return {
      item: {
        date: new Date().getTime()-86400*1000
      },
      libShow: $libShow,
      chartData: NewPlaying(),
      env: 'test',
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    this.getInfo()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    // 查询在玩数据
    getInfo() {
      if (this.env != 'test') {
        return
      }
      const $this = this
      const data = {
        Env: $this.env,
        Path: '/misc/tongits/cheat/curve',
        queryTime: Math.floor($this.item.date/1000),
        score: 200,
      }
      console.log("data", JSON.stringify(data))
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: data
      }).then(response => {
        const chartData = NewPlaying()
        if (response.RetCode === 0) {
          chartData['yData'][0]['Name'] = new Date($this.item.date).toJSON().split('T')[0]
          chartData['yData'][0]['Data'] = response.Data
          for (const i in response.Data) {
            chartData['xData'].push((5*i).toString())
          }
          $this.chartData = chartData
        }
      })
    }
  }
}
</script>
<style>
.el-table .warning-row {
background: oldlace;
}

.el-table .fail-row {
background: #999999;
}

.el-table .success-row {
background: #f0f9eb;
}
</style>
<style lang="scss" scoped>
.panel-group {
  margin-top: 10px;

.card-panel-col {
  margin-bottom: 10px;
  &:hover {
    .card-panel{
      background: #90EE90;
    }
  }
}

.card-panel_selected {
  background: #90EE90;
}

.card-panel_selected_not {
  background: #fff;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);

.card-panel-description {
  float: left;
  padding-left: 5px;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;

.card-panel-text {
  line-height: 18px;
  font-size: 18px;
  margin-bottom: 12px;
}

.card-panel-normal{
  color: rgba(0, 0, 0, 0.45);
}

.card-panel-OK{
  color: #409167;
}

.card-panel-Danger{
  color: #ff4949;
}

.card-panel-num {
  font-size: 20px;
}
}
}
}

.online-remark {
  position: absolute;
  top: 10px;
  right: 10px;
}

.online-remark i {
  font-size: 18px;
}

</style>
