<template>
  <div>
    <el-row :gutter="10" style="margin-top: 20px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm" :model="config" label-width="230px">
          <el-form-item label="公共倍数配置" prop="MultiplierOdds" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.MultiplierOdds" placeholder="请输入内容,如1,2,3,5,10">
              <template slot="append">用,连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="倍数颜色配置" prop="MultiplierColor" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.MultiplierColor" placeholder="请输入内容,如2,2,2,3,3,5,5">
              <template slot="append">长度需和公共倍数一致，1彩色，2/3/4/5普通颜色</template>
            </el-input>
          </el-form-item>

          <el-form-item label="进入特殊模式(NUDGE)赔率" prop="ScatterOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="config.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="">
            模式权重顺序：普通,NUDGE
          </el-form-item>

          <el-form-item label="模式权重" prop="ModeWeight" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.ModeWeight" placeholder="请输入内容,如100,100">
              <template slot="append">长度必须为3：普通,NUDGE,免费</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式权重" prop="FreeModeWeight" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.FreeModeWeight" placeholder="请输入内容,如100,100">
              <template slot="append">长度必须为2：普通,NUDGE</template>
            </el-input>
          </el-form-item>

          <el-form-item label="NUDGE数量权重" prop="NudgeCountWeight" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.NudgeCountWeight" placeholder="请输入内容,如100,100,100">
              <template slot="append">长度需和NudgeCountConfig一致</template>
            </el-input>
          </el-form-item>

          <el-form-item label="免费NUDGE数量权重" prop="FreeNudgeCountWeight" :rules="dataRule(true, { type: 's' })">
            <el-input v-model="config.FreeNudgeCountWeight" placeholder="请输入内容,如100,100,100">
              <template slot="append">长度需和NudgeCountConfig一致</template>
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
                  <el-button type="text" @click="editConfig(scope.row, scope.$index)">{{ (scope.row.Bet || []).map(b => b / 1000).join(', ') }}</el-button>
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

          <el-tab-pane label="普通倍数配置" name="normal_multi">
            <multiplier-row-editor
              v-if="config.NormalMultiplierRows"
              :row="config.NormalMultiplierRows"
              tip="普通模式倍数列配置"
            />
          </el-tab-pane>

          <el-tab-pane label="NUDGE倍数配置" name="nudge_multi">
            <multiplier-row-editor
              v-if="config.NudgeMultiplierRows"
              :row="config.NudgeMultiplierRows"
              tip="NUDGE 模式倍数列配置（图标固定为倍数）"
            />
          </el-tab-pane>

          <el-tab-pane label="购买免费倍数配置" name="free_multi">
            <multiplier-row-editor
              v-if="config.FreeMultiplierRows"
              :row="config.FreeMultiplierRows"
              tip="免费模式倍数列配置，为空时使用普通模式倍数列配置"
            />
          </el-tab-pane>

          <el-tab-pane label="购买免费NUDGE倍数配置" name="free_nudge_multi">
            <multiplier-row-editor
              v-if="config.FreeNudgeMultiplierRows"
              :row="config.FreeNudgeMultiplierRows"
              tip="免费 NUDGE 模式倍数列配置，为空时使用NUDGE模式倍数列配置"
            />
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
import MultiplierRowEditor from './sarimanokfortune_multiplier_row'

function splitLen(value) {
  if (value === undefined || value === null || value === '') {
    return 0
  }
  return value.toString().split(',').filter(item => item.trim() !== '').length
}

export default {
  name: 'SarimanokFortuneBetConfig',
  components: { MultiplierRowEditor },
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
    },
    // 对应 ExtConfig.NudgeCountConfig，用于校验 NUDGE 数量权重长度
    nudgeCountConfig: {
      type: String,
      default: ''
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    validate() {
      if (!ValidateVueItem(this.$refs['frm'])) {
        return false
      }
      const oddsLen = splitLen(this.config.MultiplierOdds)
      if (oddsLen === 0) {
        Message.error('公共倍数配置不能为空')
        return false
      }
      if (splitLen(this.config.MultiplierColor) !== oddsLen) {
        Message.error('倍数颜色配置长度需和公共倍数一致')
        return false
      }
      if (splitLen(this.config.ModeWeight) !== 3) {
        Message.error('模式权重长度必须为3（普通,NUDGE,免费）')
        return false
      }
      if (splitLen(this.config.FreeModeWeight) !== 2) {
        Message.error('购买免费模式权重长度必须为2（普通,NUDGE）')
        return false
      }
      const nudgeLen = splitLen(this.nudgeCountConfig)
      if (nudgeLen > 0 && splitLen(this.config.NudgeCountWeight) !== nudgeLen) {
        Message.error('NUDGE数量权重长度需和NudgeCountConfig一致')
        return false
      }
      if (nudgeLen > 0 && splitLen(this.config.FreeNudgeCountWeight) !== nudgeLen) {
        Message.error('免费NUDGE数量权重长度需和NudgeCountConfig一致')
        return false
      }
      if (!this.checkRow('普通倍数配置', this.config.NormalMultiplierRows, oddsLen)) return false
      if (!this.checkRow('NUDGE倍数配置', this.config.NudgeMultiplierRows, oddsLen)) return false
      if (!this.checkRow('购买免费倍数配置', this.config.FreeMultiplierRows, oddsLen, true)) return false
      if (!this.checkRow('购买免费NUDGE倍数配置', this.config.FreeNudgeMultiplierRows, oddsLen, true)) return false
      return true
    },
    checkRow(name, row, oddsLen, optional = false) {
      if (!row) {
        if (optional) return true
        Message.error(name + '不能为空')
        return false
      }
      const iconLen = splitLen(row.IconWeight)
      const weightLen = splitLen(row.MultiplierWeight)
      if (iconLen === 0 && weightLen === 0 && optional) {
        return true
      }
      if (iconLen !== 2) {
        Message.error(name + '图标权重必须为2个权重（倍数,NUDGE）')
        return false
      }
      if (weightLen !== oddsLen) {
        Message.error(name + '倍数权重长度需和公共倍数一致')
        return false
      }
      return true
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
      this.buyFreeOddsConf.currentBet = (row.Bet || []).map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items || []))
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
          (item.Bet || []).forEach(bet => existingBets.add(bet))
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
