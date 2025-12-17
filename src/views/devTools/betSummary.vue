<template>
  <div class="app-container">
    <el-form :model="form" label-width="110px" size="small" style="margin-top: 30px;">
      <el-form-item label="APP：">
        <el-select v-model="form.app" placeholder="请选择APP">
          <el-option
            v-for="opt in appOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker
          v-model="timeRange"
          :default-time="['00:00:00', '23:59:59']"
          type="datetimerange"
          value-format="timestamp"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="GameId：">
         <span>22,32,15</span>
      </el-form-item>
      <el-button type="primary" style="margin-left: 15px;" @click="getInfo">查询</el-button>
    </el-form>
    <!-- 新增：结果展示区域 -->
    <div style="margin-bottom: 20px; margin-top: 20px;">
      <el-table :data="tableData" border style="width: 400px;">
        <el-table-column prop="label" label="类型" width="180" />
        <el-table-column prop="value" label="数值" />
      </el-table>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
import { $libDate, $libShow } from '@/utils/common'
export default {
  name: 'TagUser',
  components: {},
  data() {
    return {
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      form: {
        app: 1000010
      },
      appOptions: [
        // ===== 测试 / UAT =====
        { label: 'CasinoPlus UAT', value: 1000010 },
        { label: 'CasinoPlus UAT-IGO', value: 1000011 },
        { label: 'CasinoPlus QAT', value: 1000012 },
        { label: 'CasinoPlus QAT-IGO', value: 1000013 },
        { label: 'CasinoPlus QAT', value: 1000014 },
        { label: 'CasinoPlus QAT-IGO', value: 1000015 },

        // ===== 正式 =====
        { label: 'CasinoPlus 正式', value: 2000005 },
        { label: 'CasinoPlus IGO 正式', value: 3000005 }
      ],
      slotsOptions: [],
      resultData: null,
      tableData: [
        { label: '总注单数', value: '-' },
        { label: '总有效投注', value: '-' },
        { label: '总输赢', value: '-' }
      ]
    }
  },
  computed: {},
  watch: {
    resultData: {
      handler(val) {
        if (val) {
          this.tableData = [
            { label: '总注单数', value: val.total_bet_num },
            { label: '总有效投注', value: val.total_valid_bet_amount != null ? (val.total_valid_bet_amount / 1000).toLocaleString() : '-' },
            { label: '总输赢', value: val.total_win_loss_amount != null ? (val.total_win_loss_amount / 1000).toLocaleString() : '-' }
          ]
        } else {
          this.tableData = [
            { label: '总注单数', value: '-' },
            { label: '总有效投注', value: '-' },
            { label: '总输赢', value: '-' }
          ]
        }
      },
      immediate: true
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    getInfo() {
      this.saveFlag = false
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
          App: this.form.app,
          StartTime: bTime,
          EndTime: eTime,
          Path: '/wallet/resultlog/betsummary'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form.tag_val = response.Data.tagVal
          this.resultData = response.Data
        }
      })
    }
  }
}
</script>
