import request from '@/utils/request'

/**
 * 自定义配置v2，单行记录，统一使用此方法保存数据
 */

// 存储数据类型
const TYPE_STRING = 1 // 普通字符串
const TYPE_JSON = 2 // JSON字符串

export function getCustomize(subKey) {
  return request({
    url: '/customizeconfigV2/one',
    method: 'get',
    data: {
      SubKey: subKey
    }
  })
}

export function createCustomize(data) {
  return request({
    url: 'customizeconfigV2/create',
    method: 'post',
    data: data
  })
}

export function updateCustomize(data) {
  return request({
    url: 'customizeconfigV2/update',
    method: 'post',
    data: data
  })
}

export function publishCustomize(Env, recordID, opType) {
  return request({
    url: 'customizeconfigV2/publish',
    method: 'post',
    data: {
      Env: Env,
      RecordID: recordID,
      OpType: opType
    }
  })
}

export function getAllCustomizes(env) {
  return request({
    url: '/customizeconfigV2/all',
    method: 'get',
    data: {
      Env: env
    }
  })
}

