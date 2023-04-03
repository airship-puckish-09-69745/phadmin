<template>
  <div class="app-container">
    <template v-for="(oneCfg, oneCfgIdx) in slotsData.BonusConfig">

      <el-card class="box-card" style="margin:40px auto;">

        <div slot="header" class="clearfix">
          <h3 style="text-align:center">---------- [ {{oneCfg.BonusCount}}列Bonus图标的设置 ] ----------</h3>
        </div>

        <el-table :data="oneCfg.Rows">
          <el-table-column label="行号(第1行在最底层)" prop="RowId" width="200">
            <template scope="rowCfg">
              <el-input v-model.number="rowCfg.row.RowId"><template slot="prepend">第</template><template slot="append">行</template></el-input>
            </template>
          </el-table-column>

          <el-table-column label="图标设置" prop="SymbolConfig">
            <template scope="rowCfg">
              <el-table :data="rowCfg.row.SymbolConfig" border>
                <el-table-column label="图标" prop="SymbolVal">
                  <template scope="symbolCfg">
                    <el-select v-model="symbolCfg.row.SymbolVal" placeholder="请选择">
                      <el-option v-for="item in cfg.icons" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" prop="SymbolCount">
                  <template scope="symbolCfg">
                    <el-input v-model.number.number="symbolCfg.row.SymbolCount"><template slot="append">个</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="SymbolVal">
                  <template scope="symbolCfg">
                    <el-button plain type="danger" size="mini" @click="delSymbolCfg(oneCfgIdx, rowCfg.$index, symbolCfg.$index)">删除</el-button>
                    <el-button plain size="mini" @click="addSymbolCfg(oneCfgIdx, rowCfg.$index, symbolCfg.$index)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>

          <el-table-column label="奖励设置" prop="OddsConfig">
            <template scope="rowCfg">
              <el-table :data="rowCfg.row.OddsConfig" border>
                <el-table-column label="赔率" prop="Odds">
                  <template scope="oddsCfg">
                    <el-input v-model.number="oddsCfg.row.Odds"><template slot="append">倍</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="获奖概率" prop="Rate">
                  <template scope="oddsCfg">
                    <el-input v-model.number="oddsCfg.row.HitRate"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="Odds">
                  <template scope="oddsCfg">
                    <el-button plain type="danger" size="mini" @click="delOddsCfg(oneCfgIdx, rowCfg.$index, oddsCfg.$index)">删除</el-button>
                    <el-button plain size="mini" @click="addOddsCfg(oneCfgIdx, rowCfg.$index, oddsCfg.$index)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200">
            <template scope="rowCfg">
              <el-button plain type="danger" size="mini" @click="delRowCfg(oneCfgIdx, rowCfg.$index)">删除</el-button>
              <el-button plain size="mini" @click="addRowCfg(oneCfgIdx, rowCfg.$index)">添加</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>

    </template>

    <el-row>
      <el-col style="text-align:center;">
        <el-button type="primary" @click="submitFrm">保存</el-button>
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
  name: 'SlotsBeautyBonusGame',
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
        'icons': [
          {'label': '乌鸦(#2)', 'value': 2},
          {'label': '公主(#7)', 'value': 7}
        ],
        'BonusConfig': [
        /*
          {
            'BonusCount': 3,
            'Rows': [
              {
                'RowId': 1,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 4}, {'SymbolVal': 2, 'SymbolCount': 1}], //假设图标1是睡美人，图标2是乌鸦
                'OddsConfig': [{'Odds': 3, 'Rate': 40}, {'Odds': 5, 'Rate': 40}]
              },
              {
                'RowId': 2,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 2}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 10, 'Rate': 45}]
              },
              {
                'RowId': 3,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 2}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 20, 'Rate': 30}]
              },
              {
                'RowId': 4,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 2}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 30, 'Rate': 30}]
              }
            ]
          },
          {
            'BonusCount': 4,
            'Rows': [
              {
                'RowId': 1,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 6}, {'SymbolVal': 2, 'SymbolCount': 1}], //假设图标1是睡美人，图标2是乌鸦
                'OddsConfig': [{'Odds': 10, 'Rate': 30}, {'Odds': 20, 'Rate': 45}]
              },
              {
                'RowId': 2,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 4}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 30, 'Rate': 30}, {'Odds': 50, 'Rate': 30}]
              },
              {
                'RowId': 3,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 4}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 80, 'Rate': 60}]
              },
              {
                'RowId': 4,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 2}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 100, 'Rate': 30}]
              }
            ]
          },
          {
            'BonusCount': 5,
            'Rows': [
              {
                'RowId': 1,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 6}, {'SymbolVal': 2, 'SymbolCount': 1}], //假设图标1是睡美人，图标2是乌鸦
                'OddsConfig': [{'Odds': 20, 'Rate': 40}, {'Odds': 40, 'Rate': 40}]
              },
              {
                'RowId': 2,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 6}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 60, 'Rate': 50}, {'Odds': 80, 'Rate': 30}]
              },
              {
                'RowId': 3,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 6}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 100, 'Rate': 40}, {'Odds': 120, 'Rate': 30}]
              },
              {
                'RowId': 4,
                'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 2}, {'SymbolVal': 2, 'SymbolCount': 1}],
                'OddsConfig': [{'Odds': 150, 'Rate': 50}]
              }
            ]
          }
        */
        ]
      },
    }
  },
  created() {
  },
  methods: {
    addRowCfg(bonusCfgIdx, rowCfgIdx) {
      let row = {
        'RowId': 1,
        'SymbolConfig': [{'SymbolVal': 1, 'SymbolCount': 4}, {'SymbolVal': 2, 'SymbolCount': 1}], //假设图标1是睡美人，图标2是乌鸦
        'OddsConfig': [{'Odds': 3, 'Rate': 40}, {'Odds': 5, 'Rate': 40}]
      }
      this.slotsData.BonusConfig[bonusCfgIdx].Rows.splice(rowCfgIdx+1, 0, row)
    },
    delRowCfg(bonusCfgIdx, rowCfgIdx) {
      this.$delete(this.slotsData.BonusConfig[bonusCfgIdx].Rows, rowCfgIdx)
    },
    addSymbolCfg(bonusCfgIdx, rowCfgIdx, symbolCfgIdx) {
      this.slotsData.BonusConfig[bonusCfgIdx].Rows[rowCfgIdx].SymbolConfig.splice(symbolCfgIdx+1, 0, {'SymbolVal': 1, 'SymbolCount': 0})
    },
    delSymbolCfg(bonusCfgIdx, rowCfgIdx, symbolCfgIdx) {
      this.$delete(this.slotsData.BonusConfig[bonusCfgIdx].Rows[rowCfgIdx].SymbolConfig, symbolCfgIdx)
    },
    addOddsCfg(bonusCfgIdx, rowCfgIdx, oddsCfgIdx) {
      this.slotsData.BonusConfig[bonusCfgIdx].Rows[rowCfgIdx].OddsConfig.splice(oddsCfgIdx+1, 0, {'Odds': 0, 'Rate': 0})
    },
    delOddsCfg(bonusCfgIdx, rowCfgIdx, oddsCfgIdx) {
      this.$delete(this.slotsData.BonusConfig[bonusCfgIdx].Rows[rowCfgIdx].OddsConfig, oddsCfgIdx)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      //if (!this.setData()) {
      //  return
      //}

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
      const col = parseInt(column['property'].substr(column['property'].length - 1))
      if (!col && col !== 0) {
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
    setData() {
      this.slotsData.ExtConfig = JSON.stringify(this.slotsData)
      // this.$message.success('保存到当前页面成功')

      return true
    }
  }
}
</script>
