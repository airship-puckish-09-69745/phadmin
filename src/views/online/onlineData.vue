<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row class="panel-group" :gutter="10">
      <el-tabs v-model="tab" @tab-click="tabClick">
        <el-tab-pane label="今日在玩" name="onlineAndPlaying">
          <el-col :span="4" class="card-panel-col">
            <div :class="gid===1001?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="queryPlaying(1001, true)">
              <div class="card-panel-description">
                <div class="card-panel-text">
                  在玩：<span :class="getDcClass(playingDiff.today)"> {{ getDcResult(playingDiff.today) }} </span>
                </div>
                <div>
                  前3天：<span :class="getDcClass(playingDiff.day3)">{{ getDcResult(playingDiff.day3) }}</span>
                </div>
                <div>
                  上周：<span :class="getDcClass(playingDiff.week)">{{ getDcResult(playingDiff.week) }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="今日分游戏在玩" name="gamesPlaying">
          <el-row>
            <el-form :model="item" label-width="150px" size="big">
              <el-select
                v-model="gids"
                multiple
                filterable
                collapse-tags
                :clearable="true"
                style="margin-left: 20px;"
                placeholder="请选择">
                <el-option
                  v-for="item in gameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button type="success" size="mini" @click="onlineAllGames">查询</el-button>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import LineChart from '../playerManage/components/LineChart'
import { $libDate, $libShow, MoneyShow } from '@/utils/common'
import store from '@/store'

function NewPlaying() {
  return {
    xData: [],
    yData: [
      { Name: '今日', Data: [] },
      { Name: '昨日', Data: [] },
      { Name: '前3天', Data: [] },
      { Name: '上周', Data: [] }
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
        date: new Date()
      },
      tab: 'onlineAndPlaying',
      logData: [],
      gameTypeMap: {},
      gameOptions: [],
      libShow: $libShow,
      libMoney: new MoneyShow(['MoneyWon', 'MoneyLose', 'MoneyTax', 'MoneyBet']),
      chartData: NewPlaying(),
      gid: 1001,
      gids: [],
      summary: {},
      summary1: {},
      summary2: {},
      userVisible: false,
      users: [],
      env: 'test',
      playingDiff: {
        today: 0, // 今日和昨日对比
        day3: 0, // 今日和前3天对比
        week: 0 // 今日和上周对比
      }
    }
  },
  computed: {
    getSummary() {
      return [9, 1, 8, 2, 3, 4, 5, 6, 7]
    }
  },
  created() {
    this.env = store.getters.env || this.env
    // this.getInfo(this.gid)
    this.queryPlaying(1001, true)
    this.getAllGameList()
  },
  methods: {
    tabClick(tab, event) {
      const showName = ['online', 'playing']
      this.showSelectDate = showName.indexOf(tab.name) >= 0
      this.tab = tab.name
      this.submit()
    },
    submit() {
      switch (this.tab) {
        case 'onlineAndPlaying':
          this.queryPlaying(1001, true)
          break
        case 'gamesPlaying':
          this.onlineAllGames()
          break
      }
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getDcClass(num) {
      if (parseInt(num) === 0) {
        return 'card-panel-Normal'
      } else if (num > 0) {
        return 'card-panel-OK'
      } else {
        return 'card-panel-Danger'
      }
    },
    getDcResult(num) {
      if (parseInt(num) === 0) {
        return num + '%'
      } else if (num > 0) {
        return num + '% ↑'
      } else {
        return num + '% ↓'
      }
    },
    getRatioClass(num) {
      return num < 50 ? 'card-panel-OK' : 'card-panel-Danger'
    },
    getSystemGot(ob) {
      if (ob) {
        return this.formatNumber((ob.Lose + ob.Tax - ob.Won) / 1000)
      }
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.IsPay) {
        return 'success-row'
      }
    },
    getCurDate(step) {
      const ts = (new Date()).getTime()
      const dt = new Date(ts - 9000000)
      const hour = dt.getHours()
      let minute = dt.getMinutes()
      if (step === 5 && minute % 5 > 0) {
        minute = parseInt(minute / 10) * 10 + (minute % 10 > 5 ? 5 : 0)
      }
      const ret = (hour >= 10 ? hour + '' : '0' + hour) + ':' + (minute >= 10 ? minute + '' : '0' + minute)

      return {
        hour: hour,
        minute: minute,
        result: ret
      }
    },
    calcRatio(num1, num2) {
      // console.log('num1 ', num1)
      // console.log('num2 ', num2)
      const ret = num1 - num2
      num2 = num2 === 0 ? 1 : num2
      return (ret / num2 * 100).toFixed(2)
    },
    // 查询在玩数据
    queryPlaying(gid, isRefresh) {
      if (isRefresh) {
        this.gid = gid
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/realtime/playing'
        }
      }).then(response => {
        const chartData = NewPlaying()
        if (response.RetCode === 0) {
          chartData['xData'] = response.Data.Cols
          chartData['yData'][0]['Data'] = response.Data.Today
          chartData['yData'][1]['Data'] = response.Data.Yesterday
          chartData['yData'][2]['Data'] = response.Data.Day3
          chartData['yData'][3]['Data'] = response.Data.Week

          // 对比
          const dt = $this.getCurDate(0)
          let index = 0
          for (const i in response.Data.Cols) {
            if (dt.result === response.Data.Cols[i]) {
              index = i
              break
            }
          }
          $this.playingDiff.today = $this.calcRatio(response.Data.Today[index], response.Data.Yesterday[index])
          $this.playingDiff.day3 = $this.calcRatio(response.Data.Today[index], response.Data.Day3[index])
          $this.playingDiff.week = $this.calcRatio(response.Data.Today[index], response.Data.Week[index])
        }
        if (isRefresh) {
          $this.chartData = chartData
        }
      })
    },
    onlineAllGames() {
      const $this = this
      // const gameTypes = []
      // for (const i in $this.gameTypeMap) {
      //   gameTypes.push(parseInt(i))
      // }
      const gidStr = JSON.stringify(this.gids)
      const names = this.gameTypeMap
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/games/realtime/playing',
          gids: gidStr
        }
      }).then(function(response) {
        loading.close()
        if (response.RetCode === 0) {
          const chartData = NewPlaying()
          const items = response.Data
          chartData['xData'] = items[0].Cols
          chartData.yData = []
          for (let i = 0; i < items.length; i++) {
            chartData.yData.push({
              Name: names[items[i].Gid],
              Type: 'line',
              Data: items[i].Player
            })
          }
          $this.chartData = chartData
        }
      }).catch(function() {
        loading.close()
      })
    },
    getAllGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].Status !== 2 || objs[i].ShowDatacenter !== 1) {
              continue
            }
            this.gameTypeMap[objs[i].Gid] = objs[i].Name
            this.gameOptions.push({ value: objs[i].Gid, label: objs[i].Name })
            this.gids.push(objs[i].Gid)
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

.online-remark {
  position: absolute;
  top: 10px;
  right: 10px;
}

.online-remark i {
  font-size: 18px;
}

</style>
