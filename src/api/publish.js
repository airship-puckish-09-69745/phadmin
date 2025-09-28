import request from '@/utils/request'

/**
 * 获取对比内容
 * @param opType 2发布到测试 3测试到预发布 6预发布到线上
 * @param keyID
 * @param envEmpty true环境变量为空
 * @returns {*}
 */
export function getDiff(opType, keyID, envEmpty) {
  return request({
    url: 'configfile/diff',
    method: 'get',
    data: {
      opType: opType,
      keyID: keyID
    },
    envEmpty: envEmpty
  })
}

/**
 * 发布
 * @param opType
 * @param keyID
 * @param summary 修改的配置，类型为对象型
 * @returns {*}
 */
export function submitPublish(opType, keyID, summary, envEmpty, attrInfo) {
  return request({
    url: 'configfile/publish',
    method: 'post',
    data: {
      opType: opType,
      keyID: keyID,
      summary: summary,
      AttrInfo: attrInfo,
      EnvEmpty: envEmpty ? 1 : 0
    },
    envEmpty: envEmpty
  })
}

// 当前发布状态 getView
// 判断权限，是否需要审核
export function getView(keyID, envEmpty) {
  const timestamp = new Date().getTime()
  return request({
    url: 'configfile/review',
    method: 'get',
    data: {
      keyID: keyID,
      _: timestamp // 添加时间戳参数避免缓存
    },
    envEmpty: envEmpty
  }).catch(error => {
    console.log('getView request failed:', error)
    throw error
  })
}

// 回滚 rollback
export function rollback(keyID, envEmpty) {
  return request({
    url: 'configfile/rollback',
    method: 'post',
    data: {
      keyID: keyID
    },
    envEmpty: envEmpty
  })
}
