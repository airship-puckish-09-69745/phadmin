<template>
  <div class="app-container">
    <el-row style="margin-top: 50px">
      <el-tabs tab-position="left">
        <el-tab-pane v-for="value in lists" :label="value.title">
          <el-row>
            <!--
            <el-col :offset="12" :span="2">
              <el-button type="text" @click="doShowChart(value.slotsType)">图表</el-button>
            </el-col>
            -->
            <el-col :offset="12" :span="2">
              <el-button size="mini" @click="getData()">刷新</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-descriptions class="margin-top" :column="2" border style="width: 1100px" title="小奖池">

              <el-descriptions-item v-for="(v,k) in GamePrizePoolMap"v-if="(k+'').indexOf(value.slotsType)===0" class="background: #E1F3D8;">
                <template slot="label">
                  <i class="el-icon-user" />
                  {{ getGameName(k) }}
                </template>
                <span :style="v/1000>1000000?'color:red':''">{{ Math.floor(v/1000).toLocaleString() }}</span>
              </el-descriptions-item>

            </el-descriptions>
          </el-row>
          <el-table
            :data="value.tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="key"
              label="统计项"
              width="140"
            />
            <el-table-column label="最近24H">
              <el-table-column
                prop="today"
                label="数额"
                width="120"
              >
                <template slot-scope="scope">{{ scope.row.today.number }}
                </template>
              </el-table-column>
              <el-table-column
                prop="today"
                label="RTP"
                width="100"
              >
                <template slot-scope="scope">
                  <span :style="percentColor(scope.row.today.color)">{{ scope.row.today.percent }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="today"
                label="中奖率"
                width="100"
              >
                <template slot-scope="scope">{{ scope.row.today.hit }}</template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="上一个24H">
              <el-table-column
                prop="yesterday"
                label="数额"
                width="120"
                class-name="warning-row"
              >
                <template slot-scope="scope">{{ scope.row.yesterday.number }}</template>
              </el-table-column>
              <el-table-column
                prop="yesterday"
                label="RTP"
                width="100"
                class-name="warning-row"
              >
                <template slot-scope="scope"><span :style="percentColor(scope.row.yesterday.color)">{{ scope.row.yesterday.percent }}</span></template>
              </el-table-column>
              <el-table-column
                prop="yesterday"
                label="中奖率"
                width="100"
                class-name="warning-row"
              >
                <template slot-scope="scope">{{ scope.row.yesterday.hit }}</template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="最近7日">
              <el-table-column
                label="数额"
                prop="day7"
                width="120"
              >
                <template slot-scope="scope">{{ scope.row.day7.number }}</template>
              </el-table-column>
              <el-table-column
                label="RTP"
                prop="day7"
                width="100"
              >
                <template slot-scope="scope"><span :style="percentColor(scope.row.day7.color)">{{ scope.row.day7.percent }}</span></template>
              </el-table-column>
              <el-table-column
                prop="day7"
                label="中奖率"
                width="100"
              >
                <template slot-scope="scope">{{ scope.row.day7.hit }}</template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!--
    <el-dialog
      title="图表信息"
      :visible.sync="dialogVisible"
      width="80%"
      center
    >
      <el-row>
        <el-col :span="14">
          <el-form :model="queryItem" label-width="150px" size="small" :inline="true">
            <el-form-item label="日期：">
              <el-date-picker
                v-model="queryItem.queryTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                size="mini"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="getChartInfo()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <slots-line-chart :chart-data="chartData" height="600px" />
      </el-row>
    </el-dialog>
    -->
  </div>
</template>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>

<script>
import request from '@/utils/request'
import store from '@/store'
import { $libDate, $libShow, MoneyShow } from '@/utils/common'
import slotsLineChart from './components/slotsLineChart'

const RETURN_ALL_KEY = ['SlotsReturn1', 'SlotsReturn2', 'SlotsReturn3', 'SlotsReturn4', 'SlotsReturn5', 'SlotsReturn6', 'Jackpot1', 'Jackpot2', 'Jackpot3', 'Jackpot4', 'Jackpot5', 'Jackpot6']
const RETURN_ALL_KEY_NORMAL = ['SlotsReturn1', 'SlotsReturn2', 'SlotsReturn5', 'SlotsReturn6', 'Jackpot1', 'Jackpot2', 'Jackpot3', 'Jackpot4', 'Jackpot5', 'Jackpot6']
const RETURN_ALL_KEY_SUM = ['SlotsReturn1', 'SlotsReturn2', 'SlotsReturn3', 'SlotsReturn5', 'SlotsReturn6', 'Jackpot1', 'Jackpot2', 'Jackpot3', 'Jackpot4', 'Jackpot5', 'Jackpot6']
const RETURN_HIT_KEY = ['SlotsReturn1Times', 'SlotsReturn2Times', 'SlotsReturn3Times', 'SlotsReturn4Times', 'SlotsReturn5Times', 'SlotsReturn6Times', 'Jackpot1Times', 'Jackpot2Times', 'Jackpot3Times', 'Jackpot4Times', 'Jackpot5Times', 'Jackpot6Times']

export default {
  components: { slotsLineChart },
  data() {
    return {
      lists: [
      ],

      libMoney: new MoneyShow(['TotalBet', 'SlotsReturn1', 'SlotsReturn2', 'SlotsReturn3', 'SlotsReturn4', 'SlotsReturn5', 'SlotsReturn6', 'Jackpot1', 'Jackpot2', 'Jackpot3', 'Jackpot4', 'Jackpot5', 'Jackpot6']),
      dialogVisible: false,
      chartData: null,
      slotsType: 0,
      queryItem: {
        queryTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())]
      },
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      tempLoading: {},
      GamePrizePoolMap: {},
      gameNamesSuffix: {
        1: '普通',
        2: '购买'
      },
      ignoreGame: [77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 151, 153, 155]
    }
  },
  created() {
    this.getData()
    this.getGamePrizePool()
    console.log(1)
  },
  methods: {
    getData() {
      this.getGamePrizePool()
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/daily/all',
          Env: store.getters.env
        }
      }).then(response => {
        console.log('list response', response)
        this.lists = []
        if (response.RetCode === 0) {
          const obj = response.Data
          for (const key in obj) {
            if (this.ignoreGame.includes(obj[key].SlotsType)) {
              continue
            }
            this.lists.push(this.calcData(obj[key]))
          }
          console.log("=========",this.lists)

        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    calcData(data) {
      return {
        'slotsType': data.SlotsType,
        'title': this.getSlotsName(data.SlotsType),
        'tableData': this.transData(data)
      }
    },
    getSlotsName(sType) {
      switch (sType) {
        case 76:
          return 'CandyRush'
        case 78:
          return 'SuperGems'
        case 80:
          return 'CandyCraze'
        case 82:
          return 'Millionaire'
        case 84:
          return 'FortuneAce'
        case 86:
          return 'SuperGemsII'
        case 88:
          return 'Lucky777'
        case 90:
          return 'FortuneComing'
        case 92:
          return 'UltraAce'
        case 94:
          return '冲锋野牛'
        case 96:
          return 'RomanArena'
        case 98:
          return 'SuperTongit'
        case 150:
          return 'SuperGemsIII'
        case 152:
          return '阿拉丁神灯'
        case 154:
          return 'GrandAce'
        case 160:
          return 'GigaAce'
      }
      return '未知老虎机-' + sType
    },
    transData(one) {
      one.Today = this.libMoney.TransForShow(one.Today)
      one.Yesterday = this.libMoney.TransForShow(one.Yesterday)
      one.Day7 = this.libMoney.TransForShow(one.Day7)
      const lists = []
      switch (one.SlotsType) {
        case 63:
        {
          lists.push(this.calcNonPercent('玩牌次数', 'PlayTimes', one))
          lists.push(this.calcNonPercent('总下注', 'TotalBet', one))
          lists.push(this.calcItem('正常返奖', 'SlotsReturn1', one))
          lists.push(this.calcItem('Scatter返奖', 'SlotsReturn2', one))
          lists.push(this.calcItem('Bonus返奖', 'SlotsReturn3', one))
          lists.push(this.calcItemTotal('总计', one))
          break
        }
        case 76:
        case 78:
        case 80:
        case 82:
        case 84:
        case 88:
        case 90:
        case 92:
        case 94:
        case 96:
        case 98:
        case 152:
        case 154:
        {
          // 混有购买免费数据
          lists.push(this.calcPlayTimes(one))
          lists.push(this.calcTotalBet(one))
          lists.push(this.calcItemNormal('正常返奖', 'SlotsReturn1', one))
          lists.push(this.calcItemNormal('Scatter返奖', 'SlotsReturn2', one))
          lists.push(this.calcItemTotalNormal('正常合计', one))
          lists.push(this.calcNonPercent('购买Scatter次数', 'SlotsReturn4Times', one))
          lists.push(this.calcNonPercent('购买Scatter金额', 'SlotsReturn4', one))
          lists.push(this.calcItemBuy('购买Scatter返奖', 'SlotsReturn3', one))
          lists.push(this.calcNonPercent('所有下注额总计', 'TotalBet', one))
          lists.push(this.calcItemTotalSum('所有返奖总计', one))
          break
        }
        case 86:
        case 150:
        {
          // 混有购买免费数据
          lists.push(this.calcPlayTimes(one))
          lists.push(this.calcTotalBet(one))
          lists.push(this.calcItemNormal('正常返奖', 'SlotsReturn1', one))
          lists.push(this.calcItemNormal('Scatter返奖', 'SlotsReturn2', one))
          lists.push(this.calcItemNormal('转盘返奖', 'SlotsReturn5', one))
          lists.push(this.calcItemTotalNormal('正常合计', one))
          lists.push(this.calcNonPercent('购买Scatter次数', 'SlotsReturn4Times', one))
          lists.push(this.calcNonPercent('购买Scatter金额', 'SlotsReturn4', one))
          lists.push(this.calcItemBuy('购买Scatter返奖', 'SlotsReturn3', one))
          lists.push(this.calcNonPercent('所有下注额总计', 'TotalBet', one))
          lists.push(this.calcItemTotalSum('所有返奖总计', one))
          break
        }
      }
      console.log("========",one.SlotsType,lists)

      return lists
    },
    getPercent(num, deno) {
      if (num == 0 || deno == 0) {
        return '0%'
      } else {
        const p = ((num / deno) * 100).toFixed(2)
        return '' + p + '%'
      }
    },
    getPercentFixed3(num, deno) {
      if (num == 0 || deno == 0) {
        return '0.00%'
      } else {
        const p = ((num / deno) * 100).toFixed(3)
        return '' + p + '%'
      }
    },
    calcColor(num, deno) {
      if (num == 0 || deno == 0) {
        return ''
      } else {
        const p = (num / deno) * 100
        return p > 97 ? 'red' : 'green'
      }
    },
    getObjRow(key) {
      const item = {
        key: key,
        today: { 'number': 0, 'percent': '', color: '', hit: '-' },
        yesterday: { 'number': 0, 'percent': '', color: '', hit: '-' },
        day7: { 'number': 0, 'percent': '', color: '', hit: '-' }
      }
      return item
    },
    calcNonPercent(name, key, data) {
      const one = this.getObjRow(name)
      one.today.number = data.Today[key]
      one.yesterday.number = data.Yesterday[key]
      one.day7.number = data.Day7[key]
      return one
    },
    calcPlayTimes(data) {
      const name = '正常玩牌次数'
      const one = this.getObjRow(name)
      one.today.number = data.Today['PlayTimes'] - data.Today['SlotsReturn4Times'] // SlotsReturn4Times购买免费次数
      one.yesterday.number = data.Yesterday['PlayTimes'] - data.Yesterday['SlotsReturn4Times']
      one.day7.number = data.Day7['PlayTimes'] - data.Day7['SlotsReturn4Times']
      return one
    },
    calcTotalBet(data) {
      const name = '正常总下注'
      const one = this.getObjRow(name)
      one.today.number = data.Today['TotalBet'] - data.Today['SlotsReturn4'] // SlotsReturn4购买免费下注
      one.yesterday.number = data.Yesterday['TotalBet'] - data.Yesterday['SlotsReturn4']
      one.day7.number = data.Day7['TotalBet'] - data.Day7['SlotsReturn4']
      return one
    },
    calcItemNormal(name, key, data) {
      const one = this.getObjRow(name)
      one.today.number = data.Today[key]
      one.yesterday.number = data.Yesterday[key]
      one.day7.number = data.Day7[key]
      one.today.percent = this.getPercent(data.Today[key], data.Today.TotalBet - data.Today.SlotsReturn4)
      one.yesterday.percent = this.getPercent(data.Yesterday[key], data.Yesterday.TotalBet - data.Yesterday.SlotsReturn4)
      one.day7.percent = this.getPercent(data.Day7[key], data.Day7.TotalBet - data.Day7.SlotsReturn4)

      const hitKey = key + 'Times'
      one.today.hit = this.getPercentFixed3(data.Today[hitKey], data.Today.PlayTimes - data.Today.SlotsReturn4Times)
      one.yesterday.hit = this.getPercentFixed3(data.Yesterday[hitKey], data.Yesterday.PlayTimes - data.Yesterday.SlotsReturn4Times)
      one.day7.hit = this.getPercentFixed3(data.Day7[hitKey], data.Day7.PlayTimes - data.Day7.SlotsReturn4Times)
      return one
    },
    calcItemTotalNormal(name, data) {
      const one = this.getObjRow(name)
      one.today.number = this.getOneTotalNormal(data.Today)
      one.yesterday.number = this.getOneTotalNormal(data.Yesterday)
      one.day7.number = this.getOneTotalNormal(data.Day7)
      one.today.percent = this.getPercent(one.today.number, data.Today.TotalBet - data.Today.SlotsReturn4)
      one.today.color = this.calcColor(one.today.number, data.Today.TotalBet - data.Today.SlotsReturn4)
      one.yesterday.percent = this.getPercent(one.yesterday.number, data.Yesterday.TotalBet - data.Yesterday.SlotsReturn4)
      one.yesterday.color = this.calcColor(one.yesterday.number, data.Yesterday.TotalBet - data.Yesterday.SlotsReturn4)
      one.day7.percent = this.getPercent(one.day7.number, data.Day7.TotalBet - data.Day7.SlotsReturn4)
      one.day7.color = this.calcColor(one.day7.number, data.Day7.TotalBet - data.Day7.SlotsReturn4)
      return one
    },
    calcItemBuy(name, key, data) {
      const one = this.getObjRow(name)
      one.today.number = data.Today[key]
      one.yesterday.number = data.Yesterday[key]
      one.day7.number = data.Day7[key]
      one.today.percent = this.getPercent(data.Today[key], data.Today.SlotsReturn4)
      one.yesterday.percent = this.getPercent(data.Yesterday[key], data.Yesterday.SlotsReturn4)
      one.day7.percent = this.getPercent(data.Day7[key], data.Day7.SlotsReturn4)

      return one
    },
    calcItemTotalSum(name, data) {
      const one = this.getObjRow(name)
      one.today.number = this.getOneTotalSum(data.Today)
      one.yesterday.number = this.getOneTotalSum(data.Yesterday)
      one.day7.number = this.getOneTotalSum(data.Day7)
      one.today.percent = this.getPercent(one.today.number, data.Today.TotalBet)
      one.today.color = this.calcColor(one.today.number, data.Today.TotalBet)
      one.yesterday.percent = this.getPercent(one.yesterday.number, data.Yesterday.TotalBet)
      one.yesterday.color = this.calcColor(one.yesterday.number, data.Yesterday.TotalBet)
      one.day7.percent = this.getPercent(one.day7.number, data.Day7.TotalBet)
      one.day7.color = this.calcColor(one.day7.number, data.Day7.TotalBet)
      return one
    },
    calcItem(name, key, data) {
      const one = this.getObjRow(name)
      one.today.number = data.Today[key]
      one.yesterday.number = data.Yesterday[key]
      one.day7.number = data.Day7[key]
      one.today.percent = this.getPercent(data.Today[key], data.Today.TotalBet)
      one.yesterday.percent = this.getPercent(data.Yesterday[key], data.Yesterday.TotalBet)
      one.day7.percent = this.getPercent(data.Day7[key], data.Day7.TotalBet)

      const hitKey = key + 'Times'
      one.today.hit = this.getPercentFixed3(data.Today[hitKey], data.Today.PlayTimes)
      one.yesterday.hit = this.getPercentFixed3(data.Yesterday[hitKey], data.Yesterday.PlayTimes)
      one.day7.hit = this.getPercentFixed3(data.Day7[hitKey], data.Day7.PlayTimes)
      return one
    },
    calcItemTotal(name, data) {
      const one = this.getObjRow(name)
      one.today.number = this.getOneTotal(data.Today)
      one.yesterday.number = this.getOneTotal(data.Yesterday)
      one.day7.number = this.getOneTotal(data.Day7)
      one.today.percent = this.getPercent(one.today.number, data.Today.TotalBet)
      one.today.color = this.calcColor(one.today.number, data.Today.TotalBet)
      one.yesterday.percent = this.getPercent(one.yesterday.number, data.Yesterday.TotalBet)
      one.yesterday.color = this.calcColor(one.yesterday.number, data.Yesterday.TotalBet)
      one.day7.percent = this.getPercent(one.day7.number, data.Day7.TotalBet)
      one.day7.color = this.calcColor(one.day7.number, data.Day7.TotalBet)
      return one
    },
    getOneTotalNormal(data) {
      let total = 0
      for (const key in RETURN_ALL_KEY_NORMAL) {
        total += data[RETURN_ALL_KEY_NORMAL[key]]
      }
      return total.toFixed(2)
    },
    getOneTotalSum(data) {
      let total = 0
      for (const key in RETURN_ALL_KEY_SUM) {
        total += data[RETURN_ALL_KEY_SUM[key]]
      }
      return total.toFixed(2)
    },
    getOneTotal(data) {
      let total = 0
      for (const key in RETURN_ALL_KEY) {
        total += data[RETURN_ALL_KEY[key]]
      }
      return total.toFixed(2)
    },
    getGamePrizePool() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/game/prize/pool/list',
          Env: store.getters.env

        }
      }).then(response => {
        console.log('list response', response)
        $this.tableData = []
        if (response.RetCode === 0) {
          for (const o of response.Data) {
            $this.GamePrizePoolMap[o.Gid] = o.PrizePool
          }
        }
      })
    },
    percentColor(color) {
      if (color == '') {
        return {}
      }
      return { 'color': color }
    },
    // -------图表-------
    doShowChart(slotsType) {
      this.slotsType = slotsType
      this.dialogVisible = true
      // this.getChartInfo()
    },
    /*
    getChartInfo() {
      const querySts = this.transTime(this.queryItem.queryTime[0])
      const queryEts = this.transTime(this.queryItem.queryTime[1])
      if (queryEts - querySts > 30 * 86400) {
        this.$message.error('查询时间不能超过30天')
        return
      }
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/daily/detail',
          slots: this.slotsType,
          QueryTimeSts: querySts,
          QueryTimeEts: queryEts,
          Env: store.getters.env
        }
      }).then(response => {
        console.log('detail list', response)
        if (response.RetCode === 0) {
          const obj = response.Data
          const data = []
          this.chartData = {}
          this.chartData.xDate = []
          switch (this.slotsType) {
            case 63:
            {
              this.chartData.yNames = ['玩牌次数', '总下注', '正常返奖', '正常RTP', 'Scatter返奖', 'ScatterRTP', 'Bonus返奖', 'BonusRTP', '总RTP', '正常中奖率', 'Scatter中奖率', 'Bonus中奖率']
              break
            }
            case 76:
            case 78:
            case 80:
            case 82:
            {
              this.chartData.yNames = ['玩牌次数', '总下注', '正常返奖', '正常RTP', 'Scatter返奖', 'ScatterRTP', '购买Scatter返奖', '购买ScatterRTP', '总RTP', '正常中奖率', 'Scatter中奖率']
              break
            }
          }
          const Jackpot1 = []
          const Jackpot1Times = []
          const Jackpot2 = []
          const Jackpot2Times = []
          const Jackpot3 = []
          const Jackpot3Times = []
          const Jackpot4 = []
          const Jackpot4Times = []
          const Jackpot5 = []
          const Jackpot5Times = []
          const Jackpot6 = []
          const Jackpot6Times = []
          const PlayTimes = []
          const SlotsReturn1 = []
          const SlotsReturn1Times = []
          const SlotsReturn2 = []
          const SlotsReturn2Times = []
          const SlotsReturn3 = []
          const SlotsReturn3Times = []
          const SlotsReturn4 = []
          const SlotsReturn4Times = []
          const SlotsReturn5 = []
          const SlotsReturn5Times = []
          const SlotsReturn6 = []
          const SlotsReturn6Times = []
          const TotalBet = []
          const TotalRTP = []
          const SlotsReturn1RTP = []
          const SlotsReturn2RTP = []
          const SlotsReturn3RTP = []
          const SlotsReturn4RTP = []
          const SlotsReturn5RTP = []
          const SlotsReturn6RTP = []
          const Jackpot1RTP = []
          const Jackpot2RTP = []
          const Jackpot3RTP = []
          const Jackpot4RTP = []
          const Jackpot5RTP = []
          const Jackpot6RTP = []
          for (const key in obj) {
            const one = this.libMoney.TransForShow(obj[key])
            const time = $libDate.FormateSecondStr(obj[key].Date, 6)
            this.chartData.xDate.push(time)
            Jackpot1.push(one.Jackpot1)
            Jackpot2.push(one.Jackpot2)
            Jackpot3.push(one.Jackpot3)
            Jackpot4.push(one.Jackpot4)
            Jackpot5.push(one.Jackpot5)
            Jackpot6.push(one.Jackpot6)
            PlayTimes.push(one.PlayTimes)
            SlotsReturn1.push(one.SlotsReturn1)
            SlotsReturn2.push(one.SlotsReturn2)
            SlotsReturn3.push(one.SlotsReturn3)
            SlotsReturn4.push(one.SlotsReturn4)
            SlotsReturn5.push(one.SlotsReturn5)
            SlotsReturn6.push(one.SlotsReturn6)
            TotalBet.push(one.TotalBet)
            TotalRTP.push(this.getPercentTimes(this.getOneTotal(one), one.TotalBet))
            SlotsReturn1RTP.push(this.getPercentTimes(one.SlotsReturn1, one.TotalBet))
            SlotsReturn2RTP.push(this.getPercentTimes(one.SlotsReturn2, one.TotalBet))
            SlotsReturn3RTP.push(this.getPercentTimes(one.SlotsReturn3, one.TotalBet))
            SlotsReturn4RTP.push(this.getPercentTimes(one.SlotsReturn4, one.TotalBet))
            SlotsReturn5RTP.push(this.getPercentTimes(one.SlotsReturn5, one.TotalBet))
            SlotsReturn6RTP.push(this.getPercentTimes(one.SlotsReturn6, one.TotalBet))
            Jackpot1RTP.push(this.getPercentTimes(one.Jackpot1, one.TotalBet))
            Jackpot2RTP.push(this.getPercentTimes(one.Jackpot2, one.TotalBet))
            Jackpot3RTP.push(this.getPercentTimes(one.Jackpot3, one.TotalBet))
            Jackpot4RTP.push(this.getPercentTimes(one.Jackpot4, one.TotalBet))
            Jackpot5RTP.push(this.getPercentTimes(one.Jackpot5, one.TotalBet))
            Jackpot6RTP.push(this.getPercentTimes(one.Jackpot6, one.TotalBet))
            SlotsReturn1Times.push(this.getPercentTimes(one.SlotsReturn1Times, one.PlayTimes))
            SlotsReturn2Times.push(this.getPercentTimes(one.SlotsReturn2Times, one.PlayTimes))
            SlotsReturn3Times.push(this.getPercentTimes(one.SlotsReturn3Times, one.PlayTimes))
            SlotsReturn4Times.push(this.getPercentTimes(one.SlotsReturn4Times, one.PlayTimes))
            SlotsReturn5Times.push(this.getPercentTimes(one.SlotsReturn5Times, one.PlayTimes))
            SlotsReturn6Times.push(this.getPercentTimes(one.SlotsReturn6Times, one.PlayTimes))
            Jackpot1Times.push(this.getPercentTimes(one.Jackpot1Times, one.PlayTimes))
            Jackpot2Times.push(this.getPercentTimes(one.Jackpot2Times, one.PlayTimes))
            Jackpot3Times.push(this.getPercentTimes(one.Jackpot3Times, one.PlayTimes))
            Jackpot4Times.push(this.getPercentTimes(one.Jackpot4Times, one.PlayTimes))
            Jackpot5Times.push(this.getPercentTimes(one.Jackpot5Times, one.PlayTimes))
            Jackpot6Times.push(this.getPercentTimes(one.Jackpot6Times, one.PlayTimes))
          }
          switch (this.slotsType) {
            case 51:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Wild返奖', SlotsReturn2),
                this.createSeries('WildRTP', SlotsReturn2RTP),
                this.createSeries('Scatter返奖', SlotsReturn3),
                this.createSeries('ScatterRTP', SlotsReturn3RTP),
                this.createSeries('ScatterIcon返奖', SlotsReturn4),
                this.createSeries('ScatterIconRTP', SlotsReturn4RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Wild中奖率', SlotsReturn2Times),
                this.createSeries('Scatter中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 52:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Jackpot返奖', SlotsReturn2),
                this.createSeries('JackpotRTP', SlotsReturn2RTP),
                this.createSeries('Bonus返奖', SlotsReturn3),
                this.createSeries('BonusRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Jackpot中奖率', SlotsReturn2Times),
                this.createSeries('Bonus中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 53:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('火小丑返奖', SlotsReturn2),
                this.createSeries('火小丑RTP', SlotsReturn2RTP),
                this.createSeries('冰小丑返奖', SlotsReturn3),
                this.createSeries('冰小丑RTP', SlotsReturn3RTP),
                this.createSeries('轮盘返奖', SlotsReturn4),
                this.createSeries('轮盘RTP', SlotsReturn4RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('火小丑中奖率', SlotsReturn2Times),
                this.createSeries('冰小丑中奖率', SlotsReturn3Times),
                this.createSeries('轮盘中奖率', SlotsReturn4Times)
              ]
              break
            }
            case 54:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('Bonus返奖', SlotsReturn3),
                this.createSeries('BonusRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('Bonus中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 55:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('Bonus返奖', SlotsReturn3),
                this.createSeries('BonusRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('Bonus中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 56:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times)
              ]
              break
            }
            case 57:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('矿工游戏返奖', SlotsReturn3),
                this.createSeries('矿工游戏RTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('矿工游戏中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 58:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('金币游戏返奖', SlotsReturn2),
                this.createSeries('金币游戏RTP', SlotsReturn2RTP),
                this.createSeries('Scatter返奖', SlotsReturn3),
                this.createSeries('ScatterRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('金币游戏中奖率', SlotsReturn2Times),
                this.createSeries('Scatter中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 59:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('Bonus返奖', SlotsReturn3),
                this.createSeries('BonusRTP', SlotsReturn3RTP),
                this.createSeries('下落返奖', SlotsReturn4),
                this.createSeries('下落RTP', SlotsReturn4RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('Bonus中奖率', SlotsReturn3Times),
                this.createSeries('下落中奖率', SlotsReturn4Times)
              ]
              break
            }
            case 61:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('主游戏掉落返奖', SlotsReturn2),
                this.createSeries('主游戏掉落RTP', SlotsReturn2RTP),
                this.createSeries('Scatter返奖', SlotsReturn3),
                this.createSeries('ScatterRTP', SlotsReturn3RTP),
                this.createSeries('Scatter掉落返奖', SlotsReturn4),
                this.createSeries('Scatter掉落RTP', SlotsReturn4RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('主游戏掉落中奖率', SlotsReturn2Times),
                this.createSeries('Scatter中奖率', SlotsReturn3Times),
                this.createSeries('Scatter掉落中奖率', SlotsReturn4Times)
              ]
              break
            }
            case 62:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('Jackpot返奖', SlotsReturn3),
                this.createSeries('JackpotRTP', SlotsReturn3RTP),
                this.createSeries('掉落返奖', SlotsReturn4),
                this.createSeries('掉落RTP', SlotsReturn4RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('Jackpot中奖率', SlotsReturn3Times),
                this.createSeries('掉落中奖率', SlotsReturn4Times)
              ]
              break
            }
            case 63:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('Bonus返奖', SlotsReturn3),
                this.createSeries('BonusRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times),
                this.createSeries('Bonus中奖率', SlotsReturn3Times)
              ]
              break
            }
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            {
              this.chartData.xSeries = [
                this.createSeries('玩牌次数', PlayTimes),
                this.createSeries('总下注', TotalBet),
                this.createSeries('正常返奖', SlotsReturn1),
                this.createSeries('正常RTP', SlotsReturn1RTP),
                this.createSeries('Scatter返奖', SlotsReturn2),
                this.createSeries('ScatterRTP', SlotsReturn2RTP),
                this.createSeries('购买Scatter返奖', SlotsReturn3),
                this.createSeries('购买ScatterRTP', SlotsReturn3RTP),
                this.createSeries('总RTP', TotalRTP),
                this.createSeries('正常中奖率', SlotsReturn1Times),
                this.createSeries('Scatter中奖率', SlotsReturn2Times)
              ]
              break
            }
          }
          console.log('charData : ', this.chartData)
        } else {
          this.$message.error('获取数据失败：' + response.Data)
        }
        this.loadingClose()
      })
    },
    */
   /*
    createSeries(name, data) {
      return {
        name: name,
        type: 'line',
        // stack: 'Total',
        data: data
      }
    },
    */
   /*
    transTime(t) {
      if (!t) {
        return 0
      }
      let time = t
      if (typeof t !== 'number') {
        time = t.getTime()
      }
      return parseInt($libDate.SelectTimeToIndiaByZone(time) / 1000)
    },
    */
   /*
    getPercentTimes(num, deno) {
      if (num == 0 || deno == 0) {
        return 0.00
      } else {
        const p = ((num / deno) * 100).toFixed(3)
        return p
      }
    },
    */
   /*
    loading() {
      this.tempLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    */
   /*
    loadingClose() {
      const $this = this
      setTimeout(function() {
        $this.tempLoading.close()
      }, 500)
    },
    */
    getGameName(gid) {
      const id = parseInt(gid)
      if (id > 5000) {
        const slotsType = parseInt(id / 100)
        const val = parseInt(id % 100)
        return $libShow.GameNames[slotsType] + this.gameNamesSuffix[val]
      }
      return $libShow.GameNames[id]
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
