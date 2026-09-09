// 道具用到的一些数据方法

// slotGameConfig
import { PROP_TYPE_OPTIONS } from '@/utils/options'
import {IsDev, IsProd, IsUat} from '@/utils/env'
import request from '@/utils/request'
import store from "@/store";

// 走配置
export const SLOT_GAME_CONFIG = [
  // { 'value': 82, 'label': '百万富翁(Millionire)', 'configKey':'millionaire_slots_base', disabled: false },
  // { 'value': 92, 'label': '超级王牌Go(UltraAce)','configKey':'fortuneacego_slots_base', disabled: false },
  // { 'value': 76, 'label': '糖果派对Way(Candy Rush)', 'configKey':'candypartyway_slots_base',disabled: false },
  // { 'value': 192, 'label': 'Bounty Raid(Bounty Raid)', 'configKey':'',disabled: false },
  // { 'value': 168, 'label': 'Pharaoh\'s Treasure', 'configKey':'',disabled: false },
  // {'value': 84, 'label': 'Fortune Ace', 'configKey':'',disabled: false },
  // {'value': 164, 'label': 'Mahjong Fortune', 'configKey':'',disabled: false },
]

// 下注类游戏
export const BETTING_GAME_CONFIG = [
  { 'value': 20, 'label': '扫雷(sweeper)', 'configKey': 'gameSweeper', disabled: false },
  { 'value': 132, 'label': 'Mines Magic', 'configKey': 'gameSweeper', disabled: false },
  { 'value': 108, 'label': 'DropBall', 'configKey': 'gameSweeper', disabled: false },
  { 'value': 25, 'label': 'Color Game', 'configKey': 'Color Game', disabled: false },
  { 'value': 143, 'label': 'Triple Wheel Spin', 'configKey': 'triplewheelspin', disabled: false },
  { 'value': 501, 'label': 'Balloon Tap', 'configKey': 'balloontap', disabled: false },
  { 'value': 500, 'label': 'Gold Master', 'configKey': 'Gold Master', disabled: false }
]

