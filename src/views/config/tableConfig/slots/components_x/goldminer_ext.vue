<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="金币倍率配置">
            <el-input v-model="cfg.GoldOdds" placeholder="请输入内容,如5,8,10,12,15,20,40"> <template slot="append">用 , 连接(放大100倍)</template> </el-input>
          </el-form-item>

          <el-form-item label="金币倍率权重">
            <el-input v-model="cfg.GoldOddsWeight" placeholder="值个数与倍率配置一样"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式金币倍率权重">
            <el-input v-model="cfg.FreeGoldOddsWeight" placeholder="值个数与倍率配置一样"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="Jackpot倍率配置">
            <el-input v-model="cfg.JackpotOdds" placeholder="请输入内容,如8,10,12,15"> <template slot="append">用 , 连接(放大100倍)</template> </el-input>
          </el-form-item>

          <el-form-item label="金币及Jackpot出现概率">
            <el-input v-model.number="cfg.GoldJackpotProbability" :required="true"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式金币及Jackpot出现概率">
            <el-input v-model.number="cfg.FreeGoldJackpotProbability" :required="true"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="出现金币及Jackpot权重配置">
            <el-input v-model="cfg.GoldJackpotWeight" placeholder="请输入内容,如8,10,12,15"> <template slot="append">用 , 连接(第一个值是金币权重)</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式出现金币及Jackpot权重配置">
            <el-input v-model="cfg.FreeGoldJackpotWeight" placeholder="请输入内容,如8,10,12,15"> <template slot="append">用 , 连接(第一个值是金币权重)</template> </el-input>
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

          <el-form-item label="Wild出现概率">
            <el-input v-model.number="cfg.WildProbability" :required="true"> <template slot="append">‰</template> </el-input>
          </el-form-item>

<!--          <el-form-item label="免费次数权重倍数V2">-->
<!--            <el-input v-model="cfg.FreeWeightOddsV2" placeholder="请输入内容,如1,2,4"> <template slot="append">用 , 连接([a,b],[c,d])</template> </el-input>-->
<!--          </el-form-item>-->

<!--          <el-form-item label="免费次数权重V2">-->
<!--            <el-input v-model="cfg.FreeWeight" placeholder="请输入内容,如1,2,4"> <template slot="append">用 , 连接(0次,6次,12次)</template> </el-input>-->
<!--          </el-form-item>-->

<!--          <el-form-item label="免费模式再次免费次数权重倍数V2">-->
<!--            <el-input v-model="cfg.FreeAgainWeightOddsV2" placeholder="请输入内容,如1,2,4"> <template slot="append">用 , 连接([a,b],[c,d])</template> </el-input>-->
<!--          </el-form-item>-->

<!--          <el-form-item label="免费模式再次免费次数权重V2">-->
<!--            <el-input v-model="cfg.FreeAgainWeight" placeholder="请输入内容,如1,2,4"> <template slot="append">用 , 连接(0次,6次,12次)</template> </el-input>-->
<!--          </el-form-item>-->

          <el-form-item label="硬币数权重">
            <el-input v-model="cfg.CoinNumWeight" placeholder="请输入内容,如2,4"> <template slot="append">用 , 连接(1个,2个)</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式硬币数权重">
            <el-input v-model="cfg.FreeCoinNumWeight" placeholder="请输入内容,如2,4"> <template slot="append">用 , 连接(1个,2个)</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入特殊模式最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

<!--          <el-form-item label="购买免费模式中奖倍数范围V2">-->
<!--            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>-->
<!--          </el-form-item>-->

