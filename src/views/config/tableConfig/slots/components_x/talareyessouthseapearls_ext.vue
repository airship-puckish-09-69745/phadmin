<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="baseFrm" :model="cfg" label-width="230px">
          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>
          <el-form-item label="加倍投注最大Bet" prop="ExtraBetMax" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.ExtraBetMax" :required="true" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22" :offset="1">
        <el-tabs v-if="cfgReady" v-model="betConfigTab" type="border-card">
          <el-tab-pane label="普通下注配置" name="normal">
            <tala-reyes-south-sea-pearls-bet-config
              ref="normalBetConfig"
              :config="cfg.NormalConfig"
              :buy-free-odds="cfg.BuyFreeOdds"
              :base-bet="baseBet"
            />
          </el-tab-pane>
          <el-tab-pane label="加倍投注配置" name="extra">
            <tala-reyes-south-sea-pearls-bet-config
              ref="extraBetConfig"
              :config="cfg.ExtraBetConfig"
              :buy-free-odds="cfg.BuyFreeOdds"
              :base-bet="baseBet"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import TalaReyesSouthSeaPearlsBetConfig from './talareyessouthseapearls_bet_config'

const BET_CONFIG_KEYS = [
  'MultiplierOdds',
  'MultiplierColor',
  'BuyFreeOddsConf',
  'ScatterOdds',
  'ModeWeight',
  'FreeModeWeight',
  'WheelConfig',
  'JackpotTypeWeight',
  'JackpotOdds',
  'JackpotCountWeight',
  'NormalMultiplierRows',
  'RespinsMultiplierRows',
  'FreeMultiplierRows',
  'FreeRespinsMultiplierRows'
]

