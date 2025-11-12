//道具用到的一些数据方法

//slotGameConfig
import request from "@/utils/request";
import { PROP_TYPE_OPTIONS } from '@/utils/options';
import { IsProd } from '@/utils/env';

export const SLOT_GAME_CONFIG =[
  { 'value': 82, 'label': '百万富翁(Millionire)', 'configKey':'millionaire_slots_base', disabled: false },
  { 'value': 92, 'label': '超级王牌Go(UltraAce)','configKey':'fortuneacego_slots_base', disabled: false },
  { 'value': 76, 'label': '糖果派对Way(Candy Rush)', 'configKey':'candypartyway_slots_base',disabled: false },
  { 'value': 192, 'label': 'Bounty Raid(Bounty Raid)', 'configKey':'',disabled: false },
  { 'value': 168, 'label': 'Pharaoh\'s Treasure', 'configKey':'',disabled: false },
  {'value': 84, 'label': 'Fortune Ace', 'configKey':'',disabled: false },
  {'value': 164, 'label': 'Mahjong Fortune', 'configKey':'',disabled: false },
]

//下注类游戏
export const BETTING_GAME_CONFIG =[
  {'value': 20, 'label': '扫雷(sweeper)', 'configKey':'gameSweeper', disabled: false },
  {'value': 132, 'label': 'Mines Magic', 'configKey':'gameSweeper', disabled: false },
  ]


// 比赛门票ID 关联门票权益配置
// 第一层下标：7 =Tongits, 8=TexasMtt, 9=Pusoy
export const MATCH_TICKET_RIGHTS_ID_CFG_DEV = {
  7: [ // PROP_TYPE_TICKET_NEW
   { 'ticketId': 331, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-332' },
    { 'ticketId': 334, 'sceneId': 201, 'label': 'Tongits新版TICKET-334' }
  ],
  8: [ // PROP_TYPE_TEXAS_TICKET_NEW
    { 'ticketId': 372, 'sceneId': 202, 'label': 'Texas测试新版德州门票带唯一ID-372' },
  ],
  9: [ // PROP_TYPE_PUSOY_TICKET_NEW
    { 'ticketId': 374, 'sceneId': 203, 'label': 'Pusoy新版门票 带唯一ID-374' },
  ]
}

//uat 线上配置
export const MATCH_TICKET_RIGHTS_ID_CFG_PROD = {
  7: [ // PROP_TYPE_TICKET_NEW
    { 'ticketId': 331, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-332' },
    { 'ticketId': 334, 'sceneId': 201, 'label': 'Tongits新版TICKET-334' }
  ],
  8: [ // PROP_TYPE_TEXAS_TICKET_NEW
    { 'ticketId': 372, 'sceneId': 200, 'label': 'Texas测试新版德州门票带唯一ID-372' },
  ],
  9: [ // PROP_TYPE_PUSOY_TICKET_NEW
    { 'ticketId': 374, 'sceneId': 200, 'label': 'Pusoy新版门票 带唯一ID-374' },
  ]
}

// 获取比赛门票权益ID列表
export const GetMatchTicketRightsIdList = (itemType) => {
  if (IsProd()) {
    return MATCH_TICKET_RIGHTS_ID_CFG_PROD[itemType] || []
  } else {
    return MATCH_TICKET_RIGHTS_ID_CFG_DEV[itemType] || []
  }
}
//是否是新版本门票
export const IsNewTicketProp = (itemType) => {
  return [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(itemType)
}
