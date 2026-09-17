<template>
  <div>
    <el-row :gutter="10" style="margin-top: 20px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm" :model="config" label-width="230px">
          <el-form-item label="额外倍数配置">
            <el-input v-model="config.MultiplierOdds" disabled placeholder="请输入内容,如1,2,3,5,10,15,20,25,50,100,200,500">
              <template slot="append">用,连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="倍数颜色配置">
            <el-input v-model="config.MultiplierColor" placeholder="请输入内容,如2,2,2,3,3,5,5,4,4,5,5">
              <template slot="append">长度需和公共倍数一致，1彩色，2/3/4/5普通颜色</template>
            </el-input>
          </el-form-item>

          <el-form-item label="进入特殊模式赔率" prop="ScatterOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="config.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="">
            模式权重顺序：普通,WHEEL,RESPINS,JACKPOT,WHEEL&amp;JACKPOT,RESPINS&amp;JACKPOT
          </el-form-item>

          <el-form-item label="模式权重">
            <el-input v-model="config.ModeWeight" placeholder="请输入内容,如100,100,100,100,100,100">
              <template slot="append">用,连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式权重">
            <el-input v-model="config.FreeModeWeight" placeholder="请输入内容,如100,100,100,100,100,100">
              <template slot="append">用,连接</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="18" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="buy_free">
            <el-button type="primary" @click="showDialog">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="config.BuyFreeOddsConf">
              <el-table-column prop="bet" label="Bet值" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row, scope.$index)">{{ scope.row.Bet.map(b => b / 1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row, scope.$index)">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="普通额外倍数" name="normal_multi">
            <el-table :data="config.NormalMultiplierRows">
              <el-table-column prop="IconWeight" label="图标权重（固定顺序：倍数,WHEEL,RESPINS）">
                <template slot-scope="scope"><el-input v-model="scope.row.IconWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="MultiplierWeight" label="倍数权重">
                <template slot-scope="scope"><el-input v-model="scope.row.MultiplierWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="PinkRate" label="彩色倍数概率(‰)" width="180">
                <template slot-scope="scope"><el-input v-model.number="scope.row.PinkRate" :disabled="true" /></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="普通ReSpins倍数" name="respins_multi">
            <el-table :data="config.RespinsMultiplierRows">
              <el-table-column prop="IconWeight" label="图标权重（固定顺序：倍数,WHEEL,RESPINS）">
                <template slot-scope="scope"><el-input v-model="scope.row.IconWeight" placeholder="100,100,100" disabled /></template>
              </el-table-column>
              <el-table-column prop="MultiplierWeight" label="倍数权重">
                <template slot-scope="scope"><el-input v-model="scope.row.MultiplierWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="PinkRate" label="彩色倍数概率(‰)" width="180">
                <template slot-scope="scope"><el-input v-model.number="scope.row.PinkRate" /></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="购买免费额外倍数" name="free_multi">
            <el-table :data="config.FreeMultiplierRows">
              <el-table-column prop="IconWeight" label="图标权重（固定顺序：倍数,WHEEL,RESPINS）">
                <template slot-scope="scope"><el-input v-model="scope.row.IconWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="MultiplierWeight" label="倍数权重">
                <template slot-scope="scope"><el-input v-model="scope.row.MultiplierWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="PinkRate" label="彩色倍数概率(‰)" width="180">
                <template slot-scope="scope"><el-input v-model.number="scope.row.PinkRate" :disabled="true" /></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="购买免费ReSpins倍数" name="free_respins_multi">
            <el-table :data="config.FreeRespinsMultiplierRows">
              <el-table-column prop="IconWeight" label="图标权重（固定顺序：倍数,WHEEL,RESPINS）">
                <template slot-scope="scope"><el-input v-model="scope.row.IconWeight" placeholder="100,100,100" disabled /></template>
              </el-table-column>
              <el-table-column prop="MultiplierWeight" label="倍数权重">
                <template slot-scope="scope"><el-input v-model="scope.row.MultiplierWeight" placeholder="100,100,100" /></template>
              </el-table-column>
              <el-table-column prop="PinkRate" label="彩色倍数概率(‰)" width="180">
                <template slot-scope="scope"><el-input v-model.number="scope.row.PinkRate" /></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="Wheel配置" name="wheel">
            <el-form :model="config.WheelConfig" label-width="230px">
              <el-form-item label="内圈bet倍数">
                <el-input v-model="config.WheelConfig.InnerOdds" disabled placeholder="请输入内容,如1,3,5,8,10,15,20,30,50,100,200,1000">
                  <template slot="append">用,连接</template>
                </el-input>
              </el-form-item>
              <el-form-item label="内圈权重">
                <el-input v-model="config.WheelConfig.InnerWeight" placeholder="请输入内容,如100,100,100,100,100,100,100,100,100,100,100,100">
                  <template slot="append">长度需和内圈bet倍数一致</template>
                </el-input>
              </el-form-item>
              <el-form-item label="外圈翻倍倍数">
                <el-input v-model="config.WheelConfig.OuterOdds" disabled placeholder="请输入内容,如1,2,3,5,10">
                  <template slot="append">用,连接</template>
                </el-input>
              </el-form-item>
              <el-form-item label="外圈权重">
                <el-input v-model="config.WheelConfig.OuterWeight" placeholder="请输入内容,如100,100,100,100,100">
                  <template slot="append">长度需和外圈翻倍倍数一致</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="JP配置" name="jackpot">
            <el-form :model="config" label-width="230px">
              <el-form-item label="JACKPOT倍数">
                <el-input v-model="config.JackpotOdds" disabled placeholder="请输入内容,如100,50,30,10">
                  <template slot="append">固定顺序：GRAND,MAJOR,MINOR,MINI</template>
                </el-input>
              </el-form-item>
              <el-form-item label="JACKPOT类型权重">
                <el-input v-model="config.JackpotTypeWeight" placeholder="请输入内容,如100,100,100,100">
                  <template slot="append">固定顺序：GRAND,MAJOR,MINOR,MINI</template>
                </el-input>
              </el-form-item>
              <el-form-item label="JACKPOT数量权重">
                <el-input v-model="config.JackpotCountWeight" placeholder="请输入内容,如100,100,100,100,100,100,100">
                  <template slot="append">固定顺序：3~9个</template>
                </el-input>
              </el-form-item>
            </el-form>
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
            <template slot="append">用,连接</template>
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
        <el-table-column prop="MaxOdds" label="]目标倍数结束" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如50" />
          </template>
        </el-table-column>
        <el-table-column prop="InWeight" label="倍数范围权重">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.InWeight" :required="true" placeholder="请输入内容,如100" />
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
  </div>
