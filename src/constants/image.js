// 图片分类
export const IMAGE_CATEGORIES = [
  { value: 'match', label: '比赛' },
  { value: 'act', label: '活动' },
  { value: 'mission', label: '任务' },
  { value: 'other', label: '其他' },
  { value: 'prop', label: '道具' },
  { value: 'subConfig', label: '子游戏大厅入口' },
  { value: 'cornerMarker', label: '角标图片' }
]
// 图片接受类型
export const IMAGE_ACCEPT = 'image/png, image/jpeg, image/webp'
// 图片最大大小, 单位: MB
export const IMAGE_MAX_SIZE = 1

// 文件分类
export const FILE_CATEGORIES = [
  { value: 'files-activity', label: '活动' },
  { value: 'files-other', label: '其他' }
]
// 文件接受类型
export const FILE_ACCEPT = 'application/zip'
// 文件最大大小, 单位: MB
export const FILE_MAX_SIZE = 3
