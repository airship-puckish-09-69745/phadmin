<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item v-if="this.env == 'test'" v-model="appId" label="App：" :required="true" label-width="80px">
          <el-select v-model="appId" placeholder="请选择" size="mini">
            <el-option label="所有App" :value="0" />
            <el-option
              v-for="row in appInfo"
              :key="'app'+row.key"
              :label="row.label"
              :value="row.key"
            />
          </el-select>
        </el-form-item>
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
          <el-switch
            v-model="isVup"
          /> 小黑屋
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showChart">输赢图表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="gid==20 && dataArr.length!=0" type="warning" size="mini" @click="checkSweeperRate">扫雷概率</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="sweeperRateVisible">
      <el-table
        :data="sweeperRate"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          label="数量"
          type="index"
          width="100"
        />
        <el-table-column
          prop="Bomb"
          label="爆炸数"
          width="100"
        />
        <el-table-column
          prop="Total"
          label="点击数"
          width="100"
        />
        <el-table-column
          prop="Rate"
          label="爆炸概率"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="scope.row.Rate>=scope.row.STD?'color:green':'color:red'">{{ scope.row.Rate.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="STD"
          label="标准概率"
          width="100"
        />
      </el-table>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="20">
        <el-descriptions
          class="margin-top"
          :column="5"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总赢：">{{ formatNumber(item.win + item.lose) }}</el-descriptions-item>
          <el-descriptions-item label="输局数："> {{ item.loseCount }}</el-descriptions-item>
          <el-descriptions-item label="赢局数：">{{ item.winCount }}</el-descriptions-item>
          <el-descriptions-item label="胜率%：">{{ ( item.loseCount+item.winCount)>0?(item.winCount/ (item.loseCount+item.winCount)*100).toFixed(1):0 }}</el-descriptions-item>
          <el-descriptions-item label="台费：">{{ formatNumber(item.fee) }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-table
      ref="filterTable"
      :key="itemKey"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="width: 100%"
      @row-click="clickData"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="FinishTime"
        label="完成时间"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="2" :timestamp="scope.row.FinishTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="Uid"
        width="120"
      />

      <el-table-column
        prop="MoneyOrigin"
        label="牌局前金额"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyOrigin/1000) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="TableMoney"
        label="前注"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['TableMoney']" size="mini" @change="handleFilter">
            <el-option label="前注" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['TableMoney']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ formatNumber(scope.row.TableMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyChanged"
        label="输赢"
        width="100"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.PayoffAmount >0?'red':'green'}">
            {{ formatNumber(scope.row.PayoffAmount) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ServiceFee"
        :label="getServiceFeeName()"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.ServiceFee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyNow"
        label="余额"
        width="150px"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow) }}
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="耗时"-->
      <!--        width="70"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.IsRobot }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column
        prop="WinRate"
        :label="getWinRateName()"
        width="70"
      />

      <el-table-column
        prop="IsRobot"
        label="玩家类型"
        width="150px"
      >
        <template slot-scope="scope">
            <el-tag>{{ showRobotLevel(scope.row.IsRobot,scope.row.RobotLevel,scope.row.RobotDefenceLevel) }}{{showTrustLevel(scope.row.IsRobot,scope.row.TrustLevel)}}</el-tag>
            <el-tag v-if="scope.row.UserType" :type="scope.row.UserType <= 1 ? 'primary' : 'danger'">{{ showUserType(scope.row.IsRobot,scope.row.UserType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="IsRobot"
        label="房间类型"
        width="120px"
      >
        <template slot-scope="scope">
          {{ showRoomLevel(scope.row.IsPractice) }}
        </template>
      </el-table-column>
      <template v-if="gid === 24">
        <el-table-column
          prop="SchemaData"
          label="威胁等级"
        >
          <template slot-scope="scope">
            {{ showDangerLevel(scope.row.SchemaData.DangerLevel) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="DealCardMode"
          label="发牌方式"
          width="140px"
        >
          <template slot-scope="scope">
            {{ showCardMode(scope.row.SchemaData.DealCardMode) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="SchemaData.ProtectedSafeUser"
          label="启用低威胁底真人保护"
        >
          <template slot-scope="scope">
            {{ scope.row.SchemaData.ProtectedSafeUser ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SchemaData.ReaperJoined"
          label="启用收割机器人"
        >
          <template slot-scope="scope">
            {{ scope.row.SchemaData.ReaperJoined ? '是' : '否' }}
          </template>
        </el-table-column>

      </template>

      <el-table-column
        prop="LogID"
        label="LogID"
        min-width="100"
      />

      <el-table-column
        prop="Op"
        label="详情"
        width="90px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button :type="clickedRowsID.includes(scope.row.ID) ? 'warning' : 'primary'" size="mini" @click="clickData2(scope.row)">牌局</el-button>
        </template>
      </el-table-column>
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
    <tongits-game-log :game-log="GameLog" :game-log-visible="GameLogVisible" :gid="Gid" :is-robot-map="isRobotMap" @closeDialog="closeDialog" />

    <el-dialog
      title="玩家列表"
      :visible.sync="playerVisible"
      width="60%"
    >
      <el-table
        ref="filterTable"
        :data="playerTable"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="FinishTime"
          label="完成时间"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.FinishTime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Uid"
          label="Uid"
          width="120"
        >
          <template slot-scope="scope">
            <span :style="{color: scope.row.Uid === playerUid ? 'red':'green'}">
              {{ scope.row.Uid }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="TableMoney"
          label="前注"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['TableMoney']" size="mini" @change="handleFilter">
              <el-option label="前注" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['TableMoney']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ formatNumber(scope.row.TableMoney) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MoneyChanged"
          label="输赢"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color: scope.row.MoneyChanged >0?'red':'green'}">
              {{ formatNumber(scope.row.MoneyChanged) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ServiceFee"
          :label="getServiceFeeName()"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ServiceFee) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MoneyNow"
          label="余额"
          width="150px"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MoneyNow) }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          label="耗时"-->
        <!--          width="70"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.IsRobot }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column
          prop="WinRate"
          :label="getWinRateName()"
          width="70"
        />
        <template>
          <template v-if="gid==1 || gid==8 || gid==9">
            <el-table-column
              prop="RandVal"
              label="是否命中"
              width="100"
            >
              <template slot-scope="scope">
                {{ isBingo(scope.row.RandVal, scope.row.WinRate) }}
              </template>
            </el-table-column>

            <!--      IsPeiResult    int32 `json:"PeiVal"`         //最终命中的值 0无 1命中赢配牌 2命中输配牌-->
            <!--      LevelChanged   int32 `json:"LevelChanged"`   //幸运等级调控变化值-->
            <!--      TheResult      int32 `json:"TheResult"`      //最终结果：1中立 2赢符和预期 3赢不符合预期 4输符和预期 5输不符合预期-->
            <el-table-column
              prop="IsPeiResult"
              label="配牌标记"
              width="101"
            >
              <template slot-scope="scope">
                {{ FIsPeiResult(scope.row.IsPeiResult) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="TheResult"
              label="最终结果"
              width="120"
            >
              <template slot-scope="scope">
                <span :style="{color:(scope.row.TheResult==3||scope.row.TheResult==5)?'red':''}">{{
                  FTheResult(scope.row.TheResult)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="LuckyVal"
              label="幸运值"
              width="100"
            />
            <el-table-column
              prop="IsPractice"
              label="练习场"
              width="100"
            >
              <template v-slot:header>
                <el-select v-model="clientDB.FilterValueMap['IsPractice']" size="mini" @change="handleFilter">
                  <el-option label="练习场" :value="0" />
                  <el-option v-for="(o,key) in clientDB.FilterMap['IsPractice']" :key="key" :label="o" :value="key" />
                </el-select>
              </template>
              <template slot-scope="scope">
                {{ clientDB.GetShowValue('IsPractice', scope.row.IsPractice) }}
              </template>
            </el-table-column>

            <el-table-column prop="AlteredRobotCards" label="改机器人牌" width="100">
              <template slot-scope="scope">
                <span>{{ IsAlteredRobotsCards(scope.row.AlteredRobotCards) }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              prop="IsPractice"
              label="小黑屋"
              width="100"
            />
          </template>
        </template>

        <el-table-column
          prop="IsRobot"
          label="机器人类型"
          width="120px"
        >
          <template slot-scope="scope">
            {{ showRobotLevel(scope.row.IsRobot,scope.row.RobotLevel,scope.row.RobotDefenceLevel) }}
          </template>
        </el-table-column>
        <template v-if="gid === 24">
          <!--          <el-table-column-->
          <!--            prop="SchemaData"-->
          <!--            label="威胁等级"-->
          <!--          >-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ showDangerLevel(scope.row.SchemaData.DangerLevel) }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->

          <el-table-column
            prop="DealCardMode"
            label="发牌方式"
            width="140px"
          >
            <template slot-scope="scope">
              {{ showCardMode(scope.row.SchemaData.DealCardMode) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="SchemaData.ProtectedSafeUser"
            label="启用低威胁底真人保护"
          >
            <template slot-scope="scope">
              {{ scope.row.SchemaData.ProtectedSafeUser ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="SchemaData.ReaperJoined"
            label="启用收割机器人"
          >
            <template slot-scope="scope">
              {{ scope.row.SchemaData.ReaperJoined ? '是' : '否' }}
            </template>
          </el-table-column>
        </template>
      </el-table>

    </el-dialog>

    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'
import TongitsGameLog from './components/TongitsGameLog'
import DateTimeShow from '@/components/DatetimeShow'

const filterMap = {
  IsPractice: { 1: '是', 0: '否', 6: '钓鱼付费', 7: '钓鱼未付', 8: '钓鱼2付费', 9: '钓鱼2未付费', 10: '钓鱼3付费', 11: '钓鱼3未付费', 12: '免费钓付费', 13: '免费钓未付费' },
  TableMoney: 'all'
}

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '输赢', Data: [] }
    ]
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, LineChart, TongitsGameLog },
  data() {
    return {
      envProjectName: process.env.VUE_APP_PROJECT,
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,
      gid: 0,
      appId: 0,
      appInfo: [],
      isVup: false,
      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        win: 0,
        lose: 0,
        winCount: 0,
        fee: 0,
        loseCount: 0,
        seconds: 0
      },
      GameLog: {}, // 游戏日志
      Gid: 0,
      GameLogVisible: false,
      detailVisible: false,
      detailData: [],

      actionVisible: false,
      actions: [],
      actionNames: {
        1: '弃牌',
        2: '看牌',
        8: '前注',
        9: '跟注',
        10: '加注',
        14: '发起比牌',
        15: '同意比牌',
        16: '拒绝比牌',
        17: '因为要充值临时停止牌局'
      },
      publicCards: [],
      showPublicCars: false,

      baccaratVisible: false,
      baccaratDealerCards: [],
      baccaratPlayerCards: [],
      baccaratOptions: [],

      sweeperRateVisible: false,

      rummyDetailVisible: false,
      rummyDetails: [],
      rummyOverReason: {
        1: '首轮drop',
        2: '非首轮drop',
        3: '超时drop',
        4: 'finish失败',
        5: 'finish成功',
        6: 'declare',
        7: '其他玩家都drop了'
      },

      playerVisible: false,
      playerTable: [],
      playerUid: 0,

      chartData: newChartData(),
      dataArr: [],

      libMoney: new MoneyShow(['MoneyChanged', 'PayoffAmount', 'MoneyNow', 'ServiceFee', 'TableMoney']),
      uids: [],
      uidMap: {},
      isRobotMap: {},
      itemKey: '',
      clickedRowsID: [] // 点击过的数据ID，牌局按钮变黄色
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    this.getAppInfo()
  },
  methods: {
    showDangerLevel(level) {
      const cfg = ['0:免费', '1:普通', '2:专业', '3:大师', '4:宗师']
      return cfg[level] ? cfg[level] : level
    },

    showCardMode(mode) {
      const cfg = ['0', '1:免费随机发牌', '2:免费大三条牌', '3:免费冤家牌', '4:免费垃圾牌',
        '5:付费随机牌', '6:付费特定冤家牌', '7:付费例行冤家牌', '8:随机牌型发牌', '9:真随机发牌']

      return cfg[mode] ? cfg[mode] : mode
    },
    showRobotLevel(isRobot,level,defenceLevel) {
      if (isRobot!=0 && level==0) {
        level = isRobot
      }
      if (defenceLevel <= 0 || defenceLevel === undefined) {
        switch (level) {
          case -1 :
            return '机器人'
          case 0:
            return '真人'
          case 1:
            return '机器人--强放'
          case 2:
            return '机器人--弱放'
          case 3:
            return '机器人--陪玩'
          case 4:
            return '机器人--弱杀'
          case 5:
            return '机器人--强杀'
          case 8:
            return '一级杀手机器人'
          case 9:
            return '二级杀手机器人'
          case 10:
            return '收割机器人'
          default:
            return level <= 7 ? '陪玩机器人' : level
        }
      } else {
        switch (defenceLevel) {
          case 3 :
            return '机器人贴防 -- 陪玩'
          case 4:
            return '机器人贴防 -- 弱杀'
          case 5:
            return '机器人贴防 -- 强杀'
          case 6:
            return '机器人贴防 -- 防作弊'
          case 7:
            return '机器人预贴防 -- 陪玩'
          case 8:
            return '机器人预贴防 -- 弱杀'
          case 9:
            return '机器人预贴防 -- 强杀'
          case 10:
            return '机器人贴防 -- 锁血强杀'
          case 11:
            return '机器人预贴防 --  锁血强杀'
          default:
            return '机器人贴防 -- ' + defenceLevel
        }
      }

    },
    // showRobotLevel(isRobot,level) {
    //   if (isRobot!=0 && level==0) {
    //     level = isRobot
    //   }
    //   switch (level) {
    //     case -1 :
    //       return '机器人'
    //     case 0:
    //       return '真人'
    //     case 1:
    //       return '机器人--强放'
    //     case 2:
    //       return '机器人--弱放'
    //     case 3:
    //       return '机器人--陪玩'
    //     case 4:
    //       return '机器人--弱杀'
    //     case 5:
    //       return '机器人--强杀'
    //     case 6:
    //       return '机器人--贴防'
    //     case 8:
    //       return '一级杀手机器人'
    //     case 9:
    //       return '二级杀手机器人'
    //     case 10:
    //       return '收割机器人'
    //     default:
    //       return level <= 7 ? '陪玩机器人' : level
    //   }
    // },
    showTrustLevel(isRobot,level) {
      if (isRobot) {
        return ''
      }
      switch (level) {
        case 1:
          return '--低危用户'
        case 2:
          return '--疑似用户'
        case 3:
          return '--黑子用户'
        case 4:
          return '--低信用户'
        case 5:
          return '--高信用户'
        default:
          return ''
      }
    },
    showUserType(isRobot,userType) {
      if (isRobot) {
        return ''
      }
      if (userType === 4) {
        return '低信用户'
      } else if (userType === 5) {
        return '高信用户'
      } else if (userType === 2) {
        return "疑似用户"
      } else if (userType === 3) {
        return "黑子用户"
      } else if (userType === 1) {
        return "低危用户"
      }
      return ""
    },
    showRoomLevel(level) {
      switch (level) {
        case 0:
          return '普通场'
        case 1:
          return '练习场'
        case 100:
          return '好友房'
        case 110:
          return '比赛场'
        default:
          return level <= 7 ? '陪玩机器人' : level
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Uid === this.item.Uid || row.uid === this.item.Uid) {
        return 'success-row'
      } else {
        return ''
      }
    },
    showCard(cards) {
      if (cards == null || cards == undefined) {
        return ''
      }
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    isBingo(valA, valB) {
      if (valA < valB) {
        return '是'
      } else {
        return '否'
      }
    },
    peiValStr(randVal, winRate, peiVal) {
      if (randVal < winRate && peiVal === 1) {
        return '赢配牌'
      }
      if (randVal >= winRate && peiVal === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FIsPeiResult(val) {
      if (val === 1) {
        return '赢配牌'
      }
      if (val === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FTheResult(val) {
      if (val === 1) {
        return '中立'
      }
      if (val === 2) {
        return '赢-符和'
      }
      if (val === 3) {
        return '赢-不符和'
      }
      if (val === 4) {
        return '输-符和'
      }
      if (val === 5) {
        return '输-不符和'
      }
      return '无'
    },
    IsAlteredRobotsCards(v) {
      return v ? '是' : '-'
    },
    CalResult(randValue, winRate, moneyChange, peiVal) {
      if (randValue < winRate && peiVal === 1) {
        // 命中赢
        if (moneyChange <= 0) {
          return '赢不符和预期'
        } else {
          return '赢符和预期'
        }
      }
      if (randValue >= winRate && peiVal === 2) {
        // 命中输
        if (moneyChange >= 0) {
          return '输不符和预期'
        } else {
          return '输符和预期'
        }
      }
      return '中立'
    },
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    async refreshShow() {
      this.uidMap = {}
      this.tableData = this.clientDB.GetCurrentPageData()
      for (const o in this.tableData) {
        this.uidMap[this.tableData[o].Uid] = 0
      }

      this.uids = []
      for (var key in this.uidMap) {
        this.uids.push(key)
      }
      if (this.envProjectName != 'ph_audit') {
        request({
          url: '/dataProxy/is/robot',
          method: 'get',
          data: {
            Env: this.env,
            Uids: JSON.stringify(this.uids)
          }
        }).then(response => {
          if (response.RetCode === 0) {
            for (const key in response.Data) {
              this.isRobotMap[key] = response.Data[key]
            }
            for (const o of this.tableData) {
              if (this.isRobotMap[o.Uid] && o.IsRobot==0) {
                o.IsRobot = -1
              }
            }
          }
        })
      }
    },

    sleep(ms) { // sleep延迟方法2
      var unixtime_ms = new Date().getTime()
      while (new Date().getTime() < unixtime_ms + ms) {}
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatHourTime(ts) {
      return $libDate.FormateSecondStr(ts, 4)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      const $this = this
      this.sweeperRateVisible = false
      this.dataArr = []
      this.uidMap = {}
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/playlog',
          Uid: this.item.Uid,
          IsVup: this.isVup ? 1 : 0,
          Time: $libDate.SelectTimeToIndia(this.item.date) / 1000,
          Gid: this.gid,
          AppId: this.appId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.length === 0 || objs == 'no Data') {
            Message.success('查询结果为空')
            // loading.close()
            // return
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.clientDB = new ClientTableData(objs, this.clientDB.GetPage().GetPageNum(), filterMap, 'ID', -1)
          $this.item.win = $this.item.lose = $this.item.winCount = $this.item.loseCount = $this.item.seconds = $this.item.fee = 0
          for (const o in objs) {
            const item = objs[o]
            console.log('====', o, item.PayoffAmount, $this.item.winCount, $this.item.loseCount)
            if (item.PayoffAmount > 0) {
              $this.item.win += item.PayoffAmount
              $this.item.winCount++
            } else {
              $this.item.lose += item.PayoffAmount
              $this.item.loseCount++
            }
            $this.item.fee += item.ServiceFee
            $this.item.seconds += item.IsRobot // 存放了每局时长
            if (item.Gid === 14 && item.WinRate > 0) {
              // 真人场，需要特殊处理胜率展示
              const tmpWinRate = item.WinRate / 100
              objs[o].WinRate = tmpWinRate.toString() + '%'
            }
            if (item.Gid === 10) {
              objs[o].ServiceFee = (item.ServiceFee * 10).toFixed(2)
              objs[o].WinRate = (item.WinRate / 100).toFixed(2)
            } else if (item.Gid == 20) {
              objs[o].WinRate /= 100
              objs[o].ServiceFee *= 1000
            }
          }
          $this.handleCurrentChange(1)
          $this.dataArr = objs
          loading.close()
        } else {
          Message.error(response.Data)
        }
      })
    },
    clickData(row, column, event) {
      if (column.label !== 'Uid' && column.label !== '详情') {
        this.getDetail(row.LogID, row.FinishTime,row.Uid)
      }
    },
    clickData2(row) {
      console.log('clickData2', row)
      if (!this.clickedRowsID.includes(row.ID)) {
        this.clickedRowsID.push(row.ID)
      }
      this.getDetail(row.LogID, row.FinishTime,row.Uid)
    },

    async getRobotMap() {
      this.uidMap = {}
      this.tableData = this.clientDB.GetCurrentPageData()
      for (const o in this.tableData) {
        this.uidMap[this.tableData[o].Uid] = 0
      }

      this.uids = []
      for (var key in this.uidMap) {
        this.uids.push(key)
      }
      if (this.envProjectName != 'ph_audit') {
        request({
          url: '/dataProxy/is/robot',
          method: 'get',
          data: {
            Env: this.env,
            Uids: JSON.stringify(this.uids)
          }
        }).then(response => {
          if (response.RetCode === 0) {
            for (const key in response.Data) {
              this.isRobotMap[key] = response.Data[key]
            }
          }
        })
      }
    },
    getDetail(id, dt,uid) {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/detail',
          ID: id,
          DateTime: dt,
          Uid: uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          this.initData()
          const gid = this.$route.meta.gid
          console.log(obj)
          $this.showTongitsGameLog(obj)
        }
      })
    },
    showTongitsGameLog(obj) {
      this.GameLog = obj.Row
      this.GameLogVisible = true
      this.Gid = obj.Gid
      // try {
      //   const cards = JSON.parse(obj.cardData)
      //   let total = 0
      //   for (let i = 0; i < this.actions.length; i++) {
      //     this.actions[i].Cards = cards[this.actions[i].uid]
      //     total += this.actions[i].actionMoney
      //     this.actions[i].total = total
      //   }
      //   this.actionVisible = true
      // } catch (e) {
      //   console.log('无法解析牌局详情，很可能不存在')
      // }
    },
    showSmallGame(obj) {
      let names = []
      switch (this.$route.meta.gid) {
        case 7:
          names = ['黑桃', '红心', '梅花', '方块', 'Joker', '黑色牌', '红色牌']
          break
        default:
          return
      }
      const tMap = {}
      for (let i = 0; i < obj.options.length; i++) {
        const ob = obj.options[i]
        if (this.$route.meta.gid == 13) {
          const name = this.showCard(ob.cards) + '</br>【' + this.showCard(obj.dealerCards) + '】'
          names.push(name)
          tMap[ob.optionId] = { ID: ob.optionId, Name: name, Hit: ob.hit, Ret: [] }
        } else {
          tMap[ob.id] = { ID: ob.id, Name: names[ob.id - 1], Hit: ob.hit, Ret: [] }
        }
      }
      for (let i = 0; i < obj.players.length; i++) {
        const player = obj.players[i]
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          if (this.$route.meta.gid == 13) {
            result.id = result.optionId
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: result.moneyWon,
            Money: player.moneyResult
          })
        }
      }
      for (let i = 1; i <= names.length; i++) {
        this.detailData.push(tMap[i])
      }
      this.detailVisible = true
    },
    initData() {
      this.detailVisible = false
      this.detailData = []
      this.actionVisible = false
      this.actions = []
      // 清空公共牌
      this.publicCards = []
      this.showPublicCars = false
      // 清空baccarat数据
      this.baccaratDealerCards = []
      this.baccaratPlayerCards = []
      this.baccaratOptions = []
      this.baccaratVisible = false
    },
    showChart() {
      this.initChartData()
    },
    initChartData() {
      console.log(1)
      const objs = this.dataArr.sort(function(a, b) {
        return a.ID - b.ID
      })
      const chartData = newChartData()

      for (const i in objs) {
        const ob = objs[i]
        chartData.xData.push($libDate.FormateSecondStr(ob.FinishTime, 6))
        chartData.yData[0].Data.push(ob.MoneyChanged)
      }
      this.chartData = chartData
    },
    getServiceFeeName() {
      if (this.gid == 20) {
        return '下注炸弹数'
      } else if (this.gid == 10) {
        return '结果'
      } else {
        return '台费'
      }
    },
    getWinRateName() {
      if (this.gid == 20) {
        return '领奖倍率'
      } else if (this.gid == 10) {
        return '下注值'
      } else {
        return '胜率'
      }
    },
    closeDialog() {
      // console.log("close dialog")
      this.GameLogVisible = false
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
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}

ul#sweeperShow {
  width: 601px;
  height: 601px;
  padding:0px;
  clear:both;
  margin:0;
  list-style:none;
  border-top:#999 1px solid;
  border-left:#999 1px solid;
}

ul#sweeperShow li {
  width: 110px;
  height: 110px;
  font-size: 30px;
  float: left;
  margin: 0px;
  border: none;
  list-style: none;
  line-height: 100px;
  border-right:#999 1px solid;
  border-bottom:#999 1px solid;
  text-align: center;
}

ul#sweeperShow li .showStep {
  width: 30px;
  height: 30px;
  font-size: 21px;
  line-height: 30px;
  border-top: 1px #999 solid;
  border-right: 1px #999 solid;
  text-align: center;
  float: left;
  margin-top:80px;
  margin-right:0px;
}
</style>
