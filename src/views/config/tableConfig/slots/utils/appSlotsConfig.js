import request from '@/utils/request'
import store from '@/store'

export default {
  data() {
    return {
      appOptions: [
        { value: 0, label: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1'
    }
  },
  methods: {
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
