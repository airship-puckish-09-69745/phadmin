<template>
  <div class="app-container">
    <el-row>
      <el-col :offset="6">
      <el-button type="success" size="mini" icon="el-icon-refresh" @click="getInfo()">刷新</el-button>
      </el-col>
    </el-row>
    <el-tabs type="border-card">
      <el-tab-pane label="Galaxy" >
        <el-table
          :data="galaxy"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
        >
          <el-table-column prop="payChannelName" label="支付渠道" width="200" />
          <el-table-column prop="Value">
            <template slot-scope="scope">
              {{ scope.row.Value/1000 }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Android" >
        <el-table
          :data="android"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
        >
          <el-table-column prop="payChannelName" label="支付渠道" width="200" />
          <el-table-column prop="Value">
            <template slot-scope="scope">
              {{ formatNumber(scope.row.Value/1000) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, MoneyShow } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare },
  data() {
    return {
      android: [],
      galaxy: [],
      libShow: $libShow,
      libMoney: new MoneyShow(['DayPay', 'DayWithdraw', 'Total', 'OutMoney', 'Correct'])

    }
  },
  created() {
    console.log(1)
    this.getInfo()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    getInfo() {
      const $this = this
      this.galaxy = []
      this.android = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/paystat/now'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const cfg = response.Data.ChannelConfig
          const tMap = response.Data.ChannelMap
          for (let i = 0; i < cfg.length; i++) {
            const ob = cfg[i]
            ob.Value = tMap[ob.payChannel]
            if (ob.platform === 'galaxy') {
              $this.galaxy.push(ob)
            } else {
              $this.android.push(ob)
            }
          }
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

</style>
