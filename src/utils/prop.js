//道具用到的一些数据方法

//slotGameConfig
import request from "@/utils/request";
import { PROP_TYPE_OPTIONS } from '@/utils/options';
import { IsProd } from '@/utils/env';

//走配置
export const SLOT_GAME_CONFIG =[
  // { 'value': 82, 'label': '百万富翁(Millionire)', 'configKey':'millionaire_slots_base', disabled: false },
  // { 'value': 92, 'label': '超级王牌Go(UltraAce)','configKey':'fortuneacego_slots_base', disabled: false },
  // { 'value': 76, 'label': '糖果派对Way(Candy Rush)', 'configKey':'candypartyway_slots_base',disabled: false },
  // { 'value': 192, 'label': 'Bounty Raid(Bounty Raid)', 'configKey':'',disabled: false },
  // { 'value': 168, 'label': 'Pharaoh\'s Treasure', 'configKey':'',disabled: false },
  // {'value': 84, 'label': 'Fortune Ace', 'configKey':'',disabled: false },
  // {'value': 164, 'label': 'Mahjong Fortune', 'configKey':'',disabled: false },
]

//下注类游戏
export const BETTING_GAME_CONFIG =[
  {'value': 20, 'label': '扫雷(sweeper)', 'configKey':'gameSweeper', disabled: false },
  {'value': 132, 'label': 'Mines Magic', 'configKey':'gameSweeper', disabled: false },
  ]

