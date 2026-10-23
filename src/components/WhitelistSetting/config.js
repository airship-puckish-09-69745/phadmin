// 白名单类型：1=SiteId白名单 2=白名单用户 3=A/B测试开关 + B分组比例
export const WHITELIST_TYPE = { SITE_ID: 1, USER: 2, AB_TEST: 3 }

export const ALL_WHITELIST_TYPES = [WHITELIST_TYPE.SITE_ID, WHITELIST_TYPE.USER, WHITELIST_TYPE.AB_TEST]

export function defaultWhitelistValue() {
  return {
    siteIdList: [],
    abTest: { switch: false, ratio: 0 },
    uidList: []
  }
}

export function normalizeWhitelist(raw) {
  const v = raw || {}
  const abTest = Object.assign({ switch: false, ratio: 0 }, v.abTest)
  abTest.switch = !!abTest.switch
  abTest.ratio = abTest.switch ? Number(abTest.ratio) || 0 : 0
  return {
    siteIdList: Array.isArray(v.siteIdList) ? v.siteIdList.slice() : [],
    abTest,
    uidList: Array.isArray(v.uidList) ? v.uidList.slice() : []
  }
}
