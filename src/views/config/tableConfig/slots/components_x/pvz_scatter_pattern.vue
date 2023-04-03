<template>
  <div class="app-container">

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>主游戏阳光奖励配置</strong></span></div>
          <div style="margin-top:20px;">
            <el-form ref="frm1" :model="cfg" label-width="200px">
              <el-form-item label="2倍奖励需要累计阳光数量">
                <el-col :span="8"><el-input v-model.number="cfg.LightX2Count" /></el-col>
              </el-form-item>
              <el-form-item label="4倍奖励需要累计阳光数量">
                <el-col :span="8"><el-input v-model.number="cfg.LightX4Count" /></el-col>
              </el-form-item>
              <el-form-item label="8倍奖励需要累计阳光数量">
                <el-col :span="8"><el-input v-model.number="cfg.LightX8Count" /></el-col>
              </el-form-item>
              <el-form-item label="未使用阳光的过期时间">
                <el-col :span="8"><el-input v-model.number="cfg.FreeLightTTL" /></el-col>秒
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>Bonus玩法配置</strong></span></div>
          <div style="margin-top:20px;">
            <el-form ref="frm1" :model="cfg" label-width="200px">
              <el-form-item label="最低出现多少轴才中Bonus">
                <el-col :span="8"><el-input v-model.number="cfg.BonusConfig.MinReels" /></el-col>
              </el-form-item>
              <el-form-item label="Bonus初始能量点数">
                <el-col :span="8"><el-input v-model.number="cfg.BonusConfig.FreePowerPoints" /></el-col>
              </el-form-item>
              <el-form-item label="Bonus矩阵行数">
                <el-col :span="8"><el-input v-model.number="cfg.BonusConfig.Rows" /></el-col>
              </el-form-item>
              <el-form-item label="Bonus奖励区矩阵列数">
                <el-col :span="8"><el-input v-model.number="cfg.BonusConfig.RewardColumns" /></el-col>
              </el-form-item>
              <el-form-item label="Bonus伤害区矩阵列数">
                <el-col :span="8"><el-input v-model.number="cfg.BonusConfig.PunishmentColumns" /></el-col>
              </el-form-item>

              <el-table :data="cfg.BonusConfig.Symbols" border style="width:800px;">
                <el-table-column prop="Symbol" label="图标">
                  <template slot-scope="scope">{{getSymbolName(scope.row.Symbol)}}</template>
                </el-table-column>
                <el-table-column prop="Count" label="概率(单位是所有图标概率值的和分之一)">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Count"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="MoneyRate" label="奖励倍数">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MoneyRate"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ReducePowerPoints" label="消耗能量点数">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ReducePowerPoints"></el-input>
                  </template>
                </el-table-column>
              </el-table>

            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>Scatter玩法配置</strong></span></div>
          <div style="margin-top:20px;">
            <el-form ref="frm1" :model="cfg" label-width="200px">
              <el-form-item label="是否开启scatter">
                <el-switch v-model="cfg.ScatterConfig.Enable" active-color="#13ce66" inactive-color="#ff4949" active-text="开启" inactive-text="关闭"></el-switch>
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
            </el-form>
          </div>

        </el-card>
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
  name: 'SlotsPVZScatterPattern',
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
    },
    SymbolList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  watch: {
    'SymbolList': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    }
  },
  data() {
    return {
      symbolMap: {},
      cfg: {
        'BonusConfig': {
          'FrameDropMaxNumber': 0,
          'FrameDropMinNumber': 0,
          'FreePowerPoints': 0,
          'MinReels': 0,
          'PunishmentColumns': 0,
          'RewardColumns': 0,
          'Rows': 0,
          'Symbols': []
        },
        'FreeLightTTL': 0,
        'LightX2Count': 0,
        'LightX4Count': 0,
        'LightX8Count': 0,
        'ScatterConfig': {
          'Enable': true,
          'PerReelsMinNumber': 0,
          'MinReels': 0,
          'JoinScatterRatio': 0,
          'Scatter3Ratio': 0,
          'Scatter4Ratio': 0,
          'Scatter5Ratio': 0,
          'Scatter3FreeTimes': 0,
          'Scatter4FreeTimes': 0,
          'Scatter5FreeTimes': 0
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
    getSymbolName(v) {
      return this.symbolMap[v]
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
    initSymbolMap() {
      // console.log('symbol list', this.SymbolList)
      this.symbolMap = {}
      for (const i in this.SymbolList) {
        const value = this.SymbolList[i]['Value']
        this.symbolMap[value] = this.SymbolList[i]['Name']
      }
    },
    initData() {
      this.initSymbolMap()
      if (this.slotsData) {
        let raw = this.slotsData
        this.cfg = raw
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
