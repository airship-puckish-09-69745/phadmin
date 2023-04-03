<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">

        <el-form-item label="UID：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
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
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-col :span="2" :offset="1">
            <el-button type="success" size="mini" @click="showChart">流水变化图</el-button>
          </el-col>
        </el-form-item>

      </el-form>
    </el-row>
    <el-row>
      <el-col :offset="6" :span="12">
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总付费：">{{ summary.Pay }}</el-descriptions-item>
          <el-descriptions-item label="付费次数："> {{ summary.PayCount }}</el-descriptions-item>
          <el-descriptions-item label="总提款：">{{ summary.Withdraw }}</el-descriptions-item>
          <el-descriptions-item label="提款次数："> {{ summary.WithdrawCount }}</el-descriptions-item>
          <el-descriptions-item label="充提差：">{{ summary.Pay - summary.Withdraw }}</el-descriptions-item>
          <el-descriptions-item label="提充比：">{{ (summary.Withdraw*100/summary.Pay).toFixed(2) }}%</el-descriptions-item>
        </el-descriptions>
      </el-col>
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
      @sort-change="sortChange"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="UpdateTime"
        label="时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.UpdateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyType"
        label="货币类型"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['MoneyType']" size="mini" @change="handleFilter">
            <el-option label="货币类型" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['MoneyType']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('MoneyType', scope.row.MoneyType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Before"
        label="前值"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow - scope.row.MoneyChanged) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Changed"
        label="变化值"
        width="200"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.MoneyType===1||scope.row.MoneyType===2"
            :style="scope.row.MoneyChanged>0?'color:red':'color:green'"
          >{{
            formatNumber(scope.row.MoneyChanged)
          }}</span>
          <span v-else>
            {{ formatNumber(scope.row.MoneyChanged) }}x
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyAll"
        label="账户总额"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.MoneyType==1 || scope.row.MoneyType==2">
            {{ formatNumber(scope.row.MoneyAll) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ActType"
        width="200"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['ActType']" multiple size="mini" @change="handleFilter2">
            <el-option label="操作类型" :value="0" />
            <el-option v-for="o in actTypeSort" :key="o" :label="clientDB.FilterMap['ActType'][o]" :value="o" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('ActType', scope.row.ActType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ActMsg"
        label="操作说明"
        min-width="300"
      />
      <el-table-column
        prop="ExtInfo"
        label="备注"
        width="200"
      />
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
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
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

const filterMap = {
  MoneyType: { 1: 'Deposited', 2: 'Winning', 3: '基础值' },
  ActType: {
    2: '充值',
    15: '提现',
    16: '提现手续费'
  }
}

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '充值', Data: [] },
      { Name: '提现', Data: [] },
      { Name: '资产', Data: [] },
      { Name: '提充差', Data: [] }
    ]
  }
}

function newSummary() {
  return {
    Pay: 0,
    PayCount: 0,
    Withdraw: 0,
    WithdrawCount: 0
  }
}

export default {
  name: 'MoneyPayAndWithdrawLog',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      search: '',
      clientDB: new ClientTableData([], 10, filterMap),
      libShow: $libShow,
      actTypeSort: [1000, 1001, 2, 15, 16, 18, 19, 20, 1, 7, 11, 12, 13, 14, 17],

      item: {
        Uid: 0
      },

      summary: newSummary(),
      moneyData: [],
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      chartData: newChartData(),
      env: 'test',
      gameNames: ['TeenPatti', 'DragonVsTiger', 'Rummy', 'AndarBahar', 'CarRoulette', 'JHandiMunda', 'AK47'],
      libMoney: new MoneyShow(['MoneyChanged', 'MoneyNow', 'MoneyAll'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter2() {
      const actTypes = {}
      for (let i = 0; i < this.clientDB.FilterValueMap['ActType'].length; i++) {
        actTypes[this.clientDB.FilterValueMap['ActType'][i]] = true
      }
      this.clientDB.ShowData = this.clientDB.TotalData.filter(
        function(data) {
          if (actTypes[data.ActType]) {
            return true
          } else {
            return false
          }
        }
      )
      this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      this.refreshShow()
    },
    handleFilter() {
      if (this.clientDB.FilterValueMap['MoneyType'] == 5) {
        this.clientDB.ShowData = this.clientDB.TotalData.filter(
          function(data) {
            if (data.MoneyType == 1 || data.MoneyType == 2) {
              return true
            } else {
              return false
            }
          }
        )
        this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      } else {
        this.clientDB.FilterData()
      }
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
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
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
      const $this = this

      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/moneylog',
          Uid: this.item.Uid,
          Type: 1,
          BTime: bTime,
          ETime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          objs = $this.libMoney.TransForShow(objs)
          $this.moneyData = objs
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          $this.handleCurrentChange(1)
          this.summary = newSummary()
          for (let i = 0; i < objs.length; i++) {
            const ob = objs[i]
            if (ob.MoneyType == 1 || ob.MoneyType == 2) {
              if (ob.ActType == 2) {
                this.summary.PayCount++
                this.summary.Pay += ob.MoneyChanged
              } else if (ob.ActType == 15) {
                this.summary.WithdrawCount++
                this.summary.Withdraw -= ob.MoneyChanged
              }
            }
          }
          loading.close()
        }
      })
    },
    getLuckValue(baseValue, moneyAll) {
      if (moneyAll === 0) {
        return 0
      } else {
        return baseValue / moneyAll
      }
    },
    getPlayWinLimitStd(baseValue, produceValue) {
      if (produceValue == 0) {
        return 0
      } else {
        return (baseValue * 100 / (produceValue)).toFixed(2)
      }
    },
    showChart() {
      this.initChartData()
    },
    initChartData() {
      const objs = this.moneyData.reverse()
      var chartData = newChartData()

      // 预处理数据，相同时间的数据进行去重
      let lastPay = 0
      let lastWithdraw = 0
      let lastTime = 0
      const timeArr = []
      const retObjs = {}

      for (const i in objs) {
        const ob = objs[i]
        if (ob.UpdateTime !== lastTime) {
          chartData.xData.push($libDate.FormateSecondStr(ob.UpdateTime, 6))
          lastTime = ob.UpdateTime
          timeArr.push(lastTime)
        }
        if (ob.MoneyType == 1 || ob.MoneyType == 2) {
          switch (ob.ActType) {
            case 2:
              lastPay += ob.MoneyChanged
              break
            case 15:
              lastWithdraw -= ob.MoneyChanged
          }
        }
        retObjs[lastTime] = {
          moneyAll: ob.MoneyNow,
          pay: lastPay,
          withdraw: lastWithdraw,
          diff: lastPay - lastWithdraw
        }
      }

      for (const i in timeArr) {
        const ob = retObjs[timeArr[i]]
        chartData.yData[0].Data.push(ob.pay)
        chartData.yData[1].Data.push(ob.withdraw)
        chartData.yData[2].Data.push(ob.moneyAll)
        chartData.yData[3].Data.push(ob.diff)
      }
      this.chartData = chartData
    }
  }
}
</script>

