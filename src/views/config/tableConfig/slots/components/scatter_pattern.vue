<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="是否开启scatter">
            <el-switch
              style="display: block"
              v-model="cfg.ScatterConfig.Enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
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

          <el-form-item label="是否禁用scatter图标">
            <el-switch
              style="display: block"
              v-model="cfg.ScatterConfig.IsDisableScatter"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="禁止"
              inactive-text="启用">
            </el-switch>
            <div class="el-form-item--small">
              <small>是否禁用scatter图标，目前只支持禁止</small>
            </div>
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

    <el-row :gutter="10">
      <el-form ref="colFrm" :model="cfg" label-width="80px">
        <el-col :span="12" :offset="3">
          <el-table
            :data="cfg.ScatterConfig.ColsRatio"
            border
            :summary-method="getSummary"
            show-summary
            :row-style="{height: '80px'}"
            :cell-style="{padding: '0px'}"
            @cell-click="colClick"
            style="width: 100%">
            <template v-for="col in cols">
              <el-table-column
                :prop="getKey(col)"
                :label="getLabel(col)"
                align="center"
                width="80">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-check" circle v-if="hasHit(scope.row.Cols, col - 1)"></el-button>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              prop="Ratio"
              label="概率"
              width="180">
              <template scope="scope">
                <ratio-input v-model="scope.row.Ratio" :is-sample="true"></ratio-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="Op"
              label="操作"
              width="180">
              <template scope="scope">
                <el-button type="primary" @click="addRow" v-if="scope.$index === 0">添加</el-button>
                <el-button type="danger" @click="delRow(scope.$index)" v-else>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
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
  name: 'SlotsScatterPattern',
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
          'JoinScatterRatio': 0,
          'Scatter3Ratio': 0,
          'Scatter4Ratio': 0,
          'Scatter5Ratio': 0,
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
      cols: [],
      symbolMap: {},
    }
  },
  watch: {
    'slotsData.SymbolList': {
      deep: true,
      handler: function(val) {
        // console.log('wild pattern symbol list watch', val)
        this.initData()
      }
    },
    'slotsData.Clos': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon cols watch', val)
        this.initData()
      }
    },
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
        return tmp.ScatterConfig
      } else {
        return {}
      }
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
      return ['总计', '-', '-', '-', '-', (ratio / 100).toFixed(2), '-', '-']
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    getKey(col) {
      return 'col' + (col - 1)
    },
    getLabel(col) {
      return '轴' + col
    },
    colClick(row, column, cell, event) {
      console.log('click row', row, ' col', column)
      const col = parseInt(column['property'].substr(column['property'].length - 1))
      if (!col && col !== 0) {
        console.log('col exception ', col)
        return
      }
      if (row.Cols.indexOf(col) >= 0) {
        const arr = []
        for (const i in row.Cols) {
          if (!row.Cols.hasOwnProperty(i) || row.Cols[i] >= 5) {
            continue
          }
          if (row.Cols[i] !== col) {
            arr.push(row.Cols[i])
          }
        }
        row.Cols = arr
      } else {
        row.Cols.push(col)
        row.Cols.sort(function(a, b) {
          return a - b
        })
      }
    },
    addRow() {
      this.cfg.ScatterConfig.ColsRatio.push({
        'Ratio': 0,
        'Cols': []
      })
    },
    delRow(idx) {
      this.cfg.ScatterConfig.ColsRatio.splice(idx, 1)
    },
    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.slotsData.SymbolList) {
        const value = this.slotsData.SymbolList[i]['Value']
        this.symbolMap[value] = this.slotsData.SymbolList[i]['Name']
      }
    },
    initCols() {
      this.cols = []
      for (let i = 1; i <= this.slotsData.Clos; i++) {
        this.cols.push(i)
      }
    },
    initData() {
      this.initCols()
      // this.initSymbolMap()
      if (this.slotsData.ExtConfig) {
        this.cfg = JSON.parse(this.slotsData.ExtConfig)
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      let ratio = 0
      for (const i in this.cfg.ScatterConfig.ColsRatio) {
        ratio += this.cfg.ScatterConfig.ColsRatio[i]['Ratio']
      }

      if (ratio !== 10000) {
        this.$message.error('概率合计必须等于100%')
        return false
      }

      this.slotsData.ExtConfig = JSON.stringify(this.cfg)
      // this.$message.success('保存到当前页面成功')

      return true
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
