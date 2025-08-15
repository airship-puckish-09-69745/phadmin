// 播报类型
export const broadcastTypeOptions = [
  {
    label: '比赛第一名',
    value: 1,
    // 条件
    condition: '配置里开启播报的比赛结束，播报获得比赛第一名玩家'
  },
  {
    label: '获得JP播报',
    value: 2,
    condition: '玩家在金币场获得JP，区分玩法'
  },
  // {
  //   label: '活动播报',
  //   value: 3,
  //   condition: '玩家在活动中获得大奖（根据活动为准）'
  // },
  {
    label: '自定义',
    value: 4,
    condition: '自定义循环展示频率'
  }
]
export const app_options_list = [
  { 'value': 1000002, 'label': 'dayusenlin' },
  { 'value': 1000003, 'label': 'testaccount' },
  { 'value': 1000004, 'label': 'testkey' },
  { 'value': 1000005, 'label': 'BingoPlusTongits' },
  { 'value': 1000006, 'label': 'BingoPlusTest' },
  { 'value': 1000007, 'label': 'br' },
  { 'value': 1000008, 'label': 'gli' },
  { 'value': 1100000, 'label': 'xworld' },
  { 'value': -1, 'label': 'all' }
]

// 獲取播报类型名称
export function getBroadcastTypeName(value) {
  const item = broadcastTypeOptions.find(item => item.value === value)
  return item ? item.label : value
}

export const positionOptions = [
  {
    label: '大厅',
    value: 1
  }
]
