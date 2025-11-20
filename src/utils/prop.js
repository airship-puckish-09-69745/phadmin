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

//比赛门票ID 关联门票权益配置 开发环境
export const MATCH_TICKET_RIGHTS_ID_CFG_DEV = {
      1000002: [
          { 'ticketId': 331, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-331' },
          { 'ticketId': 334, 'sceneId': 201, 'label': 'Tongits新版TICKET-334' },
          { 'ticketId': 372, 'sceneId': 202, 'label': 'Texas测试新版德州门票带唯一ID-372' },
          { 'ticketId': 374, 'sceneId': 203, 'label': 'Pusoy新版门票 带唯一ID-374' },

          { 'ticketId':410, 'sceneId':207 , 'label': '冬季赛日赛门票' },
          { 'ticketId':412, 'sceneId':208 , 'label': '冬季赛周赛门票' },
          { 'ticketId':413, 'sceneId':209, 'label': '冬季赛月赛门票' },
          { 'ticketId':414, 'sceneId':210, 'label': '冬季赛semi-final' },
          { 'ticketId':415, 'sceneId':211, 'label': '冬季赛线上决赛' },
          { 'ticketId':416, 'sceneId':212 , 'label': '豪客赛门票' },
          { 'ticketId':417, 'sceneId':213, 'label': '魔戒卫星赛门票' },
          { 'ticketId':418 , 'sceneId':214, 'label': '机酒赛门票' },
      ],
      1000003: [
        { 'ticketId': 407, 'sceneId': 204, 'label': 'Tongits新版门票 带唯一ID-407' },
        { 'ticketId': 408, 'sceneId': 205, 'label': '德州新版参赛券-408' },
        { 'ticketId': 409, 'sceneId': 206, 'label': 'Pusoy新版参赛券-409' },
      ]
    }



//uat 线上配置
export const MATCH_TICKET_RIGHTS_ID_CFG_PROD = {
    1000002: [ // PROP_TYPE_TICKET_NEW
      //{ 'ticketId': 322, 'sceneId': 201, 'label': 'Tongits新版门票 带唯一ID-322' },
    ],
    1000003: [ // PROP_TYPE_TICKET_NEW
      { 'ticketId': 322, 'sceneId': 200, 'label': 'Tongits新版门票 带唯一ID-322'  },
      { 'ticketId': 343, 'sceneId': 201, 'label': 'Texas测试新版德州门票带唯一ID-343' },
      { 'ticketId': 345, 'sceneId': 202, 'label': 'UAT Pusoy新版比赛门票-345' },
    ]
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
  return [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(itemType)
}
