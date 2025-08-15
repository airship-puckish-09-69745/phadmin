<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="slotsData" label-width="200px">
          <el-form-item label="老虎机类型">
            <el-select v-model.number="slotsData.SlotsType" disabled style="width: 40%;">
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
              <el-option label="WildBuffalo" :value="94" />
              <el-option label="WildBuffaloMars" :value="95" />
              <el-option label="RomanArena" :value="96" />
              <el-option label="RomanArenaMars" :value="97" />
              <el-option label="SuperTongit" :value="98" />
              <el-option label="SuperTongitMars" :value="99" />
              <el-option label="MahjongFortune" :value="100" />
              <el-option label="SuperGemsIII" :value="150" />
              <el-option label="SuperGemsIIIMars" :value="151" />
              <el-option label="AladdinsLamp" :value="152" />
              <el-option label="AladdinsLampMars" :value="153" />
              <el-option label="GrandAce" :value="154" />
              <el-option label="GrandAceMars" :value="155" />
              <el-option label="GrandAce" :value="154" />
              <el-option label="GrandAceMars" :value="155" />
              <el-option label="SharkKingdom" :value="158" />
              <el-option label="SharkKingdomMars" :value="159" />
              <el-option label="GigaAce" :value="160" />
              <el-option label="GigaAceMars" :value="161" />
              <el-option label="MajorAce" :value="162" />
              <el-option label="MajorAceMars" :value="163" />
              <el-option label="FireLink" :value="166" />
              <el-option label="FireLinkMars" :value="167" />
              <el-option label="PharaohTreasure" :value="168" />
              <el-option label="PharaohTreasureMars" :value="169" />
              <el-option label="EpicAce" :value="170" />
              <el-option label="EpicAceMars" :value="171" />
              <el-option label="172:WrathOfZeus" :value="172" />
              <el-option label="173:WrathOfZeus Mars" :value="173" />
              <el-option label="TreasureBowl" :value="174" />
              <el-option label="TreasureBowlMars" :value="175" />
              <el-option label="PuppyHome" :value="176" />
              <el-option label="PuppyHomeMars" :value="177" />
              <el-option label="MayanTotem" :value="178" />
              <el-option label="202:FortunateEbisu" :value="202" />
              <el-option label="203:FortunateEbisu Mars" :value="203" />
              <el-option label="206:LuckyWineglass" :value="206" />
              <el-option label="207:LuckyWineglass Mars" :value="207" />
              <el-option label="212:PirateShip" :value="212" />
              <el-option label="213:PirateShip Mars" :value="213" />
              <el-option label="218:WrathOfZeus2" :value="218" />
              <el-option label="219:WrathOfZeus2 Mars" :value="219" />
              <el-option label="188:StreetFighting" :value="188" />
              <el-option label="189:StreetFighting Mars" :value="189" />
              <el-option label="192:BountyRaid" :value="192" />
              <el-option label="193:BountyRaid Mars" :value="193" />
              <el-option label="180:FishingMaster" :value="180" />
              <el-option label="181:FishingMaster Mars" :value="181" />
              <el-option label="GodOfFortune" :value="182" />
              <el-option label="Dance of the Lion" :value="184" />
              <el-option label="186:MahjongJackpot" :value="186" />
              <el-option label="ArcaneEgypt" :value="190" />
              <el-option label="194:GoldTrain" :value="194" />
              <el-option label="GoldMiner" :value="196" />
              <el-option label="GoldMinerMars" :value="197" />
              <el-option label="198:FortuneBlessing" :value="198" />
              <el-option label="199:FortuneBlessing Mars" :value="199" />
              <el-option label="200:AtlantisTreasure" :value="200" />
              <el-option label="201:AtlantisTreasureMars" :value="201" />
              <el-option label="204:SpaceTreasure" :value="204" />
              <el-option label="205:SpaceTreasureMars" :value="205" />
              <el-option label="208:CandyBurst" :value="208" />
              <el-option label="209:CandyBurstMars" :value="209" />
              <el-option label="210:LuckySpirits" :value="210" />
              <el-option label="211:LuckySpiritsMars" :value="211" />
              <el-option label="216:Phoenix" :value="216" />
              <el-option label="217:PhoenixMars" :value="217" />
              <el-option label="220:GoldenDragon" :value="220" />
              <el-option label="221:GoldenDragonMars" :value="221" />
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

          <span v-if="slotsData.SlotsType === 186" style="color: red; font-size: 11px;">注: ①.下注倍数要放大1000倍 ②.1000为固定值 ③.下注大小*下注倍数*基础投注/1000=真实下注额度 </span>
          <span v-if="slotsData.SlotsType === 180" style="color: red; font-size: 11px;">注: ①.1为固定值 ②.下注大小*下注倍数*基础投注=真实下注额度 ③.下注大小*下注倍数只支持3位小数 </span>
          <el-form-item label="下注倍数">
            <el-input v-model="slotsData.OddsStr" />
          </el-form-item>

          <el-form-item label="基础投注">
            <el-input v-model.number="slotsData.BaseBet" disabled />
          </el-form-item>

          <!--
          <ratio-input v-model="slotsData.MoneyConfig.WinMoneyTransferRate" label="赢钱转化比例(%)" />
          -->

          <el-form-item label="输最大倍率的概率%">
            <el-input v-model.number="slotsData.LoseMaxOddsRate" />
          </el-form-item>

          <el-form-item label="普通模式保底奖池抽水‰">
            <el-input v-model.number="slotsData.NormalFeeRate" />
          </el-form-item>

          <el-form-item label="购买免费模式保底奖池抽水‰">
            <el-input v-model.number="slotsData.BuyFreeFeeRate" />
          </el-form-item>

          <el-form-item v-if="slotsData.SlotsType === 186" label="购买重转模式保底奖池抽水‰">
            <el-input v-model.number="slotsData.BuyRespinFeeRate" />
          </el-form-item>

          <el-form-item label="推荐下注值">
            <el-input v-model="recommendBet" />
          </el-form-item>

          <el-form-item v-for="(item, index) in slotsData.WinTypeMinOdds" :key="'WinTypeMinOdds-' + index" :label="getBigWinLabel(index)">
            <el-input v-model.number="slotsData.WinTypeMinOdds[index]" />
          </el-form-item>

          <span style="color: red; font-size: 11px;">注: ①无限=-1 ②数字后面加上*表示推荐，例如10* </span>
          <el-form-item label="普通自动下注轮数">
            <el-input v-model="slotsData.AutoSpinNum[0]"> </el-input>
          </el-form-item>

          <span style="color: red; font-size: 11px;">注: ①无限=-1 ②数字后面加上*表示推荐，例如10* </span>
          <el-form-item label="比赛自动下注轮数">
            <el-input v-model="slotsData.AutoSpinNum[1]"> </el-input>
          </el-form-item>

          <el-form-item label="TopWins开始生效日期">
            <el-date-picker
              v-model="topWinsStartTime"
              @change="handleDateChange"
              placeholder="选择日期"
              type="date"
            />
          </el-form-item>

          <el-form-item label="TopWins最小倍数">
            <el-input v-model.number="topWinsLimit" />
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
      initialAutoSpinNum: [],
      topWinsLimit: this.slotsData.TopWinsLimit ? this.slotsData.TopWinsLimit / 1000 : 0,
      topWinsStartTime: this.slotsData.TopWinsStartTime ? new Date(this.slotsData.TopWinsStartTime * 1000) : new Date().getTime()
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
        'BetExtras': this.slotsData.BetExtras,
        'OddsStr': this.slotsData.OddsStr,
        'BaseBet': this.slotsData.BaseBet,
        'LoseMaxOddsRate': this.slotsData.LoseMaxOddsRate,
        'MoneyConfig': {
          'WinMoneyTransferRate': this.slotsData.MoneyConfig.WinMoneyTransferRate
        },
        'NormalFeeRate': this.slotsData.NormalFeeRate,
        'BuyFreeFeeRate': this.slotsData.BuyFreeFeeRate,
        'BuyRespinFeeRate': this.slotsData.BuyRespinFeeRate,
        'RecommendBet': this.slotsData.RecommendBet,
        'WinTypeMinOdds': winTypeMinOdds,
        'AutoSpinNum': autoSpinNum,
        'BetOddsList': this.slotsData.BetOddsList,
        'TopWinsLimit': this.slotsData.TopWinsLimit,
        'TopWinsStartTime': this.slotsData.TopWinsStartTime
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
      if (this.slotsData.SlotsType === 180 || this.slotsData.SlotsType === 186) {
        const bets = this.slotsData.Bets.split(',')
        for (const i in bets) {
          let betFlot = parseFloat(bets[i])
          let bet = betFlot * 1000
          if (bet < 10 && bet % 2 === 1) {
            $this.$message.error(`下注大小是三位小数时只支持偶数 err bet:${betFlot}`)
            return
          }
        }
      }
      this.slotsData.TopWinsStartTime = Math.floor(this.topWinsStartTime / 1000)
      this.slotsData.RecommendBet = this.recommendBet / this.slotsData.BaseBet * 1000
      this.slotsData.TopWinsLimit = this.topWinsLimit * 1000
      this.$refs.compare.SetNewVal(this.getDiffData(this.slotsData.WinTypeMinOdds, this.slotsData.Bets, this.slotsData.AutoSpinNum))
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交 ')
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
    },
    handleDateChange(date) {

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
