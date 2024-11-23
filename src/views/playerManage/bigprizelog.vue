<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-alert type="error" description="注意：数据可能有1-2分钟的延时" />
      </el-col>
    </el-row>
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="应用：">
          <el-select v-model="item.App" size="mini">
            <el-option v-for="row of apps" :label="row.label" :value="row.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏：">
          <el-select v-model="item.Gid" size="mini">
            <el-option v-for="row of games" :label="row.label" :value="row.value" />
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
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column
          prop="Uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="Gid"
          label="游戏"
        >
          <template slot-scope="scope">
            {{ getGameName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Prizetime"
          label="时间"
          sortable
          width="100"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="4" :timestamp="scope.row.Prizetime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Bet"
          label="下注"
          width="70"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Bet/1000) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Odds"
          label="中奖倍数"
          width="70"
        />
        <el-table-column
          prop="Money"
          label="中奖金额"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Money/1000) }}
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
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, UidInput },
  data() {
    return {
      env: 'dev',
      apps: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '内部用[1000002]' },
        { 'value': 1000003, 'label': 'BP-测试[1000003]' },
        { 'value': 1000005, 'label': 'BP-正式[1000005]' }
      ],
      games: [
        { 'value': 82, 'label': 'Millionaire' },
        { 'value': 76, 'label': 'Candy Rush' }
      ],

      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        Gid: 0,
        App: 0,
        Page: 0,
        Limit: 0
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 0,
      pageNum: 20
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.item.Gid = this.games[0].value
    this.getGameList()
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
    getTime(toDate) {
      return toDate / 1000
    },
    getGameName(row) {
      let name = '' + row.Gid
      for (const i in this.games) {
        if (this.games[i].value === row.Gid) {
          name = this.games[i].label
          break
        }
      }
      return name
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 199) {
              this.games.push({
              value: response.Data[i].Gid,
              label: response.Data[i].Name
            })
            }
          }
        }
      })
    },
    getInfo() {
      const $this = this
      let uid = this.item.Uid
      // 判断 uid 是否有值，没有值给 0
      if (uid === '' || uid === undefined || isNaN(uid)) {
        uid = 0
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/bigprizelog/logs',
          Uid: parseInt(uid),
          Gid: this.item.Gid,
          App: this.item.App,
          Time: this.getTime(this.item.date),
          StartTime: this.getTime(this.item.date),
          EndTime: this.getTime(this.item.date) + 86399,
          Page: this.currentPage,
          Limit: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.totalCount = response.Data.Count
          const objs = response.Data.List || []
          $this.ret = response.Data
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.tableData = objs
        }
      })
    }
  }
}

</script>
