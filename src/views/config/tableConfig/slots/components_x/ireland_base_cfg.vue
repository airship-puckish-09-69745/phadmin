<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="slotsData" label-width="200px">
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
              <el-option label="EpicAce" :value="170" />
              <el-option label="EpicAceMars" :value="171" />
              <el-option label="TreasureBowl" :value="174" />
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
    return {
      lock: false
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
      console.log('origin data', this.getDiffData())
    }
  },
  methods: {
    getDiffData() {
      return {
        'SlotsType': this.slotsData.SlotsType,
        'Rows': this.slotsData.Rows,
        'Clos': this.slotsData.Clos,
        'MinVersion': this.slotsData.MinVersion,
        'Bets': this.slotsData.Bets,
        'OddsStr': this.slotsData.OddsStr,
        'BaseBet': this.slotsData.BaseBet,
        'LoseMaxOddsRate': this.slotsData.LoseMaxOddsRate,
        'MoneyConfig': {
          'WinMoneyTransferRate': this.slotsData.MoneyConfig.WinMoneyTransferRate
        },
        'NormalFeeRate': this.slotsData.NormalFeeRate,
        'BuyFreeFeeRate': this.slotsData.BuyFreeFeeRate
      }
    },
    submitFrm() {
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
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
