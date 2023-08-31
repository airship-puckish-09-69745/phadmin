<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">

          <el-form-item label="倍率最小值">
            <el-col :span="8"><el-input v-model.number="cfg.MinerExtConfig.OddsMin" /></el-col>(统一乘10)
          </el-form-item>

          <el-form-item label="倍率最大值">
            <el-col :span="8"><el-input v-model.number="cfg.MinerExtConfig.OddsMax" /></el-col>(统一乘10)
          </el-form-item>

          <el-form-item label="摇奖次数">
            <el-col :span="8"><el-input v-model.number="cfg.MinerExtConfig.FreeSpinTimes" /></el-col>
          </el-form-item>

          <ratio-input v-model="cfg.MinerExtConfig.BlackGoldRatio" label="黑金概率(%)" />
          <ratio-input v-model="cfg.MinerExtConfig.DoubleRatio" label="X2概率(%)" tips="倍率超过50时不再出现" />
          <ratio-input v-model="cfg.MinerExtConfig.EmptyRatio" label="空概率(%)" />

        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsGoldMinerExt',
  components: { RatioInput, Compare },
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
      cfg: {
        'ScatterConfig': {
        },
        'MinerExtConfig': {
          'OddsMin': 1,
          'OddsMax': 20,
          'FreeSpinTimes': 3,
          'BlackGoldRatio': 0,
          'DoubleRatio': 0,
          'EmptyRatio': 0
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if (this.cfg.MinerExtConfig.BlackGoldRatio + this.cfg.MinerExtConfig.DoubleRatio + this.cfg.MinerExtConfig.EmptyRatio != 10000) {
        this.$message.error('概率相加不等于100')
        return
      }
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
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.cfg = this.slotsData
        if (!this.slotsData.hasOwnProperty('MinerExtConfig')) {
          this.cfg.MinerExtConfig = {
            'OddsMin': 1,
            'OddsMax': 20,
            'FreeSpinTimes': 3,
            'BlackGoldRatio': 0,
            'DoubleRatio': 0,
            'EmptyRatio': 0
          }
        }
        this.lock = true
      }
    }
  }
}
</script>