//比赛门票ID 关联门票权益配置 开发环境
export const MATCH_TICKET_RIGHTS_ID_CFG_DEV = {
      1000002: [
          { 'ticketId': 331, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-331' },
          { 'ticketId': 334, 'sceneId': 201, 'label': 'Tongits新版TICKET-334' },
          { 'ticketId': 372, 'sceneId': 202, 'label': 'Texas测试新版德州门票带唯一ID-372' },
          { 'ticketId': 374, 'sceneId': 203, 'label': 'Pusoy新版门票 带唯一ID-374' },

          { 'ticketId':410, 'sceneId':204 , 'label': '冬季赛日赛门票' },
          { 'ticketId':412, 'sceneId':205 , 'label': '冬季赛周赛门票' },
          { 'ticketId':413, 'sceneId':206, 'label': '冬季赛月赛门票' },
          { 'ticketId':414, 'sceneId':207, 'label': '冬季赛semi-final' },
          { 'ticketId':415, 'sceneId':208, 'label': '冬季赛线上决赛' },
          { 'ticketId':416, 'sceneId':209 , 'label': '豪客赛门票' },
          { 'ticketId':417, 'sceneId':210, 'label': '魔戒卫星赛门票' },
          { 'ticketId':418 , 'sceneId':211, 'label': '机酒赛门票' },
      ],
      1000003: [
        { 'ticketId': 407, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-407' },
        { 'ticketId': 408, 'sceneId': 201, 'label': '德州新版参赛券-408' },
        { 'ticketId': 409, 'sceneId': 202, 'label': 'Pusoy新版参赛券-409' },
      ]
    }



//uat 线上配置
export const MATCH_TICKET_RIGHTS_ID_CFG_PROD = {
    1000002: [ // PROP_TYPE_TICKET_NEW
      { 'ticketId': 347, 'sceneId': 200, 'label': 'UAT Tongtis 1000002 测试门票' },
      { 'ticketId': 355, 'sceneId': 201, 'label': '新版Pusy门票-1000002' },
      { 'ticketId': 356, 'sceneId': 202, 'label': '新版德州门票UAT用-1000002' },
    ],
    1000003: [ // PROP_TYPE_TICKET_NEW
      { 'ticketId': 322, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-322'  },
      { 'ticketId': 343, 'sceneId': 201, 'label': 'Texas测试新版德州门票带唯一ID-343' },
      { 'ticketId': 345, 'sceneId': 202, 'label': 'UAT Pusoy新版比赛门票-345' },

      { 'ticketId': 427, 'sceneId': 203, 'label': 'UATTongits新版TPCC门票 -427'  },
      { 'ticketId': 471, 'sceneId': 204, 'label': 'UATTongits 带唯一ID-471'  },
      { 'ticketId': 472, 'sceneId': 205, 'label': 'UATPusoy测试 带唯一ID-472' },
      { 'ticketId': 473, 'sceneId': 206, 'label': 'UATTexas新版比赛门票-带唯一ID 473' },
      { 'ticketId': 474, 'sceneId': 207, 'label': 'UAT TPCC-带唯一ID474' },
    ],
  1000005: [
    { 'ticketId': 396, 'sceneId': 200, 'label': 'Tongits' },
    { 'ticketId': 397, 'sceneId': 201, 'label': 'Tongits' },
    { 'ticketId': 398, 'sceneId': 202, 'label': 'Tongits' },
    { 'ticketId': 399, 'sceneId': 203, 'label': 'Tongits' },
    { 'ticketId': 400, 'sceneId': 204, 'label': 'Pusoy' },
    { 'ticketId': 401, 'sceneId': 205, 'label': 'Pusoy' },
    { 'ticketId': 404, 'sceneId': 206, 'label': 'Pusoy' },
    { 'ticketId': 403, 'sceneId': 207, 'label': 'Pusoy' },
    { 'ticketId': 426, 'sceneId': 208, 'label': 'Texas' },
    { 'ticketId': 425, 'sceneId': 209, 'label': 'Texas' },
    { 'ticketId': 424, 'sceneId': 210, 'label': 'Texas' },
    { 'ticketId': 423, 'sceneId': 211, 'label': 'Texas' },
    { 'ticketId': 429, 'sceneId': 212, 'label': 'Texas' },
    { 'ticketId': 430, 'sceneId': 213, 'label': 'Texas' },

    { 'ticketId': 448, 'sceneId': 214, 'label': 'Tongits TPCC' },
    { 'ticketId': 449, 'sceneId': 215, 'label': 'Tongits TPCC' },
    { 'ticketId': 451, 'sceneId': 216, 'label': 'Tongits TPCC' },
    { 'ticketId': 450, 'sceneId': 217, 'label': 'Tongits TPCC' },
    { 'ticketId': 452, 'sceneId': 218, 'label': 'Tongits TPCC' },
    { 'ticketId': 453, 'sceneId': 219, 'label': 'Tongits TPCC' },
    { 'ticketId': 455, 'sceneId': 220, 'label': 'Tongits TPCC' },
    { 'ticketId': 454, 'sceneId': 221, 'label': 'Tongits TPCC' },
    ],
}

// 获取比赛门票权益ID列表
export const GetMatchTicketRightsIdList = (appId) => {
  if (IsProd()) {
    return MATCH_TICKET_RIGHTS_ID_CFG_PROD[appId] || []
  } else {
    return MATCH_TICKET_RIGHTS_ID_CFG_DEV[appId] || []
  }
}

//是否是新版本门票
export const IsNewTicketProp = (itemType) => {
  return [
    PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW
  ].includes(itemType)
}

// 是否是门票类型道具
export const IsTicketProp = (itemType) => {
  return [
    PROP_TYPE_OPTIONS.PROP_TYPE_TICKET,
    PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET,
    PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET
  ].includes(itemType)
}

// 是否是头像框道具
export const IsAvatarFrameProp = (itemType) => {
  return [
    PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,
    PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR
  ].includes(itemType)
}

// 检查是否需要过期天数
export const CheckPropNeedExpireDays = (itemType) => {
  return [
    PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,
    PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN,
    PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW
  ].includes(itemType)
}

// 道具过期时间是否合法
export const CheckPropExpireDays = (propType, expireDays) => {
  switch (propType) {
    case PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME:
    case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR:
      // 头像框：过期天数不能为负数
      if (expireDays < 0) {
        return false
      }
      break;
    case PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW:
    case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW:
    case PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW:
      // 新版票券：不能为0、365或负数
      if (expireDays === 0 || expireDays === 365 || expireDays < 0) {
        return false
      }
      break;
    default:
      // 其他道具类型：默认有效
      break;
  }
  return true
}
