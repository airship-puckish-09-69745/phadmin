<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="80px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="App：" :required="true" label-width="80px">
          <el-select v-model="item.app" placeholder="请选择">
            <el-option
              v-for="row in appInfo"
              :key="row.key"
              :label="row.label"
              :value="row.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="item.type" size="mini">
            <el-option label="全部" :value="0" />
            <el-option v-for="(o,k) in types" :label="o" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
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
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
        />
        <el-table-column
          prop="transaction_id"
          label="第三方流水号"
          width="300"
        />
        <el-table-column
          prop="uid"
          label="UID"
          width="100"
        />
        <el-table-column
          prop="app"
          label="第三方ID"
          width="100"
        />
        <el-table-column
          prop="type"
          label="转移类型"
          width="100"
        >
          <template slot-scope="scope">
            {{ types[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_change"
          label="变化金额"
          width="200"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.money_change/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_now"
          label="剩余金额"
          width="200"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.money_now/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="完成时间"
          width="200"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.update_time" />
          </template>
        </el-table-column>
      </el-table>
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
// import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      // appId: 0,
      appInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()),
        app: '',
        type: 0
      },
      totalData: {
        round: 0,
        betMoney: 0,
        winMoney: 0,
        normalMoney: 0,
        wildMoney: 0,
        scatterMoney: 0,
        jackpotMoney: 0
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      types: { 1: '转出', 2: '转入' },
      showDetail: false,
      detailContent: '',
      detailPayLine: 0
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    this.getAppInfo()
  },
  methods: {
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
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/thirdparties/transfer/list',
          Uid: this.item.Uid,
          App: this.item.app,
          StartTime: $libDate.SelectTimeToIndia(this.item.start) / 1000,
          EndTime: $libDate.SelectTimeToIndia(this.item.end) / 1000,
          Page: this.currentPage,
          Limit: this.pageNum,
          type: this.item.type
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.rows || []
          $this.ret = response.Data.rows
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          this.totalCount = response.Data.total
          $this.tableData = objs
        }
      })
    }
  }
}

</script>
