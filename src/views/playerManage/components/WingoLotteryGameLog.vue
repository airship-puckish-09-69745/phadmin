<template>
  <el-dialog
    title="WingoLottery详情"
    :visible.sync="ComponentsGameLogVisible"
    :before-close="closeView"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="1200px"
  >
    <el-descriptions class="margin-top" title="" :column="3" border>
      <el-descriptions-item>
        <template slot="label">
          前注：
        </template>
        {{ formatNumber(GameLog.Bet / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          开始时间：
        </template>
        {{ formatTime(GameLog.StartTime ) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          结束时间：
        </template>
        {{ formatTime(GameLog.FinishTime ) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          输赢：
        </template>
        {{ formatNumber(getMoneyWon() / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          彩球数字：
        </template>
        {{ GameLog.Wingo.dice.points }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          彩球颜色：
        </template>
        {{ NumberColors[GameLog.Wingo.dice.points] }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="GameLog.Wingo.options" border :header-cell-style="{'text-align':'center'}" :row-style="getHitStyle">
      <el-table-column label="区域ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="区域名称">
        <template slot-scope="scope">{{ getOptionName(scope.row.id) }}</template>
      </el-table-column>
      <el-table-column label="命中">
        <template slot-scope="scope">{{ scope.row.isHit ==0?'否':'是' }}</template>
      </el-table-column>
      <el-table-column label="倍率">
        <template slot-scope="scope">{{ scope.row.odds /1000 }}</template>
      </el-table-column>
      <el-table-column label="区域累计下注">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet /1000) }}</template>
      </el-table-column>
    </el-table>
    <el-table :data="GameLog.Wingo.players" border :header-cell-style="{'text-align':'center'}">
      <el-table-column prop="uid" label="UID" width="80px">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="下注金额" width="80px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet /1000) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="当前金额" width="80px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyEnd /1000) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="下注前金额" width="100px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyOrigin /1000 ) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="输赢" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.moneyWon>0" style="color: red">
            {{ formatNumber( scope.row.moneyWon /1000) }}
          </span>
          <span v-else style="color: green">
            {{ formatNumber( scope.row.moneyWon /1000) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="下注详情" width="auto">
        <template slot-scope="scope">
          <el-table :data="scope.row.options" border :row-style="getHitStyle">
            <el-table-column label="区域ID">
              <template slot-scope="scope2">{{ scope2.row.id }}</template>
            </el-table-column>
            <el-table-column label="区域名称">
              <template slot-scope="scope2">{{ getOptionName(scope2.row.id) }}</template>
            </el-table-column>
            <el-table-column label="区域下注金额">
              <template slot-scope="scope2">{{ formatNumber(scope2.row.moneyBet /1000) }}</template>
            </el-table-column>
            <el-table-column label="命中">
              <template slot-scope="scope2">{{ scope2.row.isHit==0?'否':'是' }}</template>
            </el-table-column>
            <el-table-column label="区域输赢">
              <template slot-scope="scope2">{{ formatNumber(scope2.row.moneyWon /1000) }}</template>
            </el-table-column>
            <el-table-column label="倍率">
              <template slot-scope="scope2">{{ scope2.row.odds /1000 }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style>

</style>
<script>
import { $libDate } from '@/utils/common'

export default {
  name: 'WingoLotteryDetailLog',
  components: {},
  props: {
    GameLog: {
      type: Object,
      default: function() {
        return {}
      }
    },
    Gid: {
      type: Number,
      default: function() {
        return 0
      }
    },
    GameLogVisible: Boolean
  },
  data() {
    return {
      ComponentsGameLogVisible: false,
      NumberColors: {
        0: '紫',
        1: '绿',
        2: '红',
        3: '绿',
        4: '红',
        5: '紫',
        6: '红',
        7: '绿',
        8: '红',
        9: '绿'
      },
      BetOptions: [
        { Name: '下注绿', MaxMoneyBet: 2000, Id: 0, RobotBetRate: 1 },
        { Name: '下注紫', MaxMoneyBet: 2000, Id: 1, RobotBetRate: 1 },
        { Name: '下注红', MaxMoneyBet: 2000, Id: 2, RobotBetRate: 1 },
        { Name: '数字0', MaxMoneyBet: 2000, Id: 3, RobotBetRate: 1 },
        { Name: '数字1', MaxMoneyBet: 2000, Id: 4, RobotBetRate: 1 },
        { Name: '数字2', MaxMoneyBet: 2000, Id: 5, RobotBetRate: 1 },
        { Name: '数字3', MaxMoneyBet: 2000, Id: 6, RobotBetRate: 1 },
        { Name: '数字4', MaxMoneyBet: 2000, Id: 7, RobotBetRate: 1 },
        { Name: '数字5', MaxMoneyBet: 2000, Id: 8, RobotBetRate: 1 },
        { Name: '数字6', MaxMoneyBet: 2000, Id: 9, RobotBetRate: 1 },
        { Name: '数字7', MaxMoneyBet: 2000, Id: 10, RobotBetRate: 1 },
        { Name: '数字8', MaxMoneyBet: 2000, Id: 11, RobotBetRate: 1 },
        { Name: '数字9', MaxMoneyBet: 2000, Id: 12, RobotBetRate: 1 }
      ]
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.GameLog = val
      }
    },
    'Gid': {
      deep: true,
      handler: function(val) {
        this.Gid = val
      }
    },
    'GameLogVisible': {
      deep: true,
      handler: function(val) {
        console.log('GameLogVisible', val)
        this.ComponentsGameLogVisible = val
      }
    }
  },
  created() {
    this.ComponentsGameLogVisible = this.GameLogVisible
  },
  methods: {
    getHitStyle({ row }) {
      if (row.isHit) {
        return { color: 'red' }
      }
      return {}
    },
    getOptionName(optionId) {
      for (let i = 0; i < this.BetOptions.length; i++) {
        if (this.BetOptions[i].Id === optionId) {
          return this.BetOptions[i].Name
        }
      }
      return ''
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getMoneyWon() {
      let moneyWon = 0
      this.GameLog.Wingo.players.map((item) => {
        moneyWon += item.moneyWon
      })
      return moneyWon
    },
    closeView(done) {
      this.$emit('closeDialog')
      done()
    }
  }
}
</script>
