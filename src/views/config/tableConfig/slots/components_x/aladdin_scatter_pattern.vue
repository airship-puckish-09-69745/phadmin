<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <h3>金币免费游戏配置</h3>
        <el-form ref="frm2" :model="cfg" label-width="200px">

          <el-form-item label="金币免费游戏最低金币数">
            <el-input v-model.number="cfg.CoinConfig.FreeGameMinCoinNumber" />
          </el-form-item>

          <el-form-item label="金币免费游戏赠送次数">
            <el-input v-model.number="cfg.CoinConfig.FreeGameTimes" />
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <hr>
        <h3>Scatter免费游戏配置</h3>
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

          <el-form-item label="3轴scatter赠送免费次数">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter3FreeTimes" /></el-col>
          </el-form-item>

          <el-form-item label="4轴scatter赠送免费次数">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter4FreeTimes" /></el-col>
          </el-form-item>

          <el-form-item label="5轴scatter赠送免费次数">
            <el-col :span="8"><el-input v-model.number="cfg.ScatterConfig.Scatter5FreeTimes" /></el-col>
          </el-form-item>

          <h3>Scatter钻石概率配置</h3>
          <el-table :data="cfg.ScatterConfig.DiamondConfig" border style="width:400px;">
            <el-table-column prop="Count" label="钻石数量">
              <template slot-scope="scope">{{ scope.row.Count }}个</template>
            </el-table-column>
            <el-table-column prop="Ratio" label="概率">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Ratio"><template slot="append">‱</template></el-input>
              </template>
            </el-table-column>
          </el-table>

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
  name: 'SlotsAladdinScatterPattern',
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
        'CoinConfig': {
          'FreeGameMinCoinNumber': 3,
          'FreeGameTimes': 3
        },
        'ScatterConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'FreeGameTimes': 1,
          'JoinScatterRatio': 0,
          'Scatter3Ratio': 0,
          'Scatter4Ratio': 0,
          'Scatter5Ratio': 0,
          'Scatter3FreeTimes': 10,
          'Scatter4FreeTimes': 10,
          'Scatter5FreeTimes': 10,
          'DiamondConfig': [
            { 'Count': 1, 'Ratio': 0 },
            { 'Count': 2, 'Ratio': 0 },
            { 'Count': 3, 'Ratio': 0 },
            { 'Count': 4, 'Ratio': 0 },
            { 'Count': 5, 'Ratio': 0 },
            { 'Count': 6, 'Ratio': 0 },
            { 'Count': 7, 'Ratio': 0 },
            { 'Count': 8, 'Ratio': 0 },
            { 'Count': 9, 'Ratio': 0 },
            { 'Count': 10, 'Ratio': 0 },
            { 'Count': 11, 'Ratio': 0 },
            { 'Count': 12, 'Ratio': 0 },
            { 'Count': 13, 'Ratio': 0 },
            { 'Count': 14, 'Ratio': 0 },
            { 'Count': 15, 'Ratio': 0 }
          ]
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