</template>

<script>
import { DataRule, ValidateVueItem } from '@/utils/common'
import { Message } from 'element-ui'

export default {
  name: 'TalaReyesSouthSeaPearlsBetConfig',
  props: {
    config: {
      type: Object,
      default: function() {
        return {}
      }
    },
    buyFreeOdds: {
      type: Number,
      default: 0
    },
    baseBet: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeTab: 'buy_free',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        editIndex: -1,
        dialogTitle: '添加配置',
        currentConf: []
      }
    }
  },
  methods: {
    validate() {
      return ValidateVueItem(this.$refs['frm'])
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    showDialog() {
      this.buyFreeOddsConf.dialogTitle = '添加配置'
      this.buyFreeOddsConf.currentBet = '0'
      this.buyFreeOddsConf.currentConf = [{ MinOdds: 1, MaxOdds: 100, InWeight: 100 }]
      this.buyFreeOddsConf.editIndex = -1
      this.buyFreeOddsConf.dialogVisible = true
    },
    editConfig(row, index) {
      this.buyFreeOddsConf.dialogTitle = '编辑配置'
      this.buyFreeOddsConf.currentBet = row.Bet.map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items))
      this.buyFreeOddsConf.editIndex = index
      this.buyFreeOddsConf.dialogVisible = true
    },
    addConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 1, MaxOdds: 100, InWeight: 100 })
    },
    removeConfigRow(index) {
      this.buyFreeOddsConf.currentConf.splice(index, 1)
    },
    removeConfig(index) {
      this.config.BuyFreeOddsConf.splice(index, 1)
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
        this.$set(this.config.BuyFreeOddsConf, this.buyFreeOddsConf.editIndex, {
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      } else {
        this.config.BuyFreeOddsConf.push({
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      }
      this.buyFreeOddsConf.dialogVisible = false
    },
    checkBuyFreeOdds(currentBets) {
      let weightTotal = 0
      const existingBets = new Set()
      if (!this.config.BuyFreeOddsConf) {
        this.$set(this.config, 'BuyFreeOddsConf', [])
      }
      this.config.BuyFreeOddsConf.forEach((item, index) => {
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

      for (const item of this.buyFreeOddsConf.currentConf) {
        if (item.MinOdds > item.MaxOdds) {
          Message.error(`目标倍数开始(${item.MinOdds})不能大于目标倍数结束(${item.MaxOdds})`)
          return false
        }
        weightTotal += item.InWeight
      }

      const rtp = this.calcBuyFreeOddsRtp(weightTotal)
      if (rtp >= 100) {
        Message.error(`当前RTP(${rtp})大于等于100%`)
        return false
      }
      return true
    },
    calcBuyFreeOddsRtp(weightTotal) {
      if (!weightTotal || !this.buyFreeOdds || !this.baseBet) {
        return 0
      }
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.buyFreeOdds / this.baseBet * 100
      }
      return rtp
    },
    buyFreeOddsRtp() {
      let weightTotal = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        weightTotal += item.InWeight
      }
      Message.info(`当前RTP(${this.calcBuyFreeOddsRtp(weightTotal)})`)
    }
  }
}
</script>
