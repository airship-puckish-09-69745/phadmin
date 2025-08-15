<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="游戏：" :required="true">
          <el-select v-model="item.gid" placeholder="请选择">
            <el-option label="tongits" :value="0" />
            <el-option label="tongits pot" :value="22" />
            <el-option label="tongits laizi" :value="28" />
            <el-option label="tongits quick" :value="29" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="date"
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
          prop="date"
          label="日期"
          width="100"
        />
        <el-table-column
          prop="high_score_cnt"
          label="现存高信用户"
          width="120"
        />
        <el-table-column
          prop="login_high_score_cnt"
          label="今日游戏高信用户"
          width="150"
        >
          <template slot-scope="scope">
            <span v-html="getPercent('login_high_score_cnt',scope.row,scope.row.last)"></span> 
          </template>
        </el-table-column>
        <el-table-column
          prop="low_score_cnt"
          label="现存低信用户"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="login_low_score_cnt"
          label="今日游戏低信用户"
          width="150"
        >
          <template slot-scope="scope">
            <span v-html="getPercent('login_low_score_cnt',scope.row,scope.row.last)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="suspect_cnt"
          label="现存疑似用户"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="login_suspect_cnt"
          label="今日游戏疑似用户"
          width="150"
        >
          <template slot-scope="scope">
            <span v-html="getPercent('login_suspect_cnt',scope.row,scope.row.last)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="black_cnt"
          label="现存黑子用户"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="login_black_cnt"
          label="今日游戏黑子用户"
          width="150"
        >
          <template slot-scope="scope">
            <span v-html="getPercent('login_black_cnt',scope.row,scope.row.last)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="low_risk_cnt"
          label="现存低危用户"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="login_low_risk_cnt"
          label="今日游戏低危用户"
          width="150"
        >
          <template slot-scope="scope">
            <span v-html="getPercent('login_low_risk_cnt',scope.row,scope.row.last)"></span>
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
        gid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()-86400*7*1000), // Date.parse(new Date(this.dDate(0, 30))),
        end: $libDate.GetDayEnd(new Date().getTime()) // Date.parse(new Date()),
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
    this.getInfo()
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
    getSum(row) {
      if (row === undefined) {
        return 0
      }
      return row.login_black_cnt + row.login_low_score_cnt + row.login_high_score_cnt + row.login_suspect_cnt + row.login_low_risk_cnt
    },
    getPercent(key,cur,last) {
      const sum1 = this.getSum(cur)
      const sum2 = this.getSum(last)
      const per1 = sum1===0?0:Math.round(cur[key]*100/sum1)
      if (last === undefined) {
        return `${cur[key]} (${per1}%)`
      }
      const per2 = sum2===0?0:Math.round(last[key]*100/sum2)
      if (per1 === per2) {
        return `${cur[key]} (${per1}%)`
      }
      if (per1 > per2) {
        return `${cur[key]} (<span style="color: red;"> ${per1}%</span>)`
      } else {
        return `${cur[key]} (<span style="color: green;"> ${per1}%</span>)`
      }
    },
    getInfo() {
      const $this = this

      // if (this.env != 'test') {
      //   console.log(`env:${this.env} return`)
      //   return
      // }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/stat',
          gid: this.item.gid,
          from: this.item.start / 1000,
          to: this.item.end / 1000,
          page: this.currentPage,
          limit: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          $this.ret = response.Data
          this.totalCount = response.Data.length
          $this.tableData = objs

          for (let i=0; i<this.totalCount; i++) {
            if (i < this.totalCount-1) {
              objs[i].last = objs[i+1]
            }
            // console.log(JSON.stringify(objs[i]))
          }

          console.log(objs)
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
