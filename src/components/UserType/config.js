export const USER_TYPE_VALUES = {
  NEW: 1, // 新增用户
  ALL: 2, // 所有用户
  IMPORT: 3, // 导入用户
  FILTER: 4,// 筛选用户
  TAG: 5 // 用户标签
}

export const DEFAULT_ENABLED_USER_TYPES = [
  USER_TYPE_VALUES.NEW,
  USER_TYPE_VALUES.ALL,
  USER_TYPE_VALUES.IMPORT,
  USER_TYPE_VALUES.FILTER,
  USER_TYPE_VALUES.TAG
]

export const DEFAULT_USER_TYPE_OPTIONS = [
  { value: USER_TYPE_VALUES.NEW, label: '新增用户' },
  { value: USER_TYPE_VALUES.ALL, label: '所有用户' },
  { value: USER_TYPE_VALUES.IMPORT, label: '导入用户' },
  { value: USER_TYPE_VALUES.FILTER, label: '筛选用户' },
  { value: USER_TYPE_VALUES.TAG, label: '用户标签' }
]

export function defaultUserFilterCondition() {
  return {
    registerTimeRange: { min: 0, max: 0 },
    betTimesRange: { min: 0, max: 0 },
    userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
  }
}

export function defaultUserConfig(defaultUserType = USER_TYPE_VALUES.ALL) {
  return {
    userTypes: [defaultUserType],
    userFilterCondition: defaultUserFilterCondition(),
    importedFilename: ''
  }
}
