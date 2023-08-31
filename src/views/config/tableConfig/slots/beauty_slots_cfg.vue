<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-tabs type="border-card" value="base" @tab-click="onShowTab">
          <el-tab-pane label="基础配置" name="base">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-base-cfg v-if="baseCfgLoaded" v-model="baseCfg" @saveData="saveBaseCfg" />
          </el-tab-pane>
          <el-tab-pane label="符号表配置" name="symbol">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_rule')" :env-empty="false" compare-type="Object" />
            <slots-symbol-value v-model="ruleCfg" @saveData="saveRuleCfg" />
          </el-tab-pane>
          <el-tab-pane label="支付线配置" name="pay_line">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_rule')" :env-empty="false" compare-type="Object" />
            <slots-pay-line v-model="ruleCfg" :rows="baseCfg.Rows" :cols="baseCfg.Clos" @saveData="saveRuleCfg" />
          </el-tab-pane>
          <el-tab-pane label="赔付线配置" name="pay_table">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-pay-table v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" />
          </el-tab-pane>
          <el-tab-pane label="轴图标配置" name="reels">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-reels-icon v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" />
          </el-tab-pane>
          <el-tab-pane label="2套轴图标" name="reels_double">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-reels-double v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" />
          </el-tab-pane>
          <el-tab-pane label="Jackpot配置" name="jackpot">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_ext')" :env-empty="false" compare-type="Object" />
            <slots-jackpot v-model="extCfg" @saveData="saveExtCfg" />
          </el-tab-pane>
          <el-tab-pane label="Bonus小游戏配置" name="bonus">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_ext')" :env-empty="false" compare-type="Object" />
            <slots-bonus-game v-model="extCfg" @saveData="saveExtCfg" />
          </el-tab-pane>
          <el-tab-pane label="Wild额外倍率配置" name="wild">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_ext')" :env-empty="false" compare-type="Object" />
            <slots-wild-cfg v-model="extCfg" @saveData="saveExtCfg" />
          </el-tab-pane>
          <el-tab-pane label="剧本" name="script">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('beauty_slots_rule')" :env-empty="false" compare-type="Object" />
            <slots-script v-if="ruleBool" v-model="ruleCfg" :bets="baseCfg.BetList" @saveData="saveRuleCfg" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import slotsBaseCfg from './components_x/base_cfg'
import slotsSymbolValue from './components_x/symbol_value'
import slotsPayLine from './components_x/pay_line'
import slotsPayTable from './components_x/pay_table_rate'
import slotsReelsIcon from './components_x/reels_icon'
import slotsJackpot from './beauty/jackpot'
import slotsBonusGame from './beauty/bonus_game'
import slotsWildCfg from './beauty/wild'
import slotsReelsDouble from './components_x/reels_double'
import slotsScript from './components_x/slots_script'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, slotsBaseCfg, slotsSymbolValue, slotsPayLine, slotsPayTable, slotsReelsIcon, slotsJackpot, slotsBonusGame, slotsWildCfg, slotsReelsDouble, slotsScript },
  data() {
    return {
      activeTab: 'base',
      baseCfg: {},
      ruleCfg: {},
      ruleBool: false,
      extCfg: {},
      extBool: false,
      baseForm: {},
      ruleForm: {},
      extForm: {},
      txt: '',
      baseCfgLoaded: false,
      subKey: 'beauty_slots_base'
    }
  },

  created() {
    this.getData()
  },
  methods: {
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.baseForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            const BetList = []
            for (const k in cfg.BetList) {
              BetList[k] = cfg.BetList[k] / 1000
            }
            cfg.Bets = BetList.join(',')
            this.baseCfg = cfg
            this.baseCfgLoaded = true
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })

      // 加载规则配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'beauty_slots_rule'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.ruleForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.ruleCfg = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
            this.ruleBool = true
          }
        }
      })

      // 加载扩展配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'beauty_slots_ext'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.extCfg = JSON.parse(response.Data.Data)
            console.log('ext cfg', this.extCfg)
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
            this.extBool = true
          }
        }
      })
    },

    saveBaseCfg() {
      if (this.baseCfg.Bets) {
        const bets = this.baseCfg.Bets.split(',')
        this.baseCfg.BetList = []
        for (const i in bets) {
          this.baseCfg.BetList.push(parseFloat(bets[i]) * 1000)
        }
      }
      this.baseForm.Data = JSON.stringify(this.baseCfg)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.baseForm
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
      })
    },

    saveRuleCfg() {
      this.ruleForm.Data = JSON.stringify(this.ruleCfg)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.ruleForm
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
      })
    },

    saveExtCfg() {
      this.extForm.Data = JSON.stringify(this.extCfg)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.extForm
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
      })
    },

    onShowTab(tab) {
      // 设置修改之前数据
      if (this.activeTab == 'base' || this.activeTab == 'pay_table' || this.activeTab == 'reels') {
        this.$refs.compare.SetOldVal(this.baseForm.Data)
      } else if (this.activeTab == 'symbol' || this.activeTab == 'pay_line') {
        this.$refs.compare.SetOldVal(this.ruleForm.Data)
      } else if (this.activeTab == 'jackpot' || this.activeTab == 'bonus' || this.activeTab == 'wild') {
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
