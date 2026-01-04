/**
 * 比賽配置工具函數
 * 提供數據初始化、格式化、驗證等功能
 */

import { $libDate } from '@/utils/common'
import { CONFIG_VALUES } from './matchConfigConstants'

/**
 * 初始化排名獎勵數據
 * @returns {Array} 排名獎勵數組
 */
export function initRankRewards() {
  return [
    {
      index: 1,
      startRank: 1,
      endRank: 1,
      rewardItems: [
        {
          index: 1,
          getType: CONFIG_VALUES.GET_TYPE.COIN,
          getPid: 0,
          getNum: 1, // 設置默認金幣數量
          sceneId: 0
        }
      ],
      propsReward: {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: 0,
        propExpireDays: -1,
        propsSceneId:0,
      }
    }
  ]
}

/**
 * 初始化編輯表單數據
 * @returns {Object} 編輯表單數據對象
 */
export function initEditFormData() {
  return {
    id: 0,
    name: '',
    gameId: 2033, // 默认选择 Pusoy 游戏
    csId: 0,
    opentMatchType: CONFIG_VALUES.OPEN_MATCH_TYPE.SCHEDULED,
    opentMatchMember: 0,
    repeatType: CONFIG_VALUES.REPEAT_TYPE.SINGLE,
    repeatDetail: '',
    disappearType: CONFIG_VALUES.DISAPPEAR_TYPE.AFTER_END,
    signUpType: CONFIG_VALUES.SIGN_UP_TYPE.PAID,
    signUpNum: 0,
    preShowSeconds: 0,
    preEnterSeconds: 0,
    delayEnterSeconds: 0,
    rankRewardsDetail: '',
    imagePath: '',
    openDaysLimit: 0,
    sort: 0,
    associateKey: '0',
    dcReport: 0,
    updateTime: 0,
    status: 0,
  }
}

/**
 * 初始化循環詳情數據
 * @returns {Object} 循環詳情對象
 */
export function initLoopDetail() {
  const now = new Date()
  return {
    onceTime: [
      $libDate.GetDayBegin(now.setSeconds(0)),
      $libDate.GetDayEnd(now.setSeconds(0))
    ],
    loopStartDate: $libDate.GetDayBegin(now.setSeconds(0)),
    loopEndDate: $libDate.GetDayBegin(now.setSeconds(0)),
    intervalDay: 0,
    single: {
      stime: '',
      etime: ''
    },
    loopData: [
      {
        index: 1,
        stime: '',
        etime: '',
        intervalSeconds: 0
      }
    ]
  }
}

/**
 * 初始化应用信息数据
 * @returns {Array} 应用信息数组
 */
export function initAppInfo() {
  return [
    {
      index: 1,
      appId: 1000002,
      channelId: []
    }
  ]
}

/**
 * 初始化白名單數據
 * @returns {Object} 白名單對象
 */
export function initWhiteList() {
  return {
    type: CONFIG_VALUES.WHITE_LIST.NONE,
    data: ''
  }
}

/**
 * 初始化簽名額外信息
 * @returns {Object} 簽名額外信息對象
 */
export function initSignExtra() {
  return {
    matchUniqueId: 0,
    reubyExtra: {
      supportRebuy: 0,
      reubyFree: 0,
      reubyCount: 0,
      reubyRound: 0,
      reubyScores: 0,
      reubySecs: 0,
      rebuySignType: 0,
      rebuyPropId: 0,
      rebuyPropNum: 0,
      rebuyPropCost: 0,
      rebuyPropType: 0,
      rebuyPropName: '',
      walletReport: 0
    }
  }
}

/**
 * 初始化列表額外信息
 * @returns {Object} 列表額外信息對象
 */
export function initListExtra() {
  return {
    tableSceneId: 100,
    delaySignUpSeconds: 0,
    
  }
}

/**
 * 格式化时间戳为可读字符串
 * @param {number} timestamp - 时间戳（秒）
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(timestamp) {
  if (!timestamp || typeof timestamp !== 'number') {
    return ''
  }

  try {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return ''
  }
}

/**
 * 根據遊戲ID獲取遊戲名稱
 * @param {number} gameId - 遊戲ID
 * @param {Array} gameConfigs - 遊戲配置數組
 * @returns {string} 遊戲名稱
 */
export function getGameName(gameId, gameConfigs = []) {
  if (!gameId || !Array.isArray(gameConfigs)) {
    return '未知'
  }

  const game = gameConfigs.find(item => item.value === gameId)
  return game ? game.label : '未知'
}

/**
 * 根據重複類型獲取顯示名稱
 * @param {number} repeatType - 重複類型
 * @param {Array} repeatConfigs - 重複配置數組
 * @returns {string} 顯示名稱
 */
export function getRepeatTypeShow(repeatType, repeatConfigs = []) {
  if (typeof repeatType !== 'number' || !Array.isArray(repeatConfigs)) {
    return '未知'
  }

  const repeat = repeatConfigs.find(item => item.value === repeatType)
  return repeat ? repeat.label : '未知'
}

/**
 * 获取比赛开始时间标签
 * @returns {string} 标签文本
 */
export function getMatchStartTimeLabel() {
  return '比賽時間：'
}


/**
 * 生成循環數據項
 * @param {number} index - 索引
 * @returns {Object} 循環數據項
 */
export function generateLoopDataItem(index) {
  return {
    index: index || 1,
    stime: '',
    etime: '',
    intervalSeconds: 0
  }
}




/**
 * 深拷貝對象
 * @param {any} obj - 要拷貝的對象
 * @returns {any} 拷貝後的對象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }

  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}


/**
 * 初始化獎勵額外信息
 * @returns {Object} 獎勵額外信息對象
 */
export function initPrizeExtra() {
  return {
    awardType: 0,
    prizeRate: 0,
    prizeTemplateId: 0,
    rewardType: 1,
    sceneId: 0
  }
}

// 向後兼容的別名
export const initWhileList = initWhiteList

export function initSingleCopy() {
  return {
    id: 0,
    isCopy: false,
  }
}
