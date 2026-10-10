<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col v-if="version === 'V2'" :span="20">
        <el-select v-model="appId" placeholder="请选择" @change="onAppIdChange">
          <el-option v-for="(option, index) in appOptions" :key="index" :label="option.label" :value="option.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-document-copy" @click="onCopyAllCfg">复制配置</el-button>
        <el-button type="primary" icon="el-icon-document-copy" @click="onCopyMultiAppCfg">多App复制</el-button>
      </el-col>
      <el-col :span="24">
        <el-tabs type="border-card" value="base" @tab-click="onShowTab">
          <el-tab-pane label="基础配置" name="base">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(subKey)" :env-empty="false" compare-type="Object" />
            <slots-base-cfg v-if="baseCfgBool" v-model="baseCfg" :odds-str="false" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="符号表配置" name="symbol">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getRuleSubKey())" :env-empty="false" compare-type="Object" />
            <slots-symbol-value v-if="ruleCfgBool" v-model="ruleCfg" @saveData="saveRuleCfg" @multiAppSave="onMultiAppRuleSave" />
          </el-tab-pane>
          <el-tab-pane label="赔付表配置" name="pay_table">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(subKey)" :env-empty="false" compare-type="Object" />
            <slots-pay-table v-if="baseCfgBool" v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" :label-map="labelMap" :start-col="1" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="2套轴图标" name="reels_double">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey(subKey)" :env-empty="false" compare-type="Object" />
            <slots-reels-double v-if="baseCfgBool" v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" />
          </el-tab-pane>
          <el-tab-pane label="扩展配置" name="ext">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getExtSubKey())" :env-empty="false" compare-type="Object" />
            <slots-sweet-bonanza-5000-ext v-if="extCfgBool" v-model="extCfg" @saveData="saveExtCfg" @multiAppSave="onMultiAppExtSave" />
          </el-tab-pane>
          <el-tab-pane label="剧本" name="script">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getRuleSubKey())" :env-empty="false" compare-type="Object" />
            <slots-script v-if="ruleCfgBool" v-model="ruleCfg" :bets="baseCfg.BetListAct" @saveData="saveRuleCfg" @multiAppSave="onMultiAppRuleSave" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <multi-app-select-dialog
      :visible.sync="multiAppDialogVisible"
      :app-options="appOptions"
      :checked-keys.sync="checkedAppKeys"
      :confirm-text="multiAppAction === 'copy' ? '确认复制' : '确认保存'"
      @confirm="confirmMultiAppSave"
    />
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import MultiAppSelectDialog from '@/components/Publish/MultiAppSelectDialog'
import appSlotsConfig from './utils/appSlotsConfig'
import multiAppSlotsConfig from './utils/multiAppSlotsConfig'
import slotsBaseCfg from './components_x/ireland_base_cfg'
import slotsSymbolValue from './components_x/symbol_value'
import slotsPayTable from './components_x/pay_table_rate'
import slotsSweetBonanza5000Ext from './components_x/sweetbonanza5000_ext'
import slotsScript from './components_x/slots_script'
import slotsPayLine from './components_x/pay_line'
import slotsReelsDouble from './components_x/reels_double'
import slotsSymbolcountReels from './components_x/symbolcount_reels.vue'

export default {
  components: {
    Compare,
    MultiAppSelectDialog,
    Publish,
    slotsBaseCfg,
    slotsPayTable,
    slotsScript,
    slotsSymbolValue,
    slotsSweetBonanza5000Ext,
    slotsPayLine,
    slotsReelsDouble,
    slotsSymbolcountReels
  },
  mixins: [appSlotsConfig, multiAppSlotsConfig],
  data() {
    return {
      activeTab: 'base',
      baseCfg: {},
      baseCfgBool: false,
      baseForm: {},
      extCfg: {},
      extCfgBool: false,
      extForm: {},
      ruleCfg: {},
      ruleCfgBool: false,
      ruleForm: {},
      subKey: 'sweetbonanza5000_slots_base',
      labelMap: {
                1: '4个',
                2: '5个',
                3: '6+个',
                4: '8-9个',
                5: '10-11个',
                6: '12+个'
            }
    }
  },
  created() {
    this.getData()
    this.getAppInfos()
  },
  methods: {
    buildBaseCfg(cfg) {
      const betList = cfg.BetList || []
      const betOddsList = cfg.BetOddsList || []
      cfg.Bets = betList.map(item => item / 1000).join(',')
      cfg.OddsStr = betOddsList.map(item => item / 1000).join(',')
      cfg.BetListAct = betList.reduce((bets, bet) => {
        betOddsList.forEach(odds => bets.push(bet * odds / 1000))
        return bets
      }, [])
      return cfg
    },
    saveBaseCfg() {
      this.syncBetOddsList(this.baseCfg)
      return appSlotsConfig.methods.saveBaseCfg.call(this)
    },
    onMultiAppBaseSave(oldData, newData) {
      this.syncBetOddsList(newData)
      return multiAppSlotsConfig.methods.onMultiAppBaseSave.call(this, oldData, newData)
    },
    buildMultiAppCopyPayloads(appId) {
      this.syncBetOddsList(this.baseCfg)
      return multiAppSlotsConfig.methods.buildMultiAppCopyPayloads.call(this, appId)
    },
    syncBetOddsList(cfg) {
      if (cfg.Bets) {
        cfg.BetList = cfg.Bets.split(',').map(item => parseFloat(item) * 1000)
      }
      if (cfg.OddsStr) {
        cfg.BetOddsList = cfg.OddsStr.split(',').map(item => parseFloat(item) * 1000)
      }
    },
    onShowTab(tab) {
      this.activeTab = tab.name
      if (['base', 'pay_table'].includes(this.activeTab)) {
        this.$refs.compare.SetOldVal(this.baseForm.Data)
      } else if (['symbol', 'script'].includes(this.activeTab)) {
        this.$refs.compare.SetOldVal(this.ruleForm.Data)
      } else if (this.activeTab === 'ext') {
        this.$refs.compare.SetOldVal(this.extForm.Data)
      }
    }
  }
}
</script>
