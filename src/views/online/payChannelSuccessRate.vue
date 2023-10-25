<template>
  <div class="app-container">
    <el-row>
      <el-col :span="22" :offset="1">
        <el-form ref="form" :model="form" :inline="true">
          <el-form-item label="时间段">
            <el-select v-model.number="form.duration" size="mini" placeholder="placeholder">
              <el-option :value="0" label="所有" />
              <el-option :value="5" label="5分钟" />
              <el-option :value="30" label="30分钟" />
              <el-option :value="60" label="1小时" />
              <el-option :value="1440" label="1天" />
            </el-select>
          </el-form-item>

          <el-form-item label="查询时间">
            <el-date-picker
              v-model="form.times"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="mini"
            />
          </el-form-item>

          <pay-channel-mul v-model="form.payChannel" :filter="true" :mul="true" :channel-map="form.channelMap" />

          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="22" :offset="1">
        <el-table
          :data="tableData"
          border
        >
          <el-table-column
            prop="PayChannel"
            label="代付渠道"
          >
            <template slot-scope="scope">
              {{ formatPaySysId(scope.row.PayChannel) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="StartTime"
            label="开始时间"
          >
            <template slot-scope="scope">
              {{ scope.row.StartTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="EndTime"
            label="结束时间"
          >
            <template slot-scope="scope">
              {{ scope.row.EndTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Pay"
            label="成功支付订单数"
          />
          <el-table-column
            prop="Buy"
            label="总订单数"
          />
          <el-table-column
            prop="Buy"
            label="支付成功率"
          >
            <template slot-scope="scope">
              {{ (scope.row.Pay / scope.row.Buy * 100).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import store from '@/store'
import { $libDate, $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import PayChannelMul from '@/components/PayChannelMul'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, PayChannelMul },
  data() {
    return {
      form: {
        duration: 5,
        times: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
        payChannel: [0],
        channelMap: {}
      },
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      tableData: [],
      originData: [],
      page: 0,
      limit: 10,
      total: 0
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.updatePage()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.updatePage()
    },
    updatePage() {
      const offset = (this.page - 1) * this.limit
      this.tableData = this.originData.slice(offset, offset + this.limit)
    },
    formatPaySysId(paySysId) {
      if (parseInt(paySysId) === 99) {
        return '测试'
      }
      // eslint-disable-next-line no-prototype-builtins
      return this.form.channelMap.hasOwnProperty(paySysId) ? this.form.channelMap[paySysId] : paySysId
    },
    getData() {
      const $this = this
      let sts = 0; let ets = 0
      if (this.form.times && this.form.times.length > 0) {
        sts = parseInt(this.form.times[0] / 1000)
        ets = parseInt(this.form.times[1] / 1000)
      }

      let payChan = ''
      if (this.form.payChannel && this.form.payChannel.length > 0 && parseInt(this.form.payChannel[0]) !== 0) {
        payChan = this.form.payChannel.join(',')
      }

      console.log('pay channel', payChan)

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/pay/channel/success/rate',
          Env: store.getters.env,
          duration: this.form.duration,
          sts: sts,
          ets: ets,
          payChannel: payChan
        }
      }).then(response => {
        console.log('response', response)
        if (response.RetCode === 0) {
          $this.originData = response.Data
          $this.tableData = []
          $this.total = response.Data.length
          $this.page = 1
          $this.updatePage()
        } else {
          $this.$message.error(response.Data)
        }
      })
    }
  }
}
</script>
