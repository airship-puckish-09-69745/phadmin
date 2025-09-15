<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-row class="search-filter">
      <div class="search-filter-item search-filter-item-btn">
        <el-button size="mini" @click="getInfo(10000, 1)">刷新</el-button>
      </div>
      <div class="search-filter-item search-filter-item-type">
        筛选：
        <el-button-group>
          <el-button type="success" size="mini" @click="changeType(1)">默认</el-button>
          <el-button type="success" size="mini" @click="changeType(2)">Poker</el-button>
          <el-button type="success" size="mini" @click="changeType(3)">Slots</el-button>
          <el-button type="success" size="mini" @click="changeType(4)">其他</el-button>
        </el-button-group>
      </div>
      <div class="search-filter-item search-filter-item-order">
        排序：
        <el-button-group>
          <el-button type="primary" size="mini" @click="changeOrder(1)">默认</el-button>
          <el-button type="primary" size="mini" @click="changeOrder(2)">按收益</el-button>
          <el-button type="primary" size="mini" @click="changeOrder(3)">按流水</el-button>
        </el-button-group>
      </div>
    </el-row>
    <el-row class="panel-group" :gutter="10">
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
                  奖池：{{ summary[o] ? formatNumber(summary[o].PrizePool / 1000) : 0 }}
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
      libMoney: new MoneyShow(['MoneyWon', 'MoneyLose', 'MoneyTax', 'MoneyBet']),
      gid: 10000,
      summary: {},
      total: {
        1: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        2: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        3: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 },
        4: { Bet: 0, Lose: 0, Won: 0, Tax: 0, OnlineCount: 0 }
      }, // 不同筛选下的汇总
      gameNames: {
        10: 'Crash',
        15: 'Texas Poker',
        51: '凤凰',
        52: '睡美人',
        21: 'Pusoy',
        22: 'Tongits-Pot',
        23: 'Lucky 9',
        25: 'Color',
        20: 'MINES',
        34: 'Pusoy-Dos',
        49: 'Niu Niu',
        100: 'Tower',
        76: 'Candy Rush',
        77: '糖果传奇Allline',
        78: 'SuperGems',
        79: 'CandyCrazeMars',
        80: 'Candy Craze',
        81: 'SuperGemsMars',
        82: 'Millionaire',
        83: 'MillionaireMars',
        84: 'Fortune Ace',
        85: 'FortuneAce',
        154: 'GrandAce',
        160: 'GigaAce',
        86: 'SuperGems2',
        87: '超级宝宝石II Mars',
        88: 'Lucky777',
        90: 'Fortune Coming',
        92: 'Ultra Ace',
        94: 'Wild Buffalo',
        96: 'Roman Arena',
        98: 'Super Tongit',
        28: 'Tongits Joker',
        29: 'Tongits Quick',
        31: 'Tongits-经典',
        32: 'Texas Plus',
        2032: 'Texas MTT',
        101: 'Sicbo',
        102: 'Hilo',
        103: 'Windrop',
        119: 'Windropc积分',
        6: '7Up7Down',
        104: 'Dragon Tiger',
        35: 'Solitaire',
        37: 'BlackJack',
        46: 'Domino',
        47: '8 Ball Plus',
        48: '9 Ball Plus',
        105: 'Andar Bahar',
        106: 'PIGGY TAP',
        107: 'Baccarat',
        108: 'Dropball',
        110: 'VideoPoker',
        111: 'Domino QiuQiu',
        112: 'Wingo',
        113: 'PusoySwap',
        115: 'Multi NiuNiu',
        116: 'Gin Rummy',
        117: 'Uno',
        152: 'Aladdin\'s Lamp',
        150: 'SuperGems3',
        156: 'Crazy Ace',
        158: 'Shark Kingdom',
        168: 'Pharaoh\'s Treasure',
        118: 'Car Racing',
        120: 'Tongits Swap',
        162: 'Major Ace',
        166: 'Fire Link',
        164: 'MahjongFortune',
        165: 'MahjongFortuneMars',
        198: 'FortuneBlessing',
        202: 'FortunateEbisu',
        206: 'LuckyWineglass',
        212: 'PirateShip',
        218: 'WrathOfZeus2',
        188: 'StreetFighting',
        190: 'Arcane Egypt',
        192: 'BountyRaid',
        180: 'FishingMaster',
        172: 'WrathOfZeus',
        122: 'Filipino Mahjong',
        123: 'MINES SHOWDOWN',
        124: 'Jackpot Wheel',
        125: 'Free Spin',
        170: 'Epic Ace',
        174: 'Treasure Bowl',
        176: 'Puppy Home',
        182: 'God Of Fortune',
        184: 'Dance of the Lion',
        186: 'MahjongJackpot',
        178: 'Mayan Totem',
        194: 'GoldTrain',
        196: 'GoldMiner',
        200: 'AtlantisTreasure',
        204: 'Space Treasure',
        208: 'Candy Burst',
        210: 'Lucky Spirits',
        214: 'PumpkinCash',
        216: 'Phoenix',
        220: 'Golden Dragon',
        222: 'Lion Fortune',
        9: 'Teen Patti',
        126: 'Pusoy Wild',
        2031: 'TongitsMtt',
        127: 'SaBong',
        128: 'Tongits JP',
        129: 'Live Color',
        130: 'Remi',
        131: 'Remi Pro',
        132: 'Mines Magic',
        134: 'Pusoy JP',
        1: 'Rummy',
        10000: '汇总'
      },

      userVisible: false,
      users: [],
      // 糖果传奇调用addGameNames特殊处理
      defaultOrder: [10000, 15, 22, 28, 29, 2031, 23, 25, 10, 21, 20, 34, 100, 102, 101, 103, 104, 105, 106, 111, 6, 32, 2032,
        35, 37, 107, 108, 110, 112, 115, 46, 47, 48, 49, 113, 118, 123, 117, 116, 126, 127, 128, 129, 132, 134], // 糖果传奇调用addGameNames特殊处理
      selectType: 1,

      selectOrder: 1,
      sortOrder: [],
      env: 'test',
      envProjectName: process.env.VUE_APP_PROJECT,
      authorityNum: 0,
      showZoogame: false
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
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
      this.showZoogame = true
    }
    this.env = store.getters.env || this.env
    // this.sortOrder = this.defaultOrder

    // if (this.isIN())  {
    //   this.sortOrder = this.defaultOrder
    // } else {
    //   this.sortOrder = this.BROrder
    // }
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
            174, 176, 178, 180, 182, 168, 186, 184, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220)
        } else {
          this.defaultOrder.push(76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 150, 152, 154, 156, 158, 160, 162, 164, 172, 188, 202,
            198, 192, 180, 166, 170, 176, 182, 174, 186, 178, 194, 184, 168, 196, 190, 200, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222)
        }
      }
      if (this.showZoogame) {
        this.defaultOrder.push(124, 125, 130, 131)
      }
    },
    getGameName(o) {
      let name = this.gameNames[o]
      if (name == '') {
        console.log('unknown game: ', o)
        return o
      }
      return name
    },
    isPopType(o) {
      const popTypes = [1, 9, 8, 14, 15, 21, 22, 29, 23, 28, 31, 34, 2032, 46, 47, 48, 35, 49, 113, 122, 130, 131]
      for (let i = 0; i < popTypes.length; i++) {
        if (popTypes[i] === o) {
          return false
        }
      }
      return true
    },
    isPoker(o) {
      const pokerTypes = [22, 21, 28, 15, 23, 29, 34, 32, 49, 46, 35, 113, 120, 123, 117, 116, 126, 128, 134]
      for (let i = 0; i < pokerTypes.length; i++) {
        if (pokerTypes[i] === o) {
          return true
        }
      }
      return false
    },
    isSlots(o) {
      if ((o > 50 && o < 100) || (o > 149 && o < 500)) {
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
    getSummaryClass(ob, isSlot) {
      if (ob && ob.Bet !== 0) {
        let systemGot = ob.Lose + ob.Tax - ob.Won
        if (isSlot) {
          systemGot = ob.Bet - ob.Won
        }
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
    /*    getSummaryRtpClass(ob) {
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
    },*/
    getSummaryResult(ob, isSlots) {
      if (ob && ob.Bet !== 0) {
        let systemGot = ob.Lose + ob.Tax - ob.Won
        if (isSlots) {
          systemGot = ob.Bet - ob.Won
        }
        // if (this.authorityNum>0){
        //   systemGot = ob.Bet - ob.Won
        // }
        return systemGot * 100 / ob.Bet
      } else {
        return 0
      }
    },
    getSystemGot(ob, isSlots) {
      if (ob) {
        if (isSlots) {
          return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
        } else {
          // let flag = true
          // 汇总只有老虎机的时候
          // for (const o of this.defaultOrder) {
          //   if (!this.isSlots(o) && o!==10000){
          //     flag = false
          //   }
          // }
          //
          // if (flag) {
          //   return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
          // }
          // if (this.authorityNum>0){
          //   return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
          // }
          return this.formatNumber(Math.floor((ob.Lose + ob.Tax - ob.Won) / 1000))
        }
      }
    },
    getRtp(ob) {
      if (ob && ob.Bet !== 0) {
        return (ob.Won * 100 / ob.Bet).toFixed(2)
      }
      return 0
    },
    /*    getSlotsSummaryResult(ob) {
      if (ob && ob.Bet !== 0) {
        return ((ob.Bet - ob.Won) * 100 / ob.Bet).toFixed(2)
      }
      return 0
    },*/
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
</style>
