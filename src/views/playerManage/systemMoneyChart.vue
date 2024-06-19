<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row>
      <el-col :offset="16" :span="2">
        <el-button size="mini" @click="getInfo(10000, 1)">刷新</el-button>
      </el-col>
      <el-col :span="6">
        排序：
        <el-button-group>
          <el-button type="primary" size="mini" @click="changeOrder(1)">默认</el-button>
          <el-button type="primary" size="mini" @click="changeOrder(2)">按收益</el-button>
          <el-button type="primary" size="mini" @click="changeOrder(3)">按流水</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row class="panel-group" :gutter="10">
      <el-col :span="4" class="card-panel-col">
        <div :class="gid===10000?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="getInfo(10000,2)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              汇总：<span :class="getSummaryClass(summary[10000])"> {{ getSummaryResult(summary[10000]).toFixed(2) }}% </span>
            </div>
            <div>
              收益：{{ getSystemGot(summary[10000]) }}
            </div>
            <div>
              流水：{{ summary[10000]?formatNumber(Math.floor(summary[10000].Bet/1000)):0 }}
            </div>
            <div>
              在玩：{{ summary[10000]?summary[10000].OnlineCount:0 }}({{ summary[10000]?summary[10000].RecentFive:0 }})
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-for="(o,k) in sortOrder" :key="k" :span="4" class="card-panel-col">
        <div v-if="!isPopType(o)" :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="getInfo(o,2)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ gameNames[o] }}：<span :class="getSummaryClass(summary[o])"> {{ getSummaryResult(summary[o]).toFixed(2) }}%</span>
            </div>
            <div>
              收益：{{ getSystemGot(summary[o]) }}
            </div>
            <div>
              流水：{{ summary[o]?formatNumber(Math.floor(summary[o].Bet/1000)):0 }}
            </div>
            <div>
              在玩：{{ summary[o]?summary[o].OnlineCount:0 }}({{ summary[o]?summary[o].RecentFive:0 }})
            </div>
          </div>
        </div>

        <div v-else-if="isTexasMaster(o)" :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="getInfo(o,2)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ gameNames[o] }}：<span :class="getSummaryClass(summary[o])"> {{ getSummaryResult(summary[o]).toFixed(2) }}%</span>
            </div>
            <div>
              收益：{{ getSystemGot(summary[o]) }}
            </div>
            <div>
              流水：{{ summary[o]?formatNumber(Math.floor(summary[o].Bet/1000)):0 }}
            </div>
            <div>
              在玩：{{ summary[o]?summary[o].OnlineCount:0 }}({{ summary[o]?summary[o].RecentFive:0 }})
            </div>
            <div>
              保险：{{ summary[o]?formatNumber(summary[o].Insure/1000):0 }}
            </div>
          </div>
        </div>

        <div v-else>
          <div v-if="!isSlots(o)" :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="getInfo(o,2)">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ gameNames[o] }}：<span :class="getSummaryClass(summary[o])"> {{ getSummaryResult(summary[o]).toFixed(2) }}%</span>
              </div>
              <div>
                收益：{{ getSystemGot(summary[o]) }}
              </div>
              <div>
                流水：{{ summary[o]?formatNumber(Math.floor(summary[o].Bet/1000)):0 }}
              </div>
              <div>
                在玩：{{ summary[o]?summary[o].OnlineCount:0 }}({{ summary[o]?summary[o].RecentFive:0 }})
              </div>
              <div>
                奖池：{{ summary[o]?formatNumber(summary[o].PrizePool/ 1000):0 }}
              </div>
            </div>
          </div>
          <div v-else :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'" @click="getInfo(o,2)">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ gameNames[o] }}：<span :class="getSummaryRtpClass(summary[o])"> {{ getSlotsSummaryResult(summary[o]) }}%</span>
              </div>
              <div>
                收益：{{ summary[o]?formatNumber(Math.floor((summary[o].Bet-summary[o].Won)/1000)):0 }}
              </div>
              <div>
                总下注：{{ summary[o]?formatNumber(Math.floor(summary[o].Bet/1000)):0 }}
              </div>
              <div>
                在玩：({{ summary[o]?summary[o].RecentFive:0 }})
              </div>
              <div>
                RTP：{{ getRtp(summary[o]) }} %
              </div>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-button type="primary" plain @click="showHealth">健康度</el-button>
        <el-button type="success" plain @click="showOrigin">原始值</el-button>
      </el-col>
      <el-col :span="14">
        <el-form v-if="gid!=10000" :model="item" label-width="150px" size="small" :inline="true">
          <el-form-item label="日期：">
            <el-date-picker
              v-model="item.date"
              value-format="timestamp"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item>
            <!--            <el-button type="primary" size="mini" @click="getInfo(gid,2)">查询</el-button>-->
            <el-button size="mini" type="primary" @click="getUsers(gid)">在线</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="5">
        Tips: <span style="color: blue"> 系统收益 / 玩家有效下注 = 5% </span>为健康值
      </el-col>
    </el-row>
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
    <el-dialog
      title="在线用户详情"
      :visible.sync="userVisible"
      width="50%"
    >
      <el-table
        ref="filterTable"
        :data="users"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          type="index"
          width="70"
        />
        <el-table-column
          prop="Uid"
          label="Uid"
          width="120"
        />
        <el-table-column
          label="是否付费"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.IsPay?"是":"否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MoneyChanged"
          label="输赢"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MoneyChanged/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Count"
          label="次数"
          sortable
          width="100"
        />
        <el-table-column
          prop="MoneyNow"
          label="资产"
          sortable
          width="200"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MoneyNow/1000) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="FinishTime"
          label="时间"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.FinishTime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import LineChart from './components/LineChart'
