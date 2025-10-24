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
          超级骰子：
        </template>
        {{ showSuperDice() }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          JACKPOT骰子：
        </template>
        {{ showDice(JackpotDices) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          JACKPOT奖励：
        </template>
        {{ showMoney(JackpotAward) }}
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
      <el-table-column
        prop="totalOdd"
        label="最终赔率"
        width="200"
      />
    </el-table>
  </el-dialog>
</template>

<script>
import { $libShow } from '@/utils/common'
import jackpotAward from '@/views/playerManage/jackpotAward.vue';
export default {
  name: 'MiniSuperColorDetailLog',
  // computed: {
  //   jackpotAward() {
  //     return jackpotAward
  //   }
  // },
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
        { Id: 1, Name: 'Yellow' },
        { Id: 2, Name: 'White' },
        { Id: 3, Name: 'Purple' },
        { Id: 4, Name: 'Blue' },
        { Id: 5, Name: 'Green' },
        { Id: 6, Name: 'Red' },
        { Id: 7, Name: 'YellowWhite' },
        { Id: 8, Name: 'WhitePurple' },
        { Id: 9, Name: 'PurpleGreen' },
        { Id: 10, Name: 'GreenRed' },
        { Id: 11, Name: 'RedBlue' },
        { Id: 12, Name: 'BlueYellow' },
        { Id: 13, Name: 'RedWhite' }
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
      } else if (row.moneyBet > 0) {
        return { color: 'blue' }
      }
      return {}
    },
    showMoney(money) {
      return (money / 1000).toFixed(3)
    },
    showBetOdd(odd) {
      return (odd / 1000).toFixed(1)
    },
    showBetAreaName(id) {
      const option = this.ColorOption.find(item => item.Id === id)
      return option ? option.Name : '-'
    },
    showDice(dices) {
      const dicesTmp = []
      for (let i = 0; i < dices.length; i++) {
        const dice = dices[i]
        const option = this.ColorOption.find(item => item.Id === dice)
        dicesTmp.push(option.Name)
      }
      return dicesTmp.join('，')
    },
    showSuperDice() {
      if (this.SuperIndex === -1) {
        return '-'
      }
      const dice = this.Dices[this.SuperIndex]
      const option = this.ColorOption.find(item => item.Id === dice)
      const superOdd = (this.SuperOdd / 1000).toFixed(2)
      return option.Name + '(' + superOdd + '倍)'
    },
    initData(val) {
      const gameLog = val
      const superColorGameLog = gameLog.SuperColor
      this.Dices = superColorGameLog.dices
      this.SuperIndex = superColorGameLog.superDiceIndex
      this.SuperOdd = superColorGameLog.superOdd
      this.JackpotDices = superColorGameLog.jackpotDices
      this.Player = {}
      this.Money = 0
      this.getPlayer(superColorGameLog)
      // this.SuperColorBetArea = this.Player.betAreas
      this.getSuperColorBetOption(superColorGameLog.areas, this.Player.betAreas)
    },
    getPlayer(superColorGameLog) {
      for (const playersKey in superColorGameLog.players) {
        if (this.Uid === superColorGameLog.players[playersKey].uid) {
          this.Player = superColorGameLog.players[playersKey]
          this.Money = this.Player.moneyEnd
          this.JackpotAward = this.Player.jackpotAward
          return
        }
      }
      this.$message.error('未找到玩家信息')
    },
    getSuperColorBetOption(betAreaCfg, betArea) {
      this.SuperColorBetArea = []
      for (const betAreaCfgKey in betAreaCfg) {
        const tmp = {
          id: betAreaCfg[betAreaCfgKey].id,
          isHit: betAreaCfg[betAreaCfgKey].isHit,
          moneyBet: 0,
          moneyWon: 0,
          odd: betAreaCfg[betAreaCfgKey].odd,
          superOdd: betAreaCfg[betAreaCfgKey].superOdd || 0,
          totalOdd: ''
        }
        if (betAreaCfg[betAreaCfgKey].superOdd > 0 && betAreaCfg[betAreaCfgKey].odd > 0) {
          const tmpOdd = ((tmp.odd - 1000) * tmp.superOdd) / 1000 + 1000
          tmp.totalOdd = (tmpOdd / 1000).toFixed(2)
        } else if (betAreaCfg[betAreaCfgKey].odd > 0) {
          tmp.totalOdd = (tmp.odd / 1000).toFixed(2)
        } else {
          tmp.totalOdd = 0
        }
        for (const betAreaKey in betArea) {
          if (betArea[betAreaKey].id === betAreaCfg[betAreaCfgKey].id) {
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
