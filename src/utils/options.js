// 这个文件用于存放一些常量数据，一般是下拉框数据，方便复用

import {
  GetMatchTicketRightsIdList
} from '@/utils/prop'

export const APPID_OPTIONS = [
  { 'value': 1000002, 'label': 'dayusenlin' },
  { 'value': 1000003, 'label': 'testaccount' },
  { 'value': 1000004, 'label': 'testkey' },
  { 'value': 1000005, 'label': 'BingoPlusTongits' },
  { 'value': 1000006, 'label': 'BingoPlusTest' },
  { 'value': 1000007, 'label': 'br' },
  { 'value': 1000008, 'label': 'gli' },
  { 'value': 1100000, 'label': 'xworld' }
]

export const CHANNEL_OPTIONS = [
  { 'value': 'BP', 'label': 'BP' },
  { 'value': 'AP', 'label': 'AP' },
  { 'value': 'GP', 'label': 'GP' },
  // { 'value': 'TP', 'label': 'TP' },
  // { 'value': 'PG', 'label': 'PG' }, 2025-12-22去除PG
  { 'value': 'Dev', 'label': 'Dev' }
]
// 道具类型
export const ITEM_TYPE_OPTIONS = [
 // { 'value': 1, 'label': 'Tongits门票', disabled: false },
  { 'value': 2, 'label': '头像框', disabled: false },
 // { 'value': 3, 'label': '德州门票', disabled: false },
  { 'value': 4, 'label': '德州头像框', disabled: false },
  { 'value': 5, 'label': 'SlotFreeSpin', disabled: false },
 // { 'value': 6, 'label': 'Pusoy门票', disabled: false },
  { 'value': 7, 'label': '新版Tongits门票', disabled: false },
  { 'value': 8, 'label': '新版德州参赛券', disabled: false },
  { 'value': 9, 'label': '新版Pusoy门票', disabled: false },
  { 'value': 10, 'label': '互动道具', disabled: false }
]

// 道具过期时间下拉框
export const ITEM_DAY_TYPE_OPTIONS = [
  { 'value': 1, 'label': '1天', disabled: false },
  { 'value': 2, 'label': '2天', disabled: false },
  { 'value': 3, 'label': '3天', disabled: false },
  { 'value': 4, 'label': '4天', disabled: false },
  { 'value': 5, 'label': '5天', disabled: false },
  { 'value': 7, 'label': '7天', disabled: false },
  { 'value': 30, 'label': '30天', disabled: false },
  { 'value': 365, 'label': '365天', disabled: false },
  { 'value': 0, 'label': '永久', disabled: false },
  { 'value': -1, 'label': 'freeSpin-5分钟测试', disabled: true }
]

export const ITEM_STATUSES = {
  // 发起成功
  SUCCESS: 1,
  // 发起失败
  FAIL: 2,
  // 未审批
  UNAPPROVED: 3,
  // 审批中
  APPROVING: 4,
  // 废弃
  ABANDONED: 5,
  // 同意
  AGREED: 6,
  // 拒绝
  REJECTED: 7,
  // 小额自动同意
  SMALL_AMOUNT_AGREE_STATUS: 8,
  // 自动取消
  AUTO_CANCEL_STATUS: 9,
  // 手动取消
  MANUAL_CANCEL_STATUS: 10,
  // 执行中
  EXECUTING_STATUS: 11
}

// 道具发放审批状态
// 1: '发起成功',
// 2: '发起失败',
// 3: '未审批',
// 4: '审批中',
// 5: '废弃',
// 6: '同意',
// 7: '拒绝',
// 8: '小额自动同意',
// 9: '自动取消',
// 10: '手动取消'
export const ITEM_STATUS_OPTIONS = [
  { 'value': ITEM_STATUSES.SUCCESS, 'label': '发起成功', disabled: false },
  { 'value': ITEM_STATUSES.FAIL, 'label': '发起失败', disabled: false },
  { 'value': ITEM_STATUSES.UNAPPROVED, 'label': '未审批', disabled: false },
  { 'value': ITEM_STATUSES.APPROVING, 'label': '审批中', disabled: false },
  { 'value': ITEM_STATUSES.ABANDONED, 'label': '废弃', disabled: false },
  { 'value': ITEM_STATUSES.AGREED, 'label': '同意', disabled: false },
  { 'value': ITEM_STATUSES.REJECTED, 'label': '拒绝', disabled: false },
  { 'value': ITEM_STATUSES.SMALL_AMOUNT_AGREE_STATUS, 'label': '小额自动同意', disabled: false },
  { 'value': ITEM_STATUSES.AUTO_CANCEL_STATUS, 'label': '自动取消', disabled: false },
  { 'value': ITEM_STATUSES.MANUAL_CANCEL_STATUS, 'label': '手动取消', disabled: false }
]

