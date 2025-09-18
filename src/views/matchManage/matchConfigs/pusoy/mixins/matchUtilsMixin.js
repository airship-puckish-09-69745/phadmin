/**
 * 比赛工具方法 Mixin
 * 负责通用工具方法
 */
import { Message } from 'element-ui'
import { MATCH_IUPSTREAM_TYPE_OPTIONS } from '@/utils/options'

export const matchUtilsMixin = {
  methods: {
    /**
     * 根据游戏ID过滤赛制配置
     */
    filterCsCfgsByGameId(gameId) {
      this.configs.showCsCfgs = this.configs.csCfgs.filter(cs =>
        cs.gameId.includes(gameId)
      )
    },

    /**
     * 检查是否有指定的AppID
     */
    checkHaveAppId(appId, appInfo) {
      return appInfo.some(item => item.appId === appId)
    },

    /**
     * 检查是否有指定的游戏ID
     */
    checkHaveGame(gameId, gameArray) {
      return gameArray.includes(gameId)
    },

    /**
     * 获取当前赛制成长信息
     */
    getCurrCsGrowInfo() {
      const grow_total = this.configs.growTotalNumCfgs.get(this.editForm.data.csId) || 0
      this.configs.reubyGrowCfgs = []
      for (let i = 0; i < grow_total - 1; i++) {
        this.configs.reubyGrowCfgs.push({
          'label': i + 1 + '轮',
          'value': i + 1
        })
      }
    },

    /**
     * 改变奖励配置
     */
    changeRewardCfg() {
      // 这里可以添加奖励配置变化的处理逻辑
    },

    /**
     * 生成内容描述
     */
    makeContent(key, addData, delData, editData) {
      const change = new Set()
      const add = new Set()
      const del = new Set()

      // 新增取newVal
      if (addData) {
        for (var i = 0; i < addData.length; i++) {
          for (const ele of addData[i]) {
            if (ele.key == 'matchCfgId') {
              add.add(ele.newVal)
            }
          }
        }
      }

      if (delData) {
        for (var i = 0; i < delData.length; i++) {
          for (const ele of delData[i]) {
            if (ele.key == 'matchCfgId') {
              del.add(ele.oldVal)
            }
          }
        }
      }

      if (editData) {
        for (const edit of editData) {
          change.add(edit.Head.matchCfgId)
        }
      }

      if (change.size + del.size + add.size == 0) {
        return '没有修改!'
      }

      let str = ''
      let has = false
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row.id)) {
          has && (str += '\r\n---')
          has = true
          str += `\r\n修改： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
        if (del.has(row.id)) {
          has && (str += '\r\n---')
          has = true
          str += `\r\n下架： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
        if (add.has(row.id)) {
          has && (str += '\r\n---')
          has = true
          str += `\r\n上架： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
      }
      return str
    },

    /**
     * 获取游戏名称
     */
    getGameName(gameId) {
      const game = this.configs.gameCfgs.find(item => item.value === gameId)
      return game ? game.label : '未知游戏'
    },

    /**
     * 获取循环类型显示
     */
    getRepeatTypeShow(repeatType) {
      const repeat = this.configs.repeatCfgs.find(item => item.value === repeatType)
      return repeat ? repeat.label : '未知类型'
    },

    /**
     * 获取报名类型显示
     */
    getSignUpName(signUpType, signUpNum, signExtra) {
      const signUp = this.configs.signUpTypeCfgs.find(item => item.value === signUpType)
      let signUpName = signUp ? signUp.label : '未知类型'

      if (signUpType === 0) {
        // 付费报名
        signUpName += `(${signUpNum}金币)`
      } else if (signUpType === 2) {
        // 纯门票报名
        if (signExtra && signExtra.propId > 0) {
          const prop = this.configs.matchPropsCfgs.find(p => p.propsId === signExtra.propId)
          if (prop) {
            signUpName += `(${prop.propsName} x${signExtra.propNum || 1})`
          }
        }
      } else if (signUpType === 3) {
        // 金币或门票报名
        if (signExtra && signExtra.propId > 0) {
          const prop = this.configs.matchPropsCfgs.find(p => p.propsId === signExtra.propId)
          if (prop) {
            signUpName += `(${signUpNum}金币 或 ${prop.propsName} x${signExtra.propNum || 1})`
          } else {
            signUpName += `(${signUpNum}金币)`
          }
        } else {
          signUpName += `(${signUpNum}金币)`
        }
      }

      return signUpName
    },

    /**
     * 初始化配置
     */
    initConfigs() {
      // 初始化静态配置 - 在 mixin 中不需要重新赋值，因为 configs 已经在组件中初始化
    },

    /**
     * 处理APP ID变化
     */
    handleAppIdChange(index, appId) {
      // 处理APP ID变化的逻辑
      // 清空对应APP信息的渠道ID数组
      if (this.editForm.appInfo && this.editForm.appInfo[index]) {
        this.editForm.appInfo[index].channelId = []
      }
    },

    /**
     * 处理游戏变化
     */
    handleGameChange(value) {
      // 处理游戏变化的逻辑
      this.editForm.data.gameId = value
      // 根据选择的游戏ID过滤赛制配置
      this.filterCsCfgsByGameId(value)
    },

    /**
     * 处理赛制变化
     */
    handleCsChange(value) {
      // 处理赛制变化的逻辑
      this.editForm.data.csId = value

      // 重新生成 Rebuy 截止阶段数据
      this.getCurrCsGrowInfo()
    },

    /**
     * 处理排序变化
     */
    handleSortChange(value) {
      // 处理排序变化的逻辑
      this.editForm.data.sort = value
      // 检查排序值是否重复（确保value是数字类型）
      this.checkSortDuplicate(Number(value) || 0)
    },
    // 新增的排序重複檢查方法
    checkSortDuplicate(sortValue) {
      // 比较排序值（使用严格比较确保类型一致）
      for (var i = 0; i < this.tableData.length; i++) {
        // 如果是编辑模式，排除当前编辑的项
        if (this.editForm.data.id > 0 && this.tableData[i].id === this.editForm.data.id) {
          continue
        }
        // 比较排序值（使用严格比较确保类型一致）
        if (Number(this.tableData[i].sort) === Number(sortValue)) {
          this.showTip = true
          return
        }
      }
      this.showTip = false
    },
    /**
     * 处理报名类型变化
     */
    handleSignUpTypeChange(value) {
      // 处理报名类型变化的逻辑
      this.editForm.data.signUpType = value

      // 根据报名类型进行数据重置
      if (value === 1) {
        // 免费报名：重置报名费数量为0
        this.editForm.data.signUpNum = 0
      } else if (value === 0) {
        // 付费报名：重置每日限制和投注次数
        this.editForm.data.openDaysLimit = 0
        this.editForm.signExtra.betCnt = 0
        // 重置道具相关字段
        this.editForm.signExtra.propId = 0
        this.editForm.signExtra.propType = 0
        this.editForm.signExtra.propCost = 0
        this.editForm.signExtra.propNum = 0
      } else if (value === 2) {
        // 纯门票报名：重置报名费数量为0
        this.editForm.data.signUpNum = 0
      } else if (value === 3) {
        // 金币或门票报名：保持报名费数量，但需要选择门票
        // 这里不重置报名费，让用户自己设置
      }

      // 根据报名类型更新奖励类型配置
      this.getAfterTypeCfgOptions()
    },

    /**
     * 处理道具变化
     */
    handlePropChange(value) {
      // 处理道具变化的逻辑
      this.editForm.signExtra.propId = value
    },

    /**
     * 处理重买报名类型变化
     */
    handleRebuySignTypeChange(value) {
      // 处理重买报名类型变化的逻辑
      this.editForm.signExtra.reubyExtra.rebuySignType = value
    },

    /**
     * 处理重买道具变化
     */
    handleRebuyPropChange(value) {
      // 处理重买道具变化的逻辑
      this.editForm.signExtra.reubyExtra.rebuyPropId = value
    },

    /**
     * 处理关联键变化
     */
    handleAssociateKeyChange(value) {
      // 处理关联键变化的逻辑
      this.editForm.data.associateKey = value
    },

    /**
     * 处理比赛事件变化
     */
    handleMatchEventsChange(value) {
      // 处理比赛事件变化的逻辑
      this.editForm.signExtra.matchEvents = value
    },

    /**
     * 处理数据中心报告变化
     */
    handleDcReportChange(value) {
      // 处理数据中心报告变化的逻辑
      this.editForm.data.dcReport = value
    },

    /**
     * 处理奖励类型变化
     */
    handleAwardTypeChange(awardType) {
      // 处理奖励类型变化的逻辑

      // 验证免费赛不能选择动态奖池
      if (this.editForm.data.signUpType === 1 && awardType === 1) {
        // 这里可以触发一个事件让父组件处理错误提示
        this.$emit('award-type-error', '当前选择的是免费赛，不能选择动态奖池分配模式')
        return
      }

      // 重置奖励数据
      this.editForm.rankRewards = []

      // 重置动态奖池配置
      this.editForm.prizeExtra = {
        awardType: awardType,
        prizeRate: 0,
        prizeTemplateId: 0,
        rewardType: 1,
        sceneId: 0
      }
    },

    /**
     * 处理奖品模板变化
     */
    handlePrizeTemplateChange(value) {
      // 处理奖品模板变化的逻辑
      this.editForm.prizeExtra.prizeTemplateId = value
    },

    /**
     * 处理奖品比例变化
     */
    handlePrizeRateChange(value) {
      // 处理奖品比例变化的逻辑
      const num = Number(value)
      this.editForm.prizeExtra.prizeRate = isNaN(num) ? 0 : num
    },

    /**
     * 处理奖励类型单选变化
     */
    handleRewardTypeRadioChange(value) {
      this.editForm.data.awardType = value
    },

    /**
     * 获取一天的开始时间（00:00:00）
     */
    getDayBegin(timestamp) {
      const date = new Date(timestamp)
      date.setHours(0, 0, 0, 0)
      return date
    },

    /**
     * 获取一天的结束时间（23:59:59）
     */
    getDayEnd(timestamp) {
      const date = new Date(timestamp)
      date.setHours(23, 59, 59, 999)
      return date
    },

    /**
     * 检查场景是否在投注金场景配置中
     * @param {number} scene - 场景ID
     * @returns {boolean} 是否在配置中
     */
    isInBetScenes(scene) {
      for (let index = 0; index < this.configs.betScenesCfgs.length; index++) {
        if (this.configs.betScenesCfgs[index].value == scene) {
          return true
        }
      }
      return false
    },

    /**
     * 检查场景是否在返水金场景配置中
     * @param {number} scene - 场景ID
     * @returns {boolean} 是否在配置中
     */
    isInRebateScenes(scene) {
      for (let index = 0; index < this.configs.rebateScenesCfgs.length; index++) {
        if (this.configs.rebateScenesCfgs[index].value == scene) {
          return true
        }
      }
      return false
    },

    /**
     * 选择显示的引导推荐配置
     */
    selectShowGuieds() {
      this.configs.guideShowCfgs = []
      this.configs.guideShowCfgs.push({
        'label': '无',
        'value': 0,
        'appId': 0
      })

      if (this.configs.guideCfgs.length > 0) {
        for (let i = 0; i < this.configs.guideCfgs.length; i++) {
          if (this.checkHaveAppId(this.configs.guideCfgs[i].appId, this.editForm.appInfo)) {
            this.configs.guideShowCfgs.push(this.configs.guideCfgs[i])
          }
        }
      }
    },

    /**
     * 获取道具奖励项信息
     * @param {number} propsId - 道具ID
     * @param {number} propsNum - 道具数量
     * @param {number} propExpireDays - 过期天数
     * @returns {Object} 道具奖励项
     */
    getPropsRewardItem(propsId, propsNum, propExpireDays) {
      // 检查 matchPropsCfgs 是否存在
      if (this.configs.matchPropsCfgs && this.configs.matchPropsCfgs.length > 0) {
        for (let i = 0; i < this.configs.matchPropsCfgs.length; i++) {
          if (this.configs.matchPropsCfgs[i].propsId === propsId) {
            return {
              propsId: propsId,
              propsType: this.configs.matchPropsCfgs[i].propsType,
              propsName: this.configs.matchPropsCfgs[i].propsName,
              propsIcon: this.configs.matchPropsCfgs[i].propsIcon,
              propsAttr: this.configs.matchPropsCfgs[i].propsAttr,
              propsNum: propsNum,
              propExpireDays: propExpireDays
            }
          }
        }
      }
      return {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: 0,
        propExpireDays: -1
      }
    },

    /**
     * 设置已存在的类型配置选项（兼容旧版本）
     */
    getExistedTypeCfgOptions() {
      this.configs.getTypeCfgs = [
        { value: 1, label: '金币' },
        { value: 2, label: '投注金' },
        { value: 3, label: '返水金' }
      ]
    },

    /**
     * 设置更新后的类型配置选项（根据报名类型动态设置）
     */
    getAfterTypeCfgOptions() {
      if (this.editForm.data.signUpType === 1) { // 免费报名
        this.configs.getTypeCfgs = [
          { value: 1, label: '金币' },
          { value: 2, label: '投注金' }
        ]
      } else { // 付费报名
        this.configs.getTypeCfgs = [
          { value: 1, label: '金币' },
          { value: 2, label: '投注金' },
          { value: 3, label: '返水金' }
        ]
      }
    },

    /**
     * 安全解析 JSON 数据
     * @param {string} jsonString - JSON 字符串
     * @param {Function} fallbackFn - 解析失败时的回调函数
     * @param {string} defaultValue - 默认值
     * @returns {*} 解析后的数据或默认值
     */
    parseJsonData(jsonString, fallbackFn, defaultValue = '{}') {
      try {
        // 处理特殊字符，将中文字符替换为有效的JSON
        let cleanJsonString = jsonString || defaultValue

        // 如果包含中文字符"无"，替换为null或空字符串
        if (cleanJsonString.includes('"无"')) {
          cleanJsonString = cleanJsonString.replace(/"无"/g, '""')
        }

        // 如果包含其他中文字符，尝试处理
        if (cleanJsonString.includes('无')) {
          cleanJsonString = cleanJsonString.replace(/无/g, '""')
        }

        // 如果是空字符串，直接返回默认值
        if (cleanJsonString === '' || cleanJsonString === '""') {
          return fallbackFn()
        }

        const data = JSON.parse(cleanJsonString)

        // 如果是奖励数据，确保 getNum 是数字类型
        if (Array.isArray(data) && data.length > 0 && data[0].rewardItems) {
          data.forEach(rankReward => {
            if (rankReward.rewardItems && Array.isArray(rankReward.rewardItems)) {
              rankReward.rewardItems.forEach(item => {
                if (typeof item.getNum === 'string') {
                  item.getNum = Number(item.getNum) || 0
                }
              })
            }
          })
        }

        return data
      } catch (e) {
        return fallbackFn()
      }
    },

    /**
     * 解析白名单数据
     * @param {string} whileListString - 白名单 JSON 字符串
     * @returns {Object} 白名单对象
     */
    parseWhiteListData(whileListString) {
      if (!whileListString || whileListString === '') {
        return { type: 0, data: '' }
      }

      try {
        // 处理中文字符
        let cleanString = whileListString
        if (cleanString.includes('"无"')) {
          cleanString = cleanString.replace(/"无"/g, '""')
        }
        if (cleanString.includes('无')) {
          cleanString = cleanString.replace(/无/g, '""')
        }

        const whileList = JSON.parse(cleanString)
        return {
          type: whileList.type || 0,
          data: whileList.data || ''
        }
      } catch (e) {
        return { type: 0, data: '' }
      }
    },

    /**
     * 解析报名额外数据
     * @param {string} signExtraString - 报名额外 JSON 字符串
     * @returns {Object} 报名额外对象
     */
    parseSignExtraData(signExtraString) {
      const signExtra = this.parseJsonData(signExtraString, () => ({}), '{}')
      return signExtra
    },

    /**
     * 获取报名方式显示名称
     * @param {number} signUpType - 报名类型
     * @param {number} signUpNum - 报名数量
     * @param {string} signExtra - 报名额外信息
     * @returns {string} 报名方式名称
     */
    getSignUpName(signUpType, signUpNum, signExtra) {
      let signUpName = ''
      for (var i = 0; i < this.configs.signUpTypeCfgs.length; i++) {
        if (this.configs.signUpTypeCfgs[i].value === signUpType) {
          signUpName = this.configs.signUpTypeCfgs[i].label
          break
        }
      }

      if (signUpType === 0) {
        // 付费报名
        try {
          const signExtraData = JSON.parse(signExtra || '{}')
          if (signExtraData.propId > 0) {
            signUpName += `(道具ID:${signExtraData.propId})`
          } else {
            signUpName += `(数量:${signUpNum})`
          }
        } catch (e) {
          signUpName += `(数量:${signUpNum})`
        }
      } else if (signUpType === 1) {
        // 免费报名
        signUpName += '(免费)'
      } else if (signUpType === 2) {
        // 纯门票
        signUpName += `(门票:${signUpNum})`
      } else if (signUpType === 3) {
        // 金币or门票
        signUpName += `(金币或门票:${signUpNum})`
      }

      return signUpName
    },

    /**
     * 时间字符串转换为秒数
     */
    timeToSec(timeStr) {
      if (!timeStr) return 0
      const [hour = 0, min = 0, sec = 0] = timeStr.split(':').map(Number)
      return hour * 3600 + min * 60 + sec
    }
  }
}
