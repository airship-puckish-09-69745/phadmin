<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="钱币倍数" name="script">
            <el-button type="primary" @click="addCoinOddsRow">添加配置</el-button>
            <el-table :data="coinOdds">
              <el-table-column prop="Symbol" label="钱币" width="80">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Symbol" :required="true" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Odds" label="倍数" width="240">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Odds" :required="true" placeholder="请输入内容,如10,100"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Weight" label="普通模式权重" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Weight" :required="true" placeholder="请输入内容,如10,100"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="FreeWeight" label="免费模式权重" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.FreeWeight" :required="true" placeholder="请输入内容,如10,100"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" header-align="center">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeCoinOddsRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
           <el-tab-pane label="Bonus倍数" name="script1">
            <el-button type="primary" @click="addBonusOdds">添加配置</el-button>
            <el-table :data="cfg.BonusOdds">
              <el-table-column prop="MinOdds" label="最小倍数" width="220">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MinOdds" :required="true"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MaxOdds" label="最大倍数" width="220">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MaxOdds" :required="true"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="InWeight" label="权重" width="220">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.InWeight" :required="true"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" header-align="center">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeBonusOddsRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
import { DataRule } from '@/utils/common'
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'slotsLionfortuneMarsExt',
  // eslint-disable-next-line vue/no-unused-components
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
    baseBet: Number
  },
  data() {
    return {
      cfg: {
      },
      activeTab: 'script',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: []
      },
      coinOdds: []
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
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      const $this = this
      this.saveCoinOdds()
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
        this.cfg = this.slotsData
        this.initCoinOdds()
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    initCoinOdds() {
      for (const item of this.cfg.CoinOdds) {
        this.coinOdds.push({
          Symbol: item.Symbol,
          Odds: item.Odds.join(','),
          Weight: item.Weight.join(','),
          FreeWeight: item.FreeWeight.join(',')
        })
      }
    },
    addCoinOddsRow() {
      this.coinOdds.push({
        Symbol: 0,
        Odds: '',
        Weight: '',
        FreeWeight: ''
      })
    },
    removeCoinOddsRow(index) {
      this.coinOdds.splice(index, 1)
    },
    saveCoinOdds() {
      this.cfg.CoinOdds = []
      for (const item of this.coinOdds) {
        this.cfg.CoinOdds.push({
          Symbol: item.Symbol,
          Odds: item.Odds.split(',').map(Number),
          Weight: item.Weight.split(',').map(Number),
          FreeWeight: item.FreeWeight.split(',').map(Number)
        })
      }
    },
    addBonusOdds() {
      if (this.cfg.BonusOdds === null) {
        this.cfg.BonusOdds = []
      }
      this.cfg.BonusOdds.push({
        MinOdds: 0,
        MaxOdds: 0,
        InWeight: 0
      })
    },
    removeBonusOddsRow(index) {
      this.cfg.BonusOdds.splice(index, 1)
    }
  }
}
</script>
