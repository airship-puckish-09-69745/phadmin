<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row>
      <el-col :offset="2" :span="20">
        平台:
        <el-button-group>
          <el-button
            v-for="p in displayedAppOptions"
            :key="p.value"
            :type="p.type"
            size="mini"
            :disabled="showLoading"
            @click="changeApp(p.value)"
          >
            {{ p.name }}
          </el-button>
          <el-dropdown
            v-if="hasMoreApps"
            trigger="click"
            :disabled="showLoading"
            @command="handleAppSelect"
          >
            <el-button
              size="mini"
              :type="isOtherAppSelected ? 'success' : 'info'"
              :disabled="showLoading"
            >
              {{ otherButtonLabel }}
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="p in hiddenAppOptions"
                :key="p.value"
                :command="p.value"
                :class="{ 'selected-app': p.value === appId }"
                :disabled="showLoading"
              >
                {{ p.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </el-col>
      <el-col :span="2">
        <el-button size="mini" :disabled="showLoading" @click="getInfo(10000, 1)">刷新</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 5px;">
      <el-col :offset="2" :span="11">
        筛选：
        <el-button-group>
          <el-button type="success" size="mini" :disabled="showLoading" @click="changeType(1)">默认</el-button>
          <el-button type="success" size="mini" :disabled="showLoading" @click="changeType(2)">Poker</el-button>
          <el-button type="success" size="mini" :disabled="showLoading" @click="changeType(3)">Slots</el-button>
          <el-button type="success" size="mini" :disabled="showLoading" @click="changeType(4)">其他</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="11">
        排序：
        <el-button-group>
          <el-button type="primary" size="mini" :disabled="showLoading" @click="changeOrder(1)">默认</el-button>
          <el-button type="primary" size="mini" :disabled="showLoading" @click="changeOrder(2)">按收益</el-button>
          <el-button type="primary" size="mini" :disabled="showLoading" @click="changeOrder(3)">按流水</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row v-loading="showLoading" class="panel-group" :gutter="10">
      <el-col v-if="HasACC()" :span="4" :xs="6" class="card-panel-col">
        <div
          :class="gid===10000?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
          @click="getInfo(10000,2)"
        >
          <div class="card-panel-description">
            <div class="card-panel-text">
              汇总：<span :class="getSummaryClass(total[selectType], selectType == 3)"> {{
                getSummaryResult(total[selectType], selectType == 3).toFixed(2)
              }}% </span>
            </div>
            <div>
              收益：{{ getSystemGot(total[selectType], selectType == 3) }}
            </div>
            <div>
              流水：{{ total[selectType] ? formatNumber(Math.floor(total[selectType].Bet / 1000)) : 0 }}
            </div>
            <div>
              在玩：{{ total[selectType].OnlineCount }})
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-for="(o,k) in sortOrder" v-if="o!=10000" :key="k" :span="4" :xs="6" class="card-panel-col">
        <div
          v-if="!isPopType(o)"
          :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
          @click="getInfo(o,2)"
        >
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ getGameName(o) }}：<span :class="getSummaryClass(summary[o], false)"> {{
                getSummaryResult(summary[o], false).toFixed(2)
              }}%</span>
            </div>
            <div>
              收益：{{ getSystemGot(summary[o], false) }}
            </div>
            <div>
              流水：{{ summary[o] ? formatNumber(Math.floor(summary[o].Bet / 1000)) : 0 }}
            </div>
            <div>
              在玩：{{ summary[o] ? summary[o].OnlineCount : 0 }}({{ summary[o] ? summary[o].RecentFive : 0 }})
            </div>
          </div>
        </div>

        <div
          v-else-if="isTexasMaster(o)"
          :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
          @click="getInfo(o,2)"
        >
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ gameNames[o] }}：<span :class="getSummaryClass(summary[o],false)"> {{
                getSummaryResult(summary[o], false).toFixed(2)
              }}%</span>
            </div>
            <div>
              收益：{{ getSystemGot(summary[o], false) }}
            </div>
            <div>
              流水：{{ summary[o] ? formatNumber(Math.floor(summary[o].Bet / 1000)) : 0 }}
            </div>
            <div>
              在玩：{{ summary[o] ? summary[o].OnlineCount : 0 }}({{ summary[o] ? summary[o].RecentFive : 0 }})
            </div>
            <div>
              保险：{{ summary[o] ? formatNumber(summary[o].Insure / 1000) : 0 }}
            </div>
          </div>
        </div>

        <div v-else>
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
                    :class="getSummaryClass(summary[o],false)"
                  > {{ getSummaryResult(summary[o], false).toFixed(2) }}%</span>
                </div>
                <div>
                  收益：{{ getSystemGot(summary[o], false) }}
                </div>
                <div>
                  流水：{{ summary[o] ? formatNumber(Math.floor(summary[o].Bet / 1000)) : 0 }}
                </div>
                <div>
                  在玩：{{ summary[o] ? summary[o].OnlineCount : 0 }}({{ summary[o] ? summary[o].RecentFive : 0 }})
                </div>
                <div v-if="o==37">
                  奖池： {{ formatNumber(blackJackSum / 1000) }}
                </div>
                <div v-else>
                  奖池：{{ getPrizePool(o) }} <span v-if="libShow.IsShowFreeFreezePool(o)" style="color: green">{{ getFreezePoolText(o) }}</span>
                </div>
              </div>
            </el-tooltip>
          </div>
          <div
            v-else
            :class="gid===o?'card-panel card-panel_selected':'card-panel card-panel_selected_not'"
            @click="getInfo(o,2)"
          >
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ gameNames[o] }}：<span :class="getSummaryClass(summary[o], true)"> {{
                  getSummaryResult(summary[o], true).toFixed(2)
                }}%</span>
              </div>
              <div>
                收益：{{ getSystemGot(summary[o], true) }}
              </div>
              <div>
                总下注：{{ summary[o] ? formatNumber(Math.floor(summary[o].Bet / 1000)) : 0 }}
              </div>
              <div>
                在玩：({{ summary[o] ? summary[o].RecentFive : 0 }})
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
            {{ scope.row.IsPay ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MoneyChanged"
          label="输赢"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MoneyChanged / 1000) }}
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
            {{ formatNumber(scope.row.MoneyNow / 1000) }}
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
import { mapGetters } from 'vuex'
import { systemMoneyChart } from '@/views/playerManage/systemMoneyChart/js/systemMoneyChart.js'

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
  name: 'SystemMoneyChartApp',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart, systemMoneyChart },
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
      libMoney: new MoneyShow(['MoneyWon', 'MoneyLose', 'MoneyTax', 'MoneyBet']),
      gid: 10000,
      appId: 0,
      summary: {},
      total: {
        1: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        2: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        3: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        4: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }
      }, // 不同筛选下的汇总
      gameNames: systemMoneyChart.data().gameNames,

      userVisible: false,
      users: [],
      // 糖果传奇调用addGameNames特殊处理
      defaultOrder: systemMoneyChart.data().defaultOrder,
      selectType: 1,

      selectOrder: 1,
      sortOrder: [],
      env: 'test',
      envProjectName: process.env.VUE_APP_PROJECT,
      authorityNum: 0,
      showZoogame: false,
      appList: [],
      appOptions: [],
      showLoading: false,
      showAppNum: 3 // 显示前 n 个应用
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
    displayedAppOptions() {
      // 显示前n个应用
      return this.appOptions.slice(0, this.showAppNum)
    },

    hiddenAppOptions() {
      // 隐藏其余的应用
      return this.appOptions.slice(this.showAppNum)
    },

    hasMoreApps() {
      // 判断是否有更多应用需要隐藏
      return this.appOptions.length > this.showAppNum
    },
    isOtherAppSelected() {
      // 判断当前选中的 appId 是否在隐藏的应用列表中
      return this.hiddenAppOptions.some(app => app.value === this.appId)
    },

    otherButtonLabel() {
      // 如果选中的是其他应用，则显示应用名，否则显示"其他"
      if (this.isOtherAppSelected) {
        const selectedApp = this.hiddenAppOptions.find(app => app.value === this.appId)
        return selectedApp ? '其他-' + selectedApp.name : '其他'
      }
      return '其他'
    }
  },
  // mixins: [IsMars],
  created() {
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
      this.showZoogame = true
    }
    this.env = store.getters.env || this.env
    this.addGameNames()
    this.getAllData()

    // this.getInfo(this.gid)
    if (process.env.NODE_ENV === 'development') {
      this.defaultOrder.push(120) // tongitsSwap
    }
    console.log(this.$store.state.user.pers['USER_MANAGEMENT'])
  },
  methods: {
    async getAllData() {
      this.getAppInfo()

      await this.getAuthorityData()

      await this.getInfo(this.gid)
    },
    HasACC() {
      if (this.$store.state.user.pers['USER_MANAGEMENT']) {
        if (this.$store.state.user.pers['UAT_MONITOR'] > 0 && this.env === 'test') {
          return true
        } else if (this.$store.state.user.pers['UAT_MONITOR'] > 0 && this.env === 'pro') {
          return false
        }
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
          if (systemMoneyChart.methods.isActivity(this.summary[this.defaultOrder[i]])) {
            if (this.isPoker(this.defaultOrder[i])) {
              pokers.push(this.defaultOrder[i])
            } else if (this.isSlots(this.defaultOrder[i])) {
              slots.push(this.defaultOrder[i])
            } else {
              others.push(this.defaultOrder[i])
            }
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

      if (this.selectOrder != 1) {
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
      if (IsMars()) { // 审核
        this.defaultOrder.push(76, 77, 78, 81, 79, 80, 82, 83, 175, 165, 169)
      } else {
        if (IsProd()) { // 线上
          this.defaultOrder.push(76, 80, 78, 82, 84, 86, 88, 90, 92, 94, 96, 98, 150, 152, 154, 156, 158, 160, 162, 164, 166, 170, 172,
            174, 176, 178, 180, 182, 168, 186, 184, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220,
            222, 226, 228, 232, 234, 236, 238, 240, 242, 244, 248, 250, 252, 253, 254, 255)
        } else {
          this.defaultOrder.push(76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 150, 152, 154, 156, 158, 160, 162, 164, 172, 188, 202,
            198, 192, 180, 166, 170, 176, 182, 174, 186, 178, 194, 184, 168, 196, 190, 200, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222,
            226, 228, 232, 234, 236, 238, 240, 242, 244, 248, 250, 252, 253, 254, 255)
        }
      }
      if (this.showZoogame) {
        this.defaultOrder.push(124, 125, 130, 131)
      }

      // 去重
      this.defaultOrder = [...new Set(this.defaultOrder)]
    },
    getPrizePool(o) {
      let pool = 0
      if (this.summary[o]) {
        pool = this.summary[o].PrizePool
      }
      if (this.summary[o] && this.summary[o].FreezePool != undefined) {
        pool -= this.summary[o].FreezePool
      }
      return this.formatNumber(pool / 1000)
    },
    getFreezePoolText(o) {
      console.log('getFreezePoolText gid:', o, this.summary[o] && this.summary[o].FreezePool)
      return this.summary[o] && this.summary[o].FreezePool !== undefined ? '未提现冻结 ：' + this.formatNumber(this.summary[o].FreezePool / 1000) : ''
    },
    getGameName(o) {
      const name = this.gameNames[o]
      if (name == '') {
        console.log('unknown game: ', o)
        return o
      }
      return name
    },
    isPopType(o) {
      return systemMoneyChart.methods.isPopType(o)
    },
    isPoker(o) {
      return systemMoneyChart.methods.isPoker(o)
    },
    isSlots(o) {
      return systemMoneyChart.methods.isSlots(o)
    },
    isTexasMaster(o) {
      return systemMoneyChart.methods.isTexasMaster(o)
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
    getSummaryClass(ob, isSlot) {
      return systemMoneyChart.methods.getSummaryClass(ob, isSlot)
    },
    getSummaryResult(ob, isSlots) {
      return systemMoneyChart.methods.getSummaryResult(ob, isSlots)
    },
    getSystemGot(ob, isSlots) {
      return systemMoneyChart.methods.getSystemGot(ob, isSlots)
    },
    getRtp(ob) {
      return systemMoneyChart.methods.getRtp(ob)
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
      this.showLoading = true
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
          Path: '/log/system/money/app',
          Gid: this.gid,
          App: this.appId,
          Type: iType,
          Day: parseInt(this.item.date / 1000)
        }
      }).then(response => {
        this.showLoading = false
        const has = []
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
            $this.total[2] = { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }
            $this.total[3] = { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }
            $this.total[4] = { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }
            $this.total[1] = { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }

            for (const responseElement of $this.defaultOrder) {
              has.push(responseElement)
            }

            console.log('=======', this.sortOrder)
            for (const o in $this.summary) {
              if ($this.authorityNum > 0 && !has.includes(parseInt(o))) {
                continue
              }
              if (o === '10000') {
                continue
              }
              let sType = 4
              if ($this.isSlots(parseInt(o))) {
                sType = 3
              } else if ($this.isPoker(parseInt(o))) {
                sType = 2
              }
              totalOnline += $this.summary[o].OnlineCount > 0 ? $this.summary[o].OnlineCount : $this.summary[o].RecentFive
              $this.total[sType].Bet += $this.summary[o].Bet
              $this.total[sType].Won += $this.summary[o].Won
              $this.total[sType].Tax += $this.summary[o].Tax
              $this.total[sType].Lose += $this.summary[o].Lose
              $this.total[sType].OnlineCount += $this.summary[o].OnlineCount > 0 ? $this.summary[o].OnlineCount : $this.summary[o].RecentFive

              $this.total[1].Bet += $this.summary[o].Bet
              $this.total[1].Won += $this.summary[o].Won
              $this.total[1].Tax += $this.summary[o].Tax
              $this.total[1].Lose += $this.summary[o].Lose
              $this.total[1].OnlineCount += $this.summary[o].OnlineCount > 0 ? $this.summary[o].OnlineCount : $this.summary[o].RecentFive
            }
            $this.summary[10000].OnlineCount = totalOnline
            if ($this.authorityNum === 0) {
              $this.total[1] = $this.summary[10000]
            }
          }
          $this.initChartData()
          $this.showHealth()
        }
      }).catch((error) => {
        $this.showLoading = false
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
          Env: store.getters.env,
          AppId: this.appId
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
            if (this.$store.state.user.pers['USER_MANAGEMENT'] > 0) {
              // 限制查看pro
              if ((this.$store.state.user.pers['UAT_MONITOR'] > 0) && this.env === 'test') {
                this.sortOrder = this.defaultOrder
                return
              } else if ((this.$store.state.user.pers['UAT_MONITOR'] > 0) && this.env === 'pro') {
                this.defaultOrder = []
                this.sortOrder = this.defaultOrder
                return
              }
              console.log('=======', this.name, this.authorityCfg[this.name], this.defaultOrder)
              if (this.authorityCfg[this.name]) {
                // 有权限而且有限制
                this.defaultOrder = []
                for (const o of this.authorityCfg[this.name]) {
                  if (this.gameNames[o]) {
                    this.defaultOrder.push(o)
                  }
                }
                this.authorityNum = this.defaultOrder.length
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
        if (this.isSlots(ob.Gid)) {
          // 老虎机目前没有存 MoneyLose
          if (type == 1) {
            // 老虎机目前没有存 MoneyLose
            const y = ob.MoneyBet > 0 ? (ob.MoneyBet - ob.MoneyWon) * 100 / ob.MoneyBet : 0
            healthData.yData[0].Data.push(y.toFixed(2))
            originData.yData[0].Data.push((ob.MoneyBet - ob.MoneyWon).toFixed(2))
            originData.yData[1].Data.push(ob.MoneyTax.toFixed(2))
            originData.yData[2].Data.push(ob.MoneyBet.toFixed(2))
          }
          if (type == 2) {
            const y2 = ob.MoneyBet > 0 ? (ob.MoneyBet - ob.MoneyWon) * 100 / ob.MoneyBet : 0
            healthData.yData[1].Data.push(y2.toFixed(2))
            originData.yData[3].Data.push((ob.MoneyBet - ob.MoneyWon).toFixed(2))
            originData.yData[4].Data.push(ob.MoneyTax.toFixed(2))
            originData.yData[5].Data.push(ob.MoneyBet.toFixed(2))
          }
        } else {
          if (type == 1) {
            const y = ob.MoneyBet > 0 ? (ob.MoneyLose + ob.MoneyTax - ob.MoneyWon) * 100 / ob.MoneyBet : 0
            healthData.yData[0].Data.push(y.toFixed(2))
            originData.yData[0].Data.push((ob.MoneyLose - ob.MoneyWon).toFixed(2))
            originData.yData[1].Data.push(ob.MoneyTax.toFixed(2))
            originData.yData[2].Data.push(ob.MoneyBet.toFixed(2))
          }
          if (type == 2) {
            const y2 = ob.MoneyBet > 0 ? (ob.MoneyLose + ob.MoneyTax - ob.MoneyWon) * 100 / ob.MoneyBet : 0
            healthData.yData[1].Data.push(y2.toFixed(2))
            originData.yData[3].Data.push((ob.MoneyLose - ob.MoneyWon).toFixed(2))
            originData.yData[4].Data.push(ob.MoneyTax.toFixed(2))
            originData.yData[5].Data.push(ob.MoneyBet.toFixed(2))
          }
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
    },
    getAppStorageKey() {
      return 'systemMoneyChartApp_' + (this.env || 'test')
    },
    saveLastApp(app) {
      try {
        localStorage.setItem(this.getAppStorageKey(), String(app))
      } catch (e) {
        // ignore
      }
    },
    loadLastApp() {
      try {
        const v = localStorage.getItem(this.getAppStorageKey())
        if (v !== null && v !== undefined && v !== '') {
          return parseInt(v)
        }
      } catch (e) {
        // ignore
      }
      return null
    },
    getAppInfo() {
      let apps = [
        {
          'ID': 0,
          'Account': '所有'
        },
        {
          'ID': 1000002,
          'Account': '内部'
        },
        {
          'ID': 1000003,
          'Account': 'BP test'
        },
        {
          'ID': 1000049,
          'Account': 'ZooGameDev'
        },
        {
          'ID': 2000002,
          'Account': 'CP内部（2000002）'
        }
      ]
      if (process.env.VUE_APP_PROJECT_NAME === '菲1-线上环境' || process.env.VUE_APP_PROJECT_NAME === '菲1-线上环境v2') {
        if (this.env == 'test') {
          apps = [
            {
              'ID': 0,
              'Account': '所有'
            },
            {
              'ID': 1000003,
              'Account': 'BP UAT'
            },
            {
              'ID': 2000002,
              'Account': 'CP内部 UAT（2000002）'
            },
            {
              'ID': 1000012,
              'Account': 'CP UAT（1000012）'
            },
            {
              'ID': 1000014,
              'Account': 'CP UAT（1000014）'
            },
            {
              'ID': 1000002,
              'Account': '内部'
            }
          ]
        } else {
          apps = [
            {
              'ID': 0,
              'Account': '所有'
            },
            {
              'ID': 1000005,
              'Account': 'BP正式'
            },
            {
              'ID': 2000005,
              'Account': 'CP正式'
            },
            {
              'ID': 1000002,
              'Account': '内部'
            },
            {
              'ID': 2000002,
              'Account': 'CP内部（2000002）'
            }
          ]
        }
      }
      this.appList = apps

      const lastApp = this.loadLastApp()
      if (lastApp !== null && this.appList.some(p => p.ID === lastApp)) {
        this.appId = lastApp
      }

      this.initAppOptions(this.appList)
    },
    initAppOptions() {
      if (this.appList.length === 0) {
        return
      }

      const item = []
      let found = false
      for (const p of this.appList) {
        if (p.ID === this.appId) {
          found = true
        }
        // 更新按钮类型逻辑
        const isSelected = p.ID === this.appId
        item.push({
          name: p.Account,
          value: p.ID,
          type: isSelected ? 'success' : 'info'
        })
      }
      this.appOptions = item
      if (!found) {
        // 如果当前appId不在列表中，默认选择第一个
        this.appId = this.appList[0].ID
        this.initAppOptions()
      }
    },
    handleAppSelect(value) {
      this.changeApp(value)
    },
    changeApp(app) {
      console.log('changeApp', app)
      this.appId = app
      this.saveLastApp(app)
      this.initAppOptions()
      this.getInfo(this.gid, 1)
      if (this.gid != 10000) {
        this.getInfo(this.gid, 2)
      }
      // this.changeType(1) // 重置为默认排序
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
    height: 120px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    // 移动端高度改为128px
    @media screen and (max-width: 992px) {
      height: 118px;
    }

    .card-panel-description {
      float: left;
      padding-left: 5px;
      font-weight: bold;
      margin: 18px 26px 26px 26px;
      margin-left: 0px;
      @media screen and (max-width: 992px) {
        margin: 6px;
      }

      .card-panel-text {
        line-height: 18px;
        font-size: 18px;
        margin-bottom: 12px;
        @media screen and (max-width: 992px) {
          font-size: 15px;
        }
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

.search-filter {
  display: block;
  width: fit-content;
  margin: 0 auto;
  &-item {
    display: inline-block;
    width: auto;
    margin-right: 32px;
    margin-bottom: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.selected-app {
  background-color: #90EE90 !important;
  color: #fff !important;
}

</style>
