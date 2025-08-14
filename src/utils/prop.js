//道具用到的一些数据方法

//slotGameConfig
import request from "@/utils/request";

export const SLOT_GAME_CONFIG =[
  { 'value': 82, 'label': '百万富翁(Millionire)', 'configKey':'millionaire_slots_base', disabled: false },
  { 'value': 92, 'label': '超级王牌Go(UltraAce)','configKey':'fortuneacego_slots_base', disabled: false },
  { 'value': 76, 'label': '糖果派对Way(Candy Rush)', 'configKey':'candypartyway_slots_base',disabled: false },
]

//下注类游戏
export const BETTING_GAME_CONFIG =[
  {'value': 20, 'label': '扫雷(sweeper)', 'configKey':'gameSweeper', disabled: false },
  {'value': 132, 'label': 'Mines Magic', 'configKey':'gameSweeper', disabled: false },
  ]
