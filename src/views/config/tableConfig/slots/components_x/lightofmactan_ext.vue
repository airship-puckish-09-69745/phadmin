<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="2">
        <el-form ref="form" :model="cfg" label-width="230px">
          <el-form-item label="购买免费倍数" prop="BuyFreeOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.BuyFreeOdds" />
          </el-form-item>
          <el-form-item label="购买超级免费倍数" prop="BuySuperFreeOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.BuySuperFreeOdds" />
          </el-form-item>
          <el-form-item label="普通模式倍率列表">
            <el-input v-model="cfg.NormalMultiple" placeholder="1,2,4,8,...">
              <template slot="append">固定 12 个值</template>
            </el-input>
          </el-form-item>
          <el-form-item label="免费模式倍率列表">
            <el-input v-model="cfg.FreeMultiple" placeholder="8,16,32,...">
              <template slot="append">固定 9 个值</template>
            </el-input>
          </el-form-item>
          <el-form-item label="超级免费倍率列表">
            <el-input v-model="cfg.SuperFreeMultiple" placeholder="32,64,128,...">
              <template slot="append">固定 7 个值</template>
            </el-input>
          </el-form-item>
          <el-form-item label="进入免费模式最小倍率" prop="ScatterOdds" :rules="dataRule(true, { type: 'n' })">
            <el-input v-model.number="cfg.ScatterOdds" />
          </el-form-item>
          <el-form-item label="主模式 2/3/4 轴金框概率">
            <el-input v-model="cfg.GoldRate" placeholder="如 10,20,30">
              <template slot="append">固定 3 个权重</template>
            </el-input>
          </el-form-item>
          <el-form-item label="免费模式 2/3/4 轴金框概率">
            <el-input v-model="cfg.FreeGoldRate" placeholder="如 10,20,30">
              <template slot="append">固定 3 个权重</template>
            </el-input>
          </el-form-item>
          <el-form-item label="免费模式重入概率">
            <el-input v-model.number="cfg.ScatterPlusRate">
              <template slot="append">千分比</template>
            </el-input>
          </el-form-item>
          <el-form-item label="购买免费目标倍率分布">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="如 250,500,70,501,750,50">
              <template slot="append">每 3 个值为一组</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitFrm(false)">保存</el-button>
            <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多App保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="18" :offset="2">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费目标倍率" name="BuyFreeOddsConf">
            <buy-free-odds-table :configs="getConfigs('BuyFreeOddsConf')" @add="showDialog('BuyFreeOddsConf')" @edit="editConfig($event, 'BuyFreeOddsConf')" @remove="removeConfig($event, 'BuyFreeOddsConf')" />
          </el-tab-pane>
          <el-tab-pane label="购买超级免费目标倍率" name="BuySuperFreeOddsConf">
            <buy-free-odds-table :configs="getConfigs('BuySuperFreeOddsConf')" @add="showDialog('BuySuperFreeOddsConf')" @edit="editConfig($event, 'BuySuperFreeOddsConf')" @remove="removeConfig($event, 'BuySuperFreeOddsConf')" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" :close-on-press-escape="false" width="48%">
      <el-form label-width="70px">
        <el-form-item label="Bet值">
          <el-input v-model="dialog.bets" placeholder="如 0.1,0.2">
            <template slot="append">多个 Bet 用逗号分隔</template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addOddsRow">添加倍率范围</el-button>
      <el-table :data="dialog.items">
        <el-table-column label="最小倍率" width="180">
          <template slot-scope="scope"><el-input v-model.number="scope.row.MinOdds" /></template>
        </el-table-column>
        <el-table-column label="最大倍率" width="180">
          <template slot-scope="scope"><el-input v-model.number="scope.row.MaxOdds" /></template>
        </el-table-column>
        <el-table-column label="权重">
          <template slot-scope="scope"><el-input v-model.number="scope.row.InWeight" /></template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope"><el-button type="danger" @click="dialog.items.splice(scope.$index, 1)">删除</el-button></template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
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

