<template>
  <el-dialog
    title="MiniSuperColorGame详情"
    :visible.sync="ComponentsGameLogVisible"
    :before-close="closeView"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="1200px"
  >

    <el-descriptions class="margin-top" title="" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          UID：
        </template>
        {{ Uid }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          资产：
        </template>
        {{ showMoney(Money) }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions class="margin-top" title="" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          骰子结果：
        </template>
        {{ showDice(Dices) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          JACKPOT骰子：
        </template>
        {{ showDice(JackpotDices) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          超级骰子：
        </template>
        {{ showSuperDice() }}
      </el-descriptions-item>
    </el-descriptions>

    <el-table
      ref="filterTable"
      :data="SuperColorBetArea"
      border
      :header-cell-style="{'text-align':'center'}"
      :cell-style="getHitStyle"
      style="width: 100%"
    >
      <el-table-column
        label="下注项"
        width="200"
      >
        <template slot-scope="scope">
          {{ showBetAreaName(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Hit"
        label="命中"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.isHit===1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Result"
        label="下注"
        width="200"
      >
        <template slot-scope="scope">
          {{ showMoney(scope.row.moneyBet) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Result"
        label="输赢"
        width="200"
      >
        <template slot-scope="scope">
          {{ showMoney(scope.row.moneyWon) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Result"
        label="赔率"
        width="200"
      >
        <template slot-scope="scope">
          {{ showBetOdd(scope.row.odd) }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { $libShow } from '@/utils/common'
export default {
  name: 'MiniSuperColorDetailLog',
  components: {},
  libShow: $libShow,
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
    Uid: {
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
      ColorOption: [
        { Id: 0, Name: 'Yellow' },
        { Id: 1, Name: 'White' },
        { Id: 2, Name: 'Purple' },
        { Id: 3, Name: 'Blue' },
        { Id: 4, Name: 'Green' },
        { Id: 5, Name: 'Red' },
        { Id: 6, Name: 'YellowWhite' },
        { Id: 7, Name: 'WhitePurple' },
        { Id: 8, Name: 'PurpleGreen' },
        { Id: 9, Name: 'GreenRed' },
        { Id: 10, Name: 'RedBlue' },
        { Id: 11, Name: 'BlueYellow' },
        { Id: 12, Name: 'RedWhite' }
      ],
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '阳光普照奖'
      },
      SuperColorBetArea: [],
      Dices: [],
      SuperIndex: -1,
      SuperOdd: 0,
      JackpotDices: [],
      JackpotAward: 0,
      Player: {},
      Money: 0
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.GameLog = val
        this.initData(val)
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
    this.initData(this.GameLog)
  },
  methods: {
    getHitStyle({ row }) {
      if (row.isHit && row.moneyBet > 0) {
        return { color: 'red' }
      } else if (row.moneyBet > 0){
        return { color: 'blue' }
      }
      return {}
    },
    showMoney(money) {
      return (money/1000).toFixed(3)
    },
    showBetOdd(odd) {
      return (odd/1000).toFixed(0)
    },
    showBetAreaName(id) {
      return this.ColorOption[id].Name
    },
    showDice(dices){
      const dicesTmp = []
      for (let i = 0; i < dices.length; i++) {
        const dice = dices[i]
        dicesTmp.push(this.ColorOption[dice].Name)
      }
      return dicesTmp.join('，')
    },
    showSuperDice(){
      if (this.SuperIndex === -1) {
        return '-'
      }
      const dice = this.Dices[this.SuperIndex]
      return this.ColorOption[dice].Name + '(' + this.SuperOdd + '倍)'
    },
    initData(val) {
      const gameLog = val
      const superColorGameLog = gameLog.SuperColor
      this.Dices = superColorGameLog.dices
      this.SuperIndex = superColorGameLog.superDiceIndex
      this.SuperOdd = superColorGameLog.superOdd
      this.JackpotDices = superColorGameLog.jackpotDices
      this.Player = superColorGameLog.players[0]
      this.Money = this.Player.moneyEnd
      // this.SuperColorBetArea = this.Player.betAreas
      this.getSuperColorBetOption(superColorGameLog.areas, this.Player.betAreas)
    },
    getSuperColorBetOption(betAreaCfg,betArea){
      this.SuperColorBetArea = []
      for (const betAreaCfgKey in betAreaCfg) {
        const tmp = {
          id: betAreaCfg[betAreaCfgKey].id,
          isHit: betAreaCfg[betAreaCfgKey].isHit,
          moneyBet: 0,
          moneyWon: 0,
          odd: betAreaCfg[betAreaCfgKey].odd,
          superOdd :betAreaCfg[betAreaCfgKey].superOdd || 0,
          totalOdd :0,
        }
        if (betAreaCfg[betAreaCfgKey].superOdd > 0){
          tmp.totalOdd = (tmp.odd-1000) * tmp.superOdd + 1000
        }
        for (const betAreaKey in betArea) {
          if (betArea[betAreaKey].id === betAreaCfg[betAreaCfgKey].id){
            tmp.moneyBet = betArea[betAreaKey].moneyBet
            tmp.moneyWon = betArea[betAreaKey].moneyWon
          }
        }
        this.SuperColorBetArea.push(tmp)
      }
    },
    closeView(done) {
      this.$emit('closeDialog')
      done()
    }
  }
}
</script>

<style scoped>

</style>
