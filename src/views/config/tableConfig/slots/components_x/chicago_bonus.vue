<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="是否开启Bonus">
            <el-switch
              style="display: block"
              v-model="cfg.BonusConfig.Enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.BonusConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="最低出现多少轴才中Bonus">
            <el-input v-model.number="cfg.BonusConfig.MinReels" />
          </el-form-item>
          <ratio-input v-model="cfg.BonusConfig.GangGameRatio" label="黑帮游戏概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.PoliceGameRatio" label="警察游戏概率(%)"></ratio-input>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" :offset="3">
        <h3 style="text-align:center">---------- 黑帮游戏 ----------</h3>
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <ratio-input v-model="cfg.BonusConfig.GangConfig.HandcuffsRatio" label="手铐概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.GangConfig.PokerRatio" label="扑克概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.GangConfig.AwardRatio" label="奖励概率(%)"></ratio-input>
          <el-form-item label="奖励最小值（乘10）">
            <el-input v-model.number="cfg.BonusConfig.GangConfig.OddsMin" />
          </el-form-item>
          <el-form-item label="奖励最大值（乘10）">
            <el-input v-model.number="cfg.BonusConfig.GangConfig.OddsMax" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="12" :offset="3">
        <h3 style="text-align:center">---------- 警察游戏 ----------</h3>
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <ratio-input v-model="cfg.BonusConfig.PoliceConfig.GangZeroRatio" label="命中0个黑帮概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.PoliceConfig.GangOneRatio" label="命中1个黑帮概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.PoliceConfig.GangTwoRatio" label="命中2个黑帮概率(%)"></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.PoliceConfig.GangThreeRatio" label="命中3个黑帮概率(%)"></ratio-input>
          <el-form-item label="基础倍率">
            <el-input v-model.number="cfg.BonusConfig.PoliceConfig.BaseOdds" />
          </el-form-item>
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
  name: 'SlotsChicagoBonus',
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
        'BonusConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'GangGameRatio': 0,
          'PoliceGameRatio': 0,
          'GangConfig':{
            'HandcuffsRatio':0,
            'PokerRatio':0,
            'AwardRatio':0,
            'OddsMin':0,
            'OddsMax':0
          },
          'PoliceConfig':{
            'GangZeroRatio':0,
            'GangOneRatio':0,
            'GangTwoRatio':0,
            'GangThreeRatio':0,
            'BaseOdds':0
          }
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
      if (!this.setData()) {
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
    getSummary(param) {
      // console.log('summary', param)
      let ratio = 0
      for (const i in param.data) {
        ratio += param.data[i]['Ratio']
      }
      return ['总计', (ratio / 100).toFixed(2),'-']
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      let cfg = this.cfg;
      if (cfg.BonusConfig.GangGameRatio+cfg.BonusConfig.PoliceGameRatio!=10000) {
        this.$message.error('进入那种游戏概率合计必须等于100%')
        return false
      }
      if (cfg.BonusConfig.GangConfig.HandcuffsRatio+cfg.BonusConfig.GangConfig.PokerRatio+cfg.BonusConfig.GangConfig.AwardRatio!=10000) {
        this.$message.error('黑帮游戏概率合计必须等于100%')
        return false
      }
      if (cfg.BonusConfig.PoliceConfig.GangZeroRatio+cfg.BonusConfig.PoliceConfig.GangOneRatio+cfg.BonusConfig.PoliceConfig.GangTwoRatio+cfg.BonusConfig.PoliceConfig.GangThreeRatio!=10000) {
        this.$message.error('警察游戏概率合计必须等于100%')
        return false
      }
      console.log("cfg:  ",this.cfg)
      this.slotsData = this.cfg
      // this.$message.success('保存到当前页面成功')

      return true
    }
  }
}
</script>
