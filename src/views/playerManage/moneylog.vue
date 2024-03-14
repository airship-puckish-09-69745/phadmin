<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">

        <el-form-item label="UID：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="历史数据">
          <el-switch
            v-model="isHistory"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>

      </el-form>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="10">
        <el-button type="primary" size="mini" @click="gamePanelVisible = true">牌局输赢</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="success" size="mini" @click="showChart">流水变化图</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="success" size="mini" @click="showDrawer">概要时间线</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="UpdateTime"
        label="时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="2" :timestamp="scope.row.UpdateTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyType"
        label="货币类型"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['MoneyType']" size="mini" @change="handleFilter">
            <el-option label="货币类型" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['MoneyType']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('MoneyType', scope.row.MoneyType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Before"
        label="前值"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow - scope.row.MoneyChanged) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Changed"
        label="变化值"
        width="200"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.MoneyType===1||scope.row.MoneyType===2"
            :style="scope.row.MoneyChanged>0?'color:red':'color:green'"
          >{{
            formatNumber(scope.row.MoneyChanged)
          }}</span>
          <span v-else>
            {{ formatNumber(scope.row.MoneyChanged) }}x
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyAll"
        label="账户总额"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.MoneyType==1 || scope.row.MoneyType==2">
            {{ formatNumber(scope.row.MoneyAll) }}
          </span>
          <span v-if="scope.row.MoneyType==5">
            {{ formatNumber(scope.row.MoneyNow) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ActType"
        width="200"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['ActType']" multiple size="mini" @change="handleFilter2">
            <el-option label="操作类型" :value="0" />
            <el-option v-for="o in actTypeSort" :key="o" :label="clientDB.FilterMap['ActType'][o]" :value="o" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('ActType', scope.row.ActType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ActMsg"
        label="操作说明"
        min-width="300"
      />
      <el-table-column
        prop="ExtInfo"
        label="备注"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.MoneyType==5 && scope.row.ActType==38">
            {{ libShow.GameNames[scope.row.ExtData] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <el-dialog title="玩牌金流" :visible.sync="gamePanelVisible">
      <el-table
        :data="gameTableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
      >
        <el-table-column property="Name" label="游戏名称" width="200" />
        <el-table-column property="Win" label="赢流水" width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Win) }}
          </template>
        </el-table-column>
        <el-table-column property="WinTimes" label="赢局数" width="70" />
        <el-table-column property="Lose" label="输流水" width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Lose) }}
          </template>
        </el-table-column>
        <el-table-column property="LoseTimes" label="输局数" width="70" />
        <el-table-column property="Total" label="总输赢" width="150">
          <template slot-scope="scope">
            <span v-text="formatNumber(scope.row.Win + scope.row.Lose)" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
    <el-drawer
      title="概要时间线"
      :visible.sync="drawer.visible"
      direction="ltr"
      size="600px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(ob, index) in drawer.lines"
          :key="index"
          :timestamp="ob.timestamp"
        >
          <span v-if="index!=0" :style="'color:' + ob.color">{{ ob.content }}</span>
          <div v-else>
            <el-row>
              总览
            </el-row>
            <el-row>
              <div style="height:20px;margin-top: 10px">
                付费额度：{{ ob.Pay }} ，付费次数：{{ ob.PayCount }}
              </div>
            </el-row>
            <el-row>
              <div style="height:20px;margin-top: 10px">
                提现额度：{{ -ob.Withdraw }} ，付费次数：{{ ob.WithdrawCount }}
              </div>
            </el-row>
            <el-table
              :data="ob.Games"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="padding:10px;width: 100%"
            >
              <el-table-column
                prop="Game"
                label="游戏"
                width="150"
              />
              <el-table-column
                label="总局数"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.WinCount + scope.row.LoseCount }}
                </template>
              </el-table-column>
              <el-table-column
                label="输赢"
                width="150"
              >
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Win + scope.row.Lose) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

