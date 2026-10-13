//道具的公共方法
import {getAppId, isNewVersion} from "@/utils/app";
import {
  GetMatchTicketRightsIdList,
  IsAvatarFrameProp, IsEffectProp,
  IsFreeSpinProp,
  IsNewTicketProp, IsPotCoin, MATCH_TICKET_RIGHTS_ID_CFG_DEV,
  MATCH_TICKET_RIGHTS_ID_CFG_PROD, MATCH_TICKET_RIGHTS_ID_CFG_UAT
} from "@/utils/prop";
import {IsDev, IsProdNew, IsUat} from "@/utils/env";
import request from '@/utils/request'
import store from '@/store'

/**
 * 获取可用道具配置列表,从缓存中拉取,发放道具要调用该方法
 * @returns {Promise<{total: number, itemList: Array}>}
 */
export const GetPropConfigListFromCache = () => {
  return request({
    url: '/dataProxy/info',
    method: 'get',
    data: {
      Path: '/match/props/config/list',
      PropType: 0
    }
  }).then(response => {
    if (response.RetCode !== 0) {
      return { total: 0, itemList: [] }
    }
    const objs = response.Data || {}
    const list = objs.list || []
    if (!objs.total || list.length === 0) {
      return { total: 0, itemList: [] }
    }
    const itemList = list.filter(item => IsAvailablePropItem(item))
    //console.log("getPropConfigListFromCache list ", itemList)
    return { total: objs.total, itemList }
  }).catch((err) => {
    console.error('GetPropConfigListFromCache failed', err)
    return { total: 0, itemList: [] }
  })
}
/**
 * 获取可用道具配置列表,从db中拉取, 从db中拉取的道具配置可能未发布到出去。慎用该方法
 * @returns {Promise<{total: number, itemList: Array}>}
 */
export const GetPropConfigListFromDb = () =>{
  return request({
    url: '/propsconfig/props/config/list',
    method: 'get',
    data: {
      Env: store.getters.env,
      PageNum: 1,
      PageSize: 500
    }
  }).then(response => {
    if (response.RetCode !== 0) {
      return { total: 0, itemList: [] }
    }
    const objs = response.Data || {}
    const list = objs.list || []
    if (!objs.total || list.length === 0) {
      return { total: 0, itemList: [] }
    }
    const itemList = list.filter(item => (item.status === 1))
    return { total: objs.total, itemList }
  }).catch((err) => {
    console.error('GetPropConfigListFromDb failed', err)
    return { total: 0, itemList: [] }
  })
}
//判断道具是否符合
export const IsAvailablePropItem = (item) => {
  if (!item || item.status !== 1) {
    return false
  }
  if(isNewVersion()){
    const appId = Number(getAppId())
    if (item.appId !== undefined &&  appId !== item.appId){
      return false
    }
  }
  //头像框、freeSpin
  if (IsAvatarFrameProp(item.item_type) || IsFreeSpinProp(item.item_type)) {
    return true
  }
  //互动道具
  if (IsEffectProp(item.item_type)) {
    if (item.expire_time > Date.parse(new Date()) / 1000) {
      return true
    }
  }
  //门票：需配置了权益值(sceneId) 才可用
  if (IsNewTicketProp(item.item_type)) {
    return GetMatchTicketRightsId(item.id) != null
  }
  //pot券
  return IsPotCoin(item.item_type);

}

/**
 * 根据门票ID获取权益 sceneId
 * 新后台：按当前 AppId + 环境查找
 * 旧后台：不区分 AppId，在当前环境配置中查找
 * @returns {number|null}
 */
export const GetMatchTicketRightsId = (ticketId) => {
  if (isNewVersion()) {
    const ticket = findTicketRights(ticketId, GetMatchTicketRightsIdList(getAppId()))
    return ticket ? ticket.sceneId : null
  }
  if (IsProdNew()) {
    return findTicketSceneIdInEnvCfg(ticketId, MATCH_TICKET_RIGHTS_ID_CFG_PROD)
  }
  if (IsUat()) {
    return findTicketSceneIdInEnvCfg(ticketId, MATCH_TICKET_RIGHTS_ID_CFG_UAT)
  }
  if (IsDev()) {
    return findTicketSceneIdInEnvCfg(ticketId, MATCH_TICKET_RIGHTS_ID_CFG_DEV)
  }
  return null
}

const findTicketRights = (ticketId, ticketList) => {
  return (ticketList || []).find(ticket => Number(ticket.ticketId) === Number(ticketId) && ticket.sceneId)
}

const findTicketSceneIdInEnvCfg = (ticketId, envCfg) => {
  for (const ticketList of Object.values(envCfg || {})) {
    const ticket = findTicketRights(ticketId, ticketList)
    if (ticket) {
      return ticket.sceneId
    }
  }
  return null
}
