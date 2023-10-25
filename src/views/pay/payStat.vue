<template>
  <div class="app-container">
    <el-row style="margin-top: 30px">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="时间段：">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="平台：">
          <el-select v-model="platform" placeholder="请选择">
            <el-option
              label="全部"
              value=""
            />
            <el-option
              label="Galaxy"
              value="galaxy"
            />
            <el-option
              label="Android"
              value="android"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付通道：">
          <el-select v-model.number="channel" placeholder="请选择">
            <el-option
              label="全部"
              value="0"
            />
            <el-option
              v-for="chl in channels"
              v-if="chl.Plat == platform"
              :label="getChannelName(chl.ID)"
              :value="chl.ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo">查询</el-button>
        </el-form-item>

      </el-form>
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
    >
      <el-table-column
        prop="DayTime"
        label="日期"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          {{ formatTime2(scope.row.DayTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Project"
        label="系列"
        sortable
        width="100"
      />
      <el-table-column
        prop="ChannelID"
        label="渠道"
        sortable
        width="100"
      >
        <template slot-scope="scope">
          {{ getChannelName(scope.row.ChannelID) }}
        </template>

      </el-table-column>
      <el-table-column
        prop="DayPay"
        label="充值"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.DayPay) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="PayRate"
        label="充值费率"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.PayRate/10 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="DayWithdraw"
        label="提款"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.DayWithdraw) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="WithdrawRate"
        label="提现费率"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.WithdrawRate/10 + "+" + scope.row.WithdrawFee/10 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Total"
        label="余额"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.Total - scope.row.OutMoney + scope.row.Correct) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Correct"
        label="修正"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.Correct) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="OutMoney"
        label="提出"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.OutMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        column-key="op"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleCorrect(scope.row)"
          >修正
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleOut(scope.row)"
          >提出
          </el-button>
          <el-button
            size="mini"
            @click="handleRefresh(scope.row)"
          >刷新
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 40, 100, 500]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="type==1?'修正余额':'提出金额'"
      :visible.sync="correctVisible"
      width="50%"
    >
      <el-form label-width="100px">
        <template v-if="type==1">
          <el-row>
            <el-form-item label="修正数额：">
              <el-input v-model="edit.Correct" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="修正说明：" :required="true">
              <el-input v-model="edit.CorrectNote" type="textarea" rows="5" />
            </el-form-item>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-form-item label="提出金额：" :required="true">
              <el-input v-model="edit.OutMoney" />
            </el-form-item>
          </el-row>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveData()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,
      platform: '',
      channel: 0,
      channels: [],

      correctVisible: false,
      edit: {},
      type: 0,
      correctVal: 0,
      dayTime: '',
      timeRange: [$libDate.GetDayBegin(new Date().getTime()), $libDate.GetDayEnd(new Date().getTime())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      libMoney: new MoneyShow(['DayPay', 'DayWithdraw', 'Total', 'OutMoney', 'Correct'])

    }
  },
  created() {
    console.log(1)
    this.getChannels()
  },
  methods: {
    handleCorrect(ob) {
      this.edit = ob
      this.correctVisible = true
      this.type = 1
    },
    handleOut(ob) {
      this.edit = ob
      this.correctVisible = true
      this.type = 2
    },
    handleRefresh(ob) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/log/refresh/paystat',
          DayTime: ob.DayTime,
          Platform: ob.Platform,
          Channel: ob.ChannelID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('重新计算当日剩余金额成功！')
        }
      })
    },
    saveData() {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/log/update/paystat',
          Type: this.type,
          ID: this.edit.ID,
          Correct: this.edit.Correct * 1000,
          CorrectNote: this.edit.CorrectNote,
          OutMoney: this.edit.OutMoney * 1000,
          User: store.getters.name
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.correctVisible = false
        }
      })
    },
    getChannelName(ID) {
      for (const i in this.channels) {
        if (this.channels[i].ID == ID) {
          return this.channels[i].Name
        }
      }
      return '错误'
    },
    getChannels() {
      const $this = this
      request({
        url: '/payconfig/all',
        method: 'get',
        data: {
          Type: 1,
          Platform: ''
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data || []
          $this.channels = []
          for (const i in items) {
            $this.channels.push({ Plat: items[i].platform, ID: items[i].payChannel, Name: items[i].payChannelName })
          }
        }
      })
    },
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
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
    formatTime2(ts) {
      return $libDate.FormateSecondStr(ts, 1)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/paystats',
          Platform: this.platform,
          Channel: this.channel,
          BeginTime: bTime,
          EndTime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.clientDB = new ClientTableData(objs, 10, {}, 'DayTime', -1)
          $this.handleCurrentChange(1)
        }
      })
    },
    setData() {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/log/gen/paystat',
          DayTime: Math.floor(this.dayTime / 1000 - 3600 * 3)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('succ')
        }
      })
    }
  }
}
</script>
