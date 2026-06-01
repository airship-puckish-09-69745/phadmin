import { Message } from 'element-ui'
import { createCustomize, getCustomize, updateCustomize } from '@/api/custome_configV2'
import { handleScriptV3BetListCreate } from './scriptV3BetListCreate'
import store from '@/store'

function cloneData(data) {
  if (data === undefined || data === null) {
    return data
  }
  return JSON.parse(JSON.stringify(data))
}

function getResponseError(response) {
  if (!response || response.Data === undefined || response.Data === null) {
    return ''
  }
  return typeof response.Data === 'string' ? response.Data : JSON.stringify(response.Data)
}

function buildCustomizePayload(form, data, appId, subKey) {
  const payload = cloneData(form || {}) || {}
  delete payload.ID
  payload.AppId = appId
  payload.RedisSubkey = subKey
  payload.Data = JSON.stringify(data)
  payload.Type = payload.Type || 1
  return payload
}

export default {
  data() {
    return {
      multiAppDialogVisible: false,
      checkedAppKeys: [],
      selectAllNodeKey: '__all__',
      diffData: {},
      multiAppAction: 'save',
      multiAppSubKey: '',
      copyTargetAppId: null,
      pendingScriptV3BetListBaseCfg: null,
      appTreeData: []
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
    async onCopyAllCfg() {
      await this.confirmMultiAppCopy([store.getters.appId])
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
        buildCustomizePayload(this.baseForm, this.baseCfg, appId, this.subKey),
        buildCustomizePayload(this.ruleForm, this.ruleCfg, appId, this.getRuleSubKey()),
        buildCustomizePayload(this.extForm, this.extCfg, appId, this.getExtSubKey())
      ]
    },
    async confirmMultiAppCopy(appIds) {
      const successAppIds = []
      const failedApps = []
      try {
        for (const appId of appIds) {
          const payloads = this.buildMultiAppCopyPayloads(appId)
          let hasFailed = false
          for (const payload of payloads) {
            const response = await createCustomize(payload)
            if (response.RetCode !== 0) {
              failedApps.push({
                appId,
                errMsg: getResponseError(response)
              })
              hasFailed = true
              break
            }
          }
          if (!hasFailed) {
            successAppIds.push(appId)
          }
        }
        if (successAppIds.length > 0) {
          Message.success(`配置复制完成，成功 ${successAppIds.length} 个App：${successAppIds.join(', ')}`)
        }
        if (failedApps.length > 0) {
          const errText = failedApps.map(item => `${item.appId}${item.errMsg ? '：' + item.errMsg : ''}`).join('；')
          Message.error(`配置复制失败 ${failedApps.length} 个App：${errText}`)
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
