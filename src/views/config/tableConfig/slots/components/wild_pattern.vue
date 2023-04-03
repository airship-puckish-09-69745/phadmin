<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="180px">
          <el-form-item label="出现多少个wild奖励翻倍">
            <el-input v-model.number="cfg.WildConfig.PayLineAward.Number" />
            <div class="el-form-item--small">
              <small>支付线多个wild时奖励数量</small>
            </div>
          </el-form-item>

          <el-form-item label="奖励倍数">
            <el-input v-model.number="cfg.WildConfig.PayLineAward.Rate" />
            <div class="el-form-item--small">
              <small>支付线多个wild时奖励倍数</small>
            </div>
          </el-form-item>

          <ratio-input v-model="cfg.WildConfig.SingleWildIntoFreeGame" label="进入免费游戏概率(%)" tips="单个wild进入免费游戏概率"></ratio-input>

          <el-form-item label="行">
            <el-input v-model.number="cfg.WildConfig.Row" />
          </el-form-item>

          <el-form-item label="列">
            <el-input v-model.number="cfg.WildConfig.Col" />
          </el-form-item>

          <el-form-item label="填充普通symbol的值">
            <el-select v-model.number="cfg.WildConfig.FillNormalSymbolValue">
              <el-option
                v-for="(name, sid) in symbolMap"
                :key="sid"
                :label="name"
                :value="parseInt(sid)">
              </el-option>
            </el-select>
            <div class="el-form-item--small">
              <small>目前只支持火</small>
            </div>
          </el-form-item>

          <el-form-item label="每玩多少次必进wild玩法">
            <el-input v-model.number="cfg.WildConfig.PerPlayTimesHitWild" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="6">
      <el-col v-for="(item,idx) in cfg.WildConfig.SymbolConfig" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ idx + 1 }}</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" @click="delRow(idx)">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px;">
            <el-col :span="22">
            <el-form :ref="getId(idx)" label-width="120px">
              <el-form-item label="符号">
                <el-select v-model.number="item.Symbol" size="small">
                  <el-option v-for="(symbolName, sid) in symbolMap" :label="symbolName" :value="parseInt(sid)" />
                </el-select>
              </el-form-item>

              <el-form-item label="最小下注">
                <el-input v-model.number="item.MinBet" size="small" />
              </el-form-item>

              <el-form-item label="最大下注">
                <el-input v-model.number="item.MaxBet" size="small" />
              </el-form-item>

              <el-form-item label="倍率">
                <el-input v-model.number="item.Rate" size="small" />
              </el-form-item>

              <ratio-input v-model="item.HitPercent" label="击中百分比(%)"></ratio-input>

              <el-form-item label="使用jackpot">
                <el-select v-model="item.ProgressiveJackpotName" size="small">
                  <el-option label="无" value=""></el-option>
                  <el-option v-for="symbol in jackpotMap" :label="symbol.label" :value="symbol.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="抽水比例">
                <el-input v-model.number="item.ProgressivePercent" size="small"></el-input>
              </el-form-item>
            </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col>
        <el-button type="primary" @click="addRow">添加</el-button>
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
  name: 'SlotsWildPattern',
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
        'WildConfig': {
          'PayLineAward': {
            'Number': 10,
            'Rate': 10
          },
          'SingleWildIntoFreeGame': 259,
          'Row': 3,
          'Col': 5,
          'SymbolConfig': [
            {
              'Symbol': 1,
              'MinBet': 1,
              'MaxBet': 100,
              'Rate': 2,
              'HitPercent': 10,
              'ProgressiveJackpotName': 1,
              'ProgressivePercent': 10
            }
          ],
          'FillNormalSymbolValue': 1
        },
        'ScatterConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'FreeGameTimes': 1,
          'IsDisableScatter': true,
          'ColsRatio': [
            {
              'Ratio': 10,
              'Cols': [
                1,
                2
              ]
            }
          ]
        }
      },
      symbolMap: {},
      jackpotMap: [
        { label: 'Jackpot1', value: 'jackpot_1' },
        { label: 'Jackpot2', value: 'jackpot_2' },
        { label: 'Jackpot3', value: 'jackpot_3' },
        { label: 'Jackpot4', value: 'jackpot_4' },
        { label: 'Jackpot5', value: 'jackpot_5' },
        { label: 'Jackpot6', value: 'jackpot_6' }
      ],
      lock: false
    }
  },
  watch: {
    'slotsData.SymbolList': {
      deep: true,
      handler: function(val) {
        // console.log('wild pattern symbol list watch', val)
        this.initData()
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
      if (this.slotsData.ExtConfig) {
        const tmp = JSON.parse(this.slotsData.ExtConfig)
        return tmp.WildConfig
      } else {
        return {}
      }
    },
    submitFrm() {
      this.setData()

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
    addRow() {
      this.cfg.WildConfig.SymbolConfig.push({
        'Symbol': 1,
        'MinBet': 1,
        'MaxBet': 100,
        'Rate': 0,
        'HitPercent': 0,
        'ProgressiveJackpotName': 'jackpot_1',
        'ProgressivePercent': 0
      })
    },
    delRow() {

    },
    getId(idx) {
      return 'symbol' + idx
    },
    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.slotsData.SymbolList) {
        const value = this.slotsData.SymbolList[i]['Value']
        this.symbolMap[value] = this.slotsData.SymbolList[i]['Name']
      }
    },
    initData() {
      this.initSymbolMap()
      if (this.slotsData.ExtConfig) {
        this.cfg = JSON.parse(this.slotsData.ExtConfig)
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      this.slotsData.ExtConfig = JSON.stringify(this.cfg)
      // this.$message.success('保存到当前页面成功')
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