const filterMap = {
  MoneyType: { 1: 'Deposited', 2: 'Winning', 3: '基础值', 5: 'Bonus', 10: '只看金流' }, // 4: '贡献值',
  ActType: {
    1000: '玩牌赢',
    1001: '玩牌输',
    2: '充值',
    15: '提现',
    16: '提现手续费',
    18: '未付费重置',
    19: '使用存钱罐',
    20: '领取bonus',
    1: '注册',
    7: '签到奖励',
    11: '管理后台',
    12: '月卡每日奖励',
    13: '月卡头款',
    14: '动态表情',
    17: '邀请账号提现',
    29: '老虎机下注',
    30: '老虎机返奖',
    31: '老虎机Wild返奖',
    32: '老虎机Scatter返奖',
    33: '扫雷下注',
    34: '扫雷奖励',
    37: '购买添加Bonus',
    38: '输钱添加Bonus',
    39: '游戏中Jackpot',
    40: 'Lucky9往HitPot投注',
    41: 'Lucky9获得HitPot奖励'
  }
}

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '全部金币', Data: [] },
      { Name: 'Desposited', Data: [] },
      { Name: 'Winning', Data: [] },
      { Name: '基础值', Data: [] }
    ]
  }
}

export default {
  name: 'Moneylog',
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      isHistory: false,
      search: '',
      clientDB: new ClientTableData([], 10, filterMap),
      libShow: $libShow,
      actTypeSort: [1000, 1001, 2, 15, 16, 18, 19, 20, 1, 7, 11, 12, 13, 14, 17, 29, 30, 31, 32],

      item: {
        Uid: 0
      },
      gameTableData: [],
      gamePanelVisible: false,
      moneyData: [],
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      chartData: newChartData(),
      env: 'test',

      drawer: {
        visible: false,
        lines: []
      },

      gameNames: ['TeenPatti', 'DragonVsTiger', 'Rummy', 'AndarBahar', 'CarRoulette', 'JHandiMunda', 'AK47', '7Up7Down', 'RedVsBlack', 'TeenPatti100',
        '凤凰', '睡美人', '小丑', '黄金列车', '澳洲', '印度Ganesha', '黄金矿工', '芝加哥', 'Sweeper', 'Wingo', 'Baccarat', '阿拉丁', '印度Ganesha',
        '糖果派对Way', '糖果派对Allline', '糖果糖果Grid', '糖果糖果'],
      libMoney: new MoneyShow(['MoneyChanged', 'MoneyNow', 'MoneyAll'])
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter2() {
      const actTypes = {}
      for (let i = 0; i < this.clientDB.FilterValueMap['ActType'].length; i++) {
        actTypes[this.clientDB.FilterValueMap['ActType'][i]] = true
      }
      this.clientDB.ShowData = this.clientDB.TotalData.filter(
        function(data) {
          if (actTypes[data.ActType]) {
            return true
          } else {
            return false
          }
        }
      )
      this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      this.refreshShow()
    },
    handleFilter() {
      if (this.clientDB.FilterValueMap['MoneyType'] == 10) {
        this.clientDB.ShowData = this.clientDB.TotalData.filter(
          function(data) {
            if (data.MoneyType == 1 || data.MoneyType == 2) {
              return true
            } else {
              return false
            }
          }
        )
        this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      } else {
        this.clientDB.FilterData()
      }
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    isSlotInfo(item) {
      if (item.ActType == 29 || item.ActType == 30 || item.ActType == 31 || item.ActType == 32) {
        return true
      }
      return false
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
      const $this = this
      this.moneyData = []
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const Url = this.isHistory ? '/other/moneylog' : '/dataProxy/info'
      request({
        url: Url,
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/moneylog',
          Uid: this.item.Uid,
          Type: 0,
          BTime: bTime,
          ETime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          objs = $this.libMoney.TransForShow(objs)
          $this.moneyData = objs
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'UpdateTime', -1)

          $this.handleCurrentChange(1)
          const winInfo = {}
          for (const o in this.gameNames) {
            const name = this.gameNames[o]
            winInfo[name] = { Name: name, Win: 0, Lose: 0, WinTimes: 0, LoseTimes: 0 }
          }
          winInfo['Other'] = { Name: '未知', Win: 0, Lose: 0, WinTimes: 0, LoseTimes: 0 }

          const timeMap = {}
          let gameName = ''
          for (let i = 0; i < objs.length; i++) {
            const t = objs[i].UpdateTime
            gameName = objs[i].ActMsg === 'sweeper' ? 'Sweeper' : objs[i].ActMsg
            if (winInfo[gameName] || $this.isSlotInfo(objs[i])) {
              switch (objs[i].ActType) {
                case 1000:
                  if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                    winInfo[gameName].Win += objs[i].MoneyChanged
                    if (!timeMap[t]) {
                      timeMap[t] = true
                      winInfo[gameName].WinTimes++
                    }
                  }
                  break
                case 1001:
                case 33:
                  if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                    winInfo[gameName].Lose += objs[i].MoneyChanged
                    if (!timeMap[t]) {
                      timeMap[t] = true
                      winInfo[gameName].LoseTimes++
                    }
                  }
                  break
                case 29:
                  if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                    gameName = this.getSlotsName(objs[i].ActMsg)
                    winInfo[gameName].Lose += objs[i].MoneyChanged
                    if (!timeMap[t]) {
                      timeMap[t] = true
                      winInfo[gameName].LoseTimes++
                    }
                  }
                  break
                case 30:
                case 31:
                case 32:
                  gameName = this.getSlotsName(objs[i].ActMsg)
                  if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                    winInfo[gameName].Win += objs[i].MoneyChanged
                    if (!timeMap[t]) {
                      timeMap[t] = true
                      winInfo[gameName].WinTimes++
                    }
                  }
                  break
              }
            } else {
              if (objs[i].ActType === 1000) {
                if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                  winInfo.Other.Win += objs[i].MoneyChanged
                  if (!timeMap[t]) {
                    timeMap[t] = true
                    winInfo.Other.WinTimes++
                  }
                }
              } else if (objs[i].ActType === 1001) {
                if (objs[i].MoneyType === 1 || objs[i].MoneyType === 2) {
                  winInfo.Other.Lose += objs[i].MoneyChanged
                  if (!timeMap[t]) {
                    timeMap[t] = true
                    winInfo.Other.LoseTimes++
                  }
                }
              }
            }
          }
          this.gameTableData = []
          for (const o in winInfo) {
            this.gameTableData.push(winInfo[o])
          }
        }

        loading.close()
      })
    },
    getLuckValue(baseValue, moneyAll) {
      if (moneyAll === 0) {
        return 0
      } else {
        return baseValue / moneyAll
      }
    },
    getPlayWinLimitStd(baseValue, produceValue) {
      if (produceValue == 0) {
        return 0
      } else {
        return (baseValue * 100 / (produceValue)).toFixed(2)
      }
    },
    showDrawer() {
      this.drawer.visible = true
      const objs = this.moneyData.sort(function(a, b) {
        return a.ID - b.ID
      })
      const timeArr = []
      let gameName = ''
      let preTime = 0
      for (let i = 0; i < objs.length; i++) {
        let obj = objs[i]
        if (obj.MoneyType !== 1 && obj.MoneyType !== 2) {
          continue
        }
        switch (obj.ActType) {
          case 1: // 注册
            timeArr.push({ Time: obj.UpdateTime, ActType: obj.ActType })
            break
          case 18:// 重置基础值
            timeArr.push({
              Time: obj.UpdateTime,
              ActType: obj.ActType,
              MoneyChanged: obj.MoneyChanged,
              MoneyNow: obj.MoneyNow,
              Money: obj.MoneyAll
            })
            break
          case 20:// 领取Bonus
            timeArr.push({
              Time: obj.UpdateTime,
              ActType: obj.ActType,
              MoneyChanged: obj.MoneyChanged,
              MoneyNow: obj.MoneyNow,
              Money: obj.MoneyAll
            })
            break
          case 2:// 充值
            if (obj.MoneyType == 1) {
              timeArr.push({
                Time: obj.UpdateTime,
                ActType: obj.ActType,
                MoneyChanged: obj.MoneyChanged,
                MoneyNow: obj.MoneyNow,
                Money: obj.MoneyAll
              })
            }
            break
          case 15:// 提现
            if (obj.MoneyType == 2) {
              timeArr.push({
                Time: obj.UpdateTime,
                ActType: obj.ActType,
                MoneyChanged: obj.MoneyChanged,
                MoneyNow: obj.MoneyNow,
                Money: obj.MoneyAll
              })
            }
            break
          case 1001:
          case 1000:
          case 33:
            gameName = objs[i].ActMsg === 'sweeper' ? 'Sweeper' : objs[i].ActMsg
            const item = {
              Time: obj.UpdateTime,
              Game: gameName,
              ActType: 1000,
              Lose: 0,
              LoseCount: 0,
              Win: 0,
              WinCount: 0
            }

            while (obj.ActMsg.toLowerCase() == gameName.toLowerCase() && (obj.ActType == 1000 || obj.ActType == 1001 || obj.ActType == 33)) {
              if (obj.MoneyType == 1 || obj.MoneyType == 2) {
                if (obj.UpdateTime != preTime) {
                  preTime = obj.UpdateTime
                  if (obj.MoneyChanged < 0) {
                    item.LoseCount++
                  } else {
                    item.WinCount++
                  }
                }
                if (obj.MoneyChanged < 0) {
                  item.Lose += obj.MoneyChanged
                } else {
                  item.Win += obj.MoneyChanged
                }
                item.Money = obj.MoneyAll
              }
              i++
              if (i === objs.length) {
                break
              }
              obj = objs[i]
              while (obj.ActType == 38 || obj.ActType == 14) { // 跳过bonus记录和发送表情
                i++
                if (i === objs.length) {
                  break
                }
                obj = objs[i]
              }
            }
            timeArr.push(item)
            i--
            break
          case 29:
          case 30:
          case 31:
          case 32:
            gameName = this.getSlotsName(obj.ActMsg)
            const slotsItem = {
              Time: obj.UpdateTime,
              Game: gameName,
              ActType: 29,
              Times: 0,
              Bet: 0,
              Win: 0
            }

            while (this.getSlotsName(obj.ActMsg) == gameName && (obj.ActType == 29 || obj.ActType == 30 || obj.ActType == 31 || obj.ActType == 32)) {
              if (obj.MoneyType == 1 || obj.MoneyType == 2) {
                if (obj.ActType == 29) { // 下注动作
                  slotsItem.Times++
                  slotsItem.Bet -= obj.MoneyChanged
                } else {
                  slotsItem.Win += obj.MoneyChanged
                }
                slotsItem.Money = obj.MoneyAll
              }
              i++
              if (i === objs.length) {
                break
              }
              obj = objs[i]
              while (obj.ActType == 38 || obj.ActType == 14) { // 跳过bonus记录和发送表情
                i++
                if (i === objs.length) {
                  break
                }
                obj = objs[i]
              }
            }
            timeArr.push(slotsItem)
            i--
            break
        }
      }
      this.drawer.lines = [{ cnt: '', color: '', t: '总计' }]
      let pay = 0
      let withdraw = 0
      let payCount = 0
      let withdrawCount = 0
      const gameMap = {}
      let game = ''
      for (const o in timeArr) {
        let cnt, color
        const t = this.formatTime(timeArr[o].Time)
        switch (timeArr[o].ActType) {
          case 1:
            cnt = '用户注册'
            color = 'black'
            break
          case 2:
            cnt = '充值。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
            color = 'green'
            pay += timeArr[o].MoneyChanged
            payCount++
            break
          case 15:
            if (timeArr[o].MoneyChanged < 0) {
              cnt = '提现。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
              color = 'red'
              withdraw += timeArr[o].MoneyChanged >= -100 ? timeArr[o].MoneyChanged : timeArr[o].MoneyChanged * 100 / 97
              withdrawCount++
            } else {
              cnt = '提现撤回。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
              color = 'green'
              withdraw += timeArr[o].MoneyChanged
              withdrawCount--
            }
            break
          case 20:
            cnt = 'Bonus。额度：' + timeArr[o].MoneyChanged + '，当前资产：' + timeArr[o].Money
            color = 'blue'
            break
          case 18:
            cnt = '重置基础值。重置前：' + timeArr[o].MoneyNow + '，重置后：' + timeArr[o].MoneyNow + '，资产：' + timeArr[o].Money
            break
          case 1000:
            cnt = timeArr[o].Game + ':' + (timeArr[o].WinCount + timeArr[o].LoseCount) + '局，输赢：' + this.formatNumber(timeArr[o].Lose + timeArr[o].Win) +
              '，赢：' + timeArr[o].WinCount + '，输：' + timeArr[o].LoseCount + '，资产：' + timeArr[o].Money
            game = timeArr[o].Game
            if (!gameMap[game]) {
              gameMap[game] = { WinCount: 0, LoseCount: 0, Win: 0, Lose: 0 }
            }
            gameMap[game].Game = game
            gameMap[game].WinCount += timeArr[o].WinCount
            gameMap[game].LoseCount += timeArr[o].LoseCount
            gameMap[game].Lose += timeArr[o].Lose
            gameMap[game].Win += timeArr[o].Win
            break
          case 29:
            cnt = timeArr[o].Game + ':' + timeArr[o].Times + '局，下注：' + this.formatNumber(timeArr[o].Bet) +
              '，获得：' + this.formatNumber(timeArr[o].Win - timeArr[o].Bet) + '，资产：' + timeArr[o].Money
            game = timeArr[o].Game
            if (!gameMap[game]) {
              gameMap[game] = { WinCount: 0, LoseCount: 0, Win: 0, Lose: 0 }
            }
            gameMap[game].Game = game
            gameMap[game].LoseCount += timeArr[o].Times
            gameMap[game].Lose -= timeArr[o].Bet
            gameMap[game].Win += timeArr[o].Win
            break
        }
        this.drawer.lines.push({ content: cnt, timestamp: t, color: color })
      }
      const games = []
      for (const o in gameMap) {
        games.push(gameMap[o])
      }
      this.drawer.lines[0] = {
        Pay: pay,
        PayCount: payCount,
        Withdraw: Math.floor(withdraw),
        WithdrawCount: withdrawCount,
        Games: games,
        t: '总计'
      }
    },
    getSlotsName(actMsg) {
      let slotsName = actMsg
      if (actMsg.indexOf('凤凰') >= 0) {
        slotsName = '凤凰'
      } else if (actMsg.indexOf('睡美人') >= 0) {
        slotsName = '睡美人'
      } else if (actMsg.indexOf('阿拉丁') >= 0) {
        slotsName = '阿拉丁'
      } else if (actMsg.indexOf('印度Ganesha') >= 0) {
        slotsName = '印度Ganesha'
      } else if (actMsg.indexOf('小丑') >= 0) {
        slotsName = '小丑'
      } else if (slotsName.indexOf('-') >= 0) {
        const arr = slotsName.split('-')
        slotsName = arr[0]
      }
      return slotsName
    },
    showChart() {
      this.initChartData()
    },
    initChartData() {
      const objs = this.moneyData.reverse()
      var chartData = newChartData()

      // 预处理数据，相同时间的数据进行去重
      let lastDeposited = 0
      let lastWinning = 0
      let lastBaseValue = 0

      let lastTime = 0
      const timeArr = []
      const retObjs = {}

      for (const i in objs) {
        const ob = objs[i]
        if (ob.UpdateTime !== lastTime) {
          chartData.xData.push($libDate.FormateSecondStr(ob.UpdateTime, 6))
          lastTime = ob.UpdateTime
          timeArr.push(lastTime)
        }
        switch (ob.MoneyType) {
          case 1:
            lastDeposited = ob.MoneyNow
            break
          case 2:
            lastWinning = ob.MoneyNow
            break
          case 3:
            lastBaseValue = ob.MoneyNow
            break
        }
        retObjs[lastTime] = {
          moneyAll: ob.MoneyAll,
          moneyDeposited: lastDeposited,
          moneyWinning: lastWinning,
          baseValue: lastBaseValue
        }
      }

      for (const i in timeArr) {
        const ob = retObjs[timeArr[i]]
        chartData.yData[0].Data.push(ob.moneyAll)
        chartData.yData[1].Data.push(ob.moneyDeposited)
        chartData.yData[2].Data.push(ob.moneyWinning)
        chartData.yData[3].Data.push(ob.baseValue)
      }
      this.chartData = chartData
    }
  }
}
</script>
