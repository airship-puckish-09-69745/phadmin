<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="2">
        <el-form ref="form" :model="cfg" label-width="220px">
          <el-form-item label="购买免费倍数" prop="BuyFreeOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.BuyFreeOdds" />
          </el-form-item>
          <el-form-item label="额外下注最大 Bet">
            <el-input v-model.number="cfg.ExtraBetMax" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22" :offset="1">
        <el-tabs v-model="activeConfig">
          <el-tab-pane label="普通下注配置" name="NormalConfig"></el-tab-pane>
          <el-tab-pane label="额外下注配置" name="ExtraBetConfig"></el-tab-pane>
        </el-tabs>

        <el-form :model="cfg[activeConfig]" label-width="220px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="倍率列表">
                <el-input v-model="cfg[activeConfig].MultiplierOdds" placeholder="如 1,2,3,5,10" />
              </el-form-item>
              <el-form-item label="倍率颜色列表">
                <el-input v-model="cfg[activeConfig].MultiplierColor" placeholder="与倍率列表一一对应" />
              </el-form-item>
              <el-form-item label="普通模式最小执行倍率">
                <el-input v-model.number="cfg[activeConfig].ScatterOdds" />
              </el-form-item>
              <el-form-item label="普通模式权重">
                <el-input v-model="cfg[activeConfig].ModeWeight" placeholder="普通,转盘,重转,JACKPOT,转盘JACKPOT,重转JACKPOT" />
              </el-form-item>
              <el-form-item label="购买免费模式权重">
                <el-input v-model="cfg[activeConfig].FreeModeWeight" placeholder="普通,转盘,重转,JACKPOT,转盘JACKPOT,重转JACKPOT" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="JACKPOT 类型权重">
                <el-input v-model="cfg[activeConfig].JackpotTypeWeight" placeholder="GRAND,MAJOR,MINOR,MINI" />
              </el-form-item>
              <el-form-item label="JACKPOT 倍率">
                <el-input v-model="cfg[activeConfig].JackpotOdds" placeholder="GRAND,MAJOR,MINOR,MINI" />
              </el-form-item>
              <el-form-item label="JACKPOT 数量权重">
                <el-input v-model="cfg[activeConfig].JackpotCountWeight" placeholder="3 至 9 个 JACKPOT 的权重" />
              </el-form-item>
              <el-form-item label="转盘内圈倍率">
                <el-input v-model="cfg[activeConfig].WheelConfig.InnerOdds" />
              </el-form-item>
              <el-form-item label="转盘内圈权重">
                <el-input v-model="cfg[activeConfig].WheelConfig.InnerWeight" />
              </el-form-item>
              <el-form-item label="转盘外圈倍率">
                <el-input v-model="cfg[activeConfig].WheelConfig.OuterOdds" />
              </el-form-item>
              <el-form-item label="转盘外圈权重">
                <el-input v-model="cfg[activeConfig].WheelConfig.OuterWeight" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider>倍数列配置</el-divider>
        <el-card v-for="group in rowGroups" :key="group.key" class="row-config-card">
          <div slot="header" class="row-config-header">
            <span>{{ group.label }}</span>
            <el-button v-if="!group.required" type="primary" size="mini" @click="addMultiplierRow(group.key)">添加行</el-button>
          </div>
          <el-table :data="cfg[activeConfig][group.key]">
            <el-table-column label="倍数/WHEEL/RESPINS 图标权重">
              <template slot-scope="scope"><el-input v-model="scope.row.IconWeight" /></template>
            </el-table-column>
            <el-table-column label="倍率权重">
              <template slot-scope="scope"><el-input v-model="scope.row.MultiplierWeight" /></template>
            </el-table-column>
            <el-table-column label="彩色倍率概率">
              <template slot-scope="scope"><el-input v-model.number="scope.row.PinkRate"><template slot="append">千分比</template></el-input></template>
            </el-table-column>
            <el-table-column v-if="!group.required" label="操作" width="90">
              <template slot-scope="scope"><el-button type="danger" size="mini" @click="removeMultiplierRow(group.key, scope.$index)">删除</el-button></template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-divider>购买免费目标倍率</el-divider>
        <el-button type="primary" @click="showOddsDialog">添加配置</el-button>
        <el-table :data="cfg[activeConfig].BuyFreeOddsConf" style="margin-top: 12px">
          <el-table-column label="Bet值" width="260">
            <template slot-scope="scope">{{ displayBets(scope.row.Bet) }}</template>
          </el-table-column>
          <el-table-column label="倍率范围数量">
            <template slot-scope="scope">{{ scope.row.Items ? scope.row.Items.length : 0 }}</template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" @click="editOddsConfig(scope.row)">编辑</el-button>
              <el-button type="danger" @click="cfg[activeConfig].BuyFreeOddsConf.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row style="margin-top: 24px">
      <el-col :offset="2">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多App保存</el-button>
      </el-col>
    </el-row>

    <el-dialog :title="oddsDialog.title" :visible.sync="oddsDialog.visible" :close-on-click-modal="false" :close-on-press-escape="false" width="48%">
      <el-form label-width="70px">
        <el-form-item label="Bet值">
          <el-input v-model="oddsDialog.bets" placeholder="如 0.1,0.2"><template slot="append">多个 Bet 用逗号分隔</template></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="oddsDialog.items.push({ MinOdds: 0, MaxOdds: 0, InWeight: 1 })">添加倍率范围</el-button>
      <el-table :data="oddsDialog.items">
        <el-table-column label="最小倍率" width="180"><template slot-scope="scope"><el-input v-model.number="scope.row.MinOdds" /></template></el-table-column>
        <el-table-column label="最大倍率" width="180"><template slot-scope="scope"><el-input v-model.number="scope.row.MaxOdds" /></template></el-table-column>
        <el-table-column label="权重"><template slot-scope="scope"><el-input v-model.number="scope.row.InWeight" /></template></el-table-column>
        <el-table-column label="操作" width="110"><template slot-scope="scope"><el-button type="danger" @click="oddsDialog.items.splice(scope.$index, 1)">删除</el-button></template></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oddsDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveOddsConfig">保存</el-button>
      </span>
    </el-dialog>

    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import { Message } from 'element-ui'
