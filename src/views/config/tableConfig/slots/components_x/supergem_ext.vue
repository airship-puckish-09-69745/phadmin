<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">
          <el-form-item label="普通模式中奖倍数">
            <el-input v-model="cfg.MultiStr" placeholder="请输入内容,如1,2,3,5,7"><template slot="append">用 , 连接</template></el-input>
          </el-form-item>
          <el-form-item label="普通模式中奖倍数权重">
            <el-input v-model="cfg.MultiStrWeight" placeholder="请输入内容,如0,10,10,10,10"><template slot="append">用 , 连接</template></el-input>
          </el-form-item>
          <el-form-item label="免费模式中奖倍数">
            <el-input v-model="cfg.FreeMultiStr" placeholder="请输入内容,如2,4,6,8,10"><template slot="append">用 , 连接</template></el-input>
          </el-form-item>
          <el-form-item label="免费模式中奖倍数权重">
            <el-input v-model="cfg.FreeMultiStrWeight" placeholder="请输入内容,如0,10,10,10,10"><template slot="append">用 , 连接</template></el-input>
          </el-form-item>
          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>
          <el-form-item label="进入免费模式的最小赔付" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>
          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"><template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template></el-input>
          </el-form-item>
          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如500"><template slot="append">‰</template></el-input>
          </el-form-item>
          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如50,500,70,501,750,50"><template slot="append">三个值一组用 , 连接。</template></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="buyFreeOdds">
            <el-button type="primary" @click="showBuyFreeOddsDialog">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="cfg.BuyFreeOddsConf || []">
              <el-table-column label="Bet值" width="160">
                <template slot-scope="scope">
                  <el-button type="text" @click="editBuyFreeOddsConfig(scope.row)">{{ scope.row.Bet.map(b => b / 1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editBuyFreeOddsConfig(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="removeBuyFreeOddsConfig(scope.$index)">删除</el-button>
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

      <el-button type="primary" @click="addBuyFreeOddsConfigRow">添加</el-button>
      <el-button type="primary" @click="showBuyFreeOddsRtp">检测RTP</el-button>
      <el-table :data="buyFreeOddsConf.currentConf">
        <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="MaxOdds" label="]目标倍数结束" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="InWeight" label="倍数范围权重">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.InWeight" :required="true" placeholder="请输入内容,如4" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" @click="removeBuyFreeOddsConfigRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="buyFreeOddsConf.dialogVisible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="saveBuyFreeOddsConfig">保存</el-button>
      </span>
    </el-dialog>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>

    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  name: 'SlotsSuperGemExt',
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
    baseBet: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cfg: {},
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData)),
      activeTab: 'buyFreeOdds',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: [],
        editIndex: -1
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
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      if (!ValidateVueItem(this.$refs.frm2)) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }
        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
        $this.lock = false
      })
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    showBuyFreeOddsDialog() {
      this.buyFreeOddsConf.dialogTitle = '添加配置'
      this.buyFreeOddsConf.currentBet = '0'
      this.buyFreeOddsConf.currentConf = [{ MinOdds: 0, MaxOdds: 0, InWeight: 0 }]
      this.buyFreeOddsConf.editIndex = -1
      this.buyFreeOddsConf.dialogVisible = true
    },
    editBuyFreeOddsConfig(row) {
      this.buyFreeOddsConf.dialogTitle = '编辑配置'
      this.buyFreeOddsConf.currentBet = row.Bet.map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items))
      this.buyFreeOddsConf.editIndex = (this.cfg.BuyFreeOddsConf || []).indexOf(row)
      this.buyFreeOddsConf.dialogVisible = true
    },
    addBuyFreeOddsConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 0, MaxOdds: 0, InWeight: 0 })
    },
    removeBuyFreeOddsConfigRow(index) {
      this.buyFreeOddsConf.currentConf.splice(index, 1)
    },
    removeBuyFreeOddsConfig(index) {
      this.cfg.BuyFreeOddsConf.splice(index, 1)
    },
    saveBuyFreeOddsConfig() {
      const currentBets = this.parseBuyFreeOddsBets()
      if (!currentBets || !this.checkBuyFreeOddsConfig(currentBets)) return

      if (!this.cfg.BuyFreeOddsConf) this.$set(this.cfg, 'BuyFreeOddsConf', [])
      const config = {
        Bet: currentBets,
        Items: this.buyFreeOddsConf.currentConf
      }
      if (this.buyFreeOddsConf.editIndex >= 0) {
        this.$set(this.cfg.BuyFreeOddsConf, this.buyFreeOddsConf.editIndex, config)
      } else {
        this.cfg.BuyFreeOddsConf.push(config)
      }
      this.buyFreeOddsConf.dialogVisible = false
    },
    parseBuyFreeOddsBets() {
      const betSet = new Set()
      const currentBets = []
      const betTexts = this.buyFreeOddsConf.currentBet.split(',')
      for (const betText of betTexts) {
        const value = betText.trim()
        const bet = Number(value)
        const scaledBet = bet * 1000
        if (!value || !Number.isFinite(bet) || bet < 0 || !Number.isInteger(scaledBet)) {
          Message.error('Bet值必须是大于等于0且最多三位小数的数字')
          return null
        }
        if (betSet.has(scaledBet)) {
          Message.error(`配置中存在重复的${bet}Bet值`)
          return null
        }
        betSet.add(scaledBet)
        currentBets.push(scaledBet)
      }
      return currentBets
    },
    checkBuyFreeOddsConfig(currentBets) {
      const existingBets = new Set()
      const configs = this.cfg.BuyFreeOddsConf || []
      configs.forEach((item, index) => {
        if (this.buyFreeOddsConf.editIndex !== index) {
          item.Bet.forEach(bet => existingBets.add(bet))
        }
      })
      for (const bet of currentBets) {
        if (existingBets.has(bet)) {
          Message.error(`已经存在相同的${bet / 1000}Bet值`)
          return false
        }
      }

      if (!this.checkBuyFreeOddsRanges()) return false
      const rtp = this.getBuyFreeOddsRtp()
      if (rtp >= 100) {
        Message.error(`当前RTP(${rtp})大于等于100%`)
        return false
      }
      return true
    },
    getBuyFreeOddsRtp() {
      const weightTotal = this.buyFreeOddsConf.currentConf.reduce((total, item) => total + Number(item.InWeight), 0)
      return this.buyFreeOddsConf.currentConf.reduce((rtp, item) => {
        return rtp + (Number(item.MinOdds) + Number(item.MaxOdds)) / 2 * Number(item.InWeight) / weightTotal / Number(this.cfg.BuyFreeOdds) / Number(this.baseBet) * 100
      }, 0)
    },
    showBuyFreeOddsRtp() {
      const currentBets = this.parseBuyFreeOddsBets()
      if (!currentBets || !this.checkBuyFreeOddsRanges()) return
      Message.info(`当前RTP(${this.getBuyFreeOddsRtp()})`)
    },
    checkBuyFreeOddsRanges() {
      let weightTotal = 0
      if (this.buyFreeOddsConf.currentConf.length === 0) {
        Message.error('请至少配置一组目标倍数范围')
        return false
      }
      for (const item of this.buyFreeOddsConf.currentConf) {
        const minOdds = Number(item.MinOdds)
        const maxOdds = Number(item.MaxOdds)
        const inWeight = Number(item.InWeight)
        if (!Number.isFinite(minOdds) || !Number.isFinite(maxOdds) || minOdds <= 0 || maxOdds <= 0) {
          Message.error('目标倍数必须大于0')
          return false
        }
        if (minOdds > maxOdds) {
          Message.error(`目标倍数开始(${minOdds})不能大于目标倍数结束(${maxOdds})`)
          return false
        }
        if (!Number.isFinite(inWeight) || inWeight < 0) {
          Message.error('倍数范围权重必须是大于等于0的数字')
          return false
        }
        weightTotal += inWeight
      }
      if (weightTotal <= 0) {
        Message.error('倍数范围权重总和必须大于0')
        return false
      }
      const buyFreeOdds = Number(this.cfg.BuyFreeOdds)
      const baseBet = Number(this.baseBet)
      if (buyFreeOdds <= 0 || baseBet <= 0) {
        Message.error('免费模式购买倍数和基础投注必须大于0')
        return false
      }
      return true
    }
  }
}
</script>
