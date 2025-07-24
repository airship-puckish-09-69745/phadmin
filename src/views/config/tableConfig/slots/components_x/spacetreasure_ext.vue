<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="普通模式金框图案概率">
            <el-input v-model.number="cfg.GoldSymbolRate"><template slot="append">‰</template></el-input>
          </el-form-item>

          <el-form-item label="免费模式金框图案概率">
            <el-input v-model.number="cfg.FreeGoldSymbolRate"><template slot="append">‰</template></el-input>
          </el-form-item>

          <el-form-item label="普通模式一般图案形状权重">
            <el-input v-model="cfg.IrregularShapeWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接。形状从1开始</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式一般图案形状权重">
            <el-input v-model="cfg.FreeIrregularShapeWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接。形状从1开始</template> </el-input>
          </el-form-item>

          <el-form-item label="Bonus倍数">
            <el-input v-model="cfg.BonusOdds" placeholder="请输入内容,如2,1"> <template slot="append">后3个为Jackpot，注:最大值不能超过200000</template> </el-input>
          </el-form-item>

          <el-form-item label="Bonus倍数权重">
            <el-input v-model="cfg.BonusOddsWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接。后3个为Jackpot</template> </el-input>
          </el-form-item>

          <el-form-item label="Bonus模式下bonus出现的权重">
            <el-input v-model="cfg.BonusWeight" placeholder="请输入内容,如2,1"> <template slot="append">三个值用 , 连接。无、普通、特殊</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式触发Bonus概率">
            <el-input v-model.number="cfg.FreeEnterBonusRate"><template slot="append">‰</template></el-input>
          </el-form-item>

          <el-form-item label="Jackpot倍数范围">
            <el-input v-model="cfg.JackpotOddsV2" placeholder="请输入内容,如250,1000,1000,2000"> <template slot="append">用 , 连接。如250,1000表示[250,1000](放大100倍)</template> </el-input>
          </el-form-item>

          <el-form-item label="Jackpot抽水比例">
            <el-input v-model.number="cfg.JackpotFeeRate" :required="true"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="Jackpot抽水权重">
            <el-input v-model="cfg.JackpotFeeWeight" placeholder="请输入内容,如2,4"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="bonus/免费权重">
            <el-input v-model="cfg.EnterSpecialWeight" placeholder="请输入内容,如2,4"> <template slot="append">用 , 连接。普通、bonus、免费</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="进入特殊模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>
          <!---->
<!--          <el-form-item label="bonus配置">-->
<!--            <el-table :data="cfg.FreeModeBonusCfg" border style="width: 100%">-->
<!--              <el-table-column prop="OddsMin" label="最小倍数" width="120">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.OddsMin" type="number"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="OddsMax" label="最大倍数" width="120">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.OddsMax" type="number"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="TriggerRates" label="触发bonus概率" width="95">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.TriggerRates" type="number"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="BonusOddsMin" label="bonus图案最小赔率" width="115">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.BonusOddsMin" type="number"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="BonusNumberMax" label="bonus图案最大数量" width="105">-->
<!--                &lt;!&ndash;                <template slot="header">&ndash;&gt;-->
<!--                &lt;!&ndash;                  <span>&ndash;&gt;-->
<!--                &lt;!&ndash;                    <el-tooltip effect="dark" content="bonus图案最大数量" placement="top-end">&ndash;&gt;-->
<!--                &lt;!&ndash;                      <i class="el-icon-question" style="margin-left:5px;cursor:pointer"/>&ndash;&gt;-->
<!--                &lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
<!--                &lt;!&ndash;                  </span>&ndash;&gt;-->
<!--                &lt;!&ndash;                </template>&ndash;&gt;-->

