<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row>
      <el-col :offset="8" :span="2">
        <el-button size="mini" @click="getInfo(10000, 1)">刷新</el-button>
      </el-col>
<!--      <el-col :span="6">-->
<!--        筛选：-->
<!--        <el-button-group>-->
<!--          <el-button type="success" size="mini" @click="changeType(1)">默认</el-button>-->
<!--          <el-button type="success" size="mini" @click="changeType(2)">Poker</el-button>-->
<!--          <el-button type="success" size="mini" @click="changeType(3)">Slots</el-button>-->
<!--          <el-button type="success" size="mini" @click="changeType(4)">其他</el-button>-->
<!--        </el-button-group>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        排序：-->
<!--        <el-button-group>-->
<!--          <el-button type="primary" size="mini" @click="changeOrder(1)">默认</el-button>-->
<!--          <el-button type="primary" size="mini" @click="changeOrder(2)">按收益</el-button>-->
<!--          <el-button type="primary" size="mini" @click="changeOrder(3)">按流水</el-button>-->
<!--        </el-button-group>-->
<!--      </el-col>-->
    </el-row>
    <el-row class="panel-group" :gutter="10">
      <el-col v-if="HasACC()" :span="4" class="card-panel-col" >
        <div
          :class="gid===10000?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
          @click="getInfo(10000,2)"
        >
          <div class="card-panel-description">
            <div class="card-panel-text">
              汇总：<span :class="getSummaryClass(summary[10000])"> {{
                getSummaryResult(summary[10000]).toFixed(2)
              }}% </span>
            </div>
            <div>
              积分收益：{{ getSystemGot(summary[10000]) }}
            </div>
            <div>
              积分流水：{{ summary[10000] ? formatNumber(Math.floor(summary[10000].PointBet / 1000)) : 0 }}
            </div>
            <div>
              金币收益：{{  getSystemMoneyGot(summary[10000]) }}
            </div>
            <div>
              在玩：{{
                summary[10000] ? summary[10000].OnlineCount : 0
              }}({{ summary[10000] ? summary[10000].RecentFive : 0 }})
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-for="(o,k) in sortOrder" v-if="o!=10000" :key="k" :span="4" class="card-panel-col">
        <div>
          <div
            v-if="!isSlots(o)"
            :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
            @click="getInfo(o,2)"
          >
            <el-tooltip class="item" effect="dark" placement="top" :disabled="o!=37">
              <div slot="content" style="white-space: pre-line;font-size: 14px" v-html="getBlackJackTitle()" />
              <div class="card-panel-description">
                <div class="card-panel-text">
                  {{ gameNames[o] }}：<span
                    :class="getSummaryClass(summary[o])"
                  > {{ getSummaryResult(summary[o]).toFixed(2) }}%</span>
                </div>
                <div>
                  积分收益：{{ getSystemGot(summary[o]) }}
                </div>
                <div>
                  积分流水：{{ summary[o] ? formatNumber(Math.floor(summary[o].PointBet / 1000)) : 0 }}
                </div>
                <div>
                  金币收益：{{ getSystemMoneyGot(summary[o]) }}
                </div>
                <div>
                  在玩：{{ summary[o] ? summary[o].OnlineCount : 0 }}({{ summary[o] ? summary[o].RecentFive : 0 }})
                </div>
                <div>
                  奖池：{{ summary[o] ? formatNumber(summary[o].PrizePool / 1000) : 0 }}
                </div>
              </div>
            </el-tooltip>
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
      width="60%"
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
          width="110"
        />
        <el-table-column
          label="是否付费"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.IsPay ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PointChanged"
          label="积分输赢"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.PointChanged / 1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PointCur"
          label="积分cur"
          sortable
          width="200"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.PointCur / 1000) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="PointChanged"
          label="金币输赢"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MoneyChanged / 1000) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="PointChanged"
          label="实物输赢"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ItemChanged / 1000) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="Count"
          label="次数"
          sortable
          width="100"
        />
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
import { mapGetters } from 'vuex'

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
      authorityCfg: {},
      blackJackSum: 0,
      blackJackContext: '',
      logData: [],
      preData: [],
      chartData: newHealthData(),
      healthData: newHealthData(),
      originData: newOriginData(),
      libShow: $libShow,
      libPoint: new MoneyShow(['PointWon', 'PointLose', 'PointTax', 'PointBet']),
      gid: 10000,
      summary: {},
      gameNames: {
        119: 'Windropc积分',
        10000: '汇总'
      },

      userVisible: false,
      users: [],
      // 糖果传奇调用addGameNames特殊处理
      defaultOrder: [10000, 119], // 糖果传奇调用addGameNames特殊处理
      selectType: 1,

      selectOrder: 1,
      sortOrder: [],
      env: 'test',
      envProjectName: process.env.VUE_APP_PROJECT

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  // mixins: [IsMars],
  created() {
    this.env = store.getters.env || this.env
    // this.sortOrder = this.defaultOrder

    // if (this.isIN())  {
    //   this.sortOrder = this.defaultOrder
    // } else {
    //   this.sortOrder = this.BROrder
    // }
    this.addGameNames()
    this.getInfo(this.gid)
    this.getAuthorityData()
    console.log(this.$store.state.user.pers['USER_MANAGEMENT'])
  },
  methods: {
    HasACC() {
      if (this.$store.state.user.pers['USER_MANAGEMENT']) {
        if (this.authorityCfg[this.name]) {
          if (this.authorityCfg[this.name].includes(10000)) {
            return true
          } else {
            return false
          }
        }
        return true
      }
      return false
    },
    changeType(iType) {
      this.selectType = iType
      this._changeOrder()
    },
    changeOrder(iType) {
      this.selectOrder = iType
      this._changeOrder()
    },
    _changeOrder() {
      if (this.selectType === 1) {
        this.sortOrder = this.defaultOrder
      } else {
        const pokers = []
        const slots = []
        const others = []

        for (let i = 0; i < this.defaultOrder.length; i++) {
          if (this.isPoker(this.defaultOrder[i])) {
            pokers.push(this.defaultOrder[i])
          } else if (this.isSlots(this.defaultOrder[i])) {
            slots.push(this.defaultOrder[i])
          } else {
            others.push(this.defaultOrder[i])
          }
        }
        if (this.selectType === 2) {
          this.sortOrder = pokers
        } else if (this.selectType === 3) {
          this.sortOrder = slots
        } else {
          this.sortOrder = others
        }
      }

      if (this.selectOrder != 1){
        let objs = []
        for (let i = 0; i < this.sortOrder.length; i++) {
          const gid = this.sortOrder[i]
          if (!this.isSlots(gid)) {
            const ob = this.summary[gid]
            if (ob) {
              const got = ob.PointLose + ob.PointTax - ob.PointWon
              objs.push({ Gid: gid, Got: got || 0, Sum: this.summary[gid] ? this.summary[gid].PointBet / 1000 : 0 })
            }
          } else {
            objs.push({
              Gid: gid,
              Got: this.summary[gid] ? this.summary[gid].PointBet - this.summary[gid].PointWon : 0,
              Sum: this.summary[gid] ? this.summary[gid].PointBet / 1000 : 0
            })
          }
        }
        if (this.selectOrder === 2) {
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
    },
    isPoker(o) {
      const pokerTypes = [22, 21, 28, 15, 23, 29, 34, 32, 49,46,35,113,120]
      for (let i = 0; i < pokerTypes.length; i++) {
        if (pokerTypes[i] === o) {
          return true
        }
      }
      return false
    },
    isSlots(o) {
      if (o > 50 && o < 100 || o > 149 && o < 200) {
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
      if (ob && ob.PointBet !== 0) {
        const systemGot = ob.PointLose + ob.PointTax - ob.PointWon
        const rate = systemGot * 100 / ob.PointBet
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
      if (ob && ob.PointBet !== 0) {
        const systemGot = ob.PointBet - ob.PointWon
        const rate = systemGot * 100 / ob.PointBet
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
      if (ob && ob.PointBet !== 0) {
        const systemGot = ob.PointLose + ob.PointTax - ob.PointWon
        return systemGot * 100 / ob.PointBet
      } else {
        return 0
      }
    },
    getSystemGot(ob) {
      if (ob) {
        return this.formatNumber(Math.floor((ob.PointLose + ob.PointTax - ob.PointWon) / 1000))
      }
    },
    getSystemMoneyGot(ob) {
      if (ob) {
        return this.formatNumber(Math.floor((ob.MoneyLose - ob.MoneyWon) / 1000))
      }
    },
    getRtp(ob) {
      if (ob && ob.PointBet !== 0) {
        return (ob.PointWon * 100 / ob.PointBet).toFixed(2)
      }
      return 0
    },
    getSlotsSummaryResult(ob) {
      if (ob && ob.PointBet !== 0) {
        return ((ob.PointBet - ob.PointWon) * 100 / ob.PointBet).toFixed(2)
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
          Path: '/log/pointgame/playlog/latest',
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
          Path: '/log/system/point',
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
            $this.logData = this.libPoint.TransForShow(objs)
            $this.preData = this.libPoint.TransForShow(response.Data.YesterdayItems)
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
      $this.getPoolList()
    },
    showHealth() {
      this.chartData = this.healthData
    },
    showOrigin() {
      this.chartData = this.originData
    },
    getBlackJackTitle() {
      return this.blackJackContext
    },
    getPoolList() {
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
        this.blackJackContext = ''
        $this.blackJackSum = 0
        const datas = []
        if (response.RetCode === 0) {
          for (const o of response.Data) {
            if (o.Gid === 37) {
              $this.blackJackSum += o.PrizePool
              datas.push(o)
            }
          }
        }
        datas.sort(function(a, b) {
          return a.Ante - b.Ante
        })
        for (const o of datas) {
          this.blackJackContext += '场次:' + this.formatNumber(o.Ante / 1000) + '    奖池:' + this.formatNumber(o.PrizePool / 1000) + '<br/>'
        }
      })
    },
    getAuthorityData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'systemMoneyConfig'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data && response.Data.Data !== '') {
            this.authorityCfg = JSON.parse(response.Data.Data)
            if (this.$store.state.user.pers['USER_MANAGEMENT']) {
              if (this.authorityCfg[this.name]) {
                // 有权限而且有限制
                this.defaultOrder = []
                for (const o of this.authorityCfg[this.name]) {
                  if (this.gameNames[o]) {
                    this.defaultOrder.push(o)
                  }
                }
              } else {
                this.sortOrder = this.defaultOrder
                return
              }
            } else {
              this.defaultOrder = []
            }
            this.sortOrder = this.defaultOrder
          }
        }
      })
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
      const timeData = {}
      const xLines = []
      const stamp1 = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
      for (let i = 0; i < 1440; i++) {
        const time = stamp1 + i * 60
        const hm = $libDate.FormateSecondStr(time, 5)
        timeData[hm] = {}
        xLines.push(hm)
      }
      for (const o of preObjs) {
        const hm = $libDate.FormateSecondStr(o.TimeKey, 5)
        timeData[hm]['pre'] = o
      }
      for (const o of objs) {
        const hm = $libDate.FormateSecondStr(o.TimeKey, 5)
        timeData[hm]['curr'] = o
      }
      for (let i = 0; i < xLines.length; i++) {
        healthData.xData.push(xLines[i])
        originData.xData.push(xLines[i])
        const ob = timeData[xLines[i]]['pre']

        const ob2 = timeData[xLines[i]]['curr']
        this.checkDate(ob, 1, originData, healthData)
        this.checkDate(ob2, 2, originData, healthData)
      }

      this.healthData = healthData
      this.originData = originData
    },
    checkDate(ob, type, originData, healthData) {
      if (ob) {
        if (type == 1) {
          const y = ob.PointBet > 0 ? (ob.PointLose + ob.PointTax - ob.PointWon) * 100 / ob.PointBet : 0
          healthData.yData[0].Data.push(y.toFixed(2))
          originData.yData[0].Data.push((ob.PointLose - ob.PointWon).toFixed(2))
          originData.yData[1].Data.push(ob.PointTax.toFixed(2))
          originData.yData[2].Data.push(ob.PointBet.toFixed(2))
        }
        if (type == 2) {
          const y2 = ob.PointBet > 0 ? (ob.PointLose + ob.PointTax - ob.PointWon) * 100 / ob.PointBet : 0
          healthData.yData[1].Data.push(y2.toFixed(2))
          originData.yData[3].Data.push((ob.PointLose - ob.PointWon).toFixed(2))
          originData.yData[4].Data.push(ob.PointTax.toFixed(2))
          originData.yData[5].Data.push(ob.PointBet.toFixed(2))
        }
      } else {
        if (type == 1) {
          originData.yData[0].Data.push(undefined)
          originData.yData[1].Data.push(undefined)
          originData.yData[2].Data.push(undefined)
          healthData.yData[0].Data.push(undefined)
        }
        if (type == 2) {
          originData.yData[3].Data.push(undefined)
          originData.yData[4].Data.push(undefined)
          originData.yData[5].Data.push(undefined)
          healthData.yData[1].Data.push(undefined)
        }
      }
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
      .card-panel {
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

      .card-panel-normal {
        color: rgba(0, 0, 0, 0.45);
      }

      .card-panel-OK {
        color: #409167;
      }

      .card-panel-Danger {
        color: #ff4949;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

</style>
