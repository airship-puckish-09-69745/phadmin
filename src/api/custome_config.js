import request from '@/utils/request'

/**
 * 自定义配置，单行记录，统一使用此方法保存数据
 */

// 存储数据类型
const TYPE_STRING = 1 // 字符串
// const TYPE_HASH = 2 // 哈希
// const TYPE_SET = 3 // 集合

// 数据类型
// const SUB_TYPE_INT = 1 // 整型
const SUB_TYPE_STRING = 2 // 字符串

// sub key enum
const SUB_KEY_SING_REWARD = 'signRewards' // 签到奖励

function get(subKey) {
  return request({
    url: '/customizeconfig/one',
    method: 'get',
    data: {
      SubKey: subKey
    }
  })
}

function set(data) {
  return request({
    url: 'customizeconfig/update',
    method: 'post',
    data: data
  })
}

export function getAllCustomizes(env) {
  return request({
    url: '/customizeconfig/all',
    method: 'get',
    data: {
      Env: env
    }
  })
}

// 签到奖励
export function getSignRewards() {
  return get(SUB_KEY_SING_REWARD)
}

export function setSignRewards(data) {
  data = Object.assign({
    Data: '',
    Description: '用于签到奖励管理',
    Ext1: 0,
    LastModify: 0,
    ModifyUser: '',
    Name: '签到奖励',
    RedisSubkey: SUB_KEY_SING_REWARD,
    Str1: '',
    Subtype: SUB_TYPE_STRING,
    Type: TYPE_STRING
  }, data)

  return set(data)
}
