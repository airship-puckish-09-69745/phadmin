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
          <el-form-item label="Uid">
            <el-input v-model.number="item.uid" placeholder="Uid" size="mini" oninput="if(value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)"/>
          </el-form-item>
          <el-form-item label="交易id">
            <el-input v-model="item.txId" placeholder="交易id" size="mini" style="width: 225px"/>
          </el-form-item>
          <el-form-item label="状态">
          <el-select v-model.number="item.status" placeholder="请选择" size="mini">
            <el-option label="所有" :value="0" />
            <el-option label="等待尝试" :value="1" />
            <el-option label="正在尝试" :value="2" />
            <el-option label="尝试成功" :value="3" />
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
            <el-button type="success" size="mini" @click="retryTimeFailLog">更新派彩时间</el-button>
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
          <el-table-column label="失败时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.OpTime) }}
            </template>
          </el-table-column>
          <el-table-column label="游戏">
            <template slot-scope="scope">
              {{ gameMap[scope.row.GameId] }}
            </template>
          </el-table-column>
          <el-table-column label="应用id">
            <template slot-scope="scope">
              {{ scope.row.App }}
            </template>
          </el-table-column>
          <el-table-column label="Uid">
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>

<!--          <el-table-column label="交易id" width="220px">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.TxId }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="回合id" width="220px">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.RoundId }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="失败金额">
            <template slot-scope="scope">
              <span v-if="scope.row.ActType===2000">{{scope.row.BetParamsFail.BetAmount / 1000}}</span>
              <span  v-else >{{scope.row.EndRoundParamsFail?parseInt(scope.row.EndRoundParamsFail.Data[0].PayoffAmount) / 1000:0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作类型">
            <template slot-scope="scope">
              {{ scope.row.ActType }}
            </template>
          </el-table-column>
          <el-table-column label="失败类型">
            <template slot-scope="scope">
              {{ failTypeMap[scope.row.FailType] }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ statusMap[scope.row.Status] }}
            </template>
          </el-table-column>

          <el-table-column label="下次重试时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.NextTryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="总计重试次数">
            <template slot-scope="scope">
              {{ scope.row.ReTryNum }}
            </template>
          </el-table-column>
          <el-table-column label="扩展数据">
            <template slot-scope="scope">
              {{ scope.row.ExtData }}
            </template>
          </el-table-column>
          <el-table-column label="查看id" >
            <template slot-scope="scope">
              <el-button  @click="showTxId(scope.row)"> 查看id</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" style="width: 100px;">
              <el-button type="text" size="mini" @click="retry(scope.row.TxId)">重试</el-button>
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

    <el-dialog   :visible.sync="visibleID" >
      <el-descriptions border column="1">
        <el-descriptions-item label="交易id">{{ showRow.TxId}}</el-descriptions-item>
        <el-descriptions-item label="回合id">{{ showRow.RoundId}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
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
      timeRange: [$libDate.GetDayBegin(new Date() - 86400000 * 3), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        limit: 20,
        offset: 1,
        uid: 0,
        gid: 0,
        app: 0,
        txId: '',
        status: 0,
      },
      showRow:{},
      visibleID:false,
      tableData: [],
      gameMap: {},
      failTypeMap: {
        1: '派彩失败', 2: '游戏结算失败', 3: '转回失败', 4: '下注失败',
      },
      statusMap: {
        1: '等待尝试', 2: '正在尝试', 3: '尝试成功',
      },
      totalCount: 0,
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
      if ($this.item.uid === '') {
        $this.item.uid = 0
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/wallet/fail/log',
          StartTime: bTime,
          EndTime: eTime,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          Uid: $this.item.uid,
          Gid: $this.item.gid,
          App: $this.item.app,
          TxId: $this.item.txId,
          Status: $this.item.status,
        }
      }).then(response => {
        $this.tableData = []
        console.log("===========",response.Data)
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.item.limit){
            $this.totalCount = response.Data.length+1
          }
        }
        console.log("========",response)
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
    showTxId(row){
      this.showRow = row
      this.visibleID =true
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameMap[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    },
    retry(txid){
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/retry/faillog',
          TxId: txid,
        }
      }).then(response => {
        console.log("=====", response)
        if (response.RetCode === 0) {
          Message.success("重试成功！")
        }
      })
    },
    retryTimeFailLog(){
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/retry/time/faillog',
          retryTime: parseInt(new Date().getTime() / 1000),
        }
      }).then(response => {
        console.log("=====", response)
        if (response.RetCode === 0) {
          Message.success(response.Data)
          this.getData()
        }
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.item.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.item.offset= val
      this.getData()
    },

  }
}
</script>
