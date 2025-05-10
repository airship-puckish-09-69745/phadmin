// 这个文件用于存放一些常量数据，一般是下拉框数据，方便复用

// appid
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

// 道具类型
export const ITEM_TYPE_OPTIONS = [
  { 'value': 1, 'label': 'Tongits门票', disabled: false },
  { 'value': 2, 'label': '头像框', disabled: false },
  { 'value': 3, 'label': '德州门票', disabled: false },
  { 'value': 4, 'label': '德州头像框', disabled: false }
]

// 道具过期时间下拉框
export const ITEM_DAY_TYPE_OPTIONS = [
  { 'value': 7, 'label': '7天', disabled: false },
  { 'value': 30, 'label': '30天', disabled: false },
  { 'value': 365, 'label': '365天', disabled: false },
  { 'value': 0, 'label': '永久', disabled: false }
]
