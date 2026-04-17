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
      </el-col>
      <el-col :span="24">
        <el-tabs type="border-card" value="base" @tab-click="onShowTab">
          <el-tab-pane label="基础配置" name="base">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-base-cfg v-if="baseCfgBool" v-model="baseCfg" :odds-str="false" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="符号表配置" name="symbol">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_rule')" :env-empty="false" compare-type="Object" />
            <slots-symbol-value v-if="ruleCfgBool" v-model="ruleCfg" @saveData="saveRuleCfg" @multiAppSave="onMultiAppRuleSave" />
          </el-tab-pane>
          <el-tab-pane label="赔付线配置" name="pay_table">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-pay-table v-if="baseCfgBool" v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" :start-col="3" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="进入免费方案配置" name="scatter_trigger_plans">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-free-trigger-plans v-if="baseCfgBool" v-model="baseCfg" :odds-str="false" :scatter-trigger-plans="baseCfg.scatterTriggerPlans" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="2套轴图标" name="reels_double">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_base')" :env-empty="false" compare-type="Object" />
            <slots-reels-double v-if="baseCfgBool" v-model="baseCfg" :symbol-list="ruleCfg.SymbolList" @saveData="saveBaseCfg" @multiAppSave="onMultiAppBaseSave" />
          </el-tab-pane>
          <el-tab-pane label="拓展配置" name="scatter">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_ext')" :env-empty="false" compare-type="Object" />
            <slots-millionaire-ext v-if="extCfgBool" v-model="extCfg" :base-bet="baseCfg.BaseBet" @saveData="saveExtCfg" @multiAppSave="onMultiAppExtSave" />
          </el-tab-pane>
          <el-tab-pane label="剧本" name="script">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <publish primary-key="ID" :key-id="getFullKey('millionaire_slots_rule')" :env-empty="false" compare-type="Object" />
            <slots-script v-if="ruleCfgBool" v-model="ruleCfg" :bets="baseCfg.BetListAct" @saveData="saveRuleCfg" @multiAppSave="onMultiAppRuleSave" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- 多应用选择弹窗 -->
    <el-dialog
      title="选择应用"
      :visible.sync="multiAppDialogVisible"
      width="400px"
    >
      <el-tree
        ref="appTree"
        v-model:checked-keys="checkedAppKeys"
        :data="appTreeData"
        show-checkbox
        node-key="value"
        default-expand-all
        @check-change="onCheckChange"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="multiAppDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmMultiAppSave">确认保存</el-button>
      </span>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import slotsBaseCfg from './components_x/ireland_base_cfg'