const BuyFreeOddsTable = {
  props: {
    configs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    displayBets(row) {
      return (row.Bet || []).map(bet => bet / 1000).join(', ')
    }
  },
  template: `
    <div>
      <el-button type="primary" @click="$emit('add')">添加配置</el-button>
      <el-table :data="configs" style="margin-top: 12px">
        <el-table-column label="Bet值" width="260">
          <template slot-scope="scope">{{ displayBets(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="倍率范围数量">
          <template slot-scope="scope">{{ scope.row.Items ? scope.row.Items.length : 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" @click="$emit('edit', scope.row)">编辑</el-button>
            <el-button type="danger" @click="$emit('remove', scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  `
}

export default {
  name: 'SlotsLightOfMactanExt',
  components: { BuyFreeOddsTable, Compare },
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
      activeTab: 'BuyFreeOddsConf',
      cfg: {},
      dialog: {
        bets: '',
        configKey: 'BuyFreeOddsConf',
        editIndex: -1,
        items: [],
        title: '',
        visible: false
      },
      oldData: JSON.parse(JSON.stringify(this.slotsData)),
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
      this.ensureConfigs('BuyFreeOddsConf')
      this.ensureConfigs('BuySuperFreeOddsConf')
      this.$refs.compare.SetOldVal(this.getDiffData())
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    ensureConfigs(configKey) {
      if (!Array.isArray(this.cfg[configKey])) {
        this.$set(this.cfg, configKey, [])
      }
      return this.cfg[configKey]
    },
    getConfigs(configKey) {
      return this.ensureConfigs(configKey)
    },
    showDialog(configKey) {
      this.dialog = {
        bets: '0',
        configKey,
        editIndex: -1,
        items: [{ MinOdds: 0, MaxOdds: 0, InWeight: 1 }],
        title: configKey === 'BuyFreeOddsConf' ? '添加购买免费目标倍率' : '添加购买超级免费目标倍率',
        visible: true
      }
    },
    editConfig(row, configKey) {
      this.dialog = {
        bets: (row.Bet || []).map(bet => bet / 1000).join(','),
        configKey,
        editIndex: this.ensureConfigs(configKey).indexOf(row),
        items: JSON.parse(JSON.stringify(row.Items || [])),
        title: configKey === 'BuyFreeOddsConf' ? '编辑购买免费目标倍率' : '编辑购买超级免费目标倍率',
        visible: true
      }
    },
    removeConfig(index, configKey) {
      this.ensureConfigs(configKey).splice(index, 1)
    },
    addOddsRow() {
      this.dialog.items.push({ MinOdds: 0, MaxOdds: 0, InWeight: 1 })
    },
    saveOddsConfig() {
      const bets = this.dialog.bets.split(',').map(item => parseFloat(item.trim()) * 1000).filter(item => !isNaN(item) && item >= 0)
      if (bets.length === 0 || this.dialog.items.length === 0) {
        Message.error('请填写 Bet 值和目标倍率范围')
        return
      }
      if (new Set(bets).size !== bets.length || !this.validOddsItems()) {
        return
      }
      const configs = this.ensureConfigs(this.dialog.configKey)
      const usedBets = new Set()
      configs.forEach((config, index) => {
        if (index !== this.dialog.editIndex) {
          const configBets = config.Bet || []
          configBets.forEach(bet => usedBets.add(bet))
        }
      })
      if (bets.some(bet => usedBets.has(bet))) {
        Message.error('同一个目标倍率配置不能包含重复 Bet 值')
        return
      }
      const config = { Bet: bets, Items: this.dialog.items }
      if (this.dialog.editIndex >= 0) {
        this.$set(configs, this.dialog.editIndex, config)
      } else {
        configs.push(config)
      }
      this.dialog.visible = false
    },
    validOddsItems() {
      for (const item of this.dialog.items) {
        if (item.MinOdds < 0 || item.MaxOdds < item.MinOdds || item.InWeight <= 0) {
          Message.error('目标倍率范围或权重不合法')
          return false
        }
      }
      return true
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
