<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：">
          <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item v-model="item.black" label="是否加黑：" label-width="100px">
          <el-select v-model="item.black" placeholder="请选择" size="small">
            <el-option label="全部" key="-1" value="-1" />
            <el-option label="是" key="1" value="1" />
            <el-option label="否" key="0" value="0" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="开始日期：">-->
<!--          <el-date-picker-->
<!--            v-model="item.start"-->
<!--            value-format="timestamp"-->
<!--            type="datetime"-->
<!--            placeholder="选择日期"-->
<!--            size="mini"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="结束日期：">-->
<!--          <el-date-picker-->
<!--            v-model="item.end"-->
<!--            value-format="timestamp"-->
<!--            type="datetime"-->
<!--            placeholder="选择日期"-->
<!--            size="mini"-->
<!--          />-->
<!--        </el-form-item>-->
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
          width="120"
        />
        <el-table-column
          prop="Uid"
          label="用户A Uid"
          width="120"
        />
        <el-table-column
          prop="Uid2"
          label="用户B Uid"
          width="120"
        />
        <el-table-column
          prop="CheatTimes"
          label="作弊次数"
          width="120"
        />
        <el-table-column
          prop="Black"
          label="黑名单"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag
              :type="tagtype(scope.row.Black)">
              {{ scope.row.Black == 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          label="更新时间"
          width="200"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.UpdateTime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="200"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.CreateTime" />
          </template>
        </el-table-column>
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
import { $libDate, $libShow } from '@/utils/common'
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
        start: 0, // $libDate.GetDayBegin(new Date().getTime()), // Date.parse(new Date(this.dDate(0, 30))),
        end: 0, // Date.parse(new Date()), // $libDate.GetDayEnd(new Date().getTime()),
        black: '1'
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
    tagtype(val) {
      if (val == 1) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    getInfo() {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/group/list',
          Uid: this.item.Uid || 0,
          Black: this.item.black || -1,
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