import slotsSymbolValue from './components_x/symbol_value'
import slotsPayLine from './components_x/pay_line'
import slotsPayTable from './components_x/pay_table_rate'
import slotsReelsIcon from './components_x/aladdin_reels_icon'
import slotsMillionaireExt from './components_x/millionaire_ext'
import slotsBigWinnerCfg from './components_x/big_winner_cfg'
import slotsVup from './components_x/slots_vup'
import slotsReelsDouble from './components_x/reels_double'
import slotsScript from './components_x/slots_script'
import SlotsFreeTriggerPlans from '@/views/config/tableConfig/slots/components_x/slotsFreeTriggerPlans.vue'
import {createCustomize, getCustomize, updateCustomize} from '@/api/custome_configV2'
import request from '@/utils/request'
import store from "@/store";
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { SlotsFreeTriggerPlans, Compare, Publish, slotsBaseCfg, slotsSymbolValue, slotsPayLine, slotsPayTable, slotsReelsIcon, slotsMillionaireExt, slotsBigWinnerCfg, slotsVup, slotsReelsDouble, slotsScript },
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
      txt: '',
      subKey: 'millionaire_slots_base',
      inc: 0,
      appOptions: [
        { value: 0, label: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1',
      createCfg: false,
      multiAppDialogVisible: false,
      appTreeData: [],
      checkedAppKeys: [],
      selectAllNodeKey: 'all',
      diffData: {},
      multiAppSubKey: ''
    }
  },
  created() {
    this.getData()
    this.getAppInfos()
  },
  methods: {
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      // 加载基础数值配置
      getCustomize(this.subKey, this.appId).then(response => {
        if (response.RetCode === 0) {
          this.baseForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            const BetList = []
            for (const k in cfg.BetList) {
              BetList[k] = cfg.BetList[k] / 1000
            }
            cfg.Bets = BetList.join(',')

            const OddsList = []
            for (const k in cfg.OddsList) {
              OddsList[k] = cfg.OddsList[k]
            }
            cfg.OddsStr = OddsList.join(',')

            const BetListAct = []
            for (const k in cfg.BetList) {
              for (const t in cfg.OddsList) {
                BetListAct.push(cfg.BetList[k] * cfg.OddsList[t])
              }
            }
            cfg.BetListAct = BetListAct

            this.baseCfg = cfg
            if (this.version === 'V2' && store.getters.appId !== this.appId && this.baseCfgBool === false) {
              this.createCfg = true
              console.log('this.createCfg', this.createCfg)
            }
            this.baseCfgBool = true
          }
        }
      })

      // 加载规则配置
      getCustomize('millionaire_slots_rule', this.appId).then(response => {
        if (response.RetCode === 0) {
          this.ruleForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.ruleCfg = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
          }
          this.ruleCfgBool = true
        }
      })

      // 加载扩展配置
      getCustomize('millionaire_slots_ext', this.appId).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.extCfg = JSON.parse(response.Data.Data)
            console.log('ext-data:', this.extCfg)
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
        this.extCfgBool = true
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
      if (!this.createCfg) {
        updateCustomize(this.baseForm).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
          }
        })
      } else {
        this.baseForm.AppId = store.getters.appId
        createCustomize(this.baseForm).then(response => {
          if (response.RetCode === 0) {
            console.log('保存成功')
          }
        })
      }
    },

    saveRuleCfg() {
      this.ruleForm.Data = JSON.stringify(this.ruleCfg)
      if (!this.createCfg) {
        updateCustomize(this.ruleForm).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
          }
        })
      } else {
        this.ruleForm.AppId = store.getters.appId
        createCustomize(this.ruleForm).then(response => {
          if (response.RetCode === 0) {
            console.log('保存成功')
          }
        })
      }
    },

    saveExtCfg() {
      this.extForm.Data = JSON.stringify(this.extCfg)
      if (!this.createCfg) {
        updateCustomize(this.extForm).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
          }
        })
      } else {
        this.extForm.AppId = store.getters.appId
        createCustomize(this.extForm).then(response => {
          if (response.RetCode === 0) {
            console.log('保存成功')
          }
        })
      }
    },

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
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    onAppIdChange() {
      if (this.appId === 0) {
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

              const OddsList = []
              for (const k in cfg.OddsList) {
                OddsList[k] = cfg.OddsList[k]
              }
              cfg.OddsStr = OddsList.join(',')

              const BetListAct = []
              for (const k in cfg.BetList) {
                for (const t in cfg.OddsList) {
                  BetListAct.push(cfg.BetList[k] * cfg.OddsList[t])
                }
              }
              cfg.BetListAct = BetListAct

              this.baseCfg = cfg

              if (this.version === 'V2' && this.baseCfgBool === false) {
                this.createCfg = true
                console.log('this.createCfg', this.createCfg)
              }
              this.baseCfgBool = true
            }
          }
        })

        // 加载规则配置
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: 'millionaire_slots_rule'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.ruleForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              this.ruleCfg = JSON.parse(response.Data.Data)
              // 设置修改之前数据
              // this.$refs.compare.SetOldVal(response.Data.Data)
            }

            this.ruleCfgBool = true
          }
        })

        // 加载扩展配置
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: 'millionaire_slots_ext'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.extForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              this.extCfg = JSON.parse(response.Data.Data)
              console.log('ext-data:', this.extCfg)
              // 设置修改之前数据
              // this.$refs.compare.SetOldVal(response.Data.Data)
            }
          }

          this.extCfgBool = true
        })
      } else {
        this.getData()
      }
    },
    onCopyAllCfg() {
      this.saveBaseCfg()
      this.saveRuleCfg()
      this.saveExtCfg()
      if (this.createCfg === true) {
        this.$message.success('所有配置已复制并保存成功！')
      }
      this.createCfg = false
    },
    onMultiAppBaseSave(oldData, newData) {
      // 差异计算
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)

      // 弹出多应用选择弹窗
      this.prepareAppTree()
      this.multiAppSubKey = this.subKey
      this.multiAppDialogVisible = true
    },
    onMultiAppRuleSave(oldData, newData) {
      // 差异计算
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)

      // 弹出多应用选择弹窗
      this.prepareAppTree()
      this.multiAppSubKey = 'millionaire_slots_rule'
      this.multiAppDialogVisible = true
    },
    onMultiAppExtSave(oldData, newData) {
      // 差异计算
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)

      // 弹出多应用选择弹窗
      this.prepareAppTree()
      this.multiAppSubKey = 'millionaire_slots_ext'
      this.multiAppDialogVisible = true
    },
    // 计算当前应用原数据与修改后的数据之间的差异
    getDifferenceBetweenConfigs(originalData, modifiedData) {
      const diff = {}
      for (const key in modifiedData) {
        if (!modifiedData.hasOwnProperty(key)) continue
        if (typeof modifiedData[key] === 'object' && modifiedData[key] !== null) {
          if (typeof originalData[key] !== 'object' || originalData[key] === null) {
            console.log('不同', key, modifiedData[key])
            diff[key] = modifiedData[key]
          } else {
            const nestedDiff = this.getDifferenceBetweenConfigs(originalData[key], modifiedData[key])
            if (Object.keys(nestedDiff).length > 0) {
              console.log('不同', key, nestedDiff)
              diff[key] = nestedDiff
            }
          }
        } else {
          if (modifiedData[key] !== originalData[key]) {
            console.log('不同', key, modifiedData[key])
            diff[key] = modifiedData[key]
          }
        }
      }

      return diff
    },
    async saveDifferenceToOtherApps(appIds, diffData) {
      for (const appId of appIds) {
        // 获取当前应用的配置
        const response = await getCustomize(this.multiAppSubKey, appId)

        if (response.RetCode === 0) {
          const currentConfig = response.Data || '{}'
          // 计算当前应用配置与修改数据的差异
          const data = JSON.parse(currentConfig.Data)
          const updatedConfig = this.applyDifferenceToConfig(data, diffData)

          // 将差异应用到该应用的配置
          currentConfig.Data = JSON.stringify(updatedConfig)

          await updateCustomize(currentConfig).then(response => {
            if (response.RetCode === 0) {
              Message.success(`应用 ${appId} 配置已成功更新！`)
            }
          })
        } else {
          console.warn(`⚠️ 无法获取应用 ${appId} 的配置.`)
        }
      }
    },
    applyDifferenceToConfig(currentConfig, diffData) {
      for (const key in diffData) {
        // eslint-disable-next-line no-prototype-builtins
        if (diffData.hasOwnProperty(key)) {
          // 如果差异存在于当前配置中，则进行覆盖
          if (typeof diffData[key] === 'object' && diffData[key] !== null) {
            // 如果是对象，则递归处理
            currentConfig[key] = this.applyDifferenceToConfig(currentConfig[key] || {}, diffData[key])
          } else {
            console.log('修改', key, diffData[key])
            currentConfig[key] = diffData[key]
          }
        }
      }

      return currentConfig
    },
    prepareAppTree() {
      this.appTreeData = [
        {
          label: '全选',
          value: this.selectAllNodeKey,
          children: this.appOptions.slice(1).map(app => ({
            label: app.label,
            value: app.value
          }))
        }
      ]
      this.$set(this, 'checkedAppKeys', [])
    },
    async confirmMultiAppSave() {
      // 选中的 App ID（排除全选节点 key）
      const appIds = this.checkedAppKeys.filter(key => key !== this.selectAllNodeKey)
      if (appIds.length === 0) {
        Message.warning('请至少选择一个应用')
        return
      }

      await this.saveDifferenceToOtherApps(appIds, this.diffData)
      this.multiAppDialogVisible = false
    },
    // 处理全选或取消全选
    onCheckChange(node, checked) {
      if (node.value === this.selectAllNodeKey) {
        // 点击全选节点时
        if (checked) {
          // 勾选全选时，选中所有子节点
          this.checkedAppKeys = this.appOptions.slice(1).map(app => app.value)
        } else {
          // 取消全选时，清空所有子节点的选中状态
          this.checkedAppKeys = []
        }
      } else {
        // 如果是其他节点，直接更新 checkedAppKeys
        if (checked) {
          this.checkedAppKeys.push(node.value)
        } else {
          this.checkedAppKeys = this.checkedAppKeys.filter(item => item !== node.value)
        }
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
