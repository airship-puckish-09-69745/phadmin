<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true">
          <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isButtonDisabled" type="primary" size="mini" @click="click2getInfo">查询</el-button>
          <el-button :disabled="isButtonDisabled" type="primary" size="mini" @click="exportExcel">导出</el-button>
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
          width="90"
        />
        <el-table-column
          prop="uid"
          label="Uid"
          width="90"
        />
        <el-table-column
          prop="preUid"
          label="上层Uid"
          width="90"
        />
        <el-table-column
          prop="numbersScore"
          label="次数计分"
          width="90"
        />
        <el-table-column
          prop="numbersDetail"
          label="次数计分快照"
          width="200"
        />
        <el-table-column
          prop="groupScore"
          label="个数计分"
          width="90"
        />
        <el-table-column
          prop="groupDetail"
          label="个数计分快照"
          width="200"
        />
        <el-table-column
          prop="gamelogID"
          label="GamelogID"
          width="180"
        />
        <el-table-column
          prop="finishTime"
          label="游戏结束时间"
          width="180"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.finishTime" />
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
import DateTimeShow from '@/components/DatetimeShow/index.vue'

export default {
  components: { DateTimeShow, UidInput },
  data() {
    return {
      // appId: 1000000,
      appInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        cheatType: 0,
        start: $libDate.GetDayBegin(new Date().getTime()), // Date.parse(new Date(this.dDate(0, 30))),
        end: $libDate.GetDayEnd(new Date().getTime()) // Date.parse(new Date()),
      },
      tableData: [],
      exportData: [],
      offsetId: 0,
      isButtonDisabled: false,
      libShow: $libShow,
      totalCount: 0,
      exportLimit: 100,
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
      this.isButtonDisabled = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/tongits/cheat/scorelog/list',
          Uid: this.item.Uid || 0,
          StartTime: this.item.start / 1000,
          EndTime: this.item.end / 1000,
          Page: this.currentPage,
          Limit: this.pageNum
        }
      }).then(response => {
        this.isButtonDisabled = false
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
      }).catch(function() {
        $this.isButtonDisabled = false
      })
    },
    async getExportData() {
      const response = await request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/tongits/cheat/scorelog/exportlist',
          Uid: this.item.Uid || 0,
          StartTime: this.item.start / 1000,
          EndTime: this.item.end / 1000,
          OffsetId: this.offsetId,
          Limit: this.exportLimit
        }
      })

      const data = response.Data.Items || []
      if (response.Data && response.Data.Items) {
        for (const i in data) {
          const tmp = []
          tmp.push(data[i].id)
          tmp.push(data[i].uid)
          tmp.push(data[i].preUid)
          tmp.push(data[i].numbersScore + data[i].groupScore)
          tmp.push(data[i].numbersScore)
          tmp.push(data[i].numbersDetail)
          tmp.push(data[i].groupScore)
          tmp.push(data[i].groupDetail)
          tmp.push(data[i].gamelogID)
          tmp.push($libDate.FormateMilisecondStrByZone(data[i].finishTime * 1000, 2, 'cn'))
          this.offsetId = data[i].id
          console.log('tmp: ', tmp)
          this.exportData.push(tmp)
        }
      }
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(async excel => {
        if (this.totalCount === 0) {
          this.$message.error('没有要导出的数据，或者先点击查询')
          return
        }

        this.exportData = []
        this.offsetId = 0

        const max = Math.ceil(this.totalCount / this.exportLimit)
        console.log('max=', max, 'this.dataTotal=', this.totalCount)
        this.isButtonDisabled = true
        for (let i = 1; i <= max; i++) {
          await this.getExportData()
        }
        this.isButtonDisabled = false
        const data = this.exportData
        const header = [
          'ID', 'Uid', '上层Uid', '总关联分', '次数计分', '次数计分快照', '个数计分', '个数计分快照', 'GamelogID', '游戏结束时间'
        ]
        excel.export_json_to_excel({
          header: header, // 表头 必填
          data, // 具体数据 必填
          filename: 'tongits作弊关联计分日志', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}

</script>