import store from '@/store'

function createMultiplierRow() {
  return { IconWeight: '', MultiplierWeight: '', PinkRate: 0 }
}

function createBetConfig() {
  return {
    BuyFreeOddsConf: [],
    FreeModeWeight: '',
    FreeMultiplierRows: [],
    FreeRespinsMultiplierRows: [],
    JackpotCountWeight: '',
    JackpotOdds: '',
    JackpotTypeWeight: '',
    ModeWeight: '',
    MultiplierColor: '',
    MultiplierOdds: '',
    NormalMultiplierRows: [createMultiplierRow(), createMultiplierRow(), createMultiplierRow()],
    RespinsMultiplierRows: [createMultiplierRow(), createMultiplierRow(), createMultiplierRow()],
    ScatterOdds: 0,
    WheelConfig: { InnerOdds: '', InnerWeight: '', OuterOdds: '', OuterWeight: '' }
  }
}

export default {
  name: 'SlotsTalaReyesSouthSeaPearlsExt',
  components: { Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeConfig: 'NormalConfig',
      cfg: {
        NormalConfig: createBetConfig(),
        ExtraBetConfig: createBetConfig()
      },
      oddsDialog: {
        bets: '',
        editIndex: -1,
        items: [],
        title: '',
        visible: false
      },
      oldData: JSON.parse(JSON.stringify(this.slotsData)),
      rowGroups: [
        { key: 'NormalMultiplierRows', label: '普通模式倍数列', required: true },
        { key: 'RespinsMultiplierRows', label: 'RESPINS 模式倍数列', required: true },
        { key: 'FreeMultiplierRows', label: '免费模式倍数列', required: false },
        { key: 'FreeRespinsMultiplierRows', label: '免费 RESPINS 模式倍数列', required: false }
      ],
      version: store.getters.version || 'V1'
    }
  },
  created() {
    this.$nextTick(() => this.initData())
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    initData() {
      this.cfg = this.slotsData
      if (!this.cfg.NormalConfig) this.$set(this.cfg, 'NormalConfig', createBetConfig())
      if (!this.cfg.ExtraBetConfig) this.$set(this.cfg, 'ExtraBetConfig', createBetConfig())
      this.ensureBetConfig('NormalConfig')
      this.ensureBetConfig('ExtraBetConfig')
      this.$refs.compare.SetOldVal(this.getDiffData())
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    ensureBetConfig(configKey) {
      const config = this.cfg[configKey]
      if (!config.WheelConfig) this.$set(config, 'WheelConfig', { InnerOdds: '', InnerWeight: '', OuterOdds: '', OuterWeight: '' })
      this.rowGroups.forEach(group => {
        if (!Array.isArray(config[group.key])) this.$set(config, group.key, [])
      })
      if (!Array.isArray(config.BuyFreeOddsConf)) this.$set(config, 'BuyFreeOddsConf', [])
    },
    addMultiplierRow(groupKey) {
      this.cfg[this.activeConfig][groupKey].push(createMultiplierRow())
    },
    removeMultiplierRow(groupKey, index) {
      this.cfg[this.activeConfig][groupKey].splice(index, 1)
    },
    displayBets(bets) {
      return (bets || []).map(bet => bet / 1000).join(', ')
    },
    showOddsDialog() {
      this.oddsDialog = {
        bets: '0',
        editIndex: -1,
        items: [{ MinOdds: 0, MaxOdds: 0, InWeight: 1 }],
        title: '添加购买免费目标倍率',
        visible: true
      }
    },
    editOddsConfig(config) {
      this.oddsDialog = {
        bets: this.displayBets(config.Bet),
        editIndex: this.cfg[this.activeConfig].BuyFreeOddsConf.indexOf(config),
        items: JSON.parse(JSON.stringify(config.Items || [])),
        title: '编辑购买免费目标倍率',
        visible: true
      }
    },
    saveOddsConfig() {
      const bets = this.oddsDialog.bets.split(',').map(item => parseFloat(item.trim()) * 1000).filter(item => !isNaN(item) && item >= 0)
      if (bets.length === 0 || this.oddsDialog.items.length === 0 || new Set(bets).size !== bets.length) {
        Message.error('Bet 值或目标倍率范围不合法')
        return
      }
      if (this.oddsDialog.items.some(item => item.MinOdds < 0 || item.MaxOdds < item.MinOdds || item.InWeight <= 0)) {
        Message.error('目标倍率范围或权重不合法')
        return
      }
      const configs = this.cfg[this.activeConfig].BuyFreeOddsConf
      const usedBets = new Set()
      configs.forEach((config, index) => {
        if (index !== this.oddsDialog.editIndex) (config.Bet || []).forEach(bet => usedBets.add(bet))
      })
      if (bets.some(bet => usedBets.has(bet))) {
        Message.error('同一个配置中不能有重复 Bet 值')
        return
      }
      const config = { Bet: bets, Items: this.oddsDialog.items }
      if (this.oddsDialog.editIndex >= 0) {
        this.$set(configs, this.oddsDialog.editIndex, config)
      } else {
        configs.push(config)
      }
      this.oddsDialog.visible = false
    },
    submitFrm(isMultiApp) {
      if (!ValidateVueItem(this.$refs.form)) return
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(isEdit => {
        if (!isEdit) {
          this.$message.error('没有任何修改，不需要提交')
          return
        }
        if (isMultiApp) {
          this.$emit('multiAppSave', this.oldData, this.slotsData)
        } else {
          this.$emit('saveData')
        }
      })
    }
  }
}
</script>

<style scoped>
.row-config-card {
  margin-bottom: 16px;
}

.row-config-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