<!--          <el-form-item label="购买免费模式中奖左范围概率V2">-->
<!--            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>-->
<!--          </el-form-item>-->

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

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
          <el-tab-pane label="免费次数" name="script1">
            <el-button type="primary" @click="addConfigRow(freeWeight)">添加</el-button>
            <el-table :data="freeWeight">
              <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="WeightStr" label="次数权重">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.InWeight" :required="true" placeholder="请输入内容,如1,2,4">
                    <template slot="append">用 , 连接(0次,6次,12次)</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeConfigRow(freeWeight, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="再次免费次数" name="script2">
            <el-button type="primary" @click="addConfigRow(freeAgainWeight)">添加</el-button>
            <el-table :data="freeAgainWeight">
              <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="WeightStr" label="次数权重">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.InWeight" :required="true" placeholder="请输入内容,如1,2,4">
                    <template slot="append">用 , 连接(0次,6次,12次)</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeConfigRow(freeAgainWeight, scope.$index)">删除</el-button>
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

      <el-button type="primary" @click="addBuyFreeConfigRow">添加</el-button>
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
            <el-button type="danger" @click="removeBuyFreeConfigRow(scope.$index)">删除</el-button>
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
import { DataRule, ValidateVueItem } from '@/utils/common'
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsGoldMinerExt',
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
      cfg: {},
      freeWeight: [{ MinOdds: 0, MaxOdds: 0, InWeight: '' }],
      freeAgainWeight: [{ MinOdds: 0, MaxOdds: 0, InWeight: '' }],
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      const $this = this
      this.setConfigRow()
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
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
        this.initConfigRow()
      }
    },
    initConfigRow() {
      let freeWeightOdds = this.cfg.FreeWeightOddsV2.split(',')
      let freeWeight = this.cfg.FreeWeight.split(',')
      this.freeWeight = []
      for (let i = 0; i < freeWeightOdds.length / 2; i++) {
        const inWeightGroup = freeWeight.slice(i * 3, i * 3 + 3).join(',')
        this.freeWeight.push({
          MinOdds: freeWeightOdds[i * 2],
          MaxOdds: freeWeightOdds[i * 2 + 1],
          InWeight: inWeightGroup
        })
      }

      freeWeightOdds = this.cfg.FreeAgainWeightOddsV2.split(',')
      freeWeight = this.cfg.FreeAgainWeight.split(',')
      this.freeAgainWeight = []
      for (let i = 0; i < freeWeightOdds.length / 2; i++) {
        const inWeightGroup = freeWeight.slice(i * 3, i * 3 + 3).join(',')
        this.freeAgainWeight.push({
          MinOdds: freeWeightOdds[i * 2],
          MaxOdds: freeWeightOdds[i * 2 + 1],
          InWeight: inWeightGroup
        })
      }
    },
    setConfigRow() {
      let freeWeightOdds = []
      let freeWeight = []
      for (let i = 0; i < this.freeWeight.length; i++) {
        freeWeightOdds.push(this.freeWeight[i].MinOdds)
        freeWeightOdds.push(this.freeWeight[i].MaxOdds)
        freeWeight.push(this.freeWeight[i].InWeight)
      }
      this.cfg.FreeWeightOddsV2 = freeWeightOdds.join(',')
      this.cfg.FreeWeight = freeWeight.join(',')

      freeWeightOdds = []
      freeWeight = []
      for (let i = 0; i < this.freeAgainWeight.length; i++) {
        freeWeightOdds.push(this.freeAgainWeight[i].MinOdds)
        freeWeightOdds.push(this.freeAgainWeight[i].MaxOdds)
        freeWeight.push(this.freeAgainWeight[i].InWeight)
      }
      this.cfg.FreeAgainWeightOddsV2 = freeWeightOdds.join(',')
      this.cfg.FreeAgainWeight = freeWeight.join(',')
    },
    addConfigRow(freeWeight) {
      freeWeight.push({
        MinOdds: 0,
        MaxOdds: 0,
        InWeight: ''
      })
    },
    removeConfigRow(freeWeight, index) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        freeWeight.splice(index, 1)
        console.log('removeConfigRow index', index)
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
    addBuyFreeConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 0, MaxOdds: 0, InWeight: 0 })
    },
    removeBuyFreeConfigRow(index) {
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
