<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="250px">

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="普通模式FWild在第2和4列出现概率">
            <el-input v-model="FWildTwoFourColRateStr" placeholder="请输入内容,如25,50"> <template slot="append">% 两个值一组用 , 连接。</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="15" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="特殊符号配置" name="normal">
            <el-button type="primary" @click="cfg.SpecialSymbols.push({Name:'',Value:0,WeightNormal:0,WeightFree:0,EventRate:0,EventOdds:0,EventSort:0})">添加</el-button>
            <el-table :data="cfg.SpecialSymbols">
              <el-table-column prop="Name" label="符号名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Name" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="Value" label="符号值">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Value" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="WeightNormal" label="普通模式权重">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.WeightNormal" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="WeightFree" label="免费模式权重">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.WeightFree" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="EventRate" label="事件触发的概率‰">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.EventRate" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="EventOdds" label="事件触发的倍数(放大100倍)">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.EventOdds" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="EventSort" label="事件展示排序号">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.EventSort" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="onSpecialSymbolRemove(scope.$index)">删除</el-button>
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
import { DataRule, ValidateVueItem } from '@/utils/common'
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsGoldTrainMarsExt',
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
      },
      FWildTwoFourColRateStr: '',
      activeTab: 'normal',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: []
      }
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
      const fWildTwoFourColRates = this.FWildTwoFourColRateStr.split(',')
      this.cfg.FWildTwoFourColRates = [0, 0]
      for (let i = 0; i < fWildTwoFourColRates.length; i++) {
        this.cfg.FWildTwoFourColRates[i] = parseInt(fWildTwoFourColRates[i])
      }

      if (!ValidateVueItem(this.$refs['frm2'])) return false
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
        this.FWildTwoFourColRateStr = this.slotsData.FWildTwoFourColRates ? this.slotsData.FWildTwoFourColRates.join(',') : ''
        this.cfg = this.slotsData
        if (this.cfg.SpecialSymbols === undefined) {
          this.cfg.SpecialSymbols = []
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    onSpecialSymbolRemove(index) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cfg.SpecialSymbols.splice(index, 1)
      })
    },
    showDialog() {
      this.buyFreeOddsConf.dialogTitle = '添加配置'
      this.buyFreeOddsConf.currentBet = '0'
      this.buyFreeOddsConf.currentConf = [{ MinOdds: 0, MaxOdds: 0, InWeight: 0 }]
      this.buyFreeOddsConf.editIndex = -1
      this.buyFreeOddsConf.dialogVisible = true
    },
    editConfig(row) {
      this.buyFreeOddsConf.dialogTitle = '编辑配置'
      this.buyFreeOddsConf.currentBet = row.Bet.map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items))
      this.buyFreeOddsConf.editIndex = this.cfg.BuyFreeOddsConf.findIndex(item => item.Bet === row.Bet)
      this.buyFreeOddsConf.dialogVisible = true
    },
    addConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 0, MaxOdds: 0, InWeight: 0 })
    },
    removeConfigRow(index) {
      this.buyFreeOddsConf.currentConf.splice(index, 1)
    },
    removeConfig(index) {
      this.cfg.BuyFreeOddsConf.splice(index, 1)
    },
    saveConfig() {
      const currentBets = this.buyFreeOddsConf.currentBet
        .split(',')
        .map(b => parseFloat(b.trim()) * 1000)
        .filter(b => !isNaN(b))
      const existingBets = new Set()
      console.log('currentBets', currentBets)
      if (!this.cfg.BuyFreeOddsConf) {
        this.cfg.BuyFreeOddsConf = []
      }
      // 排除正在编辑的项（如果是编辑模式）
      this.cfg.BuyFreeOddsConf.forEach((item, index) => {
        if (this.buyFreeOddsConf.editIndex !== index) {
          item.Bet.forEach(bet => existingBets.add(bet))
        }
      })

      // 检查重复
      for (const bet of currentBets) {
        if (existingBets.has(bet)) {
          Message.error(`已经存在相同的${bet / 1000}Bet值`)
          return
        }
      }

      // 检查
      for (const item of this.buyFreeOddsConf.currentConf) {
        if (item.MinOdds > item.MaxOdds) {
          Message.error(`目标倍数开始(${item.MinOdds})不能大于目标倍数结束(${item.MaxOdds})`)
          return
        }
      }

      if (this.buyFreeOddsConf.editIndex >= 0) {
        this.$set(this.cfg.BuyFreeOddsConf, this.buyFreeOddsConf.editIndex, {
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      } else {
        this.cfg.BuyFreeOddsConf.push({
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      }
      this.buyFreeOddsConf.dialogVisible = false
    }
  }
}
</script>
