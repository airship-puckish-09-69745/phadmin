<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col v-if="version === 'V2'" :span="20">
        <el-select v-model="appId" placeholder="请选择" @change="onAppIdChange">
          <el-option v-for="(o,idx) in appOptions" :key="idx" :label="o.label" :value="o.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-document-copy" @click="onCopyAllCfg">
          复制配置
        </el-button>
        <el-button type="primary" icon="el-icon-document-copy" @click="onCopyMultiAppCfg">
          多App复制
        </el-button>
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
          <el-tab-pane label="5套轴图标" name="reels_double">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey(subKey)" :env-empty="false" compare-type="Object" />
            <slots-reels-double v-if="baseCfgBool" v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="拓展配置" name="scatter">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getExtSubKey())" :env-empty="false" compare-type="Object" />
            <slots-moneycoming-ext v-if="extCfgBool" v-model="extCfg" @saveData="saveExtCfg" @multiAppSave="onMultiAppExtSave" />
          </el-tab-pane>
          <el-tab-pane label="bonus配置" name="bonus">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getExtSubKey())" :env-empty="false" compare-type="Object" />
            <slots-moneycoming-bonus-ext v-if="extCfgBool" v-model="extCfg" @saveData="saveExtCfg" @multiAppSave="onMultiAppExtSave" />
          </el-tab-pane>
          <el-tab-pane label="剧本" name="script">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey(getRuleSubKey())" :env-empty="false" compare-type="Object" />
            <slots-script v-if="ruleCfgBool" v-model="ruleCfg" :bets="baseCfg.BetListAct" @saveData="saveRuleCfg" @multiAppSave="onMultiAppRuleSave" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!--对比组件-->
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
import slotsPayLine from './components_x/pay_line'
import slotsPayTable from './components_x/pay_table_rate'
import slotsReelsIcon from './components_x/aladdin_reels_icon'
import slotsMoneycomingExt from './components_x/moneycoming_ext.vue'
import SlotsMoneycomingBonusExt from './components_x/moneycoming_bonus_ext.vue'
import slotsBigWinnerCfg from './components_x/big_winner_cfg'
import slotsVup from './components_x/slots_vup'
import slotsReelsDouble from './components_x/reels_double'
import slotsScript from './components_x/slots_script'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { MultiAppSelectDialog, Compare, Publish, slotsBaseCfg, slotsSymbolValue, slotsPayLine, slotsPayTable, slotsReelsIcon, slotsMoneycomingExt, SlotsMoneycomingBonusExt, slotsBigWinnerCfg, slotsVup, slotsReelsDouble, slotsScript },
  mixins: [appSlotsConfig, multiAppSlotsConfig],
  data() {
    return {
      activeTab: 'base',
      baseCfg: {},
      baseCfgBool: false,
      ruleCfg: {},
      ruleCfgBool: false,
      extCfg: {},
      extCfgBool: false,
      baseForm: {},
      ruleForm: {},
      extForm: {},
      subKey: 'moneycoming_slots_base'
    }
  },
  created() {
    this.getData()
    this.getAppInfos()
  },
  methods: {
    onShowTab(tab) {
      this.activeTab = tab.name
      // 设置修改之前数据
      if (this.activeTab === 'base' || this.activeTab === 'pay_table' || this.activeTab === 'reels' || this.activeTab === 'reels_double') {
        this.$refs.compare.SetOldVal(this.baseForm.Data)
      } else if (this.activeTab === 'symbol' || this.activeTab === 'pay_line' || this.activeTab === 'script') {
        this.$refs.compare.SetOldVal(this.ruleForm.Data)
      } else if (this.activeTab === 'scatter' || this.activeTab === 'bonus') {
        this.$refs.compare.SetOldVal(this.extForm.Data)
      }
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
