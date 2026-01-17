<template>
  <div class="app-container">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="注单流水" name="first">
        <el-row :gutter="10" style="margin-top: 30px">
          <el-col :span="24">
            <el-form :inline="true" size="small">
              <el-form-item label="App：">
                <el-select v-model="item.app" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="row in appInfo"
                    :key="row.key"
                    :label="row.label"
                    :value="row.key"
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
              <el-form-item>
                <el-button type="primary" size="mini" @click="getData">查询</el-button>
              </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="15" />
          <el-col>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              max-height="650"
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.TableCell(0)"
            >
              <el-table-column label="结束时间" width="150px" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.EndTime>0"> {{ formatTime(scope.row.EndTime) }}</span>
                  <span v-else> - </span>
                </template>
              </el-table-column>
              <!--          <el-table-column label="应用id">-->
              <!--            <template slot-scope="scope">-->
              <!--              {{ scope.row.App }}-->
              <!--            </template>-->
              <!--          </el-table-column>-->
              <el-table-column label="Uid">
                <template slot-scope="scope">
                  {{ scope.row.Uid }}
                </template>
              </el-table-column>
              <el-table-column label="输赢（携带变化）">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.PayoffAmount / 1000) }}
                </template>
              </el-table-column>
              <el-table-column label="返奖">
                <template slot-scope="scope">
                  {{ formatNumber( scope.row.MoneyRet /1000) }}
                </template>
              </el-table-column>
              <el-table-column label="下注">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.BetAmount / 1000) }}
                </template>
              </el-table-column>
              <el-table-column label="有效下注">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.ValidBetAmount / 1000) }}
                </template>
              </el-table-column>
              <el-table-column label="回合id" width="220px">
                <template slot-scope="scope">
                  {{ scope.row.RoundId }}
                </template>
              </el-table-column>
              <el-table-column label="子回合id" width="220px">
                <template slot-scope="scope">
                  {{ scope.row.SubRoundId }}
                </template>
              </el-table-column>
              <el-table-column label="Txid">
                <template slot-scope="scope">
                  {{ scope.row.TxId }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--    <el-row type="flex" justify="end">-->
        <!--      <el-col :span="12">-->
        <!--        <div class="block">-->
        <!--          <el-pagination-->
        <!--            background-->
        <!--            :current-page="item.currPage"-->
        <!--            :page-sizes="[20]"-->
        <!--            :page-size="item.limit"-->
        <!--            layout=" prev, next"-->
        <!--            :total="totalCount"-->
        <!--            @size-change="handleSizeChange"-->
        <!--            @current-change="handleCurrentChange"-->
        <!--          />-->
        <!--        </div>-->
        <!--      </el-col>-->
        <!--    </el-row>-->
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
      </el-tab-pane>
      <el-tab-pane label="注单汇总" name="second">
        <el-row :gutter="10" style="margin-top: 30px">
          <el-col :span="24">
            <el-form :inline="true" size="small">
              <el-select v-model="itemSummary.app" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="row in appInfo"
                  :key="row.key"
                  :label="row.label"
                  :value="row.key"
                />
              </el-select>
              <el-form-item label="开始日期：">
                <el-date-picker
                  v-model="itemSummary.start"
                  value-format="timestamp"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  placeholder="选择日期"
                  size="mini"
                />
              </el-form-item>
              <el-form-item label="结束日期：">
                <el-date-picker
                  v-model="itemSummary.end"
                  value-format="timestamp"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  placeholder="选择日期"
                  size="mini"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="getSummary">查询</el-button>
              </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="15" />
          <el-col>
            <el-table
              :data="summaryData"
              border
              style="width: 100%"
              max-height="650"
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.TableCell(0)"
            >
              <el-table-column label="Game" width="150px" align="center">
                <template slot-scope="scope">
                  {{ showGameName(scope.row.game_id) }}
                </template>
              </el-table-column>
              <el-table-column label="Bet Num">
                <template slot-scope="scope">
                  {{ scope.row.total_bet_num }}
                </template>
              </el-table-column>
              <el-table-column label="Valid Bet Amount">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.total_valid_bet_amount / 1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Win Lose Amount">
                <template slot-scope="scope">
                  {{ formatNumber( scope.row.total_win_loss_amount /1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Jackpot">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.total_jackpot / 1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Insure">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.total_insure / 1000) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { $libDate, $libShow } from '@/utils/common'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

function getNextMinuteTime(m) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + m)
  now.setSeconds(0)
  now.setMilliseconds(0)
  return now
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, MoneyInput },
  data() {
    return {
      activeName: 'first',
      libShow: $libShow,
      appInfo: [],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        start: Date.parse(new Date(this.dDate(0, 30))), // $libDate.GetDayBegin(new Date().getTime()),
        end: Date.parse(new Date()), // $libDate.GetDayEnd(new Date().getTime()),
        limit: 20,
        offset: 1,
        app: 0
      },
      itemSummary: {
        start: getNextMinuteTime(-30), // $libDate.GetDayBegin(new Date().getTime()),
        end: getNextMinuteTime(1),
        app: 0
      },
      showRow: {},
      visibleID: false,
      tableData: [],
      summaryData: [],
      gameMap: {},
      failTypeMap: {
        1: '派彩失败', 2: '游戏结算失败', 3: '转入失败', 4: '下注失败'
      },
      statusMap: {
        1: '等待重试', 2: '正在重试', 3: '重试成功'
      },
      games: {},
      actTypeMap: {
        0: '查询所有',
        1000: '玩牌赢',
        1001: '玩牌输',
        2000: '下注',
        2001: '登录',
        2002: '刷新',
        2003: '回合结束',
        2004: '回退',
        2005: '增值',
        2006: '预扣',
        2007: '游戏结算',
        2008: '平台结算',
        2009: '转入平台',
        2010: '比赛报名',
        2011: '比赛结束',
        2014: '下注并派彩'
      },
      logTypeMap: {
        1: '登录日志',
        2: '刷新日志',
        3: '下注日志',
        4: 'slots/小游戏结算',
        5: '转出',
        6: '回退',
        7: '增值业务',
        8: '游戏结算',
        9: '平台结算',
        10: '转入',
        11: '比赛报名',
        12: '比赛结束',
        15: '下注并派彩'
      },
      currentPage: 1,
      pageNum: 20,
      totalCount: 2
    }
  },
  created() {
    this.getData()
    this.getAppInfo()
    this.getSubGames()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
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
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    showGameName(gid) {
      return this.games[gid] || '未知-' + gid
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/wallet/settle/log',
          StartTime: $this.item.start / 1000,
          EndTime: $this.item.end / 1000,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          App: $this.item.app
        }
      }).then(response => {
        console.log('=====', response)
        $this.tableData = []
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data.Rows || []
          $this.totalCount = response.Data.Total || 0
          console.log($this.totalCount)
        }
      })
    },
    getSummary() {
      console.log('getSummary')
      const $this = this
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/wallet/settle/summary',
          StartTime: $this.itemSummary.start / 1000,
          EndTime: $this.itemSummary.end / 1000,
          App: $this.itemSummary.app
        }
      }).then(response => {
        loading.close()
        $this.summaryData = []
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          if (response.Data.Summary) {
            if (response.Data.Summary.details) {
              for (let i = 0; i < response.Data.Summary.details.length; i++) {
                $this.summaryData.push(response.Data.Summary.details[i])
              }
            }
          }
          if (response.Data.Summary.summary) {
            const item = response.Data.Summary.summary
            item.game_id = 100000
            $this.summaryData.push(item)
          }
        }
      }).catch(function() {
        loading.close()
      })
    },
    getAppInfo() {
      const $this = this
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            $this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
          for (let i = 0; i < $this.appInfo.length; i++) {
            if (this.appInfo[i].key === $this.item.app) {
              $this.item.app = $this.appInfo[i].key
              $this.itemSummary.app = this.appInfo[i].key
              return
            }
          }
          $this.item.app = $this.appInfo[0].key
          $this.itemSummary.app = this.appInfo[0].key
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
          for (let i = 0; i < response.Data.length; i++) {
            if (objs[i].ID === 13) {
              continue
            }
            $this.games[objs[i].Gid] = objs[i].Name
          }
        }
      })
      $this.games[100000] = '所有游戏'
    },
    // 分页处理
    handleSizeChange(val) {
      this.item.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.item.offset = val
      this.getData()
    }

  }
}
</script>
