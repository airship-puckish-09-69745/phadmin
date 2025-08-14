import request from '@/utils/request'
import store from '@/store'

function getVer() {
  return store.getters.version === 'V2' ? 'V2' : ''
}

/**
 * 获取对比内容
 * @param opType 2发布到测试 3测试到预发布 6预发布到线上
 * @param keyID
 * @param envEmpty true环境变量为空
 * @param appId
 * @returns {*}
 */
export function getDiff(opType, keyID, envEmpty, appId) {
  const ver = getVer()
  return request({
    url: `configfile${ver}/diff`,
    method: 'get',
    data: {
      opType: opType,
      keyID: keyID,
      AppId: appId
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
export function submitPublish(opType, keyID, summary, envEmpty, attrInfo, appId) {
  const ver = getVer()
  return request({
    url: `configfile${ver}/publish`,
    method: 'post',
    data: {
      opType: opType,
      keyID: keyID,
      summary: summary,
      AttrInfo: attrInfo,
      EnvEmpty: envEmpty ? 1 : 0,
      AppId: appId
    },
    envEmpty: envEmpty
  })
}

// 当前发布状态 getView
// 判断权限，是否需要审核
export function getView(keyID, envEmpty, appId) {
  const ver = getVer()
  console.log('getView keyID', keyID, envEmpty, appId)
  return request({
    url: `configfile${ver}/review`,
    method: 'get',
    data: {
      keyID: keyID,
      AppId: appId
    },
    envEmpty: envEmpty
  })
}

// 回滚 rollback
export function rollback(keyID, envEmpty, appId) {
  const ver = getVer()
  return request({
    url: `configfile${ver}/rollback`,
    method: 'post',
    data: {
      keyID: keyID,
      AppId: appId
    },
    envEmpty: envEmpty
  })
}
