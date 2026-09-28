<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="baseFrm" :model="cfg" label-width="230px">
          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>
          <el-form-item label="NUDGE数量配置" prop="NudgeCountConfig" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="cfg.NudgeCountConfig" :required="true" placeholder="请输入内容,如1,2,3">
              <template slot="append">用,连接，长度需和NUDGE数量权重一致</template>
            </el-input>
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
            <sarimanok-fortune-bet-config
              ref="normalBetConfig"
              :config="cfg.NormalConfig"
              :buy-free-odds="cfg.BuyFreeOdds"
              :base-bet="baseBet"
              :nudge-count-config="cfg.NudgeCountConfig"
            />
          </el-tab-pane>
          <el-tab-pane label="加倍投注配置" name="extra">
            <sarimanok-fortune-bet-config
              ref="extraBetConfig"
              :config="cfg.ExtraBetConfig"
              :buy-free-odds="cfg.BuyFreeOdds"
              :base-bet="baseBet"
              :nudge-count-config="cfg.NudgeCountConfig"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>

    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import SarimanokFortuneBetConfig from './sarimanokfortune_bet_config'
import store from '@/store'

const DEFAULT_MULTIPLIER_ODDS = '100,200,300,500,1000,1500,2000,2500,5000,10000,20000,50000'
const DEFAULT_MULTIPLIER_COLOR = '2,2,2,2,3,3,5,5,4,4,5,5'
const DEFAULT_NUDGE_COUNT_CONFIG = '1,2,3'
const DEFAULT_BUY_FREE_ODDS = 100

function splitLen(value) {
  if (value === undefined || value === null || value === '') {
    return 0
  }
  return value.toString().split(',').filter(item => item.trim() !== '').length
}

function buildWeightStr(value) {
  const len = splitLen(value)
  if (len <= 0) {
    return ''
  }
  return new Array(len).fill('100').join(',')
}

export default {
  name: 'SarimanokFortuneExt',
  components: { Compare, SarimanokFortuneBetConfig },
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
        BuyFreeOdds: DEFAULT_BUY_FREE_ODDS,
        NudgeCountConfig: DEFAULT_NUDGE_COUNT_CONFIG,
        ExtraBetMax: 0,
        NormalConfig: {},
        ExtraBetConfig: {}
      },
      cfgReady: false,
      betConfigTab: 'normal',
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
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
    checkNudgeCountConfig() {
      const list = (this.cfg.NudgeCountConfig || '').toString().split(',').filter(item => item.trim() !== '')
      if (list.length === 0) {
        this.$message.error('NUDGE数量配置不能为空')
        return false
      }
      for (const item of list) {
        const val = parseInt(item.trim(), 10)
        if (isNaN(val) || val <= 0) {
          this.$message.error('NUDGE数量配置必须为大于0的整数，用,连接')
          return false
        }
      }
      return true
    },
    cloneData(value) {
      return JSON.parse(JSON.stringify(value || {}))
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
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      if (!this.checkNudgeCountConfig()) return false
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
        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
        $this.initData()
      })
    },
    initDefaultCfg(betCfg, nudgeLen) {
      const nudgeWeight = new Array(nudgeLen > 0 ? nudgeLen : 0).fill('100').join(',')
      const defaults = {
        MultiplierOdds: DEFAULT_MULTIPLIER_ODDS,
        MultiplierColor: DEFAULT_MULTIPLIER_COLOR,
        ScatterOdds: 0,
        ModeWeight: '100,100',
        FreeModeWeight: '100,100',
        NudgeCountWeight: nudgeWeight,
        FreeNudgeCountWeight: nudgeWeight
      }
      Object.keys(defaults).forEach(key => {
        if (betCfg[key] === undefined || betCfg[key] === null || betCfg[key] === '') {
          this.$set(betCfg, key, defaults[key])
        }
      })
      if (!betCfg.BuyFreeOddsConf) {
        this.$set(betCfg, 'BuyFreeOddsConf', [])
      }
      // 倍数权重长度需与当前公共倍数配置保持一致
      const multiplierWeight = buildWeightStr(betCfg.MultiplierOdds) || buildWeightStr(DEFAULT_MULTIPLIER_ODDS)
      this.initMultiplierRows(betCfg, 'NormalMultiplierRows', multiplierWeight)
      this.initMultiplierRows(betCfg, 'NudgeMultiplierRows', multiplierWeight)
      this.initMultiplierRows(betCfg, 'FreeMultiplierRows', multiplierWeight)
      this.initMultiplierRows(betCfg, 'FreeNudgeMultiplierRows', multiplierWeight)
    },
    initMultiplierRows(betCfg, key, multiplierWeight) {
      const row = betCfg[key]
      if (!row || typeof row !== 'object' || Object.keys(row).length === 0) {
        this.$set(betCfg, key, {
          IconWeight: '100,100',
          MultiplierWeight: multiplierWeight
        })
      }
    },
    migrateExtendConfig(data) {
      const source = this.cloneData(data)
      const nudgeCountConfig = source.NudgeCountConfig || DEFAULT_NUDGE_COUNT_CONFIG
      const nudgeLen = splitLen(nudgeCountConfig)

      const normalCfg = this.cloneData(source.NormalConfig) || {}
      this.initDefaultCfg(normalCfg, nudgeLen)

      const extraCfg = this.cloneData(source.ExtraBetConfig) || {}
      this.initDefaultCfg(extraCfg, nudgeLen)

      return {
        BuyFreeOdds: source.BuyFreeOdds || DEFAULT_BUY_FREE_ODDS,
        NudgeCountConfig: nudgeCountConfig,
        ExtraBetMax: source.ExtraBetMax || 0,
        NormalConfig: normalCfg,
        ExtraBetConfig: extraCfg
      }
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