// 头像框常量枚举定义
export const PROP_TYPE_OPTIONS = {
  PROP_TYPE_TICKET: 1,        //门票
  PROP_TYPE_AVATAR_FRAME: 2,    //头像框
  PROP_TYPE_TEXAS_TICKET: 3,    //德州参赛券
  PROP_TYPE_TEXAS_AVATAR: 4,    //德州头像框
  PROP_TYPE_SLOT_FREE_SPIN: 5,  //slot freespin
  PROP_TYPE_PUSOY_TICKET: 6,    //Pusoy参赛券
  PROP_TYPE_TICKET_NEW:7,      //新版Tongits门票 带交易ID
  PROP_TYPE_TEXAS_TICKET_NEW:8, //新版德州参赛券 带交易ID
  PROP_TYPE_PUSOY_TICKET_NEW:9, //新版Pusoy门票 带交易ID
  PROP_TYPE_INTERACTION: 10,  //互动道具
}
// 操作类型
export const PROP_SOURCE_OPTIONS = [
  { value: 1, label: '后台发放' },
  { value: 2, label: '平台发放' },
  { value: 3, label: '空投' },
  { value: 4, label: 'tongits报名' },
  { value: 5, label: 'texas报名' },
  { value: 6, label: 'Tongits比赛发放' },
  { value: 7, label: 'texas比赛发放' },
  { value: 8, label: 'tongits报名取消' },
  { value: 9, label: 'texas报名取消' },
  { value: 10, label: '头像框激活' },
  { value: 11, label: '道具过期' },
  { value: 12, label: '红包活动' },
  { value: 13, label: 'rebuy' },
  { value: 14, label: 'rebuy回退' },
  { value: 16, label: 'free spin' },
  { value: 17, label: '富裕卡任务' },
  { value: 18, label: '7日留存活动' },
  { value: 19, label: '万圣节活动' },
  { value: 20, label: '复活节活动' },
]

// 奖励分类
export const REWARD_CURRENCY_OPTIONS = [
  { 'value': 1, 'label': '金币' },
  { 'value': 2, 'label': '投注金' },
  { 'value': 3, 'label': '返水金' }
]

