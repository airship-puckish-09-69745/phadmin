<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-alert
          type="success"
          :description="getDescription()"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}"/>
        </el-form-item>
        <el-form-item label="App：">
          <el-select v-model="item.appId" size="mini">
            <el-option v-for="(o, idx) in appInfos" :key="idx" :label="o.Account" :value="o.ID" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="item.actType" size="mini">
            <el-option label="全部" :value="-1"/>
            <el-option v-for="(o,k) in typeNames" :label="o" :value="k"/>
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
        <el-form-item label="时间段：">
          <el-time-picker
            v-model="item.timeRange"
            is-range
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间段(可不填)"
          />
          <span style="color:#909399;font-size:12px;margin-left:8px;">同一天内，间隔不超过6小时</span>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="isVup"
          />
          小黑屋
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showChart">输赢图表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="exportExcel">导出</el-button>
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
          <el-descriptions-item label="总赢：">{{
              formatNumber(statData.winMoney / 1000 - statData.betMoney / 1000)
            }}
          </el-descriptions-item>
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
            <DateTimeShow :show-type="4" :timestamp="scope.row.Uptime"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="Uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="App"
          label="App"
          width="100"
        />
        <el-table-column
          prop="ActType"
          label="操作类型"
        >
          <template slot-scope="scope">
            {{ getTypeName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Bet"
          label="下注"
          width="70"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Bet / 1000) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="Bet"
          label="下注倍数"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.BetOdds ? betOddsNumber(scope.row.BetOdds, gid) : 0 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="ReturnBet"
          label="输赢"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ReturnBet / 1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ServiceFee"
          label="服务费"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ServiceFee / 1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PayLine"
          label="命中"
          width="70"
        />
        <template v-if="[150,156,166,174,196,204,210,216,232,248].indexOf(gid) >= 0">
          <el-table-column
            header-align="center"
            label="Jackpot"
          >
            <el-table-column :label="getJPLabel(4,gid) + '收集'">
              <template slot-scope="scope">
                {{ getJPFee(scope.row.JackpotLogObj, 4) }}
              </template>
            </el-table-column>
            <el-table-column :label="getJPLabel(3,gid) + '收集'">
              <template slot-scope="scope">
                {{ getJPFee(scope.row.JackpotLogObj, 3) }}
              </template>
            </el-table-column>
            <el-table-column :label="getJPLabel(2,gid) + '收集'">
              <template slot-scope="scope">
                {{ getJPFee(scope.row.JackpotLogObj, 2) }}
              </template>
            </el-table-column>
            <el-table-column :label="getJPLabel(1,gid) + '收集'">
              <template slot-scope="scope">
                {{ getJPFee(scope.row.JackpotLogObj, 1) }}
              </template>
            </el-table-column>
            <el-table-column label="中奖类型">
              <template slot-scope="scope">
                {{
                  scope.row.JackpotLogObj.JackpotInfo ? getJPLabel(scope.row.JackpotLogObj.JackpotInfo[0].Type, gid) : null
                }}
              </template>
            </el-table-column>
            <el-table-column label="中奖倍数">
              <template slot-scope="scope">
                {{ scope.row.JackpotLogObj.JackpotInfo ? scope.row.JackpotLogObj.JackpotInfo[0].MultiOdds : null }}
              </template>
            </el-table-column>
            <el-table-column label="中奖数额">
              <template slot-scope="scope">
                {{
                  scope.row.JackpotLogObj.JackpotInfo ? scope.row.JackpotLogObj.JackpotInfo[0].AddMoney / 1000 : null
                }}
              </template>
            </el-table-column>
          </el-table-column>
        </template>
        <template
          v-if="hasScriptLog(gid)"
        >
          <el-table-column
            header-align="center"
            label="剧本"
          >
            <el-table-column prop="ActLogObj.ActOdds" label="剧本倍率"/>
            <el-table-column prop="ActLogObj.TargetOdds" label="目标倍率"/>
            <el-table-column prop="ActLogObj.CurrentOdds" label="当前倍率"/>
            <el-table-column prop="ActLogObj.CurrentOverflow" label="溢出" width="70"/>
            <el-table-column prop="ActLogObj.Profit" :formatter="toRupee" label="个人输赢" width="100"/>
            <el-table-column v-if="!isActV2(gid)" prop="ActLogObj.RoomProfit" :formatter="toRupee" label="房间输赢"/>
            <el-table-column prop="ActLogObj.Deposit" :formatter="toRupee" label="Deposit"/>
            <el-table-column v-if="!isActV2(gid)" prop="ActLogObj.RoomPool" :formatter="toRupee" label="房间水池"/>
            <el-table-column
              v-if="!isActV2(gid)"
              prop="ActLogObj.EntryPoolMoney"
              :formatter="toRupee"
              label="进入水池"
            />
            <el-table-column v-if="!isActV2(gid)" prop="ActLogObj.DoWinRate" label="执行胜率"/>
            <el-table-column
              v-if="!isActV2(gid)"
              prop="ActLogObj.CurrentWinRate"
              :formatter="showWinRate"
              label="当前胜率"
            />
            <el-table-column prop="ActLogObj.ScriptCol" label="剧本坐标">
              <template slot-scope="scope">
                {{ showPosition(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column prop="ActLogObj.RandomFlag" :formatter="showRandomFlag" label="随机flag"/>
            <el-table-column prop="ActLogObj.RandomOdds" label="目标倍率"/>
            <el-table-column prop="ActLogObj.DoRandomOdds" label="执行目标倍率"/>
            <el-table-column prop="ActLogObj.HitOdds" label="最终倍率"/>
            <el-table-column prop="ActLogObj.IsWinRateSwitchScript" :formatter="showBool" label="切换脚本">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.ActLogObj.IsWinRateSwitchScript || scope.row.ActLogObj.IsFinishSwitchScript"
                  style="color:red"
                >{{ scope.row.ActLogObj.IsWinRateSwitchScript ? '胜率变换' : '剧本切换' }}</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="ActLogObj.SwitchScriptBeforeTargetOdds" label="切换前目标倍率"/>
            <el-table-column prop="ActLogObj.SwitchScriptBeforeCurrentOdds" label="切换前执行倍率"/>
            <el-table-column prop="ActLogObj.SwitchScriptBeforeOverflow" label="切换前溢出值"/>
            <el-table-column prop="ActLogObj.IsFinishCurrentOdds" :formatter="showBool" label="是否执行完当前目标倍率"/>
            <el-table-column prop="ActLogObj.NextOverflow" label="下一个倍率溢出值"/>
            <el-table-column prop="ActLogObj.NextTargetOdds" label="下一个目标倍率"/>
            <el-table-column v-if="!isActV2(gid)" prop="ActLogObj.InterveneFactor" :formatter="toRupee" label="干扰值"/>
            <el-table-column v-if="!isActV2(gid)" prop="ActLogObj.RoomFactor" label="房间系数"/>

            <el-table-column v-if="isActCollect(gid)" prop="ActLogObj.CollectOddsAdd" label="收集倍率增加"/>
            <el-table-column v-if="isActCollect(gid)" prop="ActLogObj.CollectOddsSub" label="收集倍率扣减"/>
            <el-table-column v-if="isActCollect(gid)" prop="ActLogObj.CollectOddsTotal" label="累计收集倍率"/>

            <el-table-column v-if="isActV2(gid)" prop="ActLogObj.IsLotteryLimit" label="保底限制">
              <template slot-scope="scope">
                <span v-if="scope.row.ActLogObj.IsLotteryLimit" style="color:red">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="ActLogObj.ScriptV3PlanId" label="数值方案ID"/>
            <el-table-column prop="ActLogObj.ScriptV3PlanVer" label="数值版本ID"/>
            <el-table-column prop="ActLogObj.HitBigPrize" label="命中大奖">
              <template slot-scope="scope"><span v-if="scope.row.ActLogObj.HitBigPrize" style="color:red">是</span><span
                v-else>-</span></template>
            </el-table-column>
            <el-table-column prop="ActLogObj.BigPrizeHitReason" label="大奖原因">
              <template slot-scope="scope">{{ showBigPrizeReason(scope.row.ActLogObj.BigPrizeHitReason) }}</template>
            </el-table-column>
            <el-table-column prop="ActLogObj.BigPrizeCfgId" label="大奖用户群ID"/>
            <el-table-column prop="ActLogObj.UserPoolOdds" label="小奖池加赠倍数"/>
            <el-table-column prop="ActLogObj.UserPoolAmount" label="小奖池剩余余额" :formatter="toRupee"/>

          </el-table-column>
        </template>

      </el-table>

      <el-dialog
        title="牌局详情"
        :visible.sync="showDetail"
        width="50%"
      >
        <p>Hit the payment line：{{ detailPayLine }}</p>
        <div id="slotsLogDetail" v-html="detailContent"/>
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
      <line-chart :chart-data="chartData" height="600px"/>
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import {$libDate, $libShow, ClientTableData, MoneyShow} from '@/utils/common'
import store from '@/store'
import {Message} from 'element-ui'
import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

function newChartData() {
  return {
    xData: [],
    yData: [
      {Name: '个人输赢', Data: []},
      {Name: '资产', Data: []},
      {Name: 'Winning', Data: []},
      {Name: '危险系数', Data: []}
    ]
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {DateTimeShow, Compare, Publish, UidInput, LineChart},
  data() {
    return {
      gid: 0,
      env: 'dev',
      chartData: newChartData(),
      dataArr: [],

      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        timeRange: null,
        actType: -1,
        appId: store.getters.appId || 0
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
      typeNames: {0: '主游戏', 1: 'wild', 2: 'scatter', 3: 'jackpot', 5: 'FreeSpin'},
      showDetail: false,
      detailContent: '',
      detailPayLine: 0,
      appInfos: [
        { ID: 0, Account: '全部' }
      ]
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    if (this.gid === 150 || this.gid === 166 || this.gid === 176 || this.gid === 178 || this.gid === 232 || this.gid === 248) {
      this.typeNames[1] = 'bonus'
    }
    this.getAppInfos()
  },
  methods: {
    getDescription() {
      // eslint-disable-next-line no-empty
      return '数据根据Uid分表，需要模糊匹配请输入 0-9 数字查询。输赢图表只支持指定有效Uid查询'
    },
    // V2剧本
    isActV2(gid) {
      return [78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 150, 154, 156, 158, 160, 162, 164, 166, 170,
        172, 188, 198, 192, 180, 176, 182, 174, 178, 168, 196, 184, 202, 190, 200, 204, 206, 208, 210,
        212, 216, 218, 220, 226, 228, 230, 232, 234, 236, 238, 240, 242, 248, 253, 254, 255, 257, 1237, 1242, 258].indexOf(gid) >= 0
    },
    hasScriptLog(gid) {
      return gid % 2 === 0 || gid > 251
    },
    // 收集剧本
    isActCollect(gid) {
      return [86].indexOf(gid) >= 0
    },
    getTypeName(row) {
      // SuperGems2
      if (this.gid === 86 && row.ActType === 1) {
        return '转盘'
      }

      return this.typeNames[row.ActType]
    },
    showChart() {
      const $this = this
      const timeRange = this.getTimeRangeParam()
      if (timeRange === null) {
        return
      }
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
          IsVup: this.isVup ? 1 : 0,
          AppId: this.item.appId,
          StartTime: timeRange[0],
          EndTime: timeRange[1]
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          for (const i in objs) {
            if (objs[i]['ActLog'] && objs[i]['ActLog'] !== 'null') {
              objs[i]['ActLogObj'] = JSON.parse(objs[i]['ActLog'])
            } else {
              objs[i]['ActLogObj'] = {}
            }
          }
          $this.dataArr = objs

          const stat = response.Data.Stat
          this.statData.round = stat.Rounds
          this.statData.totalFee = stat.Fee
          this.statData.betMoney = stat.TotalBet
          this.statData.winMoney = stat.TotalReturn
          this.initChartData()
        }
      })
    },
    initChartData() {
      console.log(1)
      const objs = this.dataArr.sort(function (a, b) {
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
          let prefix = ''
          if (row.ActLogObj.hasOwnProperty('SheetIndex') && row.ActLogObj.hasOwnProperty('ActId') && row.ActLogObj.ActId > 0) {
            if (row.ActLogObj.SheetIndex === -2) {
              prefix = '指定正数'
            } else if (row.ActLogObj.SheetIndex === -1) {
              prefix = '指定负数'
            } else {
              prefix = '常规' + (row.ActLogObj.SheetIndex + 1)
            }
          }
          return prefix + '(' + (row.ActLogObj.ScriptRow + 1) + ',' + (row.ActLogObj.ScriptCol + 1) + ')'
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
    showBigPrizeReason(reason) {
      switch (reason) {
        case 0:
          return '-'
        case 1:
          return '正常随机'
        case 2:
          return '用户群随机'
        case 3:
          return '固定间隔'
        default:
          return '-'
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
    betOddsNumber(n, gid) {
      if (n != 0 && n != 1) {
        n = n / 1000
      }
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
    // 把 HH:mm:ss 转成当天的秒偏移，格式非法时返回 null
    timeToSecond(timeStr) {
      const arr = ('' + timeStr).split(':')
      if (arr.length !== 3) {
        return null
      }
      const hour = parseInt(arr[0], 10)
      const min = parseInt(arr[1], 10)
      const sec = parseInt(arr[2], 10)
      if (isNaN(hour) || isNaN(min) || isNaN(sec)) {
        return null
      }
      return hour * 3600 + min * 60 + sec
    },
    // 校验时间段并换算成所选日期的起止时间戳(秒)，供 StartTime/EndTime 使用
    // 未选择时间段返回 [0, 0]；间隔超过6小时等不合法情况提示后返回 null
    getTimeRangeParam() {
      const range = this.item.timeRange || []
      if (range.length !== 2 || !range[0] || !range[1]) {
        return [0, 0]
      }
      if (!this.item.date) { // 未选日期时后端按当天范围校验会不通过，这里不传时间段
        return [0, 0]
      }
      const start = this.timeToSecond(range[0])
      const end = this.timeToSecond(range[1])
      if (start === null || end === null) {
        Message.error('时间段格式有误，请重新选择')
        return null
      }
      if (end < start) {
        Message.error('结束时间不能早于开始时间')
        return null
      }
      if (end - start > 6 * 3600) {
        Message.error('开始时间与结束时间的间隔不能超过6小时')
        return null
      }
      const dayBegin = this.getTime(this.item.date)
      return [dayBegin + start, dayBegin + end]
    },
    getInfo() {
      const $this = this
      const timeRange = this.getTimeRangeParam()
      if (timeRange === null) {
        return
      }
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
          IsVup: this.isVup ? 1 : 0,
          AppId: this.item.appId,
          StartTime: timeRange[0],
          EndTime: timeRange[1]
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.List || []
          $this.ret = response.Data
          $this.tableData = objs
          console.log(this.tableData)
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }

          for (const i in objs) {
            if (objs[i]['ActLog'] && objs[i]['ActLog'] !== 'null') {
              objs[i]['ActLogObj'] = JSON.parse(objs[i]['ActLog'])
            } else {
              objs[i]['ActLogObj'] = {}
            }

            if ($this.gid === 150 || $this.gid === 156 || $this.gid === 166 || $this.gid === 174 || $this.gid === 196 ||
              $this.gid === 204 || $this.gid === 210 || $this.gid === 216 || $this.gid === 232 || $this.gid === 248) {
              if (objs[i]['JackpotLog'] && objs[i]['JackpotLog'] !== 'null') {
                objs[i]['JackpotLogObj'] = JSON.parse(objs[i]['JackpotLog'])
              } else {
                objs[i]['JackpotLogObj'] = {}
              }
            }
          }

          $this.totalCount = response.Data.Count
          $this.tableData = objs
          // $this.statData.round = response.Data.Round
          /*  $this.statData.normalMoney = response.Data.NormalMoney
          $this.totalData.wildMoney = response.Data.WildMoney
          $this.totalData.scatterMoney = response.Data.ScatterMoney
          $this.totalData.jackpotMoney = response.Data.JackpotMoney*/
          $this.dataArr = objs
        }
      })
    },
    async getExportData(page, timeRange) {
      console.log('qwwer', page)
      // sleep 2s
      await new Promise(resolve => {
        setTimeout(resolve, 2000)
      })
      const $this = this
      await request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/slotslog/list',
          Uid: this.item.Uid,
          SlotsType: this.gid,
          Time: this.getTime(this.item.date),
          Page: page,
          Limit: this.pageNum,
          ActType: this.item.actType,
          IsVup: this.isVup ? 1 : 0,
          AppId: this.item.appId,
          StartTime: timeRange[0],
          EndTime: timeRange[1]
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.List || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }

          for (const i in objs) {
            if (objs[i]['ActLog'] && objs[i]['ActLog'] !== 'null') {
              objs[i]['ActLogObj'] = JSON.parse(objs[i]['ActLog'])
            } else {
              objs[i]['ActLogObj'] = {}
            }

            if ($this.gid === 150 || $this.gid === 156 || $this.gid === 166 || $this.gid === 174 || $this.gid === 196 ||
              $this.gid === 204 || $this.gid === 210 || $this.gid === 216 || $this.gid === 232 || $this.gid === 248) {
              if (objs[i]['JackpotLog'] && objs[i]['JackpotLog'] !== 'null') {
                objs[i]['JackpotLogObj'] = JSON.parse(objs[i]['JackpotLog'])
              } else {
                objs[i]['JackpotLogObj'] = {}
              }
            }
            const tmp = []
            tmp.push(objs[i].Id)
            tmp.push($libDate.FormateMilisecondStr(objs[i].Uptime * 1000, 4))
            tmp.push(objs[i].Uid)
            tmp.push(this.getTypeName(objs[i]))
            tmp.push(this.formatNumber(objs[i].Bet / 1000))
            tmp.push(objs[i].BetOdds ? this.betOddsNumber(objs[i].BetOdds, this.gid) : 0)
            tmp.push(this.formatNumber(objs[i].ReturnBet / 1000))
            tmp.push(this.formatNumber(objs[i].ServiceFee / 1000))
            tmp.push(objs[i].PayLine)
            if ([150, 156, 166, 174, 196, 204, 210, 216, 232,248].indexOf(this.gid) >= 0) {
              tmp.push(this.getJPFee(objs[i].JackpotLogObj, 4))
              tmp.push(this.getJPFee(objs[i].JackpotLogObj, 3))
              tmp.push(this.getJPFee(objs[i].JackpotLogObj, 2))
              tmp.push(this.getJPFee(objs[i].JackpotLogObj, 1))
              tmp.push(objs[i].JackpotLogObj.JackpotInfo ? this.getJPLabel(objs[i].JackpotLogObj.JackpotInfo[0].Type, this.gid) : null)
              tmp.push(objs[i].JackpotLogObj.JackpotInfo ? objs[i].JackpotLogObj.JackpotInfo[0].MultiOdds : null)
              tmp.push(objs[i].JackpotLogObj.JackpotInfo ? objs[i].JackpotLogObj.JackpotInfo[0].AddMoney / 1000 : null)
            }
            if (this.hasScriptLog(this.gid)) {
              const actLogObj = objs[i].ActLogObj
              tmp.push(actLogObj.ActOdds)
              tmp.push(actLogObj.TargetOdds)
              tmp.push(actLogObj.CurrentOdds)
              tmp.push(actLogObj.CurrentOverflow)
              tmp.push(this.toRupee(null, null, actLogObj.Profit))
              if (!this.isActV2(this.gid)) {
                tmp.push(this.toRupee(null, null, actLogObj.RoomProfit))
              }
              tmp.push(this.toRupee(null, null, actLogObj.Deposit))
              if (!this.isActV2(this.gid)) {
                tmp.push(this.toRupee(null, null, actLogObj.RoomPool))
                tmp.push(this.toRupee(null, null, actLogObj.EntryPoolMoney))
                tmp.push(actLogObj.DoWinRate)
                tmp.push(this.showWinRate(null, null, actLogObj.CurrentWinRate))
              }
              tmp.push(this.showPosition(objs[i]))
              tmp.push(this.showRandomFlag(null, null, actLogObj.RandomFlag))
              tmp.push(actLogObj.RandomOdds)
              tmp.push(actLogObj.DoRandomOdds)
              tmp.push(actLogObj.HitOdds)
              const switchScriptText = actLogObj.IsWinRateSwitchScript || actLogObj.IsFinishSwitchScript
                ? (actLogObj.IsWinRateSwitchScript ? '胜率变换' : '剧本切换')
                : '否'
              tmp.push(switchScriptText)
              tmp.push(actLogObj.SwitchScriptBeforeTargetOdds)
              tmp.push(actLogObj.SwitchScriptBeforeCurrentOdds)
              tmp.push(actLogObj.SwitchScriptBeforeOverflow)
              tmp.push(this.showBool(null, null, actLogObj.IsFinishCurrentOdds))
              tmp.push(actLogObj.NextOverflow)
              tmp.push(actLogObj.NextTargetOdds)
              if (!this.isActV2(this.gid)) {
                tmp.push(this.toRupee(null, null, actLogObj.InterveneFactor))
                tmp.push(actLogObj.RoomFactor)
              }
              if (this.isActCollect(this.gid)) {
                tmp.push(actLogObj.CollectOddsAdd)
                tmp.push(actLogObj.CollectOddsSub)
                tmp.push(actLogObj.CollectOddsTotal)
              }
              if (this.isActV2(this.gid)) {
                tmp.push(actLogObj.IsLotteryLimit ? '是' : '否')
                tmp.push(actLogObj.ScriptV3PlanId)
                tmp.push(actLogObj.ScriptV3PlanVer)
                tmp.push(actLogObj.UserPoolOdds)
                tmp.push(actLogObj.UserPoolAmount)
              }
            }
            this.exportData.push(tmp)
          }
        }
      })
    },
    exportExcel() {
      const timeRange = this.getTimeRangeParam()
      if (timeRange === null) {
        return
      }
      request({
        url: '/other/export/time',
        method: 'get'
      }).then(response => {
        if (response.RetCode !== 0) {
          // 如果 RetCode 不为 0，提示返回的 Data 并返回
          this.$message.error(response.Data)
          return
        }
        import('@/vendor/Export2Excel').then(async excel => {
          if (this.tableData === 0) {
            this.$message.error('No data to export, or query first')
            return
          }
          if (this.totalCount > 20000) {
            this.$message.error('导出数据量太大(' + this.totalCount + ')，可能会影响线上业务，请缩小搜索范围')
            return
          }
          this.exportData = []
          const max = Math.ceil(this.totalCount / this.pageNum)
          this.isButtonDisabled = true
          for (let i = 1; i <= max; i++) {
            await this.getExportData(i, timeRange)
          }
          this.isButtonDisabled = false
          const data = this.exportData
          const columns = this.$refs.filterTable.columns
          // 提取表头
          const header = columns.map(column => column.label)
          excel.export_json_to_excel({
            header: header, // 表头 必填
            data, // 具体数据 必填
            filename: 'Slots records', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填
          })
        })
      })
    },
    clickData(row, column, event) {
      this.showDetail = true
      this.detailContent = row.GameLog
      this.detailPayLine = row.PayLine
    },
    getJPLabel(type, gid) {
      if (type === null || type === undefined) {
        return null
      }

      if (gid === 174) {
        switch (type) {
          case 5:
            return 'MINI'
          case 4:
            return 'MINOR'
          case 3:
            return 'MAJOR'
          case 2:
            return 'MEGA'// 聚宝盆大奖类型
          case 1:
            return 'GRAND'
        }
        return
      }
      switch (type) {
        case 4:
          return 'MINI'
        case 3:
          return 'MINOR'
        case 2:
          return 'MAJOR'
        case 1:
          return 'GRAND'
        default:
          return '无'
      }
    },
    getJPFee(JackpotLogObj, type) {
      if (!JackpotLogObj || !JackpotLogObj.JackpotFee) {
        return null
      }
      for (const i in JackpotLogObj.JackpotFee) {
        if (JackpotLogObj.JackpotFee[i].Type === type) {
          return JackpotLogObj.JackpotFee[i].AddMoney / 100000
        }
      }
      return null
    },
    getAppInfos() {
      request({
        url: '/thirdparties/apps',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appInfos.push({
              ID: response.Data[i].ID,
              Account: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
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

#slotsLogDetail table td {
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}
</style>