import { $libDate, $libShow, MoneyShow } from '@/utils/common'
import { IsMars, IsProd } from '@/utils/env'
import store from '@/store'
import { Message } from 'element-ui'

function newHealthData() {
  return {
    xData: [],
    yData: [
      { Name: '昨日收益', Data: [] },
      { Name: '今日收益', Data: [] }
    ]
  }
}

function newOriginData() {
  return {
    xData: [],
    yData: [
      { Name: '昨日系统赢', Data: [] },
      { Name: '昨日台费', Data: [] },
      { Name: '昨日有效流水', Data: [] },
      { Name: '今日系统赢', Data: [] },
      { Name: '今日台费', Data: [] },
      { Name: '今日有效流水', Data: [] }
    ]
  }
}

export default {
  name: 'SystemMoney',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      item: {
        date: new Date()
      },
      logData: [],
      preData: [],
      chartData: newHealthData(),
      healthData: newHealthData(),
      originData: newOriginData(),
      libShow: $libShow,
      libMoney: new MoneyShow(['MoneyWon', 'MoneyLose', 'MoneyTax', 'MoneyBet']),
      gid: 10000,
      summary: {},
      gameNames: { 10: 'Crash', 15: 'Texas Poker', 51: '凤凰', 52: '睡美人', 21: 'Pusoy', 22: 'Tongits-Pot', 23: 'Lucky 9', 25: 'Color', 20: 'MINES', 34: 'Pusoy-Dos', 100: 'Tower',
        76: 'Candy Rush', 77: '糖果传奇Allline', 78: '超级宝石', 79: '糖果糖果Mars', 80: 'Candy Craze', 81: '超级宝石Mars', 82: '百万富翁', 83: '百万富翁Mars', // 这行老虎机
        28: 'Tongits Joker', 31: 'Tongits-经典', 32: 'Texas Poker', 101: 'Sicbo', 102: 'Hilo', 103: 'Windrop', 6: '7Up7Down', 104: 'Dragon Tiger',
        35: 'Solitaire', 37: 'BlackJack', 43: '多米诺',
        105: 'Andar Bahar', 106: 'PIGGY TAP', 107: 'Baccarat', 108: 'Dropball', 10000: '汇总' },

      userVisible: false,
      users: [],
      defaultOrder: [15, 22, 28, 23, 25, 10, 21, 20, 34, 100, 102, 101, 103, 104, 105, 106, 6, 32, 35, 37, 107, 108, 43], // 糖果传奇调用addGameName特殊处理
      sortOrder: [],
      env: 'test',
      envProjectName: process.env.VUE_APP_PROJECT
    }
  },
  computed: {
  },
  // mixins: [IsMars],
  created() {
    this.env = store.getters.env || this.env
    this.sortOrder = this.defaultOrder
    // if (this.isIN())  {
    //   this.sortOrder = this.defaultOrder
    // } else {
    //   this.sortOrder = this.BROrder
    // }
    this.addGameNames()
    this.getInfo(this.gid)
    console.log(1)
  },
  methods: {
    changeOrder(iType) {
      console.log('summary===>', this.summary)
      if (iType === 1) {
        this.sortOrder = this.defaultOrder
      } else {
        let objs = []
        for (let i = 0; i < this.sortOrder.length; i++) {
          const gid = this.sortOrder[i]
          if (!this.isSlots(gid)) {
            const ob = this.summary[gid]
            if (ob) {
              const got = ob.Lose + ob.Tax - ob.Won
              objs.push({ Gid: gid, Got: got || 0, Sum: this.summary[gid] ? this.summary[gid].Bet / 1000 : 0 })
            }
          } else {
            objs.push({
              Gid: gid,
              Got: this.summary[gid] ? this.summary[gid].Bet - this.summary[gid].Won : 0,
              Sum: this.summary[gid] ? this.summary[gid].Bet / 1000 : 0
            })
          }
        }
        if (iType === 2) {
          objs = objs.sort(function(a, b) {
            return b.Got - a.Got
          })
        } else {
          objs = objs.sort(function(a, b) {
            return b.Sum - a.Sum
          })
        }
        const retSort = []
        for (const o in objs) {
          retSort.push(objs[o].Gid)
        }
        this.sortOrder = retSort
      }
    },
    addGameNames() {
      if (IsMars()) { // 审核
        this.defaultOrder.push(76, 77, 78, 81, 79, 80, 82, 83)
      } else {
        if (IsProd()) { // 线上
          this.defaultOrder.push(76, 80)
        } else {
          this.defaultOrder.push(76, 78, 80, 82)
        }
      }
    },
    isPopType(o) {
      if (o === 1 || o === 9 || o === 8 || o === 14 || o === 15 || o === 21 || o === 22 || o === 23 || o === 28 || o === 31 || o === 34) {
        return false
      } else {
        return true
      }
    },
    isSlots(o) {
      if (o > 50 && o < 100) {
        return true
      } else {
        return false
      }
    },
    isTexasMaster(o) {
      if (o === 32) {
        return true
      } else {
        return false
      }
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    sortChange(ob) {
      const SortName = ob.prop
      let SortOrder = 1
      if (ob.prop != null) {
        SortOrder = ob.order === 'ascending' ? 1 : -1
      }

      const compare = function(a, b) {
        const val1 = a[SortName]
        const val2 = b[SortName]
        if (val1 < val2) {
          return -1 * SortOrder
        } else if (val1 > val2) {
          return 1 * SortOrder
        } else {
          return 0
        }
      }

      if (SortName != null) {
        this.users.sort(compare)
      }

      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getSummaryClass(ob) {
      if (ob && ob.Bet !== 0) {
        const systemGot = ob.Lose + ob.Tax - ob.Won
        const rate = systemGot * 100 / ob.Bet
        if (rate > 5.5) {
          return 'card-panel-OK'
        } else if (rate < 4.5) {
          return 'card-panel-Danger'
        } else {
          return 'card-panel-Normal'
        }
      } else {
        return 'card-panel-Normal'
      }
    },
    getSummaryRtpClass(ob) {
      if (ob && ob.Bet !== 0) {
        const systemGot = ob.Bet - ob.Won
        const rate = systemGot * 100 / ob.Bet
        if (rate > 5.5) {
          return 'card-panel-OK'
        } else if (rate < 4.5) {
          return 'card-panel-Danger'
        } else {
          return 'card-panel-Normal'
        }
      } else {
        return 'card-panel-Normal'
      }
    },
    getSummaryResult(ob) {
      if (ob && ob.Bet !== 0) {
        const systemGot = ob.Lose + ob.Tax - ob.Won
        return systemGot * 100 / ob.Bet
      } else {
        return 0
      }
    },
    getSystemGot(ob) {
      if (ob) {
        return this.formatNumber(Math.floor((ob.Lose + ob.Tax - ob.Won) / 1000))
      }
    },
    getRtp(ob) {
      if (ob && ob.Bet !== 0) {
        return (ob.Won * 100 / ob.Bet).toFixed(2)
      }
      return 0
    },
    getSlotsSummaryResult(ob) {
      if (ob && ob.Bet !== 0) {
        return ((ob.Bet - ob.Won) * 100 / ob.Bet).toFixed(2)
      }
      return 0
    },
    getReturnMoney(ob) {
      if (ob) {
        return this.formatNumber((ob.Bet - ob.Lose + ob.Won) / 1000)
      }
      return 0
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.IsPay) {
        return 'success-row'
      }
    },
    getUsers(gid) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/playlog/latest',
          Gid: gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.users = response.Data || []
          $this.userVisible = true
        }
      })
    },
    getInfo(gid, iType) {
      this.gid = gid
      if (!iType) {
        iType = 1
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/system/money',
          Gid: this.gid,
          Type: iType,
          Day: parseInt(this.item.date / 1000)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (iType === 2) {
            const objs = response.Data.Items || []
            if (objs.length === 0) {
              Message.success('查询结果为空')
              return
            }
            $this.logData = this.libMoney.TransForShow(objs)
            $this.preData = this.libMoney.TransForShow(response.Data.YesterdayItems)
          } else {
            $this.summary = response.Data.Summary
            console.log($this.summary)
            let totalOnline = 0
            for (const o in $this.summary) {
              totalOnline += $this.summary[o].OnlineCount
            }
            $this.summary[10000].OnlineCount = totalOnline
          }
          $this.initChartData()
          $this.showHealth()
        }
      })
    },
    showHealth() {
      this.chartData = this.healthData
    },
    showOrigin() {
      this.chartData = this.originData
    },
    initChartData() {
      const objs = this.logData
      let preObjs = this.preData
      const healthData = newHealthData()
      const originData = newOriginData()

      // 如果昨天没有数据，赋予今天的数据
      if (preObjs.length === 0) {
        preObjs = objs
      }
      if (preObjs.length > 0) {
        preObjs.sort(function(a, b) {
          if (a.TimeKey < b.TimeKey) {
            return -1
          }
          if (a.TimeKey > b.TimeKey) {
            return 1
          }
          return 0
        })
        console.log(preObjs)
      }
      if (objs.length > 0) {
        objs.sort(function(a, b) {
          if (a.TimeKey < b.TimeKey) {
            return -1
          }
          if (a.TimeKey > b.TimeKey) {
            return 1
          }
          return 0
        })
      }

      for (const i in preObjs) {
        const ob = preObjs[i]
        if (ob.Gid > 50 && ob.Gid < 100) {
          // 老虎机目前没有存 MoneyLose
          healthData.xData.push($libDate.FormateSecondStr(ob.TimeKey, 6))
          const y = ob.MoneyBet > 0 ? (ob.MoneyBet - ob.MoneyWon) * 100 / ob.MoneyBet : 0
          healthData.yData[0].Data.push(y.toFixed(2))
          const ob2 = objs[i]
          if (ob2) {
            const y2 = ob2.MoneyBet > 0 ? (ob2.MoneyBet - ob2.MoneyWon) * 100 / ob2.MoneyBet : 0
            healthData.yData[1].Data.push(y2.toFixed(2))
          }
          originData.xData.push($libDate.FormateSecondStr(ob.TimeKey, 6))
          originData.yData[0].Data.push((ob.MoneyBet - ob.MoneyWon).toFixed(2))
          originData.yData[1].Data.push(ob.MoneyTax.toFixed(2))
          originData.yData[2].Data.push(ob.MoneyBet.toFixed(2))
          if (ob2) {
            originData.yData[3].Data.push((ob2.MoneyBet - ob2.MoneyWon).toFixed(2))
            originData.yData[4].Data.push(ob2.MoneyTax.toFixed(2))
            originData.yData[5].Data.push(ob2.MoneyBet.toFixed(2))
          }
        } else {
          healthData.xData.push($libDate.FormateSecondStr(ob.TimeKey, 6))
          const y = ob.MoneyBet > 0 ? (ob.MoneyLose + ob.MoneyTax - ob.MoneyWon) * 100 / ob.MoneyBet : 0
          healthData.yData[0].Data.push(y.toFixed(2))
          const ob2 = objs[i]
          if (ob2) {
            const y2 = ob2.MoneyBet > 0 ? (ob2.MoneyLose + ob2.MoneyTax - ob2.MoneyWon) * 100 / ob2.MoneyBet : 0
            healthData.yData[1].Data.push(y2.toFixed(2))
          }

          originData.xData.push($libDate.FormateSecondStr(ob.TimeKey, 6))
          originData.yData[0].Data.push((ob.MoneyLose - ob.MoneyWon).toFixed(2))
          originData.yData[1].Data.push(ob.MoneyTax.toFixed(2))
          originData.yData[2].Data.push(ob.MoneyBet.toFixed(2))
          if (ob2) {
            originData.yData[3].Data.push((ob2.MoneyLose - ob2.MoneyWon).toFixed(2))
            originData.yData[4].Data.push(ob2.MoneyTax.toFixed(2))
            originData.yData[5].Data.push(ob2.MoneyBet.toFixed(2))
          }
        }
      }
      this.healthData = healthData
      this.originData = originData
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
  margin: 18px 26px 26px 26px;
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