// 返水金
export const REBATE_SCENES_CFG_OPTIONS = [
  { 'value': 5, 'label': '没有任何限制的返水金' },
  { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
]

// 投注金
export const BET_SCENES_CFG_OPTIONS = [
  { 'value': 1, 'label': '任意游戏投注' },
  { 'value': 2, 'label': '仅限Poker类游戏投注' },
  { 'value': 3, 'label': '仅限Slots类游戏投注' },
  { 'value': 4, 'label': '仅限Tongits游戏投注' }

]

// 比赛Tongits全局ID集合
export const MATCH_UNIQUE_ID_CFG = [
  { 'value': 0, 'label': '无' },
  { 'value': 10001, 'label': '188Free' },
  { 'value': 10002, 'label': '12888Free' },
  { 'value': 10003, 'label': 'P10' },
  { 'value': 10004, 'label': 'P20' },
  { 'value': 10005, 'label': 'P40' },
  { 'value': 10006, 'label': 'P100' },
  { 'value': 10007, 'label': 'P300' },

  //以下全局ID为GTCC线上赛临时用 不长期占用
  // { 'value': 11001, 'label': 'GTCC日赛' },
  // { 'value': 11002, 'label': 'GTCC周赛' },
  // { 'value': 11003, 'label': 'GTCC月赛' },
  // { 'value': 11004, 'label': 'GTCC线上半决赛' },
  // { 'value': 11005, 'label': 'GTCC线上决赛' },
  // { 'value': 11006, 'label': 'GTCC机酒赛' },
  // { 'value': 11007, 'label': 'GTCC魔戒赛' },
  // { 'value': 11008, 'label': 'GTCC豪客赛' },

  //周年庆全局ID 不长期占用
  { 'value': 11105, 'label': 'Air pods pro 3' },
  { 'value': 11106, 'label': 'DJI Osmo Pocket' },
  { 'value': 11107, 'label': 'AirPods Max 2' },
  { 'value': 11108, 'label': 'JBL Partybox' },
  { 'value': 11109, 'label': 'Apple Watch Ultra 3' },
  { 'value': 11110, 'label': 'iPhone pro max 512' },


  { 'value': 11102, 'label': 'S5 Daily' },
  { 'value': 11103, 'label': 'S5 Daily Plus' },
  { 'value': 11104, 'label': 'S5 SemiFinal' },
]

// 比赛Pusoy全局ID集合
export const MATCH_PUSOY_UNIQUE_ID_CFG = [
  { 'value': 0, 'label': '无' },
  { 'value': 20001, 'label': '188Free' },
  { 'value': 20002, 'label': '12888Free' },
  { 'value': 20003, 'label': 'P10' },
  { 'value': 20004, 'label': 'P20' },
  { 'value': 20005, 'label': 'P40' },
  { 'value': 20006, 'label': 'P100' },
  { 'value': 20007, 'label': 'P300' },
  { 'value': 20009, 'label': 'P60' },
  { 'value': 20010, 'label': 'P150' },
  { 'value': 20011, 'label': 'P400' },
  { 'value': 20012, 'label': '6000Free' }
]

// 牌桌TableId
export const MATCH_TABLE_SCENE_ID_CFG = [
  { 'value': 0, 'label': '免费赛桌面' },
  { 'value': 1, 'label': '付费赛桌面' },
  { 'value': 2, 'label': 's5赛事-付费赛' },
  { 'value': 3, 'label': 's5赛事-日赛' },
  { 'value': 4, 'label': 's5赛事-半决赛' },
  { 'value': 5, 'label': 'Table5' },
]
// Pusoy 牌桌TableId
export const MATCH_PUSOY_TABLE_SCENE_ID_CFG = [
  { 'value': 100, 'label': '免费赛桌面' },
  { 'value': 101, 'label': '付费赛桌面' }
]

// 比赛页签选项
export const MATCH_LIST_TAG_OPTIONS = [
  { 'value': 0, 'label': '未分类', disabled: false },
  { 'value': 1, 'label': 'Events', disabled: false },
  { 'value': 2, 'label': 'FREE', disabled: false },
  { 'value': 3, 'label': 'Pro Arena', disabled: false },
  { 'value': 4, 'label': 'TPCC', disabled: false },
  { 'value': 5, 'label': 'TPCC Events', disabled: false },
  { 'value': 6, 'label': 'Anniversary', disabled: false },
]

// 比赛GameId选项
export const MATCH_GAME_ID_CFG_OPTIONS = [
  { 'value': 2031, 'label': 'Tongits', disabled: false },
  { 'value': 2032, 'label': 'TexasMtt', disabled: false },
  { 'value': 2033, 'label': 'Pusoy', disabled: false }
]

// 比赛GameID 宏定义
export const MATCH_IUPSTREAM_TYPE_OPTIONS = {
  MATCH_UPSTREAM_TYPE_TONGITS: 2031, // tongits
  UPSTREAM_TYPE_TEXAS_MTT: 2032, // 德州MTT
  MATCH_UPSTREAM_TYPE_PUSOY: 2033 // pusoy
}


export const RULE_END_MATCH_CFG ={
  END_MATCH_CFG_TIME_AND_USER:3,// 时间+人数
  END_MATCH_CFG_DYNAMIC_PROMOTE:4, //动态晋级

}

// 数据记录状态
export const RECORD_STATUS_OPTIONS = {
  // 上架
  ONLINE: 2,
  // 删除
  DELETE: 3,
  // 下架
  OFFLINE: 6,
  // 预上架
  PRE_ONLINE: 7,
  // 预下架
  PRE_OFFLINE: 8
}

// 活动奖励类型
export const ACTIVITY_REWARD_TYPES = {
  // 金币
  GOLD: 1,
  // 投注金
  BET_GOLD: 2,
  // 返水金
  REBATE_GOLD: 3,
  // 道具
  PROP: 4,
  // 活动物品
  ACTIVITY_ITEM: 5
}

// 活动奖励类型选项
export const ACTIVITY_REWARD_TYPE_OPTIONS = [
  { 'value': ACTIVITY_REWARD_TYPES.GOLD, 'label': '金币' },
  { 'value': ACTIVITY_REWARD_TYPES.BET_GOLD, 'label': '投注金' },
  { 'value': ACTIVITY_REWARD_TYPES.REBATE_GOLD, 'label': '返水金' },
  { 'value': ACTIVITY_REWARD_TYPES.PROP, 'label': '道具' },
  { 'value': ACTIVITY_REWARD_TYPES.ACTIVITY_ITEM, 'label': '活动物品' }
]

// 场景发放ID（内部用）选项。对应配置： phgames/base/gDefine/market_api.go
const SCENE_PID_OPTIONS = [
  // 常规场景
  { 'value': 1, 'label': '任意游戏投注' },
  { 'value': 2, 'label': '仅限Poker类游戏投注' },
  { 'value': 3, 'label': '仅限Slots类游戏投注' },
  { 'value': 4, 'label': '仅限Tongits游戏投注' },
  { 'value': 5, 'label': '没有任何限制的返水金' },
  { 'value': 6, 'label': '有限制倍数的返水金（10倍）' },
  { 'value': 7, 'label': '【圣诞节礼物活动】任意游戏投注' },
  { 'value': 8, 'label': '仅限GZ厅任意游戏投注的投注金【直播抽奖】' },
  { 'value': 9, 'label': '仅限GZ任意游戏投注金【TexasPlus免费赛】' },
  { 'value': 10, 'label': '没有任何限制的返水金【TexasPlus付费赛】' },
  { 'value': 11, 'label': '仅限GZ任意游戏投注金【新手任务】' },
  { 'value': 12, 'label': '仅限GZ任意游戏投注金【摇钱树活动】' },
  { 'value': 13, 'label': '仅限GZ任意游戏投注金【空投活动】' },
  { 'value': 14, 'label': '仅限GZ任意游戏投注金【红包雨活动Poker】' },
  { 'value': 15, 'label': '仅限GZ任意游戏投注金【Tongits免费赛】' },
  { 'value': 16, 'label': '没有任何限制的返水金【Tongits免费赛】' },
  { 'value': 17, 'label': '仅限GZ任意游戏投注金【活动地图】' },
  { 'value': 18, 'label': '仅限GZ任意游戏投注金【Poker专题活动】' },
  { 'value': 19, 'label': 'Tongits自建赛投注金【Tongits自建赛】' },
  { 'value': 20, 'label': '仅限GZ任意游戏投注金【TongitsHunter活动投注金】' },
  { 'value': 21, 'label': '仅限GZ任意游戏投注金【TongitsKingOfPot活动】' },
  { 'value': 22, 'label': 'GP站点的用户在gamezone厅下注【排行榜活动】' },
  { 'value': 23, 'label': '仅限GZ任意游戏投注金【pusoy比赛】' },
  { 'value': 24, 'label': '仅限GZ任意游戏投注金【7日留存活动】' },
  { 'value': 26, 'label': '仅限GZ任意游戏返水金【万圣节活动】' },
  { 'value': 27, 'label': '仅限GZ任意游戏投注金【竖版游戏排行榜活动】' },
  { 'value': 28, 'label': '仅限GZ任意游戏投注金【Poker类排行榜活动】' },
  { 'value': 29, 'label': '仅限GZ任意游戏投注金【聚宝盆活动】' },
  { 'value': 30, 'label': '仅限GZ任意游戏返水金【奖励邮件】' },
  { 'value': 31, 'label': '仅限GZ任意游戏投注金【红包雨活动slot】' },
  { 'value': 32, 'label': '仅限GZ任意游戏投注金【空投活动 solt】' },
  { 'value': 33, 'label': '仅限GZ任意游戏投注金【PokerPlus活动】' },
  { 'value': 34, 'label': '仅限GZ任意游戏投注金【固定反水活动】' },
  { 'value': 35, 'label': '仅限GZ任意游戏投注金【阶梯反水活动】' },
  { 'value': 36, 'label': '仅限GZ任意游戏投注金【海岛寻宝活动BP】' },
  { 'value': 37, 'label': '仅限GZ任意游戏投注金【海岛寻宝活动GP】' }
]

export const GetScenePidOptions = (appId) => {
  var sceneIdOptions = SCENE_PID_OPTIONS
  // 门票相关场景
  const matchTickets = GetMatchTicketRightsIdList(appId)
  for (let i = 0; i < matchTickets.length; i++) {
    sceneIdOptions.push({ 'value': matchTickets[i].sceneId, 'label': matchTickets[i].label, 'ticketId': matchTickets[i].ticketId })
  }
  return sceneIdOptions
}

// 营销发放类型
export const MARKET_PROVIDE_TYPES = {
  BONUS_CREDIT: 1, // 投注金
  WAGER_REWARDS: 2, // 返水金
  TICKET: 3 // 门票
}

// 营销发放类型选项
export const SCENE_P_TYPE_OPTIONS = [
  { 'value': MARKET_PROVIDE_TYPES.BONUS_CREDIT, 'label': '投注金' },
  { 'value': MARKET_PROVIDE_TYPES.WAGER_REWARDS, 'label': '返水金' },
  { 'value': MARKET_PROVIDE_TYPES.TICKET, 'label': '门票' }
]
