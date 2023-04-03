<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <el-input v-model="item.Uid" size="mini" />
        </el-form-item>

        <el-form-item label="游戏：">
          <el-select v-model="gid" size="mini">
            <el-option label="全部" :value="0" />
            <el-option label="AK47" :value="8" />
            <el-option label="TeenPatti" :value="9" />
            <el-option label="AB" :value="2" />
            <el-option label="龙虎" :value="3" />
            <el-option label="JM" :value="4" />
            <el-option label="CAR" :value="5" />
            <el-option label="7上7下" :value="6" />
            <el-option label="红黑" :value="7" />
            <el-option label="Crash" :value="10" />
            <el-option label="TP100" :value="11" />
            <el-option label="TP真人" :value="14" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="logType" size="mini">
            <el-option label="全部" :value="0" />
            <el-option v-for="(o,k) in typeNames" :label="o" :value="k" />
          </el-select>
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
        <el-form-item>
          <el-button type="primary" size="mini" @click="doGetInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-descriptions
        v-if="ret"
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="胜局数：">{{ ret.WinCount }}</el-descriptions-item>
        <el-descriptions-item label="总赢：">{{ formatNumber(ret.WinAmount) }}</el-descriptions-item>
        <el-descriptions-item label="总输：">{{ formatNumber(ret.LoseAmount) }}</el-descriptions-item>
        <el-descriptions-item label="差额：">{{ formatNumber(ret.WinAmount + ret.LoseAmount) }}</el-descriptions-item>
      </el-descriptions>
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
      @row-click="clickData"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="Gid"
        label="游戏"
        width="100"
      >
        <template slot-scope="scope">
          {{ gameNames[scope.row.Gid]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="FinishTime"
        label="完成时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.FinishTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="Uid"
        width="150"
      />
      <el-table-column
        prop="Type"
        label="类型"
        width="100"
      >
        <template slot-scope="scope">
          {{ typeNames[scope.row.Type] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="TableMoney"
        label="前注"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.TableMoney/1000) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyChanged"
        label="输赢"
        width="100"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.MoneyChanged >0?'red':'green'}">
            {{ formatNumber(scope.row.MoneyChanged/1000) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ServiceFee"
        label="台费"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.ServiceFee/1000) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyNow"
        label="余额"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow/1000) }}
        </template>
      </el-table-column>
      <template v-if="gid==8 || gid==9 || gid==0 || gid==14">
        <el-table-column
          prop="WinRate"
          label="胜率"
          width="100"
        />
        <el-table-column
          prop="RandVal"
          label="是否命中"
          width="100"
        >
          <template slot-scope="scope" v-if="scope.row.Gid==8 || scope.row.Gid==9">
            {{ isBingo(scope.row.RandVal,scope.row.WinRate) }}
          </template>
        </el-table-column>

        <!--      IsPeiResult    int32 `json:"PeiVal"`         //最终命中的值 0无 1命中赢配牌 2命中输配牌-->
        <!--      LevelChanged   int32 `json:"LevelChanged"`   //幸运等级调控变化值-->
        <!--      TheResult      int32 `json:"TheResult"`      //最终结果：1中立 2赢符和预期 3赢不符合预期 4输符和预期 5输不符合预期-->
        <el-table-column
          prop="IsPeiResult"
          label="配牌标记"
          width="101"
        >
          <template slot-scope="scope" v-if="scope.row.Gid==8 || scope.row.Gid==9">
            {{ FIsPeiResult(scope.row.IsPeiResult) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="TheResult"
          label="最终结果"
          width="120"
        >
          <template slot-scope="scope" v-if="scope.row.Gid==8 || scope.row.Gid==9">
            <span :style="{color:(scope.row.TheResult==3||scope.row.TheResult==5)?'red':''}">{{ FTheResult(scope.row.TheResult) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="LuckyVal"
          label="幸运值"
          width="100"
        />
        <el-table-column prop="AlteredRobotCards" label="改机器人牌" width="100">
          <template slot-scope="scope">
            <span>{{ IsAlteredRobotsCards(scope.row.AlteredRobotCards) }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
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
    <el-dialog
      title="牌局过程"
      :visible.sync="actionVisible"
      width="50%"
    >
      <el-table
        ref="filterTable"
        :data="actions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="70"
        />
        <el-table-column
          prop="uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="seat"
          label="座位"
          width="100"
        />
        <el-table-column
          label="手牌"
          width="100"
        >
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.Cards)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="actionType"
          label="动作"
          width="100"
        >
          <template slot-scope="scope">
            {{ actionNames[scope.row.actionType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionMoney"
          label="金币"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionMoney/1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="底池"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.total/1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionBySystem"
          label="系统"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionBySystem?"是":"否" }}
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
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      gid: 0,
      logType: 0,
      libShow: $libShow,
      actionVisible: false,
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      actions: [],
      actionNames: { 1: '弃牌', 2: '看牌', 8: '前注', 9: '跟注', 10: '加注', 14: '发起比牌', 15: '同意比牌', 16: '拒绝比牌', 17: '因为要充值临时停止牌局' },
      typeNames: { 3: '游戏中付费', 4: '额度高', 6:'钓鱼付费', 7:'钓鱼未付', 8:'钓鱼2付费',9:'钓鱼2未付费',10:'钓鱼3付费',11:'钓鱼3未付费' },
      gameNames: {
        8: 'AK47',
        9: 'TeenPatti',
        2: 'AB',
        3: '龙虎',
        4: 'JM',
        5: 'CAR',
        6: '7上7下',
        7: '红黑',
        10: 'Crash',
        11: 'TP100',
        14:"TP真人场"
      },
      ret: null,
      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        win: 0,
        lose: 0,
        winCount: 0,
        loseCount: 0
      },

      dataArr: []

    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getInfo()
    console.log(1)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.uid > 1000000) {
        return 'success-row'
      } else {
        return ''
      }
    },
    showCard(cards) {
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op' && (row.Gid==8 || row.Gid==9 || row.Gid==14)) {
        this.actionVisible = true
        this.actions = row.Actions
        const cards = row.Cards
        let total = 0
        for (let i = 0; i < this.actions.length; i++) {
          this.actions[i].Cards = cards[this.actions[i].uid]
          total += this.actions[i].actionMoney
          this.actions[i].total = total
        }
      }
    },
    isBingo(valA, valB) {
      if (valA < valB) {
        return '是'
      } else {
        return '否'
      }
    },
    peiValStr(randVal, winRate, peiVal) {
      if (randVal < winRate && peiVal === 1) {
        return '赢配牌'
      }
      if (randVal >= winRate && peiVal === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FIsPeiResult(val) {
      if (val === 1) {
        return '赢配牌'
      }
      if (val === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FTheResult(val) {
      if (val === 1) {
        return '中立'
      }
      if (val === 2) {
        return '赢-符和'
      }
      if (val === 3) {
        return '赢-不符和'
      }
      if (val === 4) {
        return '输-符和'
      }
      if (val === 5) {
        return '输-不符和'
      }
      return '无'
    },
    IsAlteredRobotsCards(v) {
      return v ? '是' : '-'
    },
    CalResult(randValue, winRate, moneyChange) {
      if (randValue < winRate) {
        // 命中赢
        if (moneyChange <= 0) {
          return 3
        } else {
          return 2
        }
      }
      if (randValue >= winRate) {
        // 命中输
        if (moneyChange >= 0) {
          return 5
        } else {
          return 4
        }
      }
      return 1
    },

    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
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
    doGetInfo(){
      this.getInfo()
      this.getStat()
    },
    getInfo() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/wrong/play/logs',
          Uid: this.item.Uid,
          Gid: this.gid,
          Type: this.logType,
          BeginTime: bTime,
          EndTime: eTime,
          PageNo: this.currentPage,
          PageNum: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []

          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          for (let i = 0; i < objs.length; i++) {
            const ob = objs[i]
            objs[i].TheResult = this.CalResult(ob.RandVal, ob.WinRate, ob.MoneyChanged)
          }
          $this.totalCount = response.Data.Total
        }
      })
    },
    getStat() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/wrong/play/stat',
          Uid: this.item.Uid,
          Gid: this.gid,
          Type: this.logType,
          BeginTime: bTime,
          EndTime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.ret = response.Data
        }
      })
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
