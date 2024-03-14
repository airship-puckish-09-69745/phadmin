<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true">
          <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="click2getInfo">查询</el-button>
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
          prop="ID"
          label="ID"
        />
        <el-table-column
          prop="Uid"
          label="Uid"
        />
        <el-table-column
          prop="FinishTime"
          label="游戏结束时间"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.FinishTime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="OpTime"
          label="踢人操作时间"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.OpTime+2" />
          </template>
        </el-table-column>
        <el-table-column
          prop="LogID"
          label="Log ID"
        />
        <el-table-column
          prop="Gid"
          label="GameId"
        />
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
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

<style>
.tooltip-button {
  margin-right: 10px;
}
</style>

<script>
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libShow, $libDate } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  components: { DateTimeShow, UidInput },
  data() {
    return {
      // appId: 1000000,
      appInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        Gid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()), // Date.parse(new Date(this.dDate(0, 30))),
        end: $libDate.GetDayEnd(new Date().getTime()) // Date.parse(new Date())
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 1,
      pageNum: 20
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.item.gameId = 0
  },
  methods: {
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
    handleSizeChange(val) {
      this.currentPage = 1
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
    click2getInfo() {
      this.currentPage = 1
      this.getInfo()
    },
    getInfo() {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/game/kick/userlog/list',
          Uid: this.item.Uid || 0,
          Gid: this.item.Gid || 0,
          StartTime: this.item.start / 1000,
          EndTime: this.item.end / 1000,
          Page: this.currentPage,
          Limit: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          $this.ret = response.Data.Items
          $this.tableData = objs
          this.totalCount = response.Data.Total
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
        }
      })
    }
  }
}

</script>
