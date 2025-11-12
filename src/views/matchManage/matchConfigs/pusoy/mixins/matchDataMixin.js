/**
 * 比赛数据获取 Mixin
 * 负责所有数据获取相关的逻辑
 */
import { Message } from 'element-ui'
import request from '@/utils/request'
import { IsMars } from '@/utils/env'
import { MATCH_IUPSTREAM_TYPE_OPTIONS } from '@/utils/options'
import { PROP_TYPE_OPTIONS } from '../utils/matchConfigConstants'
import { getAllMatchGuidesConfig } from '@/utils/common-game-config'
import { IsNewTicketProp, GetMatchTicketRightsIdList } from '@/utils/prop'
export const matchDataMixin = {
  methods: {
    /**
     * 获取比赛列表
     */
    async getMatchList(env) {
      try {
        // 防止重复调用
        if (this.loading) {
          return
        }

        this.loading = true
        const response = await request({
          url: 'matchconfig/match/config/list',
          method: 'get',
          data: {
            Env: env,
            GameId: this.searchForm.gameId,
            Status: this.searchForm.status,
            CsId: this.searchForm.csId,
            RepeatType: this.searchForm.repeatType,
            AppId: this.searchForm.appId,
            PageNum: this.page,
            PageSize: this.limit
          }
        })

        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            const tableDataCpy = objs.list
            if (tableDataCpy.length > 0) {
              for (let i = 0; i < tableDataCpy.length; i++) {
                // 处理APP信息显示
                let show_appinfo = this.filterMatchListByAppId(tableDataCpy[i].app_info_cfg)
                if (show_appinfo !== '') {
                  tableDataCpy[i].show_appinfo = show_appinfo
                  tableDataCpy[i].openShow = tableDataCpy[i].status === 0
                  if (!tableDataCpy[i].hasOwnProperty('open_days_limit')) {
                    tableDataCpy[i].open_days_limit = 0
                  }
                  this.tableData.push(tableDataCpy[i])
                }
              }
            }
          } else {
            this.tableData = []
            this.total = 0
          }
        } else {
          Message.error('获取比赛列表失败')
          this.tableData = []
          this.total = 0
        }
      } catch (error) {
        Message.error('获取比赛列表失败')
        this.tableData = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取赛制配置
     */
    async getCsCfgs(env) {
      try {
        if (!IsMars()) {
          await this.getCsIdCfgs(env)
          await this.getCsCfgsAsync(env)
        } else {
          // Mars 环境处理
          await this.getCsIdCfgs(env)
          await this.getCsCfgsAsync(env)
        }
      } catch (error) {
        // 获取赛制配置错误
      }
    },

    /**
     * 获取赛制ID列表
     */
    async getCsIdCfgs(env) {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: env,
            Path: '/match/rule/list',
            Gid:2033,
          }
        })

        if (response.RetCode === 0) {
          const data = response.Data || {}
          this.configs.csIdCfg = data.list || []
        }
      } catch (error) {
        // 获取赛制ID列表错误
      }
    },

    /**
     * 异步获取赛制配置
     */
    async getCsCfgsAsync(env) {
      try {
        const response = await request({
          url: '/matchconfig/match/rule/list',
          method: 'get',
          data: {
            Env: env,
            Status: 0,
            PageNum: 1,
            PageSize: 200,
            GameId: MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_PUSOY,
          }
        })

        if (response.RetCode === 0) {
          const data = response.Data || {}
          if (data.total > 0) {
            this.configs.csCfgs = []
            for (const item of data.list) {
              const gameId = parseInt(item.game_id, 10)
              if (gameId !== MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_PUSOY) {
                continue
              }
              if (!(await this.checkRuleIdIsPublish(item.id))) {
                continue
              }
              if (item.self_build > 0) {
                continue
              }

              this.configs.csCfgs.push({
                label: `[${item.id}]${item.name}`,
                value: item.id,
                gameId: [gameId],
                ruleType: item.rule_type
              })

              // 处理阶段详情
              const stageDetail = JSON.parse(item.stage_detail || '[]')
              this.processStageDetail(item.id, stageDetail)

              // 处理规则额外信息
              const csExtra = JSON.parse(item.rule_extra || '{}')
              if (csExtra) {
                this.configs.csExtraCfgs.set(item.id, csExtra)
              }
            }
          }
        }
      } catch (error) {
        // 异步获取赛制配置错误
      }
    },

    /**
     * 获取奖品模板配置
     */
    async getPrizeTemplateCfg(env) {
      try {
        const url = IsMars() ? '/matchprizeconfig/match/prize/list' : '/dataProxy/info'
        const data = IsMars()
          ? { Env: env }
          : { Env: env, Path: '/match/prize/template' }

        const response = await request({ url, method: 'get', data })

        if (response.RetCode === 0) {
          const result = response.Data || {}
          if (result.total > 0) {
            this.configs.prizeTemplateCfg = result.list.map(item => ({
              label: item.Name || item.title,
              value: item.ID || item.id
            }))
          }
        }
      } catch (error) {
        // 获取奖品模板配置错误
      }
    },

    /**
     * 获取比赛道具配置
     */
    async getMatchProps(env) {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: env,
            Path: '/match/props/config/list',
            PropType: 0
          }
        })

        if (response.RetCode === 0) {
          const data = response.Data || {}
          if (data.total > 0) {
            this.configs.matchPropsCfgs = [{
              propsId: 0,
              propsType: 0,
              propsName: '无',
              propsIcon: '',
              propsAttr: '',
              propsCost: '',
              propsShowName: '',
              propsSceneId: 0,
            }]

            this.configs.matchTicketsCfgs = []
            const timestamp = Date.now() / 1000
            const propsTypeList = [PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET, PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW]
            for (const item of data.list) {
              if (propsTypeList.includes(item.item_type)) {
                let canPush = false
                let sceneId = 0
                if (item.status === 1 &&
                    ((item.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET && item.expire_time > timestamp) ||
                     item.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME || item.item_type=== PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW)) {

                  const showName = item.show_name ? `${item.item_name}(${item.show_name})` : item.item_name
                  if (IsNewTicketProp(item.item_type)) {
                    const tickets = GetMatchTicketRightsIdList(item.item_type).find(ticket => ticket.ticketId === item.id)
                    //console.log("tickets",tickets)
                    if(tickets){
                      canPush = true
                      sceneId = tickets.sceneId
                    }
                  }else{
                    canPush = true
                  }
                  if (canPush) {
                    this.configs.matchPropsCfgs.push({
                      propsType: item.item_type,
                      propsId: item.id,
                      propsName: item.item_name,
                      propsIcon: item.image,
                      propsAttr: item.item_describe,
                      propsCost: item.item_cost,
                      propsShowName: showName,
                      propsSceneId: sceneId,
                    })
                  }
                  if (item.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET||item.item_type=== PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW) {
                    if (canPush) {
                    this.configs.matchTicketsCfgs.push({
                      label: showName,
                        value: item.id
                      })
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        // 获取比赛道具配置错误
      }
    },

    /**
     * 获取引导配置
     */
    async getGuideCfgs() {
      try {
        const data = await getAllMatchGuidesConfig()
        this.configs.guideCfgs = [
          { label: '无', value: 0, appId: 0 }
        ]

        for (const item of data) {
          this.configs.guideCfgs.push({
            label: item.scheme_title,
            value: item.associate_key,
            appId: item.app_id
          })
        }
      } catch (error) {
        // 获取引导配置错误
      }
    },

    /**
     * 过滤比赛列表的APP信息
     */
    filterMatchListByAppId(appInfo) {
      // 在这里实现APPID过滤
      let show_appinfo = ''

      // 检查 appInfo 是否有效
      if (!appInfo || appInfo === '无' || appInfo === '') {
        return ''
      }

      try {
        const appInfoTemp = JSON.parse(appInfo)
        for (let i = 0; i < appInfoTemp.length; i++) {
          // 检查搜索表单的 appId 是否存在，如果存在则进行过滤
          if (this.searchForm && this.searchForm.appId > 0 && this.searchForm.appId !== appInfoTemp[i].appId) {
            continue
          }
          if (i === 0) {
            show_appinfo += appInfoTemp[i].appId + ' '
          } else {
            show_appinfo += '  ' + appInfoTemp[i].appId + ' '
          }
          show_appinfo += appInfoTemp[i].channelId
        }
      } catch (e) {
        return ''
      }

      return show_appinfo
    },

    /**
     * 处理阶段详情
     */
    processStageDetail(ruleId, stageDetail) {
      for (const stage of stageDetail) {
        if (stage.system_type === 1) { // 打立出局
          this.configs.endMinuteCfgs.set(ruleId, stage.system_strike_out.end_rule.match_minute)
          this.configs.endNumCfgs.set(ruleId, stage.system_strike_out.end_rule.lave_user_number)
          this.configs.promoteNumCfgs.set(ruleId, stage.system_strike_out.promotion_rule.user_number)
          this.configs.growTotalNumCfgs.set(ruleId, stage.system_strike_out.disuse_score_growth.grow_total)
          this.configs.disuseScoreGrowDetail.set(ruleId, stage.system_strike_out.disuse_score_growth.disuse_score_grow_detail)
        } else if (stage.system_type === 2) { // 定局
          this.configs.reachOutNumCfgs.set(ruleId, stage.system_reach_out.round_config[0].promotion_user)
        }
      }
    },

    /**
     * 检查规则ID是否已发布
     */
    checkRuleIdIsPublish(ruleId) {
      return this.configs.csIdCfg.some(item => item === ruleId)
    }
  }
}
