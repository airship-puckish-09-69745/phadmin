/**
 * 比赛表单处理 Mixin
 * 负责编辑表单相关的逻辑
 */
import { Message } from 'element-ui'
import request from '@/utils/request'
import {
  initEditFormData,
  initLoopDetail,
  initRankRewards,
  initAppInfo,
  initWhiteList,
  initSignExtra,
  initListExtra,
  initPrizeExtra, initSingleCopy
} from '../utils/matchConfigUtils'

export const matchFormMixin = {
  methods: {
    /**
     * 显示编辑对话框
     */
    showEditDialog(id = 0) {
      if (id > 0) {
        this.editForm.title = '编辑比赛'
        this.editForm.isAdd = false
        this.editForm.data.id = id

        // 从表格数据中查找对应的比赛
        const editData = this.tableData.find(item => item.id == id)

        if (!editData) {
          Message.error('比赛配置不存在')
          return
        }

        // 加载比赛数据到编辑表单

        // 设置基本信息 - 完整的字段映射
        this.editForm.data = {
          id: editData.id,
          name: editData.name || '',
          gameId: editData.game_id || 0,
          csId: editData.cs_id || 0,
          opentMatchType: editData.open_match_type || 2,
          opentMatchMember: editData.open_match_member || 0,
          repeatType: editData.repeat_type || 0,
          repeatDetail: editData.repeat_detail || '',
          disappearType: editData.disappear_type || 0,
          signUpType: editData.sign_up_type || 0,
          signUpNum: editData.sign_up_num || 0,
          preShowSeconds: editData.pre_show_seconds || 0,
          preEnterSeconds: editData.pre_enter_seconds || 0,
          delayEnterSeconds: editData.delay_enter_seconds || 0,
          rankRewardsDetail: editData.rewards || '',
          status: editData.status || 0,
          imagePath: editData.image_path || '',
          openDaysLimit: editData.open_days_limit || 0,
          sort: editData.sort || 0,
          associateKey: editData.associate_key || 0,
          dcReport: editData.dc_report || 0,
          updateTime: editData.update_time || ''
        }

        this.editForm.rankRewards = this.parseJsonData(editData.rewards, initRankRewards(), 'array')
        this.editForm.whileList = this.parseWhiteListData(editData.while_list)
        this.editForm.appInfo = this.parseJsonData(editData.app_info_cfg, initAppInfo(), 'array')
        this.editForm.signExtra = this.parseSignExtraData(editData.sign_extra)

        // 处理时间配置 - 开赛日期和结束日期
        if (editData.repeat_type == 0) {
          // 单次比赛
          this.editForm.loopDetail = initLoopDetail()
          this.editForm.loopDetail.onceTime = [
            new Date((editData.start_time || 0) * 1000),
            new Date((editData.end_time || 0) * 1000)
          ]
        } else {
          // 循环比赛
          try {
            const repeatDetail = JSON.parse(editData.repeat_detail || '{}')
            this.editForm.loopDetail = initLoopDetail()
            // 设置开赛日期和结束日期
            this.editForm.loopDetail.loopStartDate = this.getDayBegin(editData.start_time * 1000)
            this.editForm.loopDetail.loopEndDate = this.getDayBegin(editData.end_time * 1000)
            this.editForm.loopDetail.intervalDay = repeatDetail.intervalDay || 0


            if (editData.repeat_type == 1) {
              // 单天单场
              this.editForm.loopDetail.single.stime = repeatDetail.msTime || ''
              this.editForm.loopDetail.single.etime = repeatDetail.meTime || ''
            } else {
              // 循环时段
              this.editForm.loopDetail.loopData = repeatDetail.loopData || [{
                index: 1,
                stime: '',
                etime: '',
                intervalSeconds: 0
              }]
            }
          } catch (e) {
            this.editForm.loopDetail = initLoopDetail()
          }
        }

        this.editForm.listExtra = this.parseJsonData(editData.list_extra, initListExtra(), 'object')
        this.editForm.prizeExtra = this.parseJsonData(editData.prize_extra, initPrizeExtra(), 'object')

        // 选择显示的引导推荐配置
        this.selectShowGuieds()

        // 获取当前赛制成长信息
        this.getCurrCsGrowInfo()

        // 根据游戏ID过滤赛制配置
        if (editData.game_id) {
          this.filterCsCfgsByGameId(editData.game_id)
        } else if (this.editForm.data.gameId) {
          this.filterCsCfgsByGameId(this.editForm.data.gameId)
        }


      } else {
        this.editForm.title = '添加比赛'
        this.editForm.isAdd = true
        this.resetEditForm()

        // 获取当前赛制成长信息
        this.getCurrCsGrowInfo()
      }
      // 调用动态配置方法，根据报名类型设置配置选项
      this.getAfterTypeCfgOptions()
      this.getAfterUpdatedSceneSelection()
      this.editForm.visable = true
    },

    /**
     * 关闭编辑对话框
     */
    closeEditDialog() {
      this.editForm.visable = false
    },

    /**
     * 重置编辑表单
     */
    resetEditForm() {
      this.editForm.data = initEditFormData()
      this.editForm.loopDetail = initLoopDetail()
      this.editForm.rankRewards = initRankRewards()
      this.editForm.appInfo = initAppInfo()
      this.editForm.whileList = initWhiteList()
      this.editForm.signExtra = initSignExtra()
      this.editForm.listExtra = initListExtra()
      this.editForm.prizeExtra = initPrizeExtra()
      this.editForm.singleCopyExtr = initSingleCopy()
    },

    /**
     * 保存比赛
     */
    async saveMatch(env) {
      try {

        // 执行配置检查
        if (!await this.configCheck()) {
          return false
        }

        // 人满即开时，提前进入时间等于提前显示时间
        if (this.editForm.data.opentMatchType == 1) {
          this.editForm.data.preEnterSeconds = this.editForm.data.preShowSeconds
        }

        // 修复道具信息
        this.fixPropsInfo()

        // 准备数据
        const rankReward = JSON.stringify(this.editForm.rankRewards)
        const whileDetail = JSON.stringify(this.editForm.whileList)
        let repeatDetail = ''
        let bTime = 0
        let eTime = 0

        // 处理时间配置
        if (this.editForm.data.repeatType == 0) {
          // 单场
          if (this.editForm.loopDetail.onceTime) {
            bTime = Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)
            eTime = Math.floor(this.editForm.loopDetail.onceTime[1] / 1000)
            repeatDetail = JSON.stringify({ startTime: bTime, endTime: eTime })
          }
        } else {
          // 循环
          bTime = Math.floor(this.editForm.loopDetail.loopStartDate / 1000)
          eTime = Math.floor(this.editForm.loopDetail.loopEndDate / 1000) + (86400 - 1) // 结束日期为当天23:59:59
          const intervalDay = this.editForm.loopDetail.intervalDay

          if (this.editForm.data.repeatType == 1) {
            // 单天单场循环
            repeatDetail = JSON.stringify({
              startTime: bTime,
              endTime: eTime,
              intervalDay: intervalDay,
              msTime: this.editForm.loopDetail.single.stime,
              meTime: this.editForm.loopDetail.single.etime
            })
          } else {
            // 单天多场循环
            repeatDetail = JSON.stringify({
              startTime: bTime,
              endTime: eTime,
              intervalDay: intervalDay,
              loopData: this.editForm.loopDetail.loopData
            })
          }
        }
        // 发送请求
        const response = await request({
          url: '/matchconfig/match/config/create',
          method: 'POST',
          data: {
            Env: env,
            Id: this.editForm.data.id,
            AppInfo: JSON.stringify(this.editForm.appInfo),
            Name: this.editForm.data.name,
            Status: this.editForm.data.status,
            GameId: this.editForm.data.gameId,
            CsId: this.editForm.data.csId,
            OpenMatchType: this.editForm.data.opentMatchType,
            OpenMatchMember: this.editForm.data.opentMatchMember,
            SignUpType: this.editForm.data.signUpType,
            SignUpNum: this.editForm.data.signUpNum,
            Rewards: rankReward,
            RepeatType: this.editForm.data.repeatType,
            DisappearType: this.editForm.data.disappearType,
            RepeatDetail: repeatDetail,
            ImagePath: this.editForm.data.imagePath,
            Modifier: this.$store.getters.name,
            WhileList: whileDetail,
            PreShowSeconds: this.editForm.data.preShowSeconds,
            PreEnterSeconds: this.editForm.data.preEnterSeconds,
            DelayEnterSeconds: this.editForm.data.delayEnterSeconds,
            OpenDaysLimit: this.editForm.data.openDaysLimit,
            Sort: this.editForm.data.sort,
            AssociateKey: this.editForm.data.associateKey,
            DcReport: this.editForm.data.dcReport,
            SignExtra: JSON.stringify(this.editForm.signExtra),
            PrizeExtra: JSON.stringify(this.editForm.prizeExtra),
            ListExtra: JSON.stringify(this.editForm.listExtra)
          }
        })

        if (response.RetCode === 0) {
          let showMsg = '新增比赛配置成功！'
          if (this.editForm.data.id > 0) {
            showMsg = '编辑比赛配置成功！'
          }
          this.editForm.singleCopyExtr.Id = 0
          this.editForm.singleCopyExtr.isCopy = false
          Message.success(showMsg)
          this.closeEditDialog()
          // 重新加载列表
          await this.getMatchList(env)
          return true
        } else {
          Message.error('保存失败: ' + (response.Data || '未知错误'))
          return false
        }
      } catch (error) {
        Message.error('保存比赛失败: ' + error.message)
        return false
      }
    },

    /**
     * 配置检查
     */
    async configCheck() {
      if (this.editForm.data.gameId == 0) {
        Message.error('请选择游戏')
        return false
      }
      if (this.editForm.data.name == '') {
        Message.error('请输入比赛名称')
        return false
      }
      if (this.editForm.appInfo[0].channelId.length == 0) {
        Message.error('请先选择渠道ID')
        return false
      }
      if (this.editForm.data.imagePath == '') {
        Message.error('请上传封面图片')
        return false
      }

      if (this.editForm.data.signUpType === 1) {
         // 如果是免费报名，重置报名费数量为0
        this.editForm.data.signUpNum = 0
      }

      // 付费赛的，每日限制不开启
      if (this.editForm.data.signUpType === 0) {
        this.editForm.data.openDaysLimit = 0
        this.editForm.signExtra.betCnt = 0
      }

      if (this.editForm.data.openDaysLimit > 0 && this.editForm.data.signUpType != 0) {
        Message.error('每日限制已经开启')
      }

      // 付费赛
      if (this.editForm.data.signUpType === 0) {
        if (this.editForm.data.signUpNum === 0) {
          Message.error('付费赛报名费不能为0')
          return false
        }
        this.editForm.signExtra.propId = 0
        this.editForm.signExtra.propType = 0
        this.editForm.signExtra.propCost = 0
        this.editForm.signExtra.propNum = 0
      }

      if (this.editForm.data.signUpType === 1 && this.editForm.prizeExtra.awardType == 1) {
        Message.error('当前选择的是免费赛,不能选择动态奖池分配模式')
        return false
      }

      // 验证奖励配置
      this.editForm.prizeExtra.rewardType = parseInt(this.editForm.prizeExtra.rewardType)
      if (this.editForm.prizeExtra.awardType === 0) {
        this.editForm.prizeExtra.rewardType = 1
        this.editForm.prizeExtra.sceneId = 0
        //console.log("checkRewardCfg rewards",this.editForm.rankRewards)
        if (!await this.checkRewardCfg(this.editForm.rankRewards)) {
          return false
        }
      }

      if (this.editForm.prizeExtra.awardType === 1) {
        //console.log("checkDynamicRewardCfg rewards",this.editForm.rankRewards)
        if (!await this.checkDynamicRewardCfg(this.editForm.rankRewards)) {
          return false
        }
      }

      if (this.editForm.prizeExtra.awardType == 1 && this.editForm.prizeExtra.prizeTemplateId == 0) {
        Message.error('当前是动态奖池，请选择模板')
        return false
      }

      if ((this.editForm.prizeExtra.awardType == 1) && (this.editForm.prizeExtra.prizeRate < 1 || this.editForm.prizeExtra.prizeRate >= 100)) {
        Message.error('当前是动态奖池，手续费率范围是[1-100)')
        return false
      }

      if (this.editForm.prizeExtra.awardType === 1) {
        // 目前动态奖池只有真金和返水金
        if (this.editForm.prizeExtra.rewardType === 2) {
          this.editForm.prizeExtra.rewardType = 3
        }
         // 动态奖池奖励类型如果是返水金，填充返水金类型
        if (this.editForm.prizeExtra.rewardType === 3) {
          this.editForm.prizeExtra.sceneId = this.configs.rebateScenesCfgs[0].value
        }
      }

      if (!await this.propCheck()) {
        return false
      }

      if (this.editForm.whileList.type == 1) {
         // 如果开启白名单，则白名单不可为空
        if (this.editForm.whileList.data == '') {
           Message.error('白名单不可为空！')
          return false
        }
      }

      // 单场赛时间检查
      if(this.editForm.data.repeatType == 0){
        // 检查时间控件是否已选择
        if (!this.editForm.loopDetail.onceTime || !Array.isArray(this.editForm.loopDetail.onceTime) ||
            this.editForm.loopDetail.onceTime[0] == null || this.editForm.loopDetail.onceTime[1] == null ||
            this.editForm.loopDetail.onceTime[0] == '' || this.editForm.loopDetail.onceTime[1] == '') {
              Message.error('开赛时间不能为空')
          return false
        }
        const bTime = Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)
        const eTime = Math.floor(this.editForm.loopDetail.onceTime[1] / 1000)

        //开赛时间or结束时间 不能小于当前时间一年之前的时间
        if (bTime < Date.now() / 1000 - 365 * 24 * 60 * 60 || eTime < Date.now() / 1000 - 365 * 24 * 60 * 60) {
          Message.error('开赛时间或结束时间不能小于当前时间一年之前的时间')
          return false
        }
        //结束时间跟开始时间要大于10分钟
        if (eTime - bTime < 600) {
          Message.error('比赛开始结束间隔要大于10分钟！')
          return false
        }
      }

      if (this.editForm.data.repeatType == 1) {
        if (Math.floor(this.timeToSec(this.editForm.loopDetail.single.etime)) - Math.floor(this.timeToSec(this.editForm.loopDetail.single.stime)) < 600) {
          Message.error('比赛开始结束间隔要大于10分钟！')
          return false
        }
        if (this.editForm.loopDetail.single.etime == '' || this.editForm.loopDetail.single.stime == '') {
          Message.error('比赛开始结束时间不能为空')
          return false
        }
      }

      if (this.editForm.data.repeatType != 0) {
        if (this.editForm.loopDetail.intervalDay < 0) {
           Message.error('循环赛间隔天数需要设置大于等于0（最小为0表示每天创建）！')
          return false
        }
      }

      if (this.editForm.data.repeatType == 2) {
        if (this.editForm.loopDetail.loopData && this.editForm.loopDetail.loopData.length > 0) {
          for (var i = 0; i < this.editForm.loopDetail.loopData.length; i++) {
            if ((Math.floor(this.timeToSec(this.editForm.loopDetail.loopData[i].etime)) - Math.floor(this.timeToSec(this.editForm.loopDetail.loopData[i].stime))) < 600) {
              Message.error('比赛开始结束间隔要大于10分钟！')
              return false
            }

            if (this.editForm.loopDetail.loopData[i].intervalSeconds < 120) {
              Message.error('循环赛间隔时间至少大于120秒（2分钟）！')
              return false
            }
            if (this.editForm.loopDetail.loopData[i].etime == '' || this.editForm.loopDetail.loopData[i].stime == '') {
              Message.error('循环赛开始结束时间不能为空')
              return false
            }
          }
        }
      }

      if ((this.editForm.data.repeatType != 0) && ((Math.floor(this.editForm.loopDetail.loopEndDate / 1000) < Math.floor(this.editForm.loopDetail.loopStartDate / 1000)))) {
        Message.error('循环赛比赛结束时间需要大于比赛开始时间！')
        return false
      }

      if (this.editForm.data.opentMatchMember <= 0) {
           Message.error('开赛人数值无效！')
        return false
      } else if (this.editForm.data.opentMatchMember < 4) {
           Message.error('最低开赛人数值大于4！')
        return false
      } else if (this.editForm.signExtra.matchMaxLimit > 0 && this.editForm.signExtra.matchMaxLimit < this.editForm.data.opentMatchMember) {
           Message.error('报名最大限制必须大于最低开赛人数')
        return false
      } else if (this.editForm.data.signUpNum < 0) {
        Message.error('报名费数值不能小于零')
        return false
      } else if (this.editForm.data.csId <= 0) {
        Message.error('赛制选择不能为空')
        return false
      } else {
        // 获取打立阶段最大时长
        const endMin = this.configs.endMinuteCfgs.get(this.editForm.data.csId)
        if ((endMin > 0) && ((this.editForm.data.delayEnterSeconds / 60) > endMin)) {
          Message.error('延迟进入时间不能大于打立出局阶段总时长')
          return false
        }
        if ((endMin > 0) && ((this.editForm.listExtra.delaySignUpSeconds / 60) > endMin)) {
          Message.error('延迟报名时间不能大于打立出局阶段总时长')
          return false
        }

        const endNum = this.configs.endNumCfgs.get(this.editForm.data.csId)
        const promoteNum = this.configs.promoteNumCfgs.get(this.editForm.data.csId)
        const ruleExtra = this.configs.csExtraCfgs.get(this.editForm.data.csId)

        if (this.editForm.data.opentMatchType == 2 && this.editForm.data.opentMatchMember < endNum) {
          if(ruleExtra == null || ruleExtra.skip_strikeout == 0) { //跳过打立赛事不做数值检查
            Message.error('开赛人数不能小于打立出局的结束规则的剩余人数')
            return false
          }
        }

        if (this.editForm.data.opentMatchType == 2 && this.editForm.data.opentMatchMember < promoteNum) {
          if(ruleExtra == null || ruleExtra.skip_strikeout == 0) { //跳过打立赛事不做数值检查
            Message.error('开赛人数不能小于打立出局的晋级规则的晋级人数')
            return false
          }
        }

        if (this.editForm.data.opentMatchType == 1) {
          const promotion_user_num = this.configs.reachOutNumCfgs.get(this.editForm.data.csId)
          if (this.editForm.data.opentMatchMember < promotion_user_num) {
            Message.error('开赛人数不能小于定局第一阶段的晋级人数')
            return false
          }
        }

        if (this.editForm.data.opentMatchType == 1 && this.editForm.data.disappearType != 1) {
          Message.error('sng比赛必须开赛后消失')
          return false
        }
      }

      if (this.editForm.data.preShowSeconds <= 0 || this.editForm.data.preEnterSeconds <= 0) {
        Message.error('提前进入时间 或者是提前显示时间不能配置为0')
        return false
      }

      if (!this.reubyConfigCheck()) {
        return false
      }

      if (!this.checkDelaySignUpConfig()) {
        return false
      }
      return true
    },


    /**
     * 修复道具信息
     */
    fixPropsInfo() {
      // 修复奖励道具信息
      for (let i = 0; i < this.editForm.rankRewards.length; i++) {
        const element = this.editForm.rankRewards[i]
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          element.propsReward = this.getPropsRewardItem(
            element.propsReward.propsId,
            element.propsReward.propsNum,
            element.propsReward.propExpireDays
          )
        }
      }

      // 修复报名和重买道具信息
      const propsInfo =  this.configs.matchPropsCfgs || []
      for (let i = 0; i < propsInfo.length; i++) {
        const prop = propsInfo[i]

        // 修复报名道具信息
        if (prop.propsId === this.editForm.signExtra.propId) {
          this.editForm.signExtra.propType = prop.propsType
          this.editForm.signExtra.propCost = prop.propsCost
          this.editForm.signExtra.propName = prop.propsName
        }

        // 修复重买道具信息
        if (prop.propsId === this.editForm.signExtra.reubyExtra.rebuyPropId) {
          this.editForm.signExtra.reubyExtra.rebuyPropType = prop.propsType
          this.editForm.signExtra.reubyExtra.rebuyPropCost = prop.propsCost
          this.editForm.signExtra.reubyExtra.rebuyPropName = prop.propsName
        }
      }
    },

    // reuby 配置检测
    rebuyConfigReset() {
      this.editForm.signExtra.reubyExtra = {}
      this.editForm.signExtra.reubyExtra.supportRebuy = 0
      this.editForm.signExtra.reubyExtra.reubyFree = 0
      this.editForm.signExtra.reubyExtra.reubyRound = 0
      this.editForm.signExtra.reubyExtra.reubyScores = 0
      this.editForm.signExtra.reubyExtra.reubySecs = 0
      this.editForm.signExtra.reubyExtra.reubyCount = 0
      this.editForm.signExtra.reubyExtra.rebuySignType = 0
      this.editForm.signExtra.reubyExtra.rebuyPropId = 0
      this.editForm.signExtra.reubyExtra.rebuyPropNum = 0
      this.editForm.signExtra.reubyExtra.rebuyPropCost = 0
      this.editForm.signExtra.reubyExtra.rebuyPropType = 0
      this.editForm.signExtra.reubyExtra.rebuyPropName = ''
    },

    reubyConfigCheck() {
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 0) {
        this.rebuyConfigReset()
        return true
      }
      // 免费赛配buy 规则不允许
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1 && this.editForm.data.signUpType === 1) {
        this.rebuyConfigReset()
        Message.error('免费报名不支持rebuy')
        return false
      }
      // 纯门票报名比赛 不支持rebuy
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1 && this.editForm.data.signUpType === 2) {
        this.rebuyConfigReset()
        Message.error('纯门票报名比赛不支持rebuy')
        return false
      }
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 0 || this.editForm.data.signUpType === 1) {
        this.rebuyConfigReset()
      }

      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1) {
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 0) {
          this.editForm.signExtra.reubyExtra.rebuyPropNum = 0
          this.editForm.signExtra.reubyExtra.rebuyPropId = 0
          this.editForm.signExtra.reubyExtra.rebuyPropCost = 0
        }
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 2) {
          this.editForm.signExtra.reubyExtra.reubyFree = 0
        }
        if (this.editForm.signExtra.reubyExtra.reubyRound === 0 ||
          this.editForm.signExtra.reubyExtra.reubyScores === 0 || this.editForm.signExtra.reubyExtra.reubySecs === 0 ||
          this.editForm.signExtra.reubyExtra.reubyCount === 0) {
            Message.error('reuby配置有错,请检查')
          return false
        }
        // 付费 或者金币or门票
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 0 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) {
          if (this.editForm.signExtra.reubyExtra.reubyFree <= 0) {
            Message.error('当前是付费或者金币or门票reuby 报名费用不能为0')
            return false
          }
          if ((this.editForm.data.signUpType === 0 || this.editForm.data.signUpType === 3) && this.editForm.data.signUpNum !== this.editForm.signExtra.reubyExtra.reubyFree) {
            Message.error('当前是付费或者金币or门票reuby rebuy费用跟报名费不一致,请检查')
            return false
          }
        }
        // 纯门票 或者金币or门票
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 2 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) {
          if (this.editForm.signExtra.reubyExtra.rebuyPropId <= 0 || this.editForm.signExtra.reubyExtra.rebuyPropNum <= 0) {
            Message.error('当前是纯门票或者 金币or门票reuby 请选择门票或者填门票数量')
            return false
          }
        }
      }
      // 买入积分检测
      var disuseScores = this.configs.disuseScoreGrowDetail.get(this.editForm.data.csId)
      if (disuseScores && disuseScores.length > 0) {
        for (var i = 0; i < disuseScores.length; i++) {
          if (disuseScores[i].index === this.editForm.signExtra.reubyExtra.reubyRound && this.editForm.signExtra.reubyExtra.reubyScores < disuseScores[i].disuse_score) {
            Message.error('买入积分小于当前打立阶段轮数淘汰分[' + disuseScores[i].disuse_score + '],请检查配置')
            return false
          }
        }
      }

      var grow_total = this.configs.growTotalNumCfgs.get(this.editForm.data.csId)
      if (grow_total.length <= this.editForm.signExtra.reubyExtra.reubyRound) {
        Message.error('rebuy截止轮次大于当前赛制打立阶段的最大轮次,请检查配置')
        return false
      }
      //如果开启了延迟报名时间 则rebuy总时长必须大于延迟报名时间
      if(this.editForm.listExtra.delaySignUpSeconds >0){
        let rebuyTotalSecs = 0
        for (let i = 0; i < this.editForm.signExtra.reubyExtra.reubyRound; i++) {
          rebuyTotalSecs += disuseScores[i].duration
        }
        if (this.editForm.listExtra.delaySignUpSeconds >= rebuyTotalSecs) {
          Message.error('延迟报名时间不能大于等于rebuy总时长')
          return false
        }
      }
      return true
    },
    /**
     * 道具检查
     */
    async propCheck() {
      // 道具报名或金币/门票报名
      if (this.editForm.data.signUpType === 2 || this.editForm.data.signUpType === 3) {
        if (this.editForm.signExtra.propId > 0) {
          if (!await this.propTakeEffectCheck(this.editForm.signExtra.propId)) {
            Message.error('所选选择的道具不生效')
            return false
          }
        }
      }

      // 金币或门票报名
      if (this.editForm.data.signUpType === 3) {
        if (this.editForm.data.signUpNum === 0) {
          Message.error('付费赛报名费不能为0')
          return false
        }
        if (this.editForm.signExtra.propId === 0) {
          Message.error('金币或门票报名必须选择门票')
          return false
        }
      }

      // 纯门票报名
      if (this.editForm.data.signUpType === 2) {
        this.editForm.data.signUpNum = 0
        if (this.editForm.signExtra.propId === 0) {
          Message.error('门票报名必须选择门票')
          return false
        }
      }

      // Rebuy 道具检测
      if ((this.editForm.signExtra.reubyExtra.rebuySignType === 2 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) &&
          this.editForm.signExtra.reubyExtra.rebuyPropId > 0) {
        if (!await this.propTakeEffectCheck(this.editForm.signExtra.reubyExtra.rebuyPropId)) {
          Message.error('Rebuy所选择的道具不生效')
          return false
        }
      }

      return true
    },

    /**
     * 道具生效检查
     */
    async propTakeEffectCheck(propId) {
      if (propId > 0 && this.configs.matchPropsCfgs && this.configs.matchPropsCfgs.length > 0) {
        for (let i = 0; i < this.configs.matchPropsCfgs.length; i++) {
          if (propId === this.configs.matchPropsCfgs[i].propsId) {
            return true
          }
        }
      }
      return false
    },

    /**
     * 检查固定奖励配置
     */
    async checkRewardCfg(rewards) {
      if (rewards.length <= 0) {
        Message.error('请添加固定奖励配置')
        return false
      }

      // 前三名单独检测
      const topThree = []
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank === element.endRank && element.startRank <= 3) {
          topThree.push(element.startRank)
        }
      }

      if (topThree.length === 0) {
        Message.error('至少需要配一名奖励,且请以1-1,2-2,3-3的格式配')
        return false
      }

      // 检查前三名是否连续
      for (let i = 0; i < topThree.length - 1; i++) {
        if (topThree[i] + 1 !== topThree[i + 1]) {
          Message.error('奖励名次必须是从第一名开始连续配置,且请以1-1,2-2,3-3的格式配')
          return false
        }
      }

      // 遍历配置项
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank <= 0 || element.endRank < element.startRank) {
          Message.error('请填写正确的排名')
          return false
        }
        if (element.startRank <= 3 && element.startRank !== element.endRank) {
          Message.error('奖励前三名需要单独配，名次区间请配置成：1-1  2-2 3-3')
          return false
        }
        if (element.startRank >= 4 && topThree.length < 3) {
          Message.error('前三名必须配,且请以1-1,2-2,3-3的格式配')
          return false
        }
        if (element.startRank >= 4 && index > 0 && element.startRank <= rewards[index - 1].endRank) {
          Message.error('名次配置必须连续')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.hasOwnProperty('rewardItems') && element.propsReward.propsId <= 0 && element.rewardItems[0].getNum <= 0) {
          Message.error('当前名次没有配任何奖励,请检查')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsNum > 0 && element.propsReward.propsId <= 0 ) {
          Message.error('名次[' + element.startRank + '-' + element.endRank + ']项请选择道具')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 && (element.propsReward.propsNum === 0 || element.propsReward.propsNum === undefined)) {
          Message.error('名次[' + element.startRank + '-' + element.endRank + ']项请填写道具数量')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 &&
          this.checkPropNeedExpireDays(element.propsReward.propsId, element.propsReward.propsNum, element.propsReward.propExpireDays) && element.propsReward.propExpireDays < 0) {
          Message.error('请选择道具过期天数')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          if (!await this.propTakeEffectCheck(element.propsReward.propsId)) {
            Message.error('所选择的道具不生效,请检查')
            return false
          }
        }
        if (element.rewardItems.length === 0) {
          Message.error('请添加奖励配置')
          return false
        }

        // 遍历奖励配置项
        for (let i = 0; i < element.rewardItems.length; i++) {
          const rewardItem = element.rewardItems[i]
          if (rewardItem.getType === 1) {
            element.rewardItems[i].sceneId = 0
          } else if (rewardItem.getType === 2) {
            if (!this.isInBetScenes(rewardItem.sceneId)) {
              Message.error('名次[' + element.startRank + '-' + element.endRank + ']第' + rewardItem.index + '项请正确选择投注金')
              return false
            }
          } else if (rewardItem.getType === 3) {
            if (!this.isInRebateScenes(rewardItem.sceneId)) {
              Message.error('名次[' + element.startRank + '-' + element.endRank + ']第' + rewardItem.index + '项请正确选择返水金')
              return false
            }
          }
        }
      }
      return true
    },

    /**
     * 检查动态奖励配置
     */
    async checkDynamicRewardCfg(rewards) {
      // 前三名单独检测
      var topThree = []
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank === element.endRank && element.startRank <= 3) {
          topThree.push(element.startRank)
        }
      }


      for (let i = 0; i < topThree.length - 1; i++) {
        if (topThree[i] + 1 !== topThree[i + 1]) {
          Message.error('奖励名次必须是从第一名开始连续配置,且请以1-1,2-2,3-3的格式配')
          return false
        }
      }

      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank <= 0 || element.endRank < element.startRank) {
          Message.error('请填写正确的排名')
          return false
        }
        if (element.startRank <= 3 && element.startRank !== element.endRank) {
          Message.error('奖励前三名需要单独配，名次区间请配置成：1-1  2-2 3-3')
          return false
        }
        if (element.startRank >= 4 && topThree.length < 3) {
          Message.error('前三名必须配,且请以1-1,2-2,3-3的格式配')
          return false
        }
        if (element.startRank >= 4 && index > 0 && element.startRank <= rewards[index - 1].endRank) {
          Message.error('名次配置必须连续')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsNum > 0 && element.propsReward.propsId <= 0){
          Message.error('名次[' + element.startRank + '-' + element.endRank + ']项请选择道具')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 && (element.propsReward.propsNum === 0 || element.propsReward.propsNum === undefined)) {
          Message.error('请选择道具或者填写道具数量')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 &&
          this.checkPropNeedExpireDays(element.propsReward.propsId,element.propsReward.propsNum, element.propsReward.propExpireDays) &&  element.propsReward.propExpireDays < 0) {
          Message.error('请选择道具过期天数')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          if (!await this.propTakeEffectCheck(element.propsReward.propsId)) {
            Message.error('所选择的道具不生效,请检查')
            return false
          }
        }
      }
      return true
    },

    /**
     * 检查场景是否在投注金场景配置中
     */
    isInBetScenes(scene) {
      for (let index = 0; index < this.configs.betScenesCfgs.length; index++) {
        if (this.configs.betScenesCfgs[index].value === scene) {
          return true
        }
      }
      return false
    },

    /**
     * 检查场景是否在返水金场景配置中
     */
    isInRebateScenes(scene) {
      for (let index = 0; index < this.configs.rebateScenesCfgs.length; index++) {
        if (this.configs.rebateScenesCfgs[index].value === scene) {
          return true
        }
      }
      return false
    },

    /**
     * 解析JSON数据
     */
    parseJsonData(jsonString, defaultValue, type = 'object') {
      if (!jsonString || jsonString === '无' || jsonString === '') {
        return defaultValue
      }

      try {
        const parsed = JSON.parse(jsonString)
        if (type === 'array' && !Array.isArray(parsed)) {
          return defaultValue
        }
        return parsed
      } catch (e) {
        return defaultValue
      }
    },

    /**
     * 解析白名单数据
     */
    parseWhiteListData(whileListString) {
      if (!whileListString || whileListString === '无' || whileListString === '') {
        return initWhiteList()
      }

      try {
        const whileList = JSON.parse(whileListString)
        return {
          type: whileList.type || 0,
          data: whileList.data || ''
        }
      } catch (e) {
        return initWhiteList()
      }
    },

    /**
     * 解析报名额外数据
     */
    parseSignExtraData(signExtraString) {
      if (!signExtraString || signExtraString === '无' || signExtraString === '') {
        return initSignExtra()
      }

      try {
        return JSON.parse(signExtraString)
      } catch (e) {
        return initSignExtra()
      }
    },

    /**
     * 添加排名奖励
     */
    addRankReward() {
        let index = 0
        let maxRank = 0
        if (this.editForm.rankRewards.length > 0) {
            index = this.editForm.rankRewards.length
            for (let i = 0; i < this.editForm.rankRewards.length; i++) {
                if (this.editForm.rankRewards[i].endRank > maxRank) {
                    maxRank = this.editForm.rankRewards[i].endRank
                }
            }
        }
        index ++
        maxRank++
      const newReward = {
        index: index,
        startRank: maxRank,
        endRank: maxRank,
        rewardItems: [
          {
            index: 1,
            getType:1,
            getPid: 0,
            getNum: 1,
            sceneId: 0
          }
        ],
        propsReward: {
          propsId: 0,
          propsType: 0,
          propsName: '',
          propsIcon: '',
          propsAttr: '',
          propsNum: 0,
          propExpireDays: -1,
          propsSceneId:0,
        }
      }
      this.editForm.rankRewards.push(newReward)
    },

    /**
     * 删除排名奖励
     */
    removeRankReward(index) {
      this.editForm.rankRewards.splice(index, 1)
      // 重新设置索引
      this.editForm.rankRewards.forEach((item, idx) => {
        item.index = idx + 1
      })
    },

    /**
     * 处理奖励类型变化
     */
    handleRewardTypeChange(index, value) {
      this.editForm.rankRewards[index].rewardType = value
    },

    /**
     * 处理奖励数量变化
     */
    handleRewardNumChange(index, value) {
      this.editForm.rankRewards[index].rewardNum = value
    },

    /**
     * 处理道具变化
     */
    handlePropsChange(rankIndex, value) {
      this.editForm.rankRewards[rankIndex].propsReward.propsId = value
    },

    /**
     * 处理道具数量变化
     */
    handlePropsNumChange(rankIndex, value) {
      this.editForm.rankRewards[rankIndex].propsReward.propsNum = Number(value) || 0
    },

    /**
     * 处理道具过期时间变化
     */
    handlePropsExpireChange(rankIndex, value) {
      this.editForm.rankRewards[rankIndex].propsReward.propExpireDays = value
    },

    /**
     * 处理开始排名变化
     */
    handleStartRankChange(rankIndex, value) {
      // 將字符串轉換為數字
      const numericValue = parseInt(value, 10)
      this.editForm.rankRewards[rankIndex].startRank = isNaN(numericValue) ? 0 : numericValue
    },

    /**
     * 处理结束排名变化
     */
    handleEndRankChange(rankIndex, value) {
      // 將字符串轉換為數字
      const numericValue = parseInt(value, 10)
      this.editForm.rankRewards[rankIndex].endRank = isNaN(numericValue) ? 0 : numericValue
    },
    handleSetCopyExtr(ID) {
      this.editForm.singleCopyExtr.isCopy = true
      this.editForm.singleCopyExtr.id = ID
    },
    checkDelaySignUpConfig(){
      if(this.editForm.listExtra.delaySignUpSeconds > 0){
        if(this.editForm.data.opentMatchType === 1){
          this.errmsg('sng比赛不支持延迟报名')
          return false
        }
        //如果开启了每日多长循环赛
        if(this.editForm.data.repeatType ===2 && this.editForm.loopDetail.loopData.length >0){
          for(let i=0;i<this.editForm.loopDetail.loopData.length;i++){
            if(this.editForm.loopDetail.loopData[i].intervalSeconds < 30*60) {
              this.errmsg('每日循环赛的间隔时间不能小于30分钟')
              return false
            }
          }
        }

        //不同时支持延迟进入 跟延迟报名
        if(this.editForm.data.delayEnterSeconds >0 && this.editForm.listExtra.delaySignUpSeconds >0){
          this.errmsg('延迟进入时间不能跟延迟报名时间同时配置')
          return false
        }
        return true
      }
      return true
    },
  },
}
