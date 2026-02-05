<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              v-model="timeRange"
              :default-time="['00:00:00', '23:59:59']"
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
          <el-form-item label="操作类型">
            <el-select v-model="item.actType" placeholder="请选择操作类型" clearable filterable>
              <el-option label="所有" :value="0" />
              <el-option
                v-for="(label, key) in actTypeMap"
                :key="key"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Uid">
            <el-input v-model.number="item.uid" placeholder="Uid" size="mini" />
          </el-form-item>
          <el-form-item label="交易id">
            <el-input v-model="item.UniqueNo" placeholder="交易id" size="mini" style="width: 225px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model.number="item.status" placeholder="请选择" size="mini">
              <el-option label="所有" :value="0" />
              <el-option label="等待重试" :value="1" />
              <el-option label="正在重试" :value="2" />
              <el-option label="重试成功" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
            <!--            <el-button type="success" size="mini" @click="retryTimeFailLog">更新派彩时间</el-button>-->
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
          <el-table-column label="失败时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.CTime) }}
            </template>
          </el-table-column>
          <el-table-column label="下次重试时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.NextTryTime) }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="游戏">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ gameMap[scope.row.GameId] }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="应用id">
            <template slot-scope="scope">
              {{ scope.row.App }}
            </template>
          </el-table-column>
          <el-table-column label="站点)">
            <template slot-scope="scope">
              {{ scope.row.SceneId }}
            </template>
          </el-table-column>
          <el-table-column label="场景值(外部用)">
            <template slot-scope="scope">
              {{ scope.row.SiteId }}
            </template>
          </el-table-column>
          <el-table-column label="Uid">
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>

          <el-table-column label="交易id" width="220px">
            <template slot-scope="scope">
              {{ scope.row.UniqueNo }}
            </template>
          </el-table-column>
          <el-table-column label="失败金额">
            <template slot-scope="scope">
              <span>{{ scope.row.Amount > 0 ? (scope.row.Amount / 1000) : "" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作类型">
            <template slot-scope="scope">
              {{ actTypeMap[String(scope.row.ActType)] }}
            </template>
          </el-table-column>
          <el-table-column label="发放类型">
            <template slot-scope="scope">
              {{ VoucherTypeMap[scope.row.VoucherType] }}
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
          <!--          <el-table-column label="查看id">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button @click="showTxId(scope.row)"> 查看id</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="操作">-->
          <!--            <template slot-scope="scope" style="width: 100px;">-->
          <!--              <el-button type="text" size="mini" @click="retry(scope.row.TxId)">重试</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
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

    <el-dialog :visible.sync="visibleID">
      <el-descriptions border column="1">
        <el-descriptions-item label="交易id">{{ showRow.TxId }}</el-descriptions-item>
        <el-descriptions-item label="回合id">{{ showRow.RoundId }}</el-descriptions-item>
        <el-descriptions-item v-if="showRow.Status == 3" label="下注状态">{{ showRow.Valid }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import { Message } from 'element-ui'
import { base64 } from 'jszip/lib/support'
const filterMap = {

}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      appInfo: [],
      item: {
        limit: 20,
        offset: 1,
        uid: '',
        gid: 0,
        app: 0,
        UniqueNo: '',
        status: 0,
        actType: 0,
        sceneId: 0
      },
      showRow: {},
      visibleID: false,
      tableData: [],
      gameMap: {},
      VoucherTypeMap: {
        1: '门票发放', 0: '权益金发放'
      },
      statusMap: {
        1: '等待重试', 2: '正在重试', 3: '重试成功'
      },
      actTypeMap: {
        '3000': '比赛营销接口-系统发放',
        '3001': '比赛营销接口派彩',
        '3002': '德州比赛营销接口派彩',
        '3003': '摇钱树活动营销接口派彩',
        '3004': '复活节活动营销接口派彩',
        '3005': '直播抽奖接口派彩',
        '3006': '新手任务活动营销接口派彩',
        '3007': '空投活动营销接口派彩',
        '3008': '红包雨活动营销接口派彩',
        '3009': '活动地图营销接口派彩',
        '3010': 'Poker专题活动营销接口派彩',
        '3011': 'TongitsHunter活动营销接口派彩',
        '3012': 'KingOfPot活动营销接口派彩',
        '3013': '有效下注排行榜活动营销接口派彩',
        '3014': '7日留存活动',
        '3015': 'Pusoy比赛营销接口派彩',
        '3016': '万圣节活动营销接口派彩',
        '3017': '排名活动营销接口派彩'
      },
      totalCount: 0
    }
  },
  created() {
    this.getGameList()
    this.getData()
    this.getAppInfo()
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
      let uid = 0
      if ($this.item.uid === '') {
        uid = 0
      } else {
        const exp = /^[0-9]*$/
        if (!exp.test($this.item.uid)) {
          Message.error('请输入正确的uid')
          return
        }
        uid = $this.item.uid
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/marketing/fail/list',
          StartTime: bTime,
          EndTime: eTime,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          Uid: uid,
          Gid: $this.item.gid,
          App: $this.item.app,
          UniqueNo: $this.item.UniqueNo,
          Status: $this.item.status,
          ActType: $this.item.actType,
          SceneId: $this.item.sceneId
        }
      }).then(response => {
        $this.tableData = []
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          console.log(response.Data)

          // 处理每一项的 FailPayloadJson 字段
          if (Array.isArray(response.Data)) {
            response.Data.forEach(item => {
              item.Amount = null
              if (item.FailPayloadJson) {
                var failPayloadObj = JSON.parse(item.FailPayloadJson)
                item.Amount = failPayloadObj.Amount
              }
            })
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.item.limit) {
            $this.totalCount = ($this.item.offset - 1) * $this.item.limit + $this.item.limit + 1
          }
        }
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
    showTxId(row) {
      this.showRow = row
      this.visibleID = true
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
    retry(txid) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/marketing/fail/list',
          TxId: txid
        }
      }).then(response => {
        console.log('=====', response)
        if (response.RetCode === 0) {
          Message.success('重试成功！')
        }
      })
    },
    retryTimeFailLog() {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/retry/time/faillog',
          retryTime: parseInt(new Date().getTime() / 1000)
        }
      }).then(response => {
        console.log('=====', response)
        if (response.RetCode === 0) {
          Message.success(response.Data)
          this.getData()
        }
      })
    },
    getAmount(data) {
      if (data.FailType == 7) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.EntryFee / 1000
      } else if (data.FailType == 8) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        if (sub.MatchStatus == 1) {
          if (sub.HighPrecision == 1) { // 高精度
            return sub.Amount / 1000000
          }
          return sub.Amount / 1000
        } else {
          return '退费：' + (sub.Amount / 1000)
        }
      } else if (data.FailType == 10) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.Amount / 1000
      } else if (data.FailType == 11) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.HoldingAmount / 1000 - sub.BetAmount / 1000 + sub.PayoffAmount / 1000
      } else if (data.FailType == 12) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.Amount / 1000
      } else if (data.FailType == 13) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.GiftAmount / 1000
      } else if (data.FailType == 14) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return sub.Amount / 1000
      } else if (data.FailType == 16) {
        const sub = JSON.parse(data.CommonFailParamsJsonString)
        console.log('json data', JSON.parse(data.CommonFailParamsJsonString))
        return '下注:' + (sub.BetAmount / 1000) + ' | 派彩:' + sub.PayoffAmount / 1000
      } else {
        if (data.hasOwnProperty('BetParams')) {
          return data.BetParamsFail.BetAmount / 1000
        }
        return 0
      }
    },
    // 分页处理
    handleSizeChange(val) {
      this.item.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.item.offset = val
      this.getData()
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
    }

  }
}
</script>
