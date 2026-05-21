import { Message } from 'element-ui'
import { createCustomize, getCustomize, updateCustomize } from '@/api/custome_configV2'
import { handleScriptV3BetListCreate } from './scriptV3BetListCreate'

function cloneData(data) {
  if (data === undefined || data === null) {
    return data
  }
  return JSON.parse(JSON.stringify(data))
}

function buildCustomizePayload(form, data, appId) {
  const payload = cloneData(form || {}) || {}
  payload.AppId = appId
  payload.Data = JSON.stringify(data)
  payload.Type = payload.Type || 1
  return payload
}

export default {
  data() {
    return {
      multiAppDialogVisible: false,
      appTreeData: [],
      checkedAppKeys: [],
      selectAllNodeKey: 'all',
      diffData: {},
      multiAppSubKey: '',
      multiAppAction: 'save',
      pendingScriptV3BetListBaseCfg: null,
      copyTargetAppId: null
    }
  },
  methods: {
    getRuleSubKey() {
      return this.subKey.replace('_base', '_rule')
    },
    getExtSubKey() {
      return this.subKey.replace('_base', '_ext')
    },
    onCopyMultiAppCfg() {
      this.prepareAppTree()
      this.multiAppAction = 'copy'
      this.multiAppDialogVisible = true
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
      if (newData.Bets) {
        const bets = newData.Bets.split(',')
        newData.BetList = []
        for (const i in bets) {
          newData.BetList.push(parseFloat(bets[i]) * 1000)
        }
      }
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)
      this.pendingScriptV3BetListBaseCfg = { oldBaseCfg: cloneData(oldData), newBaseCfg: cloneData(newData) }
      this.prepareAppTree()
      this.multiAppAction = 'save'
      this.multiAppSubKey = this.subKey
      this.multiAppDialogVisible = true
    },
    onMultiAppRuleSave(oldData, newData) {
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)
      this.prepareAppTree()
      this.multiAppAction = 'save'
      this.multiAppSubKey = this.getRuleSubKey()
      this.multiAppDialogVisible = true
    },
    onMultiAppExtSave(oldData, newData) {
      this.diffData = this.getDifferenceBetweenConfigs(oldData, newData)
      this.prepareAppTree()
      this.multiAppAction = 'save'
      this.multiAppSubKey = this.getExtSubKey()
      this.multiAppDialogVisible = true
    },
    getDifferenceBetweenConfigs(originalData, modifiedData) {
      if (Array.isArray(modifiedData)) {
        if (JSON.stringify(originalData) !== JSON.stringify(modifiedData)) {
          return cloneData(modifiedData)
        }
        return []
      }
      const original = originalData || {}
      const diff = {}
      for (const key in modifiedData) {
        if (!Object.prototype.hasOwnProperty.call(modifiedData, key)) continue
        if (Array.isArray(modifiedData[key])) {
          if (JSON.stringify(original[key]) !== JSON.stringify(modifiedData[key])) {
            diff[key] = cloneData(modifiedData[key])
          }
        } else if (typeof modifiedData[key] === 'object' && modifiedData[key] !== null) {
          if (typeof original[key] !== 'object' || original[key] === null) {
            diff[key] = modifiedData[key]
          } else {
            const nestedDiff = this.getDifferenceBetweenConfigs(original[key], modifiedData[key])
            if (Object.keys(nestedDiff).length > 0) {
              diff[key] = nestedDiff
            }
          }
        } else if (modifiedData[key] !== original[key]) {
          diff[key] = modifiedData[key]
        }
      }
      return diff
    },
    async saveDifferenceToOtherApps(appIds, diffData) {
      for (const appId of appIds) {
        const response = await getCustomize(this.multiAppSubKey, appId)
        if (response.RetCode === 0) {
          const currentConfig = response.Data || {}
          const data = currentConfig.Data ? JSON.parse(currentConfig.Data) : {}
          currentConfig.Data = JSON.stringify(this.applyDifferenceToConfig(data, diffData))
          await updateCustomize(currentConfig).then(response => {
            if (response.RetCode === 0) {
              Message.success(`应用 ${appId} 配置复制成功！`)
            }
          })
        } else {
          console.warn(`无法获取应用 ${appId} 的配置！`)
        }
      }
    },
    applyDifferenceToConfig(currentConfig, diffData) {
      if (Array.isArray(diffData)) {
        return cloneData(diffData)
      }
      for (const key in diffData) {
        if (Object.prototype.hasOwnProperty.call(diffData, key)) {
          if (Array.isArray(diffData[key])) {
            currentConfig[key] = cloneData(diffData[key])
          } else if (typeof diffData[key] === 'object' && diffData[key] !== null) {
            currentConfig[key] = this.applyDifferenceToConfig(currentConfig[key] || {}, diffData[key])
          } else {
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
    buildMultiAppCopyPayloads(appId) {
      if (this.baseCfg.Bets) {
        const bets = this.baseCfg.Bets.split(',')
        this.baseCfg.BetList = []
        for (const i in bets) {
          this.baseCfg.BetList.push(parseFloat(bets[i]) * 1000)
        }
      }
      return [
        buildCustomizePayload(this.baseForm, this.baseCfg, appId),
        buildCustomizePayload(this.ruleForm, this.ruleCfg, appId),
        buildCustomizePayload(this.extForm, this.extCfg, appId)
      ]
    },
    async confirmMultiAppCopy(appIds) {
      try {
        for (const appId of appIds) {
          const payloads = this.buildMultiAppCopyPayloads(appId)
          for (const payload of payloads) {
            const response = await createCustomize(payload)
            if (response.RetCode !== 0) {
              Message.error(`应用 ${appId} 配置复制失败！`)
              return
            }
          }
          Message.success(`应用 ${appId} 配置复制成功！`)
        }
      } finally {
        this.copyTargetAppId = null
      }
    },
    async confirmMultiAppSave(appIds = this.checkedAppKeys) {
      const checkedAppIds = appIds.filter(key => key !== this.selectAllNodeKey)
      if (checkedAppIds.length === 0) {
        Message.warning('请至少选择一个应用！')
        return
      }
      try {
        if (this.multiAppAction === 'copy') {
          await this.confirmMultiAppCopy(checkedAppIds)
        } else {
          await this.saveDifferenceToOtherApps(checkedAppIds, this.diffData)
          if (this.multiAppSubKey === this.subKey && this.pendingScriptV3BetListBaseCfg) {
            await handleScriptV3BetListCreate(this, { ...this.pendingScriptV3BetListBaseCfg, subKey: this.subKey, appIds: checkedAppIds })
          }
        }
      } finally {
        this.multiAppDialogVisible = false
        this.multiAppAction = 'save'
      }
    },
    onCheckChange(node, checked) {
      if (node.value === this.selectAllNodeKey) {
        this.checkedAppKeys = checked ? this.appOptions.slice(1).map(app => app.value) : []
      } else if (checked) {
        this.checkedAppKeys.push(node.value)
      } else {
        this.checkedAppKeys = this.checkedAppKeys.filter(item => item !== node.value)
      }
    }
  }
}
