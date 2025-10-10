//道具用到的一些数据方法

//slotGameConfig
import request from "@/utils/request";

export const SLOT_GAME_CONFIG =[
  { 'value': 82, 'label': '百万富翁(Millionire)', 'configKey':'millionaire_slots_base', disabled: false },
  { 'value': 92, 'label': '超级王牌Go(UltraAce)','configKey':'fortuneacego_slots_base', disabled: false },
  { 'value': 76, 'label': '糖果派对Way(Candy Rush)', 'configKey':'candypartyway_slots_base',disabled: false },
  { 'value': 192, 'label': 'Bounty Raid(Bounty Raid)', 'configKey':'',disabled: false },
  { 'value': 168, 'label': 'Pharaoh\'s Treasure', 'configKey':'',disabled: false },
  {'value': 84, 'label': 'Fortune Ace', 'configKey':'',disabled: false },
  {'value': 186, 'label': 'Mahjong Jackpot', 'configKey':'',disabled: false },
  {'value': 164, 'label': 'Mahjong Fortune', 'configKey':'',disabled: false },
]

//下注类游戏
export const BETTING_GAME_CONFIG =[
  {'value': 20, 'label': '扫雷(sweeper)', 'configKey':'gameSweeper', disabled: false },
  {'value': 132, 'label': 'Mines Magic', 'configKey':'gameSweeper', disabled: false },
  ]
