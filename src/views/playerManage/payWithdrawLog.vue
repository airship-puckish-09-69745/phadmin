<template>
  <div class="app-container">
    <el-row>
      <el-form :model="form" label-width="80px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true">
          <UidInput :uid-input="form.Uid" @setUid="function (iUid) { form.Uid = iUid }" />
        </el-form-item>
        <el-form-item label="账号：">
          <el-input v-model="form.Account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="timeRange"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="{
              ...pickerOptions,
              disabledDate: (time) => time.getTime() < new Date('2025-08-08 00:00:00').getTime()
            }"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-row>
        <el-descriptions
          size="medium"
          border
          :column="10"
          :label-style="{'text-align': 'left', 'font-weight':'bold', 'width': '150px'}"
        >
          <el-descriptions-item label="累计充值金额">{{ PayWithdrawSummary.PayAmount/1000 }}</el-descriptions-item>
          <el-descriptions-item label="累计提现金额">{{ PayWithdrawSummary.WithdrawAmount/1000 }}</el-descriptions-item>
          <el-descriptions-item label="首次充值时间">
            <DateTimeShow v-if="PayWithdrawSummary.FirstPayTime>0" :show-type="2" :timestamp="PayWithdrawSummary.FirstPayTime" />
          </el-descriptions-item>
          <el-descriptions-item label="今日充值金额">{{ PayWithdrawSummary.TodayPayAmount/1000 }}</el-descriptions-item>
          <el-descriptions-item label="今日提现金额">{{ PayWithdrawSummary.TodayWithdrawAmount/1000 }}</el-descriptions-item>
        </el-descriptions>
      </el-row>
      <el-row>
        <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="充值流水" name="payLog">
            <el-row>
              <span style="font-size: 14px">汇总充值金额：{{ PayWithdrawSummary.LogsPayAmount/1000 }}</span>
            </el-row>
            <el-table
              :data="payLogTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{ height: '10px' }"
              :cell-style="libShow.DefaultTableCell"
              style="padding:10px;width: 100%"
            >
              <el-table-column prop="OrderId" label="订单ID" width="200" />
              <el-table-column prop="Uid" label="UID" width="150" />
              <el-table-column prop="Account" label="账号" width="150" />
              <el-table-column prop="Site" label="站点" />
              <el-table-column prop="Money" label="充值金额" />
              <el-table-column prop="OrderStatus" label="状态">
                <template slot-scope="scope">
                  {{ PayStatuses[scope.row.OrderStatus+''] }}
                </template>
              </el-table-column>
              <el-table-column prop="CreateTime" label="创建时间">
                <template slot-scope="scope">
                  <DateTimeShow v-if="scope.row.CreateTime>0" :show-type="2" :timestamp="scope.row.CreateTime" />
                </template>
              </el-table-column>
              <el-table-column prop="FinishTime" label="完成时间">
                <template slot-scope="scope">
                  <DateTimeShow v-if="scope.row.FinishTime>0" :show-type="2" :timestamp="scope.row.FinishTime" />
                  <span v-else>未完成</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <el-col :span="12">
                <div class="block">
                  <el-pagination
                    :current-page="payLogDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="payLogDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="payLogDB.GetPage().GetTotalCount()"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="提现流水" name="withdrawLog">
            <el-row>
              <span style="font-size: 14px">汇总提现金额：{{ PayWithdrawSummary.LogsWithdrawAmount/1000 }}</span>
            </el-row>
            <el-table
              :data="withdrawLogTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{ height: '10px' }"
              :cell-style="libShow.DefaultTableCell"
              style="padding:10px;width: 100%"
            >
              <el-table-column prop="WithdrawId" label="订单ID" width="200" />
              <el-table-column prop="Uid" label="UID" width="150" />
              <el-table-column prop="Account" label="账号" width="150" />
              <el-table-column prop="Site" label="站点" />
              <el-table-column prop="Money" label="提现金额" />
              <el-table-column prop="Status" label="状态">
                <template slot-scope="scope">
                  {{ WithdrawStatuses[scope.row.Status+''] }}
                </template>
              </el-table-column>
              <el-table-column prop="CreateTime" label="创建时间">
                <template slot-scope="scope">
                  <DateTimeShow v-if="scope.row.CreateTime>0" :show-type="2" :timestamp="scope.row.CreateTime" />
                </template>
              </el-table-column>
              <el-table-column prop="FinishTime" label="完成时间">
                <template slot-scope="scope">
                  <DateTimeShow v-if="scope.row.FinishTime>0" :show-type="2" :timestamp="scope.row.FinishTime" />
                  <span v-else>未完成</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <el-col :span="12">
                <div class="block">
                  <el-pagination
                    :current-page="withdrawLogDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="withdrawLogDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="withdrawLogDB.GetPage().GetTotalCount()"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import UidInput from '@/components/UidInput/index.vue'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow/index.vue'

const filterMap = {}

