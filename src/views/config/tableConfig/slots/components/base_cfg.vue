<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="slotsData" label-width="120px">
          <el-form-item label="老虎机类型">
            <el-select v-model.number="slotsData.SlotsType" disabled>
              <el-option label="凤凰老虎机" :value="51">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="行">
            <el-input v-model.number="slotsData.Rows" disabled></el-input>
          </el-form-item>

          <el-form-item label="列">
            <el-input v-model.number="slotsData.Clos" disabled></el-input>
          </el-form-item>

          <el-form-item label="最低版本">
            <el-input v-model.number="slotsData.MinVersion"></el-input>
          </el-form-item>

          <el-form-item label="下注列表">
            <el-input v-model="slotsData.Bets"></el-input>
          </el-form-item>

          <el-form-item label="最低版本">
            <el-input v-model.number="slotsData.MinVersion"></el-input>
          </el-form-item>

          <ratio-input v-model="slotsData.MoneyConfig.WinMoneyTransferRate" label="赢钱转化比例(%)"></ratio-input>

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
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
      console.log('origin data', this.getDiffData())
    }
  },
  data() {
    return {
      lock: false
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
