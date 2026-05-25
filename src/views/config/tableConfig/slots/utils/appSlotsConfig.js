import request from '@/utils/request'
import store from '@/store'
import { createCustomize, getCustomize, updateCustomize } from '@/api/custome_configV2'
import { handleScriptV3BetListCreate } from './scriptV3BetListCreate'

function cloneData(data) {
  if (data === undefined || data === null) {
    return data
  }
  return JSON.parse(JSON.stringify(data))
}

export default {
  data() {
    return {
      appOptions: [
        { value: 0, label: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1',
      createCfg: false
    }
  },
  methods: {
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getRuleSubKey() {
      return this.subKey.replace('_base', '_rule')
    },
    getExtSubKey() {
      return this.subKey.replace('_base', '_ext')
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode !== 0) {
          return
        }
        response.Data.forEach(app => {
          if (app.Status === 2) {
            this.appOptions.push({
              value: app.ID,
              label: app.ID + '-' + app.Account
            })
          }
        })
      })
    },
    onAppIdChange() {
      if (this.appId === 0) {
        this.loadLegacyBaseConfig()
        this.loadLegacyRuleConfig()
        this.loadLegacyExtConfig()
        return
      }
      this.getData()
    },
    getData() {
      getCustomize(this.subKey, this.appId).then(response => {
        if (response.RetCode === 0) {
          this.baseForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.baseCfg = this.normalizeLegacyBaseCfg(JSON.parse(response.Data.Data))
            if (this.version === 'V2' && store.getters.appId !== this.appId && this.baseCfgBool === false) {
              this.createCfg = true
            }
            this.baseCfgBool = true
          }
        }
      })

      getCustomize(this.getRuleSubKey(), this.appId).then(response => {
        if (response.RetCode === 0) {
          this.ruleForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.ruleCfg = this.normalizeLegacyRuleCfg(JSON.parse(response.Data.Data))
          }
          this.ruleCfgBool = true
        }
      })

      getCustomize(this.getExtSubKey(), this.appId).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.extCfg = this.normalizeLegacyExtCfg(JSON.parse(response.Data.Data))
          }
        }
        this.extCfgBool = true
      })
    },
    async saveBaseCfg() {
      const oldBaseCfg = cloneData(this.baseCfg)
      if (this.baseCfg.Bets) {
        const bets = this.baseCfg.Bets.split(',')
        this.baseCfg.BetList = []
        for (const i in bets) {
          this.baseCfg.BetList.push(parseFloat(bets[i]) * 1000)
        }
      }
      this.baseForm.Data = JSON.stringify(this.baseCfg)
      if (!this.createCfg) {
        const response = await updateCustomize(this.baseForm)
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
          await handleScriptV3BetListCreate(this, { oldBaseCfg, newBaseCfg: this.baseCfg, subKey: this.subKey, appIds: [this.appId] })
        }
        return
      }
      this.baseForm.AppId = store.getters.appId
      const response = await createCustomize(this.baseForm)
      if (response.RetCode === 0) {
        console.log('保存成功')
      }
    },
    async saveRuleCfg() {
      this.ruleForm.Data = JSON.stringify(this.ruleCfg)
      if (!this.createCfg) {
        const response = await updateCustomize(this.ruleForm)
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
        return
      }
      this.ruleForm.AppId = store.getters.appId
      const response = await createCustomize(this.ruleForm)
      if (response.RetCode === 0) {
        console.log('保存成功')
      }
    },
    async saveExtCfg() {
      this.extForm.Data = JSON.stringify(this.extCfg)
      if (!this.createCfg) {
        const response = await updateCustomize(this.extForm)
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
        return
      }
      this.extForm.AppId = store.getters.appId
      const response = await createCustomize(this.extForm)
      if (response.RetCode === 0) {
        console.log('保存成功')
      }
    },
    loadLegacyBaseConfig() {
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
            this.baseCfg = this.normalizeLegacyBaseCfg(JSON.parse(response.Data.Data))
            if (this.version === 'V2' && this.baseCfgBool === false) {
              this.createCfg = true
            }
            this.baseCfgBool = true
          }
        }
      })
    },
    loadLegacyRuleConfig() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.getRuleSubKey()
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.ruleForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.ruleCfg = this.normalizeLegacyRuleCfg(JSON.parse(response.Data.Data))
          }
          this.ruleCfgBool = true
        }
      })
    },
    loadLegacyExtConfig() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.getExtSubKey()
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.extCfg = this.normalizeLegacyExtCfg(JSON.parse(response.Data.Data))
          }
        }
        this.extCfgBool = true
      })
    },
    normalizeLegacyBaseCfg(cfg) {
      return this.buildBaseCfg(cfg)
    },
    buildBaseCfg(cfg) {
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
        BetListAct.push(cfg.BetList[k])
      }
      cfg.BetListAct = BetListAct

      return cfg
    },
    normalizeLegacyRuleCfg(cfg) {
      if (this.subKey === 'fishingmaster_slots_base') {
        cfg.SlotsType = 180
      }
      return cfg
    },
    normalizeLegacyExtCfg(cfg) {
      return cfg
    }
  }
}
