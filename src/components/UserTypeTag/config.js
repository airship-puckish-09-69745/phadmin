export const USER_TYPE_VALUES = {
  NEW: 1, // 新用户
  ALL: 2, // 所有用户
  IMPORT: 3, // 导入用户
  FILTER: 4, // 筛选用户
  TAG: 5 // 标签用户
}

export const DEFAULT_ENABLED_USER_TYPES = [
  USER_TYPE_VALUES.NEW,
  USER_TYPE_VALUES.ALL,
  USER_TYPE_VALUES.IMPORT,
  USER_TYPE_VALUES.FILTER,
  USER_TYPE_VALUES.TAG
]

export const DEFAULT_USER_TYPE_OPTIONS = [
  { value: USER_TYPE_VALUES.NEW, label: '新增用户', icon: 'el-icon-user', desc: '仅活动期间新注册的用户参与' },
  { value: USER_TYPE_VALUES.ALL, label: '所有用户', icon: 'el-icon-s-custom', desc: '所有用户均可参与' },
  { value: USER_TYPE_VALUES.IMPORT, label: '导入用户', icon: 'el-icon-upload2', desc: '通过 CSV 导入指定的用户ID' },
  { value: USER_TYPE_VALUES.FILTER, label: '筛选用户', icon: 'el-icon-search', desc: '按注册时间、累计投注次数筛选' },
  { value: USER_TYPE_VALUES.TAG, label: '用户标签', icon: 'el-icon-price-tag', desc: '按用户标签筛选，可多选' }
]

export const TAG_TYPE_NAMES = {
  1: '用户类型',
  2: '游戏强度',
  3: '游戏场次',
  4: '赛事类型',
  5: 'Slots用户类型'
}

// 每种用户类型对应一个独立字段，便于后续扩展
export function defaultUserTypeConfig(userType = USER_TYPE_VALUES.ALL) {
  return {
    userType,
    [USER_TYPE_VALUES.NEW]: {},
    [USER_TYPE_VALUES.ALL]: {},
    [USER_TYPE_VALUES.IMPORT]: { importedFilename: '' },
    [USER_TYPE_VALUES.FILTER]: {
      registerTimeRange: { min: 0, max: 0 },
      betTimesRange: { min: 0, max: 0 }
    },
    [USER_TYPE_VALUES.TAG]: { tags: [] }
  }
}

export function normalizeUserTypeConfig(raw, fallbackType = USER_TYPE_VALUES.ALL) {
  const base = defaultUserTypeConfig(fallbackType)
  const v = raw || {}
  const result = { ...base, ...v }
  result.userType = Number(v.userType) || fallbackType
  Object.keys(base).forEach(k => {
    if (k === 'userType') return
    result[k] = { ...base[k], ...(v[k] || {}) }
  })
  const filter = result[USER_TYPE_VALUES.FILTER]
  filter.registerTimeRange = { ...base[USER_TYPE_VALUES.FILTER].registerTimeRange, ...filter.registerTimeRange }
  filter.betTimesRange = { ...base[USER_TYPE_VALUES.FILTER].betTimesRange, ...filter.betTimesRange }
  if (!Array.isArray(result[USER_TYPE_VALUES.TAG].tags)) result[USER_TYPE_VALUES.TAG].tags = []
  return result
}

// 兼容旧格式：{ userTypes: [n], userFilterCondition, importedFilename }
export function fromLegacyUserConfig(legacy) {
  const l = legacy || {}
  const userType = Array.isArray(l.userTypes) && l.userTypes.length > 0 ? Number(l.userTypes[0]) : USER_TYPE_VALUES.ALL
  const cond = l.userFilterCondition || {}
  const cfg = defaultUserTypeConfig(userType)
  cfg[USER_TYPE_VALUES.IMPORT].importedFilename = l.importedFilename || ''
  if (cond.registerTimeRange) cfg[USER_TYPE_VALUES.FILTER].registerTimeRange = { ...cond.registerTimeRange }
  if (cond.betTimesRange) cfg[USER_TYPE_VALUES.FILTER].betTimesRange = { ...cond.betTimesRange }
  const tag = cond.userTagConfig
  if (userType === USER_TYPE_VALUES.TAG && tag && tag.tagId) {
    cfg[USER_TYPE_VALUES.TAG].tags = [{
      tagType: tag.tagType,
      tagGid: 0,
      tagId: tag.tagId,
      tagValues: tag.tagValue ? [tag.tagValue] : []
    }]
  }
  return cfg
}

// 校验配置，返回错误信息；通过返回空字符串
export function validateUserTypeConfig(config) {
  const cfg = normalizeUserTypeConfig(config)
  if (cfg.userType === USER_TYPE_VALUES.FILTER) {
    const { registerTimeRange: r, betTimesRange: b } = cfg[USER_TYPE_VALUES.FILTER]
    if (!r.min || !r.max || r.max < r.min) return '请选择有效的用户注册时间范围'
    const min = Number(b.min)
    const max = Number(b.max)
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < 0) return '累计投注次数必须为非负整数'
    if (max < min) return '累计投注次数最大值不能小于最小值'
  }
  if (cfg.userType === USER_TYPE_VALUES.TAG && cfg[USER_TYPE_VALUES.TAG].tags.length === 0) {
    return '请至少选择一个用户标签'
  }
  return ''
}
