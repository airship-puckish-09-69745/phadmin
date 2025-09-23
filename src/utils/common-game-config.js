import request from './request'

export const getAllCommonGameConfig = async() => {
  const response = await request({
    url: '/customizeconfig/one',
    method: 'get',
    data: {
      SubKey: 'game_resource_common_cfg'
    }
  })

  if (response.RetCode === 0) {
    if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
      return JSON.parse(response.Data.Data)
    }
  }
}

export const getAllMatchGuidesConfig = async() => {
  const response = await request({
    url: '/customizeconfig/one',
    method: 'get',
    data: {
      SubKey: 'match_guide_list_new'
    }
  })

  if (response.RetCode === 0) {
    if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
      return JSON.parse(response.Data.Data)
    }
  }
}

//验证UID输入：检查是否为纯数字且用英文逗号分隔
export function validateUidInput(input) {
  if (!input || input.trim() === '') {
    return { valid: true, message: '' }
  }
  // 移除前后空白
  const trimmedInput = input.trim()
  //是否只包含数字、英文逗号和空白
  const validPattern = /^[\d,\s]+$/
  if (!validPattern.test(trimmedInput)) {
    return { valid: false, message: 'UID只能包含数字和英文逗号,不允许其他字符' }
  }

  // 分割并检查每个UID
  const uids = trimmedInput.split(',').map(uid => uid.trim()).filter(uid => uid !== '')
  //检查每个UID是否为纯数字
  for (const uid of uids) {
    if (!/^\d+$/.test(uid)) {
      return { valid: false, message: `UID "${uid}" 不是有效的數字` }
    }
  }

  // 检查是否有重复的UID
  const uniqueUids = [...new Set(uids)]
  if (uniqueUids.length !== uids.length) {
    return { valid: false, message: 'UID列表中存在的重复ID' }
  }

  return { valid: true, message: '', uids: uids }
}


// 处理UID输入变化 - 简化版本，返回格式化后的字符串
export function handleUidInputChange(input) {
  const validation = validateUidInput(input)

  if (!validation.valid) {
    return { success: false, message: validation.message, formattedInput: input }
  }


  //如果验证通过，格式化输入（移除多余空白，统一逗号间距）
  const formattedInput = validation.uids ? validation.uids.join(',') : input

  return { success: true, message: '', formattedInput: formattedInput }
}

//设置对象属性的辅助函数
export function setNestedProperty(obj, path, value) {
  const fieldParts = path.split('.')
  let target = obj
  for (let i = 0; i < fieldParts.length - 1; i++) {
    target = target[fieldParts[i]]
  }
  target[fieldParts[fieldParts.length - 1]] = value
}


