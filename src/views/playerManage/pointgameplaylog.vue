<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="UID：" :required="true" label-width="150px">
            <UidInput @setUid="function(iUid){item.Uid=iUid}" />
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
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
            <!--            <el-button type="success" size="mini" @click="retryTimeFailLog">更新派彩时间</el-button> //todo-->
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
          @row-click="clickData"
        >
          <el-table-column label="ID" width="160px">
            <template slot-scope="scope">
              {{ scope.row.ID }}
            </template>
          </el-table-column>
          <el-table-column label="uid">
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>

          <el-table-column label="开始时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.StartTime) }}
            </template>
          </el-table-column>
          <el-table-column label="结束时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.FinishTime) }}
            </template>
          </el-table-column>

          <el-table-column label="积分bets">
            <template slot-scope="scope">
              {{ scope.row.PointBet/1000 }}
            </template>
          </el-table-column>

          <el-table-column label="积分won">
            <template slot-scope="scope">
              {{ scope.row.PointWon/1000 }}
            </template>
          </el-table-column>

          <el-table-column label="积分taxed">
            <template slot-scope="scope">
              {{ scope.row.PointTaxed/1000 }}
            </template>
          </el-table-column>

          <el-table-column label="积分cur">
            <template slot-scope="scope">
              {{ scope.row.PointCur/1000 }}
            </template>
          </el-table-column>

          <el-table-column label="金币change">
            <template slot-scope="scope">
              {{ scope.row.MoneyChange/1000 }}
            </template>
          </el-table-column>

          <el-table-column label="实物change">
            <template slot-scope="scope">
              {{ scope.row.ItemChange }}
            </template>
          </el-table-column>

          <!--          <el-table-column label="操作"> //todo-->
          <!--            <template slot-scope="scope" style="width: 100px;">-->
          <!--              <el-button type="text" size="mini" @click="retry(scope.row.UniqueNo)">重试</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </el-col>
    </el-row>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="Windropc详情"
      :visible.sync="WindropcGameVisible"
      width="60%"
    >
      <br>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="累计贡献值">{{ WindropcGameResult.JackpotContributeTotal /1000 }}</el-descriptions-item>
        <el-descriptions-item label="单次贡献值">{{ WindropcGameResult.JackpotContribute /1000 }}</el-descriptions-item>
        <el-descriptions-item label="总球数">{{ WindropcGameResult.BallNum }}</el-descriptions-item>
        <el-descriptions-item label="总下注积分">{{ WindropcGameResult.BetAllScore /1000 }}</el-descriptions-item>
        <el-descriptions-item label="单球下注积分">{{ WindropcGameResult.BetScore /1000 }}</el-descriptions-item>
        <el-descriptions-item label="当前能量">{{ WindropcGameResult.CurEnergy /1000 }}</el-descriptions-item>
        <el-descriptions-item label="能量奖励">{{ WindropcGameResult.EnergyNum <1000 ? WindropcGameResult.EnergyNum+' 球' : WindropcGameResult.EnergyNum+' 积分' }}</el-descriptions-item>
        <el-descriptions-item label="Spin总次数">{{ WindropcGameResult.SpinCount }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formatTime(WindropcGameResult.StartTime) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formatTime(WindropcGameResult.FinishTime) }}</el-descriptions-item>
      </el-descriptions>
      <br>
      <el-table
        ref="filterTable"
        :data="WindropcGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="ID"
          label="ID"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.ID+1" />
          </template>
        </el-table-column>
        <el-table-column
          prop="ODDS"
          label="倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.ODDS<0" style="color:red">spin</span>
            <span v-else>{{ scope.row.ODDS }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="BallTimes"
          label="翻倍次数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.BallTimes" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinOdd"
          label="spin中奖倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.SpinOdd" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinScore"
          label="spin中奖积分"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.SpinScore /1000)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Score"
          label="积分"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.Score /1000)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="JpLevel"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.JpLevel)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="JpType"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.JpType)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="Jp数额"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.JpType>10000">
              {{formatNumber(scope.row.Jackpot)}}
            </span>
            <span v-else v-html="formatNumber(scope.row.Jackpot /1000)" />

          </template>
        </el-table-column>

        <el-table-column prop="cards" label="下注时间" width="110px">
          <template slot-scope="scope"> {{ formatHMSTime(scope.row.BallTime/1000) }}.{{ scope.row.BallTime%1000 }}  </template>
        </el-table-column>

