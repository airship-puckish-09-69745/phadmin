<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="App：" v-model="item.app" :required="true" label-width="80px">
          <el-input-number type="number" placeholder="请输入App" value="1000000" :width="150"/>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
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
      >
        <el-table-column
          prop="unique_no"
          label="UniqueNO"
          width="120"
        />
        <el-table-column
          prop="account"
          label="用户唯一标识"
          width="120"
        />
        <el-table-column
          prop="game_id"
          label="给平台方的游戏id"
          width="120"
        >
          <template slot-scope="scope">
            {{scope.row.game_id}}（{{ games[scope.row.game_id] }}）
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
          prop="Status"
          label="输赢平"
          width="80"
        >
          <template slot-scope="scope">
            {{ allStatus[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="bet_amount"
          label="下注额"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.bet_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="before_amount"
          label="投注前用户余额"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.before_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payoff_amount"
          label="输赢金额（减去服务费）"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.payoff_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="service_fee"
          label="服务费"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.service_fee/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="jackpot_amount"
          label="获得 jackpot 的金额"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.jackpot_amount/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="投注（开始）时间"
          width="200"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.start_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束（结算）时间"
          width="200"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.end_time" />
          </template>
        </el-table-column>
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

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
// import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      appId: 1000000,
      env: 'dev',
      item: {
        Uid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()),
        app: -1,
        type: 0
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
      allStatus: { 1: '赢', 2: '平', 3: '输' },
      gameTypes: { 1: '老虎机', 2: '纸牌', 3: '街机' },
      games: { 1: 'Color', 2: 'Rocket', 3: 'Lucky9', 4: 'Tongits', 5: 'Sleeping Beauty', 6: 'Phoenix' },
      showDetail: false,
      detailContent: '',
      detailPayLine: 0
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/thirdparties/playlog/list',
          Uid: this.item.Uid,
          App: this.appId,
          StartTime: $libDate.SelectTimeToIndia(this.item.start) / 1000,
          EndTime: $libDate.SelectTimeToIndia(this.item.end) / 1000,
          Page: this.currentPage,
          Limit: this.pageNum,
          type: this.item.type
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.rows || []
          $this.ret = response.Data.rows
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          this.totalCount = response.Data.total
          $this.tableData = objs
        }
      })
    }
  }
}

</script>
