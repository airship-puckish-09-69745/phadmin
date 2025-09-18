/**
 * 比賽配置相關常量
 * 使用更清晰的命名和結構化數據
 */

// 遊戲配置
export const GAME_CONFIGS = [
  { value: 2033, label: 'Pusoy', code: 'pusoy' }
]

// 狀態配置
export const STATUS_CONFIGS = [
  { value: 0, label: '启用', code: 'enabled' },
  { value: 1, label: '禁用', code: 'disabled' }
]

// 重複類型配置
export const REPEAT_TYPE_CONFIGS = [
  { value: 0, label: '单场', code: 'single', disabled: false },
  { value: 1, label: '单天单场循环', code: 'single_day_single', disabled: false },
  { value: 2, label: '单天多场循环', code: 'single_day_multiple', disabled: false }
]

// 消失時間點配置
export const DISAPPEAR_TYPE_CONFIGS = [
  { value: 0, label: '结束后', code: 'after_end' },
  { value: 1, label: '开赛后', code: 'after_start' }
]

// 開賽類型配置
export const OPEN_MATCH_TYPE_CONFIGS = [
  { value: 2, label: '定时开赛', code: 'scheduled', disabled: false },
  { value: 1, label: '人满即开', code: 'immediate', disabled: false }
]

// 報名類型配置
export const SIGN_UP_TYPE_CONFIGS = [
  { value: 0, label: '付费报名', code: 'paid' },
  { value: 1, label: '免费报名', code: 'free' },
  { value: 2, label: '纯门票', code: 'ticket_only' },
  { value: 3, label: '金币或门票', code: 'coin_or_ticket' }
]

// 重買報名類型配置
export const REBUY_SIGN_UP_TYPE_CONFIGS = [
  { value: 0, label: '付费报名', code: 'paid' },
  { value: 2, label: '纯门票', code: 'ticket_only' },
  { value: 3, label: '金币或门票', code: 'coin_or_ticket' }
]

// 獲取類型配置
export const GET_TYPE_CONFIGS = [
  { value: 1, label: '金币', code: 'coin' },
  { value: 2, label: '投注金', code: 'bet_amount' },
  { value: 3, label: '返水金', code: 'rebate' }
]

// 白名單配置
export const WHITE_LIST_CONFIGS = [
  { value: 0, label: '无白名单', code: 'none' },
  { value: 1, label: '有白名单', code: 'enabled' }
]

// 返水金場景配置
export const REBATE_SCENES_CONFIGS = [
  { value: 5, label: '沒有任何限制的返水金', code: 'unlimited' },
  { value: 6, label: '有限制倍數的返水金（10倍）', code: 'limited_10x' },
  { value: 16, label: '沒有任何限制的返水金【Tongits免費賽】', code: 'tongits_unlimited' }
]

// 投注金場景配置
export const BET_SCENES_CONFIGS = [
  { value: 1, label: '任意游戏投注', code: 'any_game' },
  { value: 2, label: '僅限Poker類遊戲投注', code: 'poker_only' },
  { value: 3, label: '仅限Slots类游戏投注', code: 'slots_only' },
  { value: 4, label: '仅限Tongits游戏投注', code: 'tongits_only' },
  { value: 15, label: '仅限GZ任意游戏投注金【Tongits免费赛】', code: 'gz_tongits' }
]


// 獎品模式配置
export const PRIZE_MODEL_CONFIGS = [
  { value: 0, label: '固定奖励', code: 'fixed' },
  { value: 1, label: '动态奖励', code: 'dynamic' }
]

// 道具类型配置
export const PROP_TYPE_OPTIONS = {
  PROP_TYPE_AVATAR_FRAME: 2,  // 头像框类型
  PROP_TYPE_PUSOY_TICKET: 6   // Pusoy 门票类型
}

// 道具信息配置
export const PROPS_INFO_CONFIGS = [
  {
    propsId: 0,
    propsType: 0,
    propsName: '无',
    propsIcon: '',
    propsAttr: '',
    propsCost: '',
    propsShowName: '无'
  }
]
// 配置枚舉值
export const CONFIG_VALUES = {
  GAME: {
    PUSOY: 2033
  },
  STATUS: {
    ENABLED: 0,
    DISABLED: 1
  },
  REPEAT_TYPE: {
    SINGLE: 0,
    SINGLE_DAY_SINGLE: 1,
    SINGLE_DAY_MULTIPLE: 2
  },
  DISAPPEAR_TYPE: {
    AFTER_END: 0,
    AFTER_START: 1
  },
  OPEN_MATCH_TYPE: {
    IMMEDIATE: 1,
    SCHEDULED: 2
  },
  SIGN_UP_TYPE: {
    PAID: 0,
    FREE: 1,
    TICKET_ONLY: 2,
    COIN_OR_TICKET: 3
  },
  GET_TYPE: {
    COIN: 1,
    BET_AMOUNT: 2,
    REBATE: 3
  },
  WHITE_LIST: {
    NONE: 0,
    ENABLED: 1
  }
}