export default {
  name: 'PayWithdrawLog',
  components: { DateTimeShow, UidInput },
  data() {
    return {
      title: '支付提现流水',
      form: {
        Uid: 0,
        Account: '',
        StartTime: 0,
        EndTime: 0
      },
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],

      libShow: $libShow,
      libMoney: new MoneyShow(['Money']),
      activeTab: 'payLog',
      payLogDB: new ClientTableData([], 10, filterMap),
      withdrawLogDB: new ClientTableData([], 10, filterMap),

      payLogTableData: [],
      withdrawLogTableData: [],

      PayWithdrawSummary: {
        PayAmount: 0,
        WithdrawAmount: 0,
        FirstPayTime: 0,
        TodayPayAmount: 0,
        TodayWithdrawAmount: 0,
        LogsPayAmount: 0,
        LogsWithdrawAmount: 0
      },
      PayStatuses: {
        1: '成功'
      },
      // 0=挂起，1=处理中，2=批准，-1=客户取消，-2=CSO 取消，-3=拒绝
      WithdrawStatuses: {
        '0': '挂起',
        '1': '处理中',
        '2': '批准',
        '-1': '客户取消',
        '-2': 'CSO 取消',
        '-3': '拒绝'
      }
    }
  },
  watch: {
    '$route.query.Uid': {
      handler(newUid, oldUid) {
        console.log('query change newUid', newUid, ' oldUid', oldUid)
        if (newUid) {
          this.form.Uid = parseInt(newUid)
          this.getPayLogList()
          this.getWithdrawLogList()
          console.log('has new Uid:', this.form.Uid)
        }
      },
      deep: true
    },
    'form.Uid': {
      handler(newUid, oldUid) {
        if (newUid) {
          this.getPayWithdrawSummary()
        }
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.query.Uid) {
      this.form.Uid = parseInt(this.$route.query.Uid)
    }
    if (this.form.Uid > 0) {
      this.getPayLogList()
      this.getWithdrawLogList()
      this.getPayWithdrawSummary()
    }
  },
  methods: {
    // 分页处理
    refreshShow() {
      if (this.activeTab === 'payLog') {
        this.payLogTableData = this.payLogDB.GetCurrentPageData()
      } else {
        this.withdrawLogTableData = this.withdrawLogDB.GetCurrentPageData()
      }
    },
    handleSizeChange(val) {
      if (this.activeTab === 'payLog') {
        this.payLogDB.GetPage().SetPageNum(val)
      } else {
        this.withdrawLogDB.GetPage().SetPageNum(val)
      }
      this.refreshShow()
    },
    handleCurrentChange(val) {
      if (this.activeTab === 'payLog') {
        this.payLogDB.GetPage().SetPageNo(val)
      } else {
        this.withdrawLogDB.GetPage().SetPageNo(val)
      }
      this.refreshShow()
    },
    handleTabClick(tab, event) {
      if (tab.name === 'payLog') {
        this.getPayLogList()
      } else {
        this.getWithdrawLogList()
      }
    },
    getList() {
      this.$EventBus.$emit('uid-change', this.form.Uid)

      if (this.timeRange) {
        this.form.StartTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        this.form.EndTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      if (this.form.EndTime - this.form.StartTime > 86400 * 31) {
        Message.error('不能超过 31 天')
        return
      }

      if (this.activeTab === 'payLog') {
        this.getPayLogList()
      } else {
        this.getWithdrawLogList()
      }
    },
    getPayLogList() {
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const $this = this
      console.log('uid', isNaN(this.form.Uid))

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/pay/callback/logs',
          Uid: this.form.Uid,
          Account: this.form.Account,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.PayWithdrawSummary.TodayPayAmount = response.Data ? response.Data.TodayMoneySum : 0
          $this.PayWithdrawSummary.LogsPayAmount = response.Data ? response.Data.LogsMoneySum : 0
          let objs = response.Data.Logs ? response.Data.Logs || [] : []
          objs = $this.libMoney.TransForShow(objs)
          $this.payLogDB = new ClientTableData(objs, 10, filterMap, 'CreateTime', -1)
          $this.handleCurrentChange(1)
        }
        loading.close()
      })
    },
    getWithdrawLogList() {
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
          Path: '/log/withdraw/callback/logs',
          Uid: this.form.Uid,
          Account: this.form.Account,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime
        }
      }).then(response => {
        const $this = this
        if (response.RetCode === 0) {
          $this.PayWithdrawSummary.TodayWithdrawAmount = response.Data ? response.Data.TodayMoneySum : 0
          $this.PayWithdrawSummary.LogsWithdrawAmount = response.Data ? response.Data.LogsMoneySum : 0
          let objs = response.Data ? response.Data.Logs || [] : []
          objs = $this.libMoney.TransForShow(objs)
          $this.withdrawLogDB = new ClientTableData(objs, 10, filterMap, 'CreateTime', -1)
          $this.handleCurrentChange(1)
        }
        loading.close()
      })
    },
    getPayWithdrawSummary() {
      if (this.form.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/pay/withdraw/summary',
          Uid: this.form.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.PayWithdrawSummary.PayAmount = response.Data.PayAmount
          $this.PayWithdrawSummary.WithdrawAmount = response.Data.WithdrawAmount
          $this.PayWithdrawSummary.FirstPayTime = response.Data.FirstPayTime
          console.log('PayWithdrawSummary.PayAmount:', $this.PayWithdrawSummary.PayAmount)
          console.log('PayWithdrawSummary.WithdrawAmount:', $this.PayWithdrawSummary.WithdrawAmount)
          console.log('PayWithdrawSummary.FirstPayTime:', $this.PayWithdrawSummary.FirstPayTime)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
