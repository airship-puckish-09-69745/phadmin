<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item v-model="item.app" label="App：" :required="true" label-width="80px">
          <el-select v-model="item.app" filterable placeholder="请选择" size="mini">
            <el-option
              v-for="row in appInfo"
              :key="row.key"
              :label="row.label"
              :value="row.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.gameId" label="游戏：" :required="true" label-width="80px">
          <el-select v-model="item.gameId" filterable placeholder="游戏筛选" size="mini">
            <el-option
              v-for="row in games2"
              :label="row.name"
              :value="row.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item v-model="item.totalBet" label="下注额：" label-width="70px">
          <el-col style="width: auto">
            <el-tooltip class="item" effect="dark" content="主要用于 tongits" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-select v-model="item.totalBet" placeholder="下注额" size="mini">
            <el-option
              v-for="row in totalBets"
              :label="row == 0 ? '所有' : formatNumber(row / 1000)"
              :value="row"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="click2getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-descriptions
          class="margin-top"
          :column="5"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总投注笔数：">{{ formatNumber(item.total_bet_num) }}</el-descriptions-item>
          <el-descriptions-item label="总下注额度："> {{ formatNumber(item.total_bet_amount / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="总jackpot金额：">{{ formatNumber(item.total_jackpot_amount / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="总有效投注："> {{ formatNumber(item.total_valid_bet_amount / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="GGR：">{{ formatNumber(-item.total_win_loss_amount / 1000) }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;margin-top:10px;"
        max-height="620"
      >
        <el-table-column
          prop="uid"
          label="Uid"
          width="90"
        />
        <el-table-column
          prop="account"
          label="平台账号"
          width="150"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="300"
              trigger="hover"
            >
              <template>
                <el-row>
                  GameLog: {{ scope.row.game_log }}
                </el-row>
                <el-row>
                  UniqueNO: {{ scope.row.unique_no }}
                </el-row>
                <el-row>
                  WalletGameLogNo: {{ scope.row.wallet_gameLog_no		 }}
                </el-row>
              </template>
              <span slot="reference" size="mini">{{ scope.row.account }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="game_id"
          label="平台GID"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.game_id }}（{{ games[scope.row.game_id] }}）
          </template>
        </el-table-column>
        <el-table-column
          prop="bet_amount"
          label="下注额"
          width="80"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.bet_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="valid_bet_amount"
          label="有效下注"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.game_type===2">
              {{ formatNumber(scope.row.valid_bet_amount/1000) }}
            </span>
            <span v-else>
              {{ formatNumber(scope.row.valid_bet_amount/1000) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="before_amount"
          label="注前余额"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.before_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payoff_amount"
          label="资产变化"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.payoff_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="service_fee"
          label="下注类型"
          width="80"
        >
          <template slot-scope="scope">
            {{ showBetType(scope.row.bet_type || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="service_fee"
          label="服务费"
          width="80"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.service_fee > 0 ? scope.row.service_fee/1000 : 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="taxes"
          label="抽水贡献值"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.taxes * Math.pow(10, -9)).toFixed(9) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="taxes"
          label="抽水上限比例（德州）"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.taxe_ratios/10000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ggr"
          label="GGR"
          width="80"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ggr / 1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="jackpot_total_amount"
          label="Jackpot Total Amount"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.jackpot_total_amount / 1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_now"
          label="结算后余额"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.money_now/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pot_bet"
          label="jackpot bet"
          width="100"
        >
          <template slot-scope="scope">
            {{ jackportShow(scope.row.pot_bet/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="jackpot_amount"
          label="获得jackpot"
          width="100"
        >
          <template slot-scope="scope">
            {{ jackportShow(scope.row.jackpot_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="real_jp"
          label="real jackpot"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber((scope.row.real_jp || 0)/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="wallet"
          label="钱包类型"
          width="100"
        >
          <template slot-scope="scope">
            {{ showWalletType(scope.row.wallet || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="insure"
          label="保险收益（德州）"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber((scope.row.insure || 0)/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="投注（开始）时间"
          width="150"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.start_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束（结算）时间"
          width="150"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.end_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="game_type"
          label="游戏类型"
          width="80"
        >
          <template slot-scope="scope">
            {{ gameTypes[scope.row.game_type] }}
          </template>
        </el-table-column>

        <el-table-column
          prop="site_id"
          label="站点标识"
          width="80"
        />
        <el-table-column
          prop="tx_id"
          label="钱包交易ID"
          width="250"
        />

        <el-table-column
          prop="round_id"
          label="钱包回合ID"
          width="250"
        />

      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.tooltip-button {
  margin-right: 10px;
}
</style>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
// import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      // appId: 1000000,
      appInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        start: Date.parse(new Date(this.dDate(0, 30))), // $libDate.GetDayBegin(new Date().getTime()),
        end: Date.parse(new Date()), // $libDate.GetDayEnd(new Date().getTime()),
        app: '',
        type: 0,
        gameId: 0,
        totalBet: 0, // 下注额筛选
        total_bet_num: 0,
        total_valid_bet_amount: 0,
        total_win_loss_amount: 0,
        total_bet_amount: 0,
        total_jackpot_amount: 0
      },
      totalData: {
        round: 0,
        betMoney: 0,
        winMoney: 0,
        normalMoney: 0,
        wildMoney: 0,
        scatterMoney: 0,
        jackpotMoney: 0
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      types: { 1: '转出', 2: '转入' },
      allStatus: { 1: '赢', 2: '输', 3: '平' },
      gameTypes: { 1: '老虎机', 2: '纸牌', 3: '街机' },
      games: {},
      games2: [
        { id: 0, name: 'All games' }
      ],
      totalBets: [0, 15000, 100000, 400000, 1000000, 5000000, 4000000],
      showDetail: false,
      detailContent: '',
      detailPayLine: 0
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    this.item.gameId = 0
    this.getAppInfo()
    this.getSubGames()
  },
  methods: {
    // 设置默认日期
    dDate(daysAgo, minutesAgo) {
      var now = new Date()
      var date = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000 - minutesAgo * 60 * 1000)
      if (now.getDate() !== date.getDate()) {
        var nowYear = now.getFullYear()
        var nowMonth = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)
        var nowDay = now.getDate() > 9 ? now.getDate() : '0' + now.getDate()
        return nowYear + '-' + nowMonth + '-' + nowDay + ' 00:00:00'
      }
      var year = date.getFullYear()
      var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      var hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      var result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':00'
      return result
    },
    movePointLeft(str, scale) {
      var s, s1, s2, ch, ps, sign
      ch = '.'
      sign = ''
      s = str || ''
      if (scale <= 0) return s
      ps = s.split('.')
      s1 = ps[0] ? ps[0] : ''
      s2 = ps[1] ? ps[1] : ''
      if (s1.slice(0, 1) == '-') {
        // 负数
        s1 = s1.slice(1)
        sign = '-'
      }
      if (s1.length <= scale) {
        ch = '0.'
        s1 = this.padLeft(s1, scale)
      }
      return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    showWalletType(n) {
      return n === 0 ? '转账' : '单一'
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    showBetType(n) {
      switch (n) {
        case 0:
        case 1:
          return '常规'
        case 2:
        case 3:
          return 'FreeSpin'
        default:
          return 'Unknown'
      }
    },
    jackportShow(n) {
      if (n >= 0) {
        return this.formatNumber(n)
      }
      return '无'
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    getSubGames() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('objs>>>>>', objs)
          for (let i = 0; i < response.Data.length; i++) {
            if (objs[i].ID === 13) {
              continue
            }
            $this.games[objs[i].GameID] = objs[i].Name
            const oneGame = {
              id: objs[i].GameID,
              name: objs[i].Name
            }
            $this.games2.push(oneGame)
          }
        }
      })
    },
    click2getInfo() {
      this.currentPage = 1
      this.getInfo()
    },
    getInfo() {
      const $this = this

      if ((this.item.end - this.item.start) / 1000 >= 3600) { // 时间区间限制在1小时内
        this.$message.error('为了不影响业务，此处查询时间范围不能超过一个小时')
        return false
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/thirdparties/playlog/list',
          Uid: this.item.Uid,
          App: this.item.app,
          StartTime: this.item.start / 1000,
          EndTime: this.item.end / 1000,
          idDesc: '1',
          Page: this.currentPage,
          Limit: this.pageNum,
          gameId: this.item.gameId,
          totalBet: this.item.totalBet,
          Sumary: '1',
          type: this.item.type
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.rows || []
          $this.ret = response.Data.rows
          $this.tableData = objs
          console.log('objs>>>>>', objs)
          this.totalCount = response.Data.total
          $this.tableData = objs
          $this.item.total_bet_num = response.Data.sumary.total_bet_num || 0
          $this.item.total_valid_bet_amount = response.Data.sumary.total_valid_bet_amount || 0
          $this.item.total_win_loss_amount = response.Data.sumary.total_win_loss_amount || 0
          $this.item.total_bet_amount = response.Data.sumary.total_bet_amount || 0
          $this.item.total_jackpot_amount = response.Data.sumary.total_jackpot_amount || 0
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
        }
      })
    }
  }
}

</script>
