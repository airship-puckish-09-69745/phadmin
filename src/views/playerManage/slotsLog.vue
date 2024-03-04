<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="item.actType" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option v-for="(o,k) in typeNames" :label="o" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="item.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="isVup"
          /> 小黑屋
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showChart">输赢图表</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :offset="5" :span="12">
        <el-descriptions
          class="margin-top"
          :column="5"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总局数："> {{ statData.round }}</el-descriptions-item>
          <el-descriptions-item label="总下注金额："> {{ formatNumber(statData.betMoney / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="总返奖金额："> {{ formatNumber(statData.winMoney / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="总赢：">{{ formatNumber(statData.winMoney / 1000 - statData.betMoney / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="抽水：">{{ formatNumber(statData.totalFee / 1000) }}</el-descriptions-item>
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
        @row-click="clickData"
      >
        <el-table-column
          prop="Id"
          label="ID"
          width="100"
        />
        <el-table-column
          prop="Uptime"
          label="时间"
          sortable
          width="100"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="4" :timestamp="scope.row.Uptime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="ActType"
          label="操作类型"
        >
          <template slot-scope="scope">
            {{ typeNames[scope.row.ActType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Bet"
          label="下注"
          width="70"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Bet/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ReturnBet"
          label="输赢"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ReturnBet/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ServiceFee"
          label="服务费"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ServiceFee/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PayLine"
          label="命中"
          width="70"
        />
        <template v-if="[51,52,53,54,57,58,59,66,67,76].indexOf(gid) >= 0">
          <el-table-column
            header-align="center"
            label="剧本"
          >
            <el-table-column prop="ActLogObj.ActOdds" label="剧本倍率" />
            <el-table-column prop="ActLogObj.TargetOdds" label="目标倍率" />
            <el-table-column prop="ActLogObj.CurrentOdds" label="当前倍率" />
            <el-table-column prop="ActLogObj.CurrentOverflow" label="溢出" width="70" />
            <el-table-column prop="ActLogObj.Profit" :formatter="toRupee" label="个人输赢" width="100" />
            <el-table-column prop="ActLogObj.RoomProfit" :formatter="toRupee" label="房间输赢" />
            <el-table-column prop="ActLogObj.Deposit" :formatter="toRupee" label="Deposit" />
            <el-table-column prop="ActLogObj.Winning" :formatter="toRupee" label="Winning" />
            <el-table-column prop="ActLogObj.RoomPool" :formatter="toRupee" label="房间水池" />
            <el-table-column prop="ActLogObj.EntryPoolMoney" :formatter="toRupee" label="进入水池" />
            <el-table-column prop="ActLogObj.HelpType" :formatter="showHelpType" label="帮助类型" />
            <el-table-column prop="ActLogObj.HelpMoney" :formatter="toRupee" label="帮助金额" />
            <el-table-column prop="ActLogObj.DangerFactor" label="危险系数" />
            <el-table-column prop="ActLogObj.DoWinRate" label="执行胜率" />
            <el-table-column prop="ActLogObj.CurrentWinRate" :formatter="showWinRate" label="当前胜率" />
            <el-table-column prop="ActLogObj.ScriptCol" label="剧本坐标">
              <template slot-scope="scope">
                {{ showPosition(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column prop="ActLogObj.RandomFlag" :formatter="showRandomFlag" label="随机flag" />
            <el-table-column prop="ActLogObj.RandomOdds" label="目标倍率" />
            <el-table-column prop="ActLogObj.DoRandomOdds" label="执行目标倍率" />
            <el-table-column prop="ActLogObj.HitOdds" label="最终倍率" />
            <el-table-column prop="ActLogObj.IsWinRateSwitchScript" :formatter="showBool" label="切换脚本">
              <template slot-scope="scope">
                <span v-if="scope.row.ActLogObj.IsWinRateSwitchScript || scope.row.ActLogObj.IsFinishSwitchScript" style="color:red">{{ scope.row.ActLogObj.IsWinRateSwitchScript?'胜率变换':'剧本切换' }}</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="ActLogObj.SwitchScriptBeforeTargetOdds" label="切换前目标倍率" />
            <el-table-column prop="ActLogObj.SwitchScriptBeforeCurrentOdds" label="切换前执行倍率" />
            <el-table-column prop="ActLogObj.SwitchScriptBeforeOverflow" label="切换前溢出值" />
            <el-table-column prop="ActLogObj.IsFinishCurrentOdds" :formatter="showBool" label="是否执行完当前目标倍率" />
            <el-table-column prop="ActLogObj.NextOverflow" label="下一个倍率溢出值" />
            <el-table-column prop="ActLogObj.NextTargetOdds" label="下一个目标倍率" />
            <el-table-column prop="ActLogObj.IsResetAct" :formatter="showBool" label="免费转付费重置" />
            <el-table-column prop="ActLogObj.IsEntryPool" :formatter="showBool" label="是否进入水池" />
            <el-table-column prop="ActLogObj.InterveneFactor" :formatter="toRupee" label="干扰值" />
            <el-table-column prop="ActLogObj.RoomFactor" label="房间系数" />
          </el-table-column>
        </template>

      </el-table>

      <el-dialog
        title="牌局详情"
        :visible.sync="showDetail"
        width="50%"
      >
        <p>命中支付线：{{ detailPayLine }}</p>
        <div id="slotsLogDetail" v-html="detailContent" />
      </el-dialog>
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
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '个人输赢', Data: [] },
      { Name: '资产', Data: [] },
      { Name: 'Winning', Data: [] },
      { Name: '危险系数', Data: [] }
    ]
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, LineChart },
  data() {
    return {
      gid: 0,
      env: 'dev',
      chartData: newChartData(),
      dataArr: [],

      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        actType: -1
      },
      isVup: false,
      statData: {
        round: 0,
        betMoney: 0,
        winMoney: 0,
        totalFee: 0
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 0,
      pageNum: 20,
      typeNames: { 0: '主游戏', 1: 'wild', 2: 'scatter', 3: 'jackpot' },
      showDetail: false,
      detailContent: '',
      detailPayLine: 0
    }
  },
  computed: {},
  created() {
    console.log(1)
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
    showChart() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/slotslog/chart/data',
          Uid: this.item.Uid,
          SlotsType: this.gid,
          Time: this.getTime(this.item.date),
          ActType: this.item.actType,
          IsVup: this.isVup ? 1 : 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          for (const i in objs) {
            if (objs[i]['ActLog']) {
              objs[i]['ActLogObj'] = JSON.parse(objs[i]['ActLog'])
            } else {
              objs[i]['ActLogObj'] = {}
            }
          }
          $this.dataArr = objs

          const stat = response.Data.Stat
          this.statData.totalFee = stat.Fee
          this.statData.betMoney = stat.TotalBet
          this.statData.winMoney = stat.TotalReturn
          this.initChartData()
        }
      })
    },
    initChartData() {
      console.log(1)
      const objs = this.dataArr.sort(function(a, b) {
        return a.Uptime - b.Uptime
      })
      const chartData = newChartData()

      for (const i in objs) {
        const ob = objs[i]
        if (ob.ActLogObj.Profit) {
          chartData.xData.push($libDate.FormateSecondStr(ob.Uptime, 6))
          chartData.yData[0].Data.push(ob.ActLogObj.Profit / 1000)
          chartData.yData[1].Data.push(ob.ActLogObj.Deposit / 1000)
          chartData.yData[2].Data.push(ob.ActLogObj.Winning / 1000)
          chartData.yData[3].Data.push(ob.ActLogObj.DangerFactor)
        }
      }
      this.chartData = chartData
    },
    showWinRate(row, col, num) {
      try {
        const str = num.toString()
        const idx = str.indexOf('.')
        if (idx >= 0 && str.length - idx - 1 >= 2) {
          return num.toFixed(2)
        } else {
          return num
        }
      } catch (e) {
        console.log('showWinRate', e)
        return num
      }
    },
    showPosition(row) {
      try {
        if (row.hasOwnProperty('ActLogObj') && row.ActLogObj.hasOwnProperty('ScriptRow') && row.ActLogObj.hasOwnProperty('ScriptCol')) {
          return '(' + (row.ActLogObj.ScriptRow + 1) + ',' + (row.ActLogObj.ScriptCol + 1) + ')'
        }
      } catch (e) {
        console.log('showPosition', e)
      }
    },
    showHelpType(row, col, val, idx) {
      switch (val) {
        case 0:
          return '正常'
        case 1:
          return '新手期'
        case 2:
          return '免费帮助'
        case 3:
          return '免费控制'
        case 4:
          return '付费帮助'
        case 5:
          return '付费控制'
        default:
          return val
      }
    },
    toRupee(row, col, val, idx) {
      if (val === 0) {
        return 0
      }
      if (!val) {
        return '-'
      }
      return val / 1000
    },
    showBool(row, col, val, idx) {
      return val ? '是' : '否'
      // if (row['ActLogObj']['TargetOdds'] > 0) {
      //
      // } else {
      //   return ''
      // }
    },
    showRandomFlag(row, col, val, idx) {
      switch (val) {
        case 0:
          return '正常'
        case 1:
          return '随机输'
        case 2:
          return '随机赢'
        default:
          return val
      }
    },
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
    getVupLevel(lvl) {
      lvl = lvl >> 2
      if (lvl & 0x01) {
        return 1
      } else if (lvl & 0x02) {
        return 2
      } else if (lvl & 0x04) {
        return 3
      } else if (lvl & 0x08) {
        return 4
      }
      return 0
    },
    getTime(toDate) {
      // if (this.isIN()) {
      //   return $libDate.SelectTimeToIndia(toDate) / 1000
      // } else {
      //   return $libDate.SelectTimeToBR(toDate) / 1000
      // }
      return toDate / 1000
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/slotslog/list',
          Uid: this.item.Uid,
          SlotsType: this.gid,
          Time: this.getTime(this.item.date),
          Page: this.currentPage,
          Limit: this.pageNum,
          ActType: this.item.actType,
          IsVup: this.isVup ? 1 : 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.List || []
          $this.ret = response.Data
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }

          for (const i in objs) {
            if (objs[i]['ActLog']) {
              objs[i]['ActLogObj'] = JSON.parse(objs[i]['ActLog'])
            } else {
              objs[i]['ActLogObj'] = {}
            }
          }

          $this.totalCount = response.Data.Count
          $this.tableData = objs
          $this.statData.round = response.Data.Round
          /*  $this.statData.normalMoney = response.Data.NormalMoney
          $this.totalData.wildMoney = response.Data.WildMoney
          $this.totalData.scatterMoney = response.Data.ScatterMoney
          $this.totalData.jackpotMoney = response.Data.JackpotMoney*/
          $this.dataArr = objs
        }
      })
    },
    clickData(row, column, event) {
      this.showDetail = true
      this.detailContent = row.GameLog
      this.detailPayLine = row.PayLine
    }
  }
}

</script>

<style>
    #slotsLogDetail table {
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    #slotsLogDetail table td{
        border: 1px solid #eee;
        height: 31px;
        line-height: 31px;
        padding: 2px;
    }
</style>
