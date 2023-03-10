<template>
  <el-table
    :data="AmountTable"
    style="width: 100%"
  >
    <el-table-column
      prop="Amount"
      label="等级"
    >
      <template slot-scope="scope">
        <small-game-level v-model="scope.row.Amount" />
      </template>
    </el-table-column>
    <el-table-column
      prop="BetStr"
      label="下注金额列表"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.BetStr" placeholder="多个下注金额用英文逗号隔开" @change="change" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import SmallGameLevel from '@/components/SmallGameLevel'

export default {
  name: 'BetAmount',
  components: { SmallGameLevel },
  model: {
    prop: 'betAmount',
    event: 'cc'
  },
  props: {
    betAmount: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      options: [
        { label: '初级', value: 100000, desc: '>100' },
        { label: '中级', value: 1000000, desc: '>1000' },
        { label: '高级', value: 10000000, desc: '>10000' }
      ]
    }
  },
  computed: {
    AmountTable: {
      get: function() {
        if (!this.betAmount || this.betAmount.length === 0) {
          console.log('init data', this.initData())
          return this.initData()
        }
        const table = []
        for (const i in this.betAmount) {
          table.push({
            Amount: parseInt(this.betAmount[i].Amount),
            Bet: this.betAmount[i].Bet,
            BetStr: this.betAmount[i].Bet && this.betAmount[i].Bet.length > 0 ? this.betAmount[i].Bet.join(',') : ''
          })
        }
        return table
      }
    }
  },
  methods: {
    initData() {
      return [
        { Amount: 100000, Bet: [] },
        { Amount: 1000000, Bet: [] },
        { Amount: 10000000, Bet: [] }
      ]
    },
    change() {
      const arr = []
      for (const i in this.AmountTable) {
        const bet = []
        if (this.AmountTable[i].BetStr && this.AmountTable[i].BetStr.length > 0) {
          const tmp = this.AmountTable[i].BetStr.split(',')
          for (const j in tmp) {
            bet.push(parseInt(tmp[j]))
          }
        }
        arr.push({
          Amount: parseInt(this.AmountTable[i].Amount),
          Bet: bet
        })
      }
      this.betAmount = arr
      console.log('bet amount cfg ', this.betAmount)
      this.$emit('cc', this.betAmount)
    }
  }
}
</script>