<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.BonusNumberMax" type="number"/>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="操作" width="63">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--            <el-button style="margin-top: 10px;" type="primary" @click="handleAdd">新增一行</el-button>-->
<!--          </el-form-item>-->

          <!---->
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="script">
            <el-button type="primary" @click="showDialog">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="cfg.BuyFreeOddsConf">
              <el-table-column prop="bet" label="Bet值" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row)">{{ scope.row.Bet.map(b => b/1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="bonus配置" name="script1">
            <el-button type="primary" @click="handleAdd">添加配置</el-button>
            <el-table :data="cfg.FreeModeBonusCfg">
              <el-table-column prop="OddsMin" label="最小倍数" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMin" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="OddsMax" label="最大倍数" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMax" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="TriggerRates" label="触发bonus概率" width="95">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.TriggerRates" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="BonusOddsMin" label="bonus图案最小赔率" width="115">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.BonusOddsMin" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="BonusNumberMax" label="bonus图案最大数量" width="105">
                <!--                <template slot="header">-->
                <!--                  <span>-->
                <!--                    <el-tooltip effect="dark" content="bonus图案最大数量" placement="top-end">-->
                <!--                      <i class="el-icon-question" style="margin-left:5px;cursor:pointer"/>-->
                <!--                    </el-tooltip>-->
                <!--                  </span>-->
                <!--                </template>-->

                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.BonusNumberMax" type="number"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      :title="buyFreeOddsConf.dialogTitle"
      :visible.sync="buyFreeOddsConf.dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form label-width="50px">
        <el-form-item label="Bet值">
          <el-input v-model="buyFreeOddsConf.currentBet" :disabled="buyFreeOddsConf.currentBet === '0' && buyFreeOddsConf.editIndex >= 0" placeholder="请输入Bet值">
            <template slot="append">用 , 连接</template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addConfigRow">添加</el-button>
      <el-button type="primary" @click="buyFreeOddsRtp">检测RTP</el-button>
      <el-table :data="buyFreeOddsConf.currentConf">
        <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="WeightStr" label="倍数范围权重">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.InWeight" :required="true" placeholder="请输入内容,如4" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" @click="removeConfigRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="buyFreeOddsConf.dialogVisible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>

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
import {DataRule, ValidateVueItem} from '@/utils/common'
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsAtlantisTreasureExt',
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
        FreeModeBonusCfg: []
      },
      activeTab: 'script',
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
    handleDelete(index) {
      this.cfg.FreeModeBonusCfg.splice(index, 1)
    },
    handleAdd() {
      const newRow = {
        OddsMin: 0,
        OddsMax: 0,
        TriggerRates: 0,
        BonusOddsMin: 0,
        BonusNumberMax: 0
      }
      this.cfg.FreeModeBonusCfg.push(newRow)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      // 校验
      let checkValue1 = true
      let checkValue2 = true
      let checkValue3 = true
      let checkValue4 = true
      this.$refs['frm2'].validate((valid) => {
        // eslint-disable-next-line no-empty
        for (const index in this.cfg.FreeModeBonusCfg) {
          // eslint-disable-next-line no-empty
          const fmbc = this.cfg.FreeModeBonusCfg[index]
          if (fmbc.OddsMin >= fmbc.OddsMax) {
            checkValue1 = false
          }
          // eslint-disable-next-line no-empty
          if (fmbc.BonusOddsMin >= fmbc.OddsMin) {
            checkValue2 = false
          }
          //
          if (fmbc.TriggerRates < 0 || fmbc.TriggerRates > 100) {
            checkValue3 = false
          }
          //
          // eslint-disable-next-line no-empty
          if (fmbc.BonusOddsMin < 0 || fmbc.BonusNumberMax < 0) {
            checkValue4 = false
          }
        }
      })
      if (!checkValue1) {
        this.$message.error('"最小倍数"应该小于"最大倍数"')
        return
      }
      if (!checkValue2) {
        this.$message.error('"bonus图案最小赔率"应该小于"最小倍数"')
        return
      }
      if (!checkValue3) {
        this.$message.error('"触发bonus概率"的概率值应该大于等于0,小于等于100')
        return
      }
      if (!checkValue4) {
        this.$message.error('数值小于0,请检查')
        return
      }
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      //
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function (isEdit) {
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
        if (!this.cfg.FreeModeBonusCfg) {
          this.cfg.FreeModeBonusCfg = []
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
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

      if (this.checkBuyFreeOdds(currentBets) === false) {
        return
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
    },
    checkBuyFreeOdds(currentBets) {
      let weightTotal = 0
      const existingBets = new Set()
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
          return false
        }
      }

      // 检查Odds
      for (const item of this.buyFreeOddsConf.currentConf) {
        if (item.MinOdds > item.MaxOdds) {
          Message.error(`目标倍数开始(${item.MinOdds})不能大于目标倍数结束(${item.MaxOdds})`)
          return false
        }
        weightTotal += item.InWeight
      }

      // 检查rtp
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg.BuyFreeOdds / this.baseBet * 100
      }
      if (rtp >= 100) {
        Message.error(`当前RTP(${rtp})大于等于100%`)
        return false
      }
      return true
    },
    buyFreeOddsRtp() {
      let weightTotal = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        weightTotal += item.InWeight
      }
      // rtp
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg.BuyFreeOdds / this.baseBet * 100
      }
      Message.info(`当前RTP(${rtp})`)
    }
  }
}
</script>
