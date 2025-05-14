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
  { 'value': 1, 'label': '发起成功', disabled: false },
  { 'value': 2, 'label': '发起失败', disabled: false },
  { 'value': 3, 'label': '未审批', disabled: false },
  { 'value': 4, 'label': '审批中', disabled: false },
  { 'value': 5, 'label': '废弃', disabled: false },
  { 'value': 6, 'label': '同意', disabled: false },
  { 'value': 7, 'label': '拒绝', disabled: false },
  { 'value': 8, 'label': '小额自动同意', disabled: false },
  { 'value': 9, 'label': '自动取消', disabled: false },
  { 'value': 10, 'label': '手动取消', disabled: false }
]

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
  { value: 11, label: '道具过期' }
]
