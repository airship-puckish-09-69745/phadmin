<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="slotsData" label-width="150px">
          <el-form-item label="老虎机类型">
            <el-select v-model.number="slotsData.SlotsType" disabled>
              <el-option label="凤凰老虎机" :value="51" />
              <el-option label="睡美人老虎机" :value="52" />
              <el-option label="小丑老虎机" :value="53" />
              <el-option label="黄金列车老虎机" :value="54" />
              <el-option label="澳洲老虎机" :value="55" />
              <el-option label="象鼻神老虎机" :value="56" />
              <el-option label="黄金矿工老虎机" :value="57" />
              <el-option label="阿拉丁老虎机" :value="58" />
              <el-option label="芝加哥黑手党老虎机" :value="59" />
              <el-option label="粮果派对老虎机" :value="60" />
              <el-option label="FireKick老虎机" :value="61" />
              <el-option label="侏罗纪老虎机" :value="62" />
              <el-option label="夺宝奇兵老虎机" :value="63" />
              <el-option label="植物大战僵尸老虎机" :value="64" />
              <el-option label="爱尔兰精灵" :value="66" />
              <el-option label="金钱兔" :value="67" />
              <el-option label="十倍金牛" :value="68" />
              <el-option label="糖果派对Way" :value="76" />
              <el-option label="糖果派对Allline" :value="77" />
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

          <el-form-item label="下注倍数">
            <el-input v-model="slotsData.OddsStr" />
          </el-form-item>

          <el-form-item label="基础投注">
            <el-input v-model.number="slotsData.BaseBet" />
          </el-form-item>

          <ratio-input v-model="slotsData.MoneyConfig.WinMoneyTransferRate" label="赢钱转化比例(%)" />

          <el-form-item label="输最大倍率的概率%">
            <el-input v-model.number="slotsData.LoseMaxOddsRate" />
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
        }
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