<!--        <el-table-column-->
<!--          prop="TracksPos"-->
<!--          label="路径"-->
<!--          width="620"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <span v-html="scope.row.TracksPos" />-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <el-row type="flex" justify="end">
        <el-col :span="12">
          <div class="block">
            <el-pagination
              :current-page="clientDB.GetPage().GetCurrentPage()"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="clientDB.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDB.GetPage().GetTotalCount()"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
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
import { base64 } from 'jszip/lib/support';
import UidInput from "@/components/UidInput/index.vue";
const filterMap = {

}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {UidInput, Compare, Publish, MoneyInput},
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 10, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        date: $libDate.GetDayBegin(new Date().getTime()),
        limit: 20,
        offset: 1,
        uid: '',
        gid: 0,
        app: 0,
        uniqueNo: '',
        status: 0,
      },
      showRow:{},
      visibleID:false,
      tableData: [],
      gameMap: {},
      statusMap: {
        1: '等待重试', 2: '正在重试', 3: '重试成功',
      },
      totalCount: 0,
      WindropcGameVisible: false,
      WindropcGameResult: {
        BallNum: 0,
        BetAllScore: 0,
        BetScore: 0,
        CurEnergy: 0,
        EnergyNum: 0,
        SpinCount: 0,
        JackpotContributeTotal: 0,
        JackpotContribute: 0
      },
      WindropcGameOptions: [],
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
      if (this.item.Uid !== 0) {
        this.$EventBus.$emit('uid-change', this.item.Uid)
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/log/pointgame/playlog',
          Uid: this.item.Uid,
          Time: $libDate.SelectTimeToIndia(this.item.date) / 1000,
          Gid: 119
        }
      }).then(response => {
        $this.tableData = []
        console.log("===========",response.Data)
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          $this.tableData = response.Data
          $this.clientDB = new ClientTableData(objs, this.clientDB.GetPage().GetPageNum(), filterMap, 'ID', -1)
          $this.handleCurrentChange(1)
        }
        console.log("========",response)
      })
    },
    clickData(row, column, event) {
      if (column.label !== 'Uid') {
        this.getDetail(row.LogID, row.FinishTime)
      }
    },
    getDetail(id, dt) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/pointgame/detail',
          ID: id,
          DateTime: dt
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          const gid = this.$route.meta.gid
          console.log(obj)
         if (gid === 119) {
            $this.showWindropcGame(obj)
          } else {
            $this.showSmallGame(obj)
          }
        }
      })
    },

    showWindropcGame(obj) {
      const tMap = {}
      this.WindropcGameOptions = []
      const windropcObj = obj.Windropc
      if (Array.isArray(windropcObj.optionData.bouns) && windropcObj.optionData.bouns.length > 0) {
        for (let i = 0; i < windropcObj.optionData.bouns.length; i++) {
          const tracksPos = []
          if (windropcObj.optionData.bouns[i].TracksPos) {
            for (const pos of windropcObj.optionData.bouns[i].TracksPos) {
              tracksPos.push({
                posX: pos.posX,
                posY: pos.posY
              })
            }
          }
          const bouns = windropcObj.optionData.bouns[i]
          tMap[i] = {
            ID: i,
            ODDS: bouns.odds,
            BallTimes: bouns.ballTimes,
            SpinOdd: bouns.spinOdd,
            SpinScore: bouns.spinScore,
            Score: bouns.score,
            JpLevel: bouns.jpLevel,
            JpType: bouns.jpType,
            Jackpot: bouns.jackpot,
            BallTime: bouns.ballTime,
            TracksPos: tracksPos
          }
        }
        for (let i = 0; i < windropcObj.optionData.bouns.length; i++) {
          this.WindropcGameOptions.push(tMap[i])
        }
      }
      console.log(this.windropcGameOptions)
      this.WindropcGameResult.BallNum = windropcObj.optionData.ballNum
      this.WindropcGameResult.BetAllScore = windropcObj.optionData.betAllScore
      this.WindropcGameResult.BetScore = windropcObj.optionData.betScore
      this.WindropcGameResult.CurEnergy = windropcObj.optionData.curEnergy
      this.WindropcGameResult.EnergyNum = windropcObj.optionData.energyNum
      this.WindropcGameResult.SpinCount = windropcObj.optionData.spinCount
      this.WindropcGameResult.JackpotContributeTotal = windropcObj.JackpotContributeTotal
      this.WindropcGameResult.JackpotContribute = windropcObj.JackpotContribute
      this.WindropcGameVisible = true
    },

    formatHMSTime(ts) {
      return $libDate.FormateSecondStr(ts, 4)
    },
    formatNumber(n) {
      return n.toLocaleString()
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

    //todo:
    // retry(txid){
    //   request({
    //     url: '/dataProxy/info',
    //     method: 'post',
    //     data: {
    //       Path: '/wallet/retry/faillog',
    //       UniqueNo: txid,
    //     }
    //   }).then(response => {
    //     console.log("=====", response)
    //     if (response.RetCode === 0) {
    //       Message.success("重试成功！")
    //     }
    //   })
    // },
    // retryTimeFailLog(){
    //   request({
    //     url: '/dataProxy/info',
    //     method: 'post',
    //     data: {
    //       Path: '/wallet/retry/time/faillog',
    //       retryTime: parseInt(new Date().getTime() / 1000),
    //     }
    //   }).then(response => {
    //     console.log("=====", response)
    //     if (response.RetCode === 0) {
    //       Message.success(response.Data)
    //       this.getData()
    //     }
    //   })
    // },
    // 分页处理
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
  }
}
</script>
