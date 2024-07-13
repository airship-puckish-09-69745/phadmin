<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="15">
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
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15" />
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
          <el-table-column label="操作时间" width="160px">
            <template slot-scope="scope">
              {{formatTime(scope.row.OpTime)}}
            </template>
          </el-table-column>
          <el-table-column label="游戏">
            <template slot-scope="scope">
              {{gameMap[scope.row.GameId]}}
            </template>
          </el-table-column>
          <el-table-column label="应用id">
            <template slot-scope="scope">
              {{scope.row.App}}
            </template>
          </el-table-column>
          <el-table-column label="Uid">
            <template slot-scope="scope">
              {{scope.row.Uid}}
            </template>
          </el-table-column>
          <el-table-column label="交易id" width="220px">
            <template slot-scope="scope">
              {{scope.row.TxId}}
            </template>
          </el-table-column>
          <el-table-column label="回合id" width="220px">
            <template slot-scope="scope">
              {{scope.row.RoundId}}
            </template>
          </el-table-column>
          <el-table-column label="操作类型">
            <template slot-scope="scope">
              {{scope.row.ActType}}
            </template>
          </el-table-column>
          <el-table-column label="失败类型">
            <template slot-scope="scope">
              {{scope.row.FailType}}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.Status}}
            </template>
          </el-table-column>

          <el-table-column label="下次重试时间" width="160px">
            <template slot-scope="scope">
              {{formatTime(scope.row.NextTryTime)}}
            </template>
          </el-table-column>
          <el-table-column label="总计重试次数">
            <template slot-scope="scope">
              {{scope.row.ReTryNum}}
            </template>
          </el-table-column>
          <el-table-column label="扩展数据">
            <template slot-scope="scope">
              {{scope.row.ExtData}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {$libDate, $libShow} from "@/utils/common";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()-86400000*3), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item:{
        limit:20,
        offset:1,
        uid:0,
        gid:0,
        app:0,
        txId:'',
      },
      tableData:[],
      gameMap:{}
    }
  },
  created() {
    this.getGameList()
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
          Path: '/walletfaillog/log',
          StartTime: bTime,
          EndTime: eTime,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          Uid: $this.item.uid,
          Gid: $this.item.gid,
          App: $this.item.app,
          TxId: $this.item.txId,
        }
      }).then(response => {
        $this.tableData=[]
        if (response.RetCode===0){
          $this.tableData=response.Data
        }
  console.log(response)
      })
    },

    getList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Scene
            })
          }
        }
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameMap[response.Data[i].Gid]=response.Data[i].Name
          }
        }
      })
    }

  }
}
</script>
