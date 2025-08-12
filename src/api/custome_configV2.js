import request from '@/utils/request'
import store from "@/store";

/**
 * 自定义配置v2，单行记录，统一使用此方法保存数据
 */

// 存储数据类型
const TYPE_STRING = 1 // 普通字符串
const TYPE_JSON = 2 // JSON字符串

function getVer() {
  return store.getters.version === 'V2' ? 'V2' : ''
}

export function getCustomize(subKey, appId) {
  const ver = getVer()
  return request({
    url: `/customizeconfig${ver}/one`,
    method: 'get',
    data: {
      SubKey: subKey,
      AppId: appId
    }
  })
}

export function createCustomize(data) {
  const ver = getVer()
  return request({
    url: `/customizeconfig${ver}/create`,
    method: 'post',
    data: data
  })
}

export function updateCustomize(data) {
  const ver = getVer()
  return request({
    url: `/customizeconfig${ver}/update`,
    method: 'post',
    data: data
  })
}

export function publishCustomize(Env, recordID, opType) {
  const ver = getVer()
  return request({
    url: `/customizeconfig${ver}/publish`,
    method: 'post',
    data: {
      Env: Env,
      RecordID: recordID,
      OpType: opType
    }
  })
}

export function getAllCustomizes(env, appId) {
  const ver = getVer()
  return request({
    url: `/customizeconfig${ver}/all`,
    method: 'get',
    data: {
      Env: env,
      AppId: appId
    }
  })
}

