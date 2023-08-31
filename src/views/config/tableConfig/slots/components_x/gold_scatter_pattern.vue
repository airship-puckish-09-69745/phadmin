<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="是否开启scatter">
            <el-switch
              v-model="cfg.ScatterConfig.Enable"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.ScatterConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="最低出现多少轴才中scatter">
            <el-input v-model.number="cfg.ScatterConfig.MinReels" />
          </el-form-item>

          <el-form-item label="小游戏次数">
            <el-input v-model.number="cfg.ScatterConfig.FreeGameTimes" />
          </el-form-item>

          <el-form-item label="进入小游戏的概率">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.JoinScatterRatio" /></el-col>‱
          </el-form-item>

          <el-form-item label="3轴scatter的概率">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter3Ratio" /></el-col>‱
          </el-form-item>

          <el-form-item label="4轴scatter的概率">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter4Ratio" /></el-col>‱
          </el-form-item>

          <el-form-item label="5轴scatter的概率">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter5Ratio" /></el-col>‱
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
  name: 'SlotsGoldScatterPattern',
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
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'FreeGameTimes': 1,
          'JoinScatterRatio': 0,
          'Scatter3Ratio': 0,
          'Scatter4Ratio': 0,
          'Scatter5Ratio': 0
        },
        'BonusConfig': {}
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
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        const raw = this.slotsData
        if (raw.hasOwnProperty('ScatterConfig')) {
          this.cfg = raw
        } else {
          if (raw.hasOwnProperty('BonusConfig')) {
            this.cfg.BonusConfig = raw.BonusConfig
          }
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
