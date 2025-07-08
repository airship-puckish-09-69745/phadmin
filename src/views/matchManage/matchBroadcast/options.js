// 播报类型
export const broadcastTypeOptions = [
  {
    label: '比赛播报',
    value: 1,
    // 条件
    condition: '配置里开启播报的比赛结束，播报获得比赛第一名玩家'
  },
  {
    label: '获得JP播报',
    value: 2,
    condition: '玩家在金币场获得JP，区分玩法'
  },
  {
    label: '自定义',
    value: 3,
    condition: '自定义循环展示频率'
  }
]

export const positionOptions = [
  {
    label: '大厅',
    value: 1
  }
]