//比赛门票ID 关联门票权益配置 开发环境
export const MATCH_TICKET_RIGHTS_ID_CFG_DEV = {
  1000002: [
    { 'ticketId': 331, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-331' },
    { 'ticketId': 334, 'sceneId': 201, 'label': 'Tongits新版TICKET-334' },
    { 'ticketId': 372, 'sceneId': 202, 'label': 'Texas测试新版德州门票带唯一ID-372' },
    { 'ticketId': 374, 'sceneId': 203, 'label': 'Pusoy新版门票 带唯一ID-374' },

    { 'ticketId': 584, 'sceneId': 204, 'label': 'S5决赛邀请函' },
    { 'ticketId': 585, 'sceneId': 205, 'label': 'S5半决赛门票' },
    { 'ticketId': 586, 'sceneId': 206, 'label': '第一周S5日赛门票' },
    { 'ticketId': 587, 'sceneId': 207, 'label': '第二周S5日赛门票' },
    { 'ticketId': 588, 'sceneId': 208, 'label': '第三周S5日赛门票' },
    { 'ticketId': 589, 'sceneId': 209, 'label': '第四周S5日赛门票' },
    { 'ticketId': 590, 'sceneId': 210, 'label': '第五周S5日赛门票' },
    { 'ticketId': 646, 'sceneId': 211, 'label': 'Tongits-646门票P10 ' },
    { 'ticketId': 648, 'sceneId': 212, 'label': 'Pusoy-648门票P10 ' },
  ],

  1000003: [
    { 'ticketId': 407, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-407' },
    { 'ticketId': 408, 'sceneId': 201, 'label': '德州新版参赛券-408' },
    { 'ticketId': 409, 'sceneId': 202, 'label': 'Pusoy新版参赛券-409' },
  ]
}

//UAT门票配置
export const MATCH_TICKET_RIGHTS_ID_CFG_UAT = {
  10000002:[],
  1000003: [ // PROP_TYPE_TICKET_NEW
    { 'ticketId': 322, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-322'  },
    { 'ticketId': 343, 'sceneId': 201, 'label': 'Texas测试新版德州门票带唯一ID-343' },
    { 'ticketId': 345, 'sceneId': 202, 'label': 'UAT Pusoy新版比赛门票-345' },

    { 'ticketId': 427, 'sceneId': 203, 'label': 'UATTongits新版TPCC门票 -427'  },
    { 'ticketId': 471, 'sceneId': 204, 'label': 'UATTongits 带唯一ID-471'  },
    { 'ticketId': 472, 'sceneId': 205, 'label': 'UATPusoy测试 带唯一ID-472' },
    { 'ticketId': 473, 'sceneId': 206, 'label': 'UATTexas新版比赛门票-带唯一ID 473' },
    { 'ticketId': 474, 'sceneId': 207, 'label': 'UAT TPCC-带唯一ID474' },
    { 'ticketId': 478, 'sceneId': 208, 'label': 'UAT TPCC-带唯一ID478' },
    { 'ticketId': 479, 'sceneId': 209, 'label': 'UAT TPCC-带唯一ID479' },
    { 'ticketId': 480, 'sceneId': 210, 'label': 'UAT TPCC-带唯一ID480' },
    { 'ticketId':516 , 'sceneId': 218, 'label': 'UAT-Pusoy'  },
    { 'ticketId':517 , 'sceneId': 219, 'label': 'UAT-Pusoy'  },
    { 'ticketId':518, 'sceneId': 220, 'label': 'UAT-Pusoy'  },
    { 'ticketId':519 , 'sceneId': 221, 'label': 'UAT-Pusoy'  },
    { 'ticketId':522 , 'sceneId': 222, 'label': 'UAT-Texas'  },

    { 'ticketId':595 , 'sceneId': 223, 'label': 'S5 Daily Ticket Week 1'  },
    { 'ticketId':596 , 'sceneId': 224, 'label': 'S5 Daily Ticket Week 2'  },
    { 'ticketId':597 , 'sceneId': 225, 'label': 'S5 Daily Ticket Week 3'  },
    { 'ticketId':598 , 'sceneId': 226, 'label': 'S5 Daily Ticket Week 4'  },
    { 'ticketId':599 , 'sceneId': 227, 'label': 'S5 Daily Ticket Week 5'  },
    { 'ticketId':600 , 'sceneId': 228, 'label': 'S5 Semi-Finals Ticket'  },
    { 'ticketId':601 , 'sceneId': 229, 'label': 'S5 Grand Finals Invitation'  },

  ],
}

//线上配置
export const MATCH_TICKET_RIGHTS_ID_CFG_PROD = {
  1000002: [ // PROP_TYPE_TICKET_NEW
    { 'ticketId': 347, 'sceneId': 200, 'label': 'UAT Tongtis 1000002 测试门票' },
    { 'ticketId': 355, 'sceneId': 201, 'label': '新版Pusy门票-1000002' },
    { 'ticketId': 521, 'sceneId': 202, 'label': '新版德州门票UAT用-1000002' },

    { 'ticketId': 602, 'sceneId': 203, 'label': 'tongits 内部正式S5日赛门票w1' },
    { 'ticketId': 603, 'sceneId': 204, 'label': 'tongits 内部正式S5日赛门票w2' },
    { 'ticketId': 604, 'sceneId': 205, 'label': 'tongits 内部正式S5日赛门票w3' },
    { 'ticketId': 605, 'sceneId': 206, 'label': 'tongits 内部正式S5日赛门票w4' },
    { 'ticketId': 606, 'sceneId': 207, 'label': 'tongits 内部正式S5日赛门票w5' },
    { 'ticketId': 607, 'sceneId': 208, 'label': 'tongits 内部正式S5半决赛门票' },
   { 'ticketId': 608, 'sceneId': 209, 'label': 'tongits 内部正式S5决赛邀请函' },

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

    // { 'ticketId': 448, 'sceneId': 214, 'label': 'Tongits TPCC' },
    // { 'ticketId': 449, 'sceneId': 215, 'label': 'Tongits TPCC' },
    // { 'ticketId': 451, 'sceneId': 216, 'label': 'Tongits TPCC' },
    // { 'ticketId': 450, 'sceneId': 217, 'label': 'Tongits TPCC' },
    // { 'ticketId': 452, 'sceneId': 218, 'label': 'Tongits TPCC' },
    // { 'ticketId': 453, 'sceneId': 219, 'label': 'Tongits TPCC' },
    // { 'ticketId': 455, 'sceneId': 220, 'label': 'Tongits TPCC' },
    // { 'ticketId': 454, 'sceneId': 221, 'label': 'Tongits TPCC' },

    { 'ticketId': 497, 'sceneId': 222, 'label': 'Pusoy' },
    { 'ticketId': 498, 'sceneId': 223, 'label': 'Pusoy' },
    { 'ticketId': 499, 'sceneId': 224, 'label': 'Pusoy' },

    { 'ticketId': 529, 'sceneId': 225, 'label': 'Tongits' },
    { 'ticketId': 530, 'sceneId': 226, 'label': 'Tongits' },
    { 'ticketId': 531, 'sceneId': 227, 'label': 'Tongits' },
    { 'ticketId': 532, 'sceneId': 228, 'label': 'Tongits' },
    { 'ticketId': 533, 'sceneId': 229, 'label': 'Tongits' },
    { 'ticketId': 534, 'sceneId': 230, 'label': 'Tongits' },
    { 'ticketId': 544, 'sceneId': 231, 'label': 'Texas' },
    { 'ticketId': 545, 'sceneId': 232, 'label': 'Texas' },

    { 'ticketId':582 , 'sceneId': 233, 'label': 'S5 Daily Ticket Week 1'  },
    { 'ticketId':583 , 'sceneId': 234, 'label': 'S5 Daily Ticket Week 2'  },
    { 'ticketId':584 , 'sceneId': 235, 'label': 'S5 Daily Ticket Week 3'  },
    { 'ticketId':585 , 'sceneId': 236, 'label': 'S5 Daily Ticket Week 4'  },
    { 'ticketId':586 , 'sceneId': 237, 'label': 'S5 Daily Ticket Week 5'  },
    { 'ticketId':587 , 'sceneId': 238, 'label': 'S5 Semi-Finals Ticket'  },
    { 'ticketId':588 , 'sceneId': 239, 'label': 'S5 Grand Finals Invitation'  },
  ],
}

// 获取比赛门票权益ID列表
export const GetMatchTicketRightsIdList = (appId) => {
  if (IsDev()) {
    return MATCH_TICKET_RIGHTS_ID_CFG_DEV[appId] || []
  } else  if (IsUat()) {
    return MATCH_TICKET_RIGHTS_ID_CFG_UAT[appId] || []
  } else if (IsProd()) {
    return MATCH_TICKET_RIGHTS_ID_CFG_PROD[appId] || []
  }
  return []
}
// 是否是新版本门票
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

//是否为freeSpin
export const IsFreeSpinProp = (itemType) => {
  return  itemType === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN
}

//是否为互动道具
export const IsEffectProp = (itemType) => {
  return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_INTERACTION
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
      break
    case PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW:
    case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW:
    case PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW:
      // 新版票券：不能为0、365或负数
      if (expireDays === 0 || expireDays === 365 || expireDays < 0) {
        return false
      }
      break
    default:
      // 其他道具类型：默认有效
      break
  }
  return true
}
