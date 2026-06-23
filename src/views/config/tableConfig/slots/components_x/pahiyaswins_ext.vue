<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">
          <el-form-item label="出现金框符号的概率" prop="GoldenSymbolRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.GoldenSymbolRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得随机倍率的概率" prop="GoldenSymbolOddsRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.GoldenSymbolOddsRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得的倍率范围">
            <el-input v-model="cfg.GoldenSymbolOddsRange" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得的倍率权重">
            <el-input v-model="cfg.GoldenSymbolOddsWeights" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="头行出现金框符号的概率" prop="GoldenSymbolRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.HeadGoldenSymbolRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="头行金框符号获得随机倍率的概率" prop="GoldenSymbolOddsRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.HeadGoldenSymbolOddsRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="头行金框符号获得的倍率范围">
            <el-input v-model="cfg.HeadGoldenSymbolOddsRange" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="头行金框符号获得的倍率权重">
            <el-input v-model="cfg.HeadGoldenSymbolOddsWeights" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="收集符号出现概率" prop="GoldenSymbolOddsRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.CollectSymbolRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买超级免费初始累计倍数范围">
            <el-input v-model="cfg.InitSumMultiOddsRange" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="购买超级免费初始累计倍数权重">
            <el-input v-model="cfg.InitSumMultiOddsWeights" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式额外增加免费的概率" prop="ScatterPlusRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterPlusRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="超级免费模式购买倍数" prop="BuySuperFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuySuperFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="BuyFreeOddsConf">
            <el-button type="primary" @click="showDialog('BuyFreeOddsConf')">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="cfg.BuyFreeOddsConf">
              <el-table-column prop="bet" label="Bet值" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row, 'BuyFreeOddsConf')">{{ scope.row.Bet.map(b => b/1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row, 'BuyFreeOddsConf')">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index, 'BuyFreeOddsConf')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="购买超级免费倍数" name="BuySuperFreeOddsConf">
            <el-button type="primary" @click="showDialog('BuySuperFreeOddsConf')">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="cfg.BuySuperFreeOddsConf">
              <el-table-column prop="bet" label="Bet值" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row, 'BuySuperFreeOddsConf')">{{ scope.row.Bet.map(b => b/1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row, 'BuySuperFreeOddsConf')">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index, 'BuySuperFreeOddsConf')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
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

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import { Message } from 'element-ui'
import store from '@/store'

export default {
  name: 'SlotsPahiyasWinsExt',
  components: { Compare },
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
      activeTab: 'BuyFreeOddsConf',
      buyFreeOddsConf: {
        dialogVisible: false,
        configKey: 'BuyFreeOddsConf',
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: []
      },
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
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
      if (!ValidateVueItem(this.$refs['frm2'])) return false
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
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.ensureBuyFreeConfs('BuyFreeOddsConf')
        this.ensureBuyFreeConfs('BuySuperFreeOddsConf')
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    getBuyFreeConfMeta(configKey) {
      if (configKey === 'BuySuperFreeOddsConf') {
        return {
          listKey: 'BuySuperFreeOddsConf',
          oddsKey: 'BuySuperFreeOdds',
          addTitle: '添加购买超级免费配置',
          editTitle: '编辑购买超级免费配置'
        }
      }
      return {
        listKey: 'BuyFreeOddsConf',
        oddsKey: 'BuyFreeOdds',
        addTitle: '添加购买免费配置',
        editTitle: '编辑购买免费配置'
      }
    },
    ensureBuyFreeConfs(configKey) {
      const meta = this.getBuyFreeConfMeta(configKey)
      if (!this.cfg[meta.listKey]) {
        this.$set(this.cfg, meta.listKey, [])
      }
      return this.cfg[meta.listKey]
    },
    showDialog(configKey) {
      const meta = this.getBuyFreeConfMeta(configKey)
      this.buyFreeOddsConf.configKey = meta.listKey
      this.buyFreeOddsConf.dialogTitle = meta.addTitle
      this.buyFreeOddsConf.currentBet = '0'
      this.buyFreeOddsConf.currentConf = [{ MinOdds: 0, MaxOdds: 0, InWeight: 0 }]
      this.buyFreeOddsConf.editIndex = -1
      this.buyFreeOddsConf.dialogVisible = true
    },
    editConfig(row, configKey) {
      const meta = this.getBuyFreeConfMeta(configKey)
      const confs = this.ensureBuyFreeConfs(meta.listKey)
      this.buyFreeOddsConf.configKey = meta.listKey
      this.buyFreeOddsConf.dialogTitle = meta.editTitle
      this.buyFreeOddsConf.currentBet = row.Bet.map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items))
      this.buyFreeOddsConf.editIndex = confs.findIndex(item => item === row)
      this.buyFreeOddsConf.dialogVisible = true
    },
    addConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 0, MaxOdds: 0, InWeight: 0 })
    },
    removeConfigRow(index) {
      this.buyFreeOddsConf.currentConf.splice(index, 1)
    },
    removeConfig(index, configKey) {
      this.ensureBuyFreeConfs(configKey).splice(index, 1)
    },
    saveConfig() {
      const currentBets = this.buyFreeOddsConf.currentBet
        .split(',')
        .map(b => parseFloat(b.trim()) * 1000)
        .filter(b => !isNaN(b))

      if (this.checkBuyFreeOdds(currentBets) === false) {
        return
      }
      const confs = this.ensureBuyFreeConfs(this.buyFreeOddsConf.configKey)
      if (this.buyFreeOddsConf.editIndex >= 0) {
        this.$set(confs, this.buyFreeOddsConf.editIndex, {
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      } else {
        confs.push({
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      }
      this.buyFreeOddsConf.dialogVisible = false
    },
    checkBuyFreeOdds(currentBets) {
      const meta = this.getBuyFreeConfMeta(this.buyFreeOddsConf.configKey)
      const confs = this.ensureBuyFreeConfs(meta.listKey)
      let weightTotal = 0
      const existingBets = new Set()
      // 排除正在编辑的项（如果是编辑模式）
      confs.forEach((item, index) => {
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
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg[meta.oddsKey] / this.baseBet * 100
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
      const meta = this.getBuyFreeConfMeta(this.buyFreeOddsConf.configKey)
      // rtp
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg[meta.oddsKey] / this.baseBet * 100
      }
      Message.info(`当前RTP(${rtp})`)
    },
    scaleDown(value, power) {
      if (value) {
        return value.split(',').map(val => (parseFloat(val) / power).toString()).join(',')
      }
      return ''
    },
    scaleUp(value, power) {
      if (value) {
        return value.split(',').map(val => (parseFloat(val) * power).toString()).join(',')
      }
      return ''
    }
  }
}
</script>
