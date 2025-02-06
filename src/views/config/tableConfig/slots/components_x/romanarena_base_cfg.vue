<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="老虎机类型">
            <el-select v-model.number="slotsData.SlotsType" disabled>
              <el-option label="糖果传奇Way" :value="76" />
              <el-option label="糖果传奇Allline" :value="77" />
              <el-option label="SuperGems" :value="78" />
              <el-option label="SuperGemsMars" :value="81" />
              <el-option label="CandyCrazeMars" :value="79" />
              <el-option label="CandyCraze" :value="80" />
              <el-option label="Millionaire" :value="82" />
              <el-option label="MillionaireMars" :value="83" />
              <el-option label="FortuneAce" :value="84" />
              <el-option label="FortuneAceMars" :value="85" />
              <el-option label="SuperGemsII" :value="86" />
              <el-option label="SuperGemsIIMars" :value="87" />
              <el-option label="Lucky777" :value="88" />
              <el-option label="Lucky777Mars" :value="89" />
              <el-option label="UltraAce" :value="92" />
              <el-option label="UltraAceMars" :value="93" />
            </el-select>
          </el-form-item>

          <el-form-item label="行">
            <el-input v-model.number="slotsData.Rows" disabled />
          </el-form-item>

          <el-form-item label="列">
            <el-input v-model.number="slotsData.Clos" disabled />
          </el-form-item>

          <el-form-item label="最低版本">
            <el-input v-model.number="slotsData.MinVersion" />
          </el-form-item>

          <el-form-item label="下注大小">
            <el-input v-model="slotsData.Bets" />
          </el-form-item>

          <el-form-item v-if="oddsStr" label="下注倍数">
            <el-input v-model="slotsData.OddsStr" />
          </el-form-item>


          <el-form-item label="基础投注">
            <el-input v-model.number="slotsData.BaseBet" disabled />
          </el-form-item>

          <ratio-input v-model="slotsData.MoneyConfig.WinMoneyTransferRate" label="赢钱转化比例(%)" />

          <el-form-item label="输最大倍率的概率%">
            <el-input v-model.number="slotsData.LoseMaxOddsRate" />
          </el-form-item>

          <el-form-item label="普通模式保底奖池抽水‰">
            <el-input v-model.number="slotsData.NormalFeeRate" />
          </el-form-item>

          <el-form-item label="购买免费模式保底奖池抽水‰">
            <el-input v-model.number="slotsData.BuyFreeFeeRate" />
          </el-form-item>

          <el-form-item label="推荐下注值">
            <el-input v-model="recommendBet" />
          </el-form-item>

          <el-form-item v-for="(item, index) in slotsData.WinTypeMinOdds" :key="'WinTypeMinOdds-' + index" :label="getBigWinLabel(index)">
            <el-input v-model.number="slotsData.WinTypeMinOdds[index]" />
          </el-form-item>

          <el-form-item label="普通自动下注轮数">
            <el-input v-model="slotsData.AutoSpinNum[0]"> <template slot="append">无限=-1</template> </el-input>
          </el-form-item>

          <el-form-item label="比赛自动下注轮数">
            <el-input v-model="slotsData.AutoSpinNum[1]"> <template slot="append">无限=-1</template> </el-input>
          </el-form-item>

          <el-form-item label="是否启用新版剧本">
            <el-select v-model="slotsData.EnableScriptV3" disabled>
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="submitFrm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import RatioInput from '@/components/RatioInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsBaseCfg',
  components: { Compare, RatioInput },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    oddsStr: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var data = {
      lock: false,
      recommendBet: this.slotsData.RecommendBet ? this.slotsData.RecommendBet * this.slotsData.BaseBet / 1000 : 0,
      initialWinTypeMinOdds: [],
      initialBets: this.slotsData.Bets,
      initialAutoSpinNum: []
    }
    for (const k in this.slotsData.WinTypeMinOdds) {
      data.initialWinTypeMinOdds.push(this.slotsData.WinTypeMinOdds[k])
    }
    if (!this.slotsData.WinTypeMinOdds || this.slotsData.WinTypeMinOdds.length === 0) {
      this.$set(this.slotsData, 'WinTypeMinOdds', [6, 12, 24])
    }
    if (!this.slotsData.AutoSpinNum || this.slotsData.AutoSpinNum.length === 0) {
      this.$set(this.slotsData, 'AutoSpinNum', ['', ''])
    }
    for (const k in this.slotsData.AutoSpinNum) {
      data.initialAutoSpinNum.push(this.slotsData.AutoSpinNum[k])
    }
    return data
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData(this.initialWinTypeMinOdds, this.initialBets, this.initialAutoSpinNum))
      this.lock = true
      console.log('origin data', this.getDiffData(this.initialWinTypeMinOdds, this.initialBets, this.initialAutoSpinNum))
    }
  },
  methods: {
    getDiffData(winTypeMinOdds, bets, autoSpinNum) {
      return {
        'SlotsType': this.slotsData.SlotsType,
        'Rows': this.slotsData.Rows,
        'Clos': this.slotsData.Clos,
        'MinVersion': this.slotsData.MinVersion,
        'Bets': bets,
        'OddsStr': this.slotsData.OddsStr,
        'BaseBet': this.slotsData.BaseBet,
        'LoseMaxOddsRate': this.slotsData.LoseMaxOddsRate,
        'MoneyConfig': {
          'WinMoneyTransferRate': this.slotsData.MoneyConfig.WinMoneyTransferRate
        },
        'NormalFeeRate': this.slotsData.NormalFeeRate,
        'BuyFreeFeeRate': this.slotsData.BuyFreeFeeRate,
        'RecommendBet': this.slotsData.RecommendBet,
        'WinTypeMinOdds': winTypeMinOdds,
        'AutoSpinNum': autoSpinNum
      }
    },
    submitFrm() {
      const $this = this
      if (this.recommendBetCheck() === false) {
        $this.$message.error('推荐下注值必须是下注大小中存在的值')
        return
      }
      if (this.winTypeMinOddsCheck() === false) {
        return
      }
      this.slotsData.RecommendBet = this.recommendBet / this.slotsData.BaseBet * 1000
      this.$refs.compare.SetNewVal(this.getDiffData(this.slotsData.WinTypeMinOdds, this.slotsData.Bets, this.slotsData.AutoSpinNum))
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
      this.initialWinTypeMinOdds = []
      for (const k in this.slotsData.WinTypeMinOdds) {
        this.initialWinTypeMinOdds.push(parseInt(this.slotsData.WinTypeMinOdds[k]))
      }
      this.initialBets = this.slotsData.Bets
      this.initialAutoSpinNum = []
      for (const k in this.slotsData.AutoSpinNum) {
        this.initialAutoSpinNum.push(this.slotsData.AutoSpinNum[k])
      }
    },
    recommendBetCheck() {
      if (this.recommendBet === 0) {
        return true
      }
      var betlist = this.slotsData.Bets.split(',')
      for (const i in betlist) {
        if (String(this.recommendBet / this.slotsData.BaseBet) === betlist[i]) {
          return true
        }
      }
      return false
    },
    winTypeMinOddsCheck() {
      let lastWinTypeMinOdds = 0
      for (const i in this.slotsData.WinTypeMinOdds) {
        if (this.slotsData.WinTypeMinOdds[i] === 0) {
          this.$message.error(this.getBigWinLabel(i) + '不能为0')
          return false
        } else if (this.slotsData.WinTypeMinOdds[i] === '') {
          this.$message.error(this.getBigWinLabel(i) + '不能为空')
          return false
        } else if (lastWinTypeMinOdds >= this.slotsData.WinTypeMinOdds[i]) {
          this.$message.error(this.getBigWinLabel(i) + ' 必须大于 ' + this.getBigWinLabel(i - 1))
          return false
        }
        lastWinTypeMinOdds = this.slotsData.WinTypeMinOdds[i]
      }
      return true
    },
    getBigWinLabel(index) {
      // 根据索引返回对应的标签文本
      const labels = ['BigWin最小触发倍数', 'MegaWin最小触发倍数', 'SuperWin最小触发倍数']
      return labels[index] || '未知' // 默认返回 "未知" 以防止超出索引范围
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