export default {
  name: 'SlotsTalaReyesSouthSeaPearlsExt',
  components: { Compare, TalaReyesSouthSeaPearlsBetConfig },
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
    baseBet: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cfg: {
        BuyFreeOdds: 100,
        ExtraBetMax: 0,
        NormalConfig: {},
        ExtraBetConfig: {}
      },
      cfgReady: false,
      betConfigTab: 'normal'
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.cfg))
    },
    getStoreData() {
      const data = this.getDiffData()
      this.scaleExtendCfgOdds(data, 100)
      this.scaleExtraBetMax(data, 1000)
      return data
    },
    submitFrm() {
      if (!ValidateVueItem(this.$refs['baseFrm'])) return false
      if (this.$refs.normalBetConfig && !this.$refs.normalBetConfig.validate()) return false
      if (this.$refs.extraBetConfig && !this.$refs.extraBetConfig.validate()) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getStoreData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        const storeData = $this.getStoreData()
        Object.keys($this.slotsData).forEach(key => {
          $this.$delete($this.slotsData, key)
        })
        Object.keys(storeData).forEach(key => {
          $this.$set($this.slotsData, key, storeData[key])
        })
        $this.$emit('saveData')
        $this.initData()
      })
    },
    initDefaultCfg(betCfg) {
      const multiplierOdds = '100,200,300,500,1000,1500,2000,2500,5000,10000,20000,50000'
      const multiplierWeight = this.buildWeightStr(multiplierOdds)
      const defaults = {
        MultiplierOdds: multiplierOdds,
        MultiplierColor: '2,2,2,2,3,3,5,5,4,4,5,5',
        ScatterOdds: 0,
        ModeWeight: '100,100,100,100,100,100',
        FreeModeWeight: '100,100,100,100,100,100',
        JackpotTypeWeight: '100,100,100,100',
        JackpotOdds: '10000,5000,3000,1000',
        JackpotCountWeight: '100,100,100,100,100,100,100,100,100'
      }
      Object.keys(defaults).forEach(key => {
        if (betCfg[key] === undefined || betCfg[key] === null || betCfg[key] === '') {
          this.$set(betCfg, key, defaults[key])
        }
      })
      if (!betCfg.WheelConfig) {
        this.$set(betCfg, 'WheelConfig', {})
      }
      const wheelDefaults = {
        InnerOdds: '100,300,500,800,1000,1500,2000,3000,5000,10000,20000,100000',
        InnerWeight: '100,100,100,100,100,100,100,100,100,100,100,100',
        OuterOdds: '100,200,300,500,1000',
        OuterWeight: '100,100,100,100,100'
      }
      Object.keys(wheelDefaults).forEach(key => {
        if (betCfg.WheelConfig[key] === undefined || betCfg.WheelConfig[key] === null || betCfg.WheelConfig[key] === '') {
          this.$set(betCfg.WheelConfig, key, wheelDefaults[key])
        }
      })
      if (!betCfg.BuyFreeOddsConf) {
        this.$set(betCfg, 'BuyFreeOddsConf', [])
      }
      this.initMultiplierRows(betCfg, 'NormalMultiplierRows', multiplierWeight, false)
      this.initMultiplierRows(betCfg, 'RespinsMultiplierRows', multiplierWeight, true)
      this.initMultiplierRows(betCfg, 'FreeMultiplierRows', multiplierWeight, false)
      this.initMultiplierRows(betCfg, 'FreeRespinsMultiplierRows', multiplierWeight, true)
    },
    initMultiplierRows(betCfg, key, multiplierWeight, needPink) {
      if (!betCfg[key] || betCfg[key].length === 0) {
        const rows = []
        for (let i = 0; i < 3; i++) {
          rows.push({
            IconWeight: '100,100,100',
            MultiplierWeight: multiplierWeight,
            PinkRate: 0
          })
        }
        this.$set(betCfg, key, rows)
      }
      betCfg[key].forEach(row => {
        if (!needPink) {
          row.PinkRate = 0
        }
      })
    },
    buildWeightStr(value) {
      return value.split(',').map(() => '100').join(',')
    },
    cloneData(value) {
      return JSON.parse(JSON.stringify(value || {}))
    },
    extractOldBetConfig(data) {
      const betCfg = {}
      BET_CONFIG_KEYS.forEach(key => {
        if (data[key] !== undefined) {
          betCfg[key] = this.cloneData(data[key])
        }
      })
      return betCfg
    },
    migrateExtendConfig(data) {
      const source = this.cloneData(data)
      const hasNewConfig = source.NormalConfig || source.ExtraBetConfig
      const normalCfg = hasNewConfig ? this.cloneData(source.NormalConfig) : this.extractOldBetConfig(source)
      this.initDefaultCfg(normalCfg)

      let extraCfg = hasNewConfig ? this.cloneData(source.ExtraBetConfig) : {}
      if (!extraCfg || Object.keys(extraCfg).length === 0) {
        extraCfg = this.buildExtraBetConfig(normalCfg)
      } else {
        this.initDefaultCfg(extraCfg)
      }

      return {
        BuyFreeOdds: source.BuyFreeOdds || 100,
        ExtraBetMax: source.ExtraBetMax || 0,
        NormalConfig: normalCfg,
        ExtraBetConfig: extraCfg
      }
    },
    buildExtraBetConfig(normalCfg) {
      const extraCfg = this.cloneData(normalCfg)
      extraCfg.MultiplierOdds = this.scaleOddsStr(extraCfg.MultiplierOdds, 8)
      if (extraCfg.WheelConfig) {
        extraCfg.WheelConfig.OuterOdds = this.scaleOddsStr(extraCfg.WheelConfig.OuterOdds, 8)
      }
      return extraCfg
    },
    scaleOddsStr(value, rate) {
      if (value === undefined || value === null || value === '') {
        return value
      }
      return value.toString().split(',').map(item => {
        const text = item.trim()
        const val = parseFloat(text)
        if (isNaN(val)) {
          return text
        }
        return parseFloat((val * rate).toFixed(6)).toString()
      }).join(',')
    },
    scaleBetCfgOdds(betCfg, rate) {
      if (!betCfg) {
        return
      }
      betCfg.MultiplierOdds = this.scaleOddsStr(betCfg.MultiplierOdds, rate)
      betCfg.JackpotOdds = this.scaleOddsStr(betCfg.JackpotOdds, rate)
      if (betCfg.WheelConfig) {
        betCfg.WheelConfig.InnerOdds = this.scaleOddsStr(betCfg.WheelConfig.InnerOdds, rate)
        betCfg.WheelConfig.OuterOdds = this.scaleOddsStr(betCfg.WheelConfig.OuterOdds, rate)
      }
    },
    scaleExtendCfgOdds(extendCfg, rate) {
      this.scaleBetCfgOdds(extendCfg.NormalConfig, rate)
      this.scaleBetCfgOdds(extendCfg.ExtraBetConfig, rate)
    },
    scaleExtraBetMax(extendCfg, rate) {
      const val = parseFloat(extendCfg.ExtraBetMax)
      if (isNaN(val)) {
        return
      }
      extendCfg.ExtraBetMax = parseFloat((val * rate).toFixed(6))
    },
    initData() {
      const migratedCfg = this.migrateExtendConfig(this.slotsData)
      this.scaleExtendCfgOdds(migratedCfg, 0.01)
      this.scaleExtraBetMax(migratedCfg, 0.001)
      this.cfg = migratedCfg
      this.cfgReady = true
      this.$refs.compare.SetOldVal(this.getStoreData())
      this.lock = true
    }
  }
}
</script>
