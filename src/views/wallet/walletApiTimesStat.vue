<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="timeRange"
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
          <el-form-item label="API列表">
            <el-select v-model.number="item.statType" placeholder="请选择" size="mini">
              <el-option label="检查账号" :value="1" />
              <el-option label="获取钱包余额" :value="2" />
              <el-option label="下注" :value="3" />
              <el-option label="结算" :value="4" />
              <el-option label="转出" :value="5" />
              <el-option label="转回" :value="6" />
              <el-option label="下注退款" :value="8" />
              <el-option label="增值业务" :value="9" />
              <el-option label="下注并派彩" :value="20" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model.number="item.failed" placeholder="请选择" size="mini">
              <el-option label="成功查询" :value="0" />
              <el-option label="失败查询" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15"/>
      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.TableCell(0)"
        >
          <el-table-column label="统计时间" >
            <template slot-scope="scope">
              {{ formatTime(scope.row.ReqStatTime) }}
            </template>
          </el-table-column>
          <el-table-column label="平均请求时间(ms)">
            <template slot-scope="scope">
              {{ scope.row.AvgTime }}
            </template>
          </el-table-column>

          <el-table-column label="请求次数" >
            <template slot-scope="scope">
              {{ scope.row.Count }}
            </template>
          </el-table-column>
          <el-table-column label="最高请求时间(ms)">
            <template slot-scope="scope">
              {{ scope.row.MaxTime }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            background
            :current-page="item.currPage"
            :page-sizes="[20]"
            :page-size="item.limit"
            layout=" prev, next"
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
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {$libDate, $libShow, ClientTableData} from "@/utils/common";
import {Message} from "element-ui";
const filterMap = {

}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        failed: 0,
        statType: 3
      },
      showRow: {},
      visibleID: false,
      tableData: [],
      gameMap: {},
      totalCount: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getData() {
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
          Env: $this.env,
          Path: '/wallet/reqtimes/stat',
          StartTime: bTime,
          EndTime: eTime,
          StatType: $this.item.statType,
          Failed: $this.item.failed
        }
      }).then(response => {
        $this.tableData = []
        console.log(response)
        if (response.RetCode === 0) {
          if (response.Data === 'no Data') {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.item.limit) {
            $this.totalCount = response.Data.length + 1
          }
          console.log($this.totalCount)
        }
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.item.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.item.offset = val
      this.getData()
    }

  }
}
</script>
