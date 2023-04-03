<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <el-input v-model="item.Uid" size="mini" />
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
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
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
        prop="ID"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="CreateTime"
        label="完成时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.CreateTime) }}
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
        prop="VupPay"
        label="Vup充值额"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.VupPay/1000) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="VupWithdraw"
        label="Vup提现额"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.VupWithdraw/1000) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="VupLevel"
        label="标志"
        width="100"
      />
      <el-table-column
        prop="Note"
        label="说明"
        min-width="200"
      />
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
      typeNames: { 1: '付费', 2: '提现', 3: '金币变化', 4: '管理后台' },

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
          Path: '/log/vup/logs',
          Uid: this.item.Uid,
          Type: this.logType,
          BeginTime: bTime,
          EndTime: eTime,
          PageNo: this.currentPage,
          PageNum: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          $this.ret = response.Data
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.totalCount = response.Data.Total
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
