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

/**
 * 生成默认配置：每种用户类型对应一个独立字段，tag 直接是标签数组
 * @param {number} userType 当前选中的用户类型
 * @returns {object} 默认用户类型配置
 */
export function defaultUserTypeConfig(userType = USER_TYPE_VALUES.ALL) {
  return {
    userType,
    new: {},
    all: {},
    import: { importedFilename: '' },
    filter: {
      registerTimeRange: { min: 0, max: 0 },
      betTimesRange: { min: 0, max: 0 }
    },
    tag: [],
    isParticipate: true
  }
}

/**
 * 规范化配置：用默认值补齐缺失字段，保证各字段结构完整
 * @param {object} raw 原始配置（可为空）
 * @param {number} fallbackType userType 缺失时使用的类型
 * @returns {object} 结构完整的新配置对象
 */
export function normalizeUserTypeConfig(raw, fallbackType = USER_TYPE_VALUES.ALL) {
  const base = defaultUserTypeConfig(fallbackType)
  const v = raw || {}
  const filter = v.filter || {}
  return {
    userType: Number(v.userType) || fallbackType,
    new: { ...v.new },
    all: { ...v.all },
    import: { ...base.import, ...v.import },
    filter: {
      ...filter,
      registerTimeRange: { ...base.filter.registerTimeRange, ...filter.registerTimeRange },
      betTimesRange: { ...base.filter.betTimesRange, ...filter.betTimesRange }
    },
    // 标签为数组，拷贝一份避免与外部共享引用
    tag: Array.isArray(v.tag) ? v.tag.map(t => ({ ...t })) : [],
    isParticipate: normalizeBoolean(v.isParticipate, base.isParticipate)
  }
}

function normalizeBoolean(value, fallback) {
  if (typeof value === 'boolean') return value
  if (value === 1 || value === '1' || value === 'true') return true
  if (value === 0 || value === '0' || value === 'false') return false
  return fallback
}

/**
 * 校验配置
 * @param {object} config 用户类型配置
 * @returns {string} 错误信息；校验通过返回空字符串
 */
export function validateUserTypeConfig(config) {
  const cfg = normalizeUserTypeConfig(config)
  // 筛选用户：校验注册时间范围与投注次数范围
  if (cfg.userType === USER_TYPE_VALUES.FILTER) {
    const { registerTimeRange: r, betTimesRange: b } = cfg.filter
    if (!r.min || !r.max || r.max < r.min) return '请选择有效的用户注册时间范围'
    const min = Number(b.min)
    const max = Number(b.max)
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < 0) return '累计投注次数必须为非负整数'
    if (max < min) return '累计投注次数最大值不能小于最小值'
  }
  // 标签用户：至少选择一个标签
  if (cfg.userType === USER_TYPE_VALUES.TAG && cfg.tag.length === 0) {
    return '请至少选择一个用户标签'
  }
  return ''
}