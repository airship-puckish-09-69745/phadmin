<template>
  <div class="app-container">
    <el-row>
      <publish
        primary-key="matchCfgId"
        key-id="MatchConfig"
        :env-empty="true"
        :attr-names="AttrNames"
        :make-content="makeContent"
        :head-attrs="headAttrs"
      />
    </el-row>
    <el-row>
      <!-- 搜索表单 -->
      <SearchForm
        :form="searchForm"
        :loading="loading"
        :game-cfgs="configs.gameCfgs"
        :repeat-cfgs="configs.repeatCfgs"
        :status-cfgs="configs.statusCfgs"
        :cs-cfgs="configs.csCfgs"
        @search="handleSearch"
        @reset-search="handleResetSearch"
      />

      <!-- 数据表格 -->
      <DataTable
        :table-data="tableData"
        :page="page"
        :limit="limit"
        :total="total"
        :loading="loading"
        :game-cfgs="configs.gameCfgs"
        :repeat-cfgs="configs.repeatCfgs"
        :show-dev-tool="showDevTool"
        @edit="handleEdit"
        @delete="handleDelete"
        @copy="handleCopy"
        @update-status="handleUpdateStatus"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        @add-match="handleAddMatch"
        @show-dev-tools="handleShowDevTools"
        @copy-all="handleCopyAll"
        @expire-all="handleExpireAll"
        @delete-all-off="handleDeleteAllOff"
      />

      <!-- 编辑对话框 -->
      <EditDialog
        :edit-form="editForm"
        :show-tip="showTip"
        :configs="configs"
        :attr-names="attrNames"
        :game-cfgs="configs.gameCfgs"
        :show-cs-cfgs="configs.showCsCfgs"
        :open-match-type-cfgs="configs.openMatchTypeCfgs"
        :while-list-cfgs="configs.whileListCfgs"
        :repeat-cfgs="configs.repeatCfgs"
        :disappear-cfgs="configs.disappearCfgs"
        :sign-up-type-cfgs="configs.signUpTypeCfgs"
        :get-type-cfgs="configs.getTypeCfgs"
        :bet-scenes-cfgs="configs.betScenesCfgs"
        :rebate-scenes-cfgs="configs.rebateScenesCfgs"
        :match-props-cfgs="configs.matchPropsCfgs"
        :match-tickets-cfgs="configs.matchTicketsCfgs"
        :rebuy-sign-up-type-cfgs="configs.rebuySignUpTypeCfgs"
        :reuby-grow-cfgs="configs.reubyGrowCfgs"
        :guide-show-cfgs="configs.guideShowCfgs"
        :match-list-tag-options="configs.matchListTagOptions"
        :prize-modle-cfgs="configs.prizeModleCfgs"
        :prize-template-cfg="configs.prizeTemplateCfg"
        :item-day-type-options="configs.itemDayTypeOptions"
        :match-pusoy-unique-id-cfg="configs.MATCH_PUSOY_UNIQUE_ID_CFG"
        :match-pusoy-table-scene-id-cfg="configs.MATCH_PUSOY_TABLE_SCENE_ID_CFG"
        @save="handleSave"
        @close="handleCloseEdit"
        @app-id-change="handleAppIdChange"
        @game-change="handleGameChange"
        @cs-change="handleCsChange"
        @sort-change="handleSortChange"
        @sign-up-type-change="handleSignUpTypeChange"
        @prop-change="handlePropChange"
        @rebuy-sign-type-change="handleRebuySignTypeChange"
        @rebuy-prop-change="handleRebuyPropChange"
        @associate-key-change="handleAssociateKeyChange"
        @match-events-change="handleMatchEventsChange"
        @dc-report-change="handleDcReportChange"
        @award-type-change="handleAwardTypeChange"
        @prize-template-change="handlePrizeTemplateChange"
        @prize-rate-change="handlePrizeRateChange"
        @reward-type-radio-change="handleRewardTypeRadioChange"
        @add-rank-reward="addRankReward"
        @remove-rank-reward="removeRankReward"
        @reward-type-change="handleRewardTypeChange"
        @reward-num-change="handleRewardNumChange"
        @props-change="handlePropsChange"
        @props-num-change="handlePropsNumChange"
        @props-expire-change="handlePropsExpireChange"
        @start-rank-change="handleStartRankChange"
        @end-rank-change="handleEndRankChange"
      />
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { IsMars } from '@/utils/env'
import { MATCH_IUPSTREAM_TYPE_OPTIONS, ITEM_DAY_TYPE_OPTIONS ,MATCH_LIST_TAG_OPTIONS} from '@/utils/options'
import { getAllMatchGuidesConfig } from '@/utils/common-game-config'
import request from '@/utils/request'
import Publish from '@/components/Publish'

// 导入子组件
import SearchForm from './components/SearchForm.vue'
import DataTable from './components/DataTable.vue'
import EditDialog from './components/EditDialog.vue'
import SignUpConditionConfig from './components/SignUpConditionConfig.vue'
import RebuyConditionConfig from './components/RebuyConditionConfig.vue'

// 导入 Mixins
import { matchDataMixin } from './mixins/matchDataMixin'
import { matchFormMixin } from './mixins/matchFormMixin'
import { matchActionMixin } from './mixins/matchActionMixin'
import { matchUtilsMixin } from './mixins/matchUtilsMixin'

// 导入常量和工具函数
import {
  GAME_CONFIGS,
  STATUS_CONFIGS,
  REPEAT_TYPE_CONFIGS,
  DISAPPEAR_TYPE_CONFIGS,
  OPEN_MATCH_TYPE_CONFIGS,
  SIGN_UP_TYPE_CONFIGS,
  REBUY_SIGN_UP_TYPE_CONFIGS,
  GET_TYPE_CONFIGS,
  WHITE_LIST_CONFIGS,
  REBATE_SCENES_CONFIGS,
  BET_SCENES_CONFIGS,
  PRIZE_MODEL_CONFIGS,
  PROPS_INFO_CONFIGS
} from './utils/matchConfigConstants'

import {
  initRankRewards,
  initEditFormData,
  initLoopDetail,
  initAppInfo,
  initWhiteList,
  initSignExtra,
  initListExtra,
  initPrizeExtra
} from './utils/matchConfigUtils'

export default {
  name: 'MatchConfigOptimized',
  components: {
    SearchForm,
    DataTable,
    EditDialog,
    SignUpConditionConfig,
    RebuyConditionConfig,
    Publish
  },
  mixins: [
    matchDataMixin,
    matchFormMixin,
    matchActionMixin,
    matchUtilsMixin
  ],
  data() {
    return {
      // 比赛配置相关数据
      tableData: [],
      total: 0,
      page: 1,
      limit: 100,
      loading: false,
      showDevTool: false,

      // Publish 组件相关配置
      AttrNames: {
        appInfo: 'APP信息',
        matchCfgId: '赛事id',
        title: '赛事名称',
        gid: '游戏id',
        ruleId: '赛制id',
        startType: '开赛方式',
        startUserNum: '开赛人数',
        repeatType: '循环类型',
        disappearType: '消失时间点',
        startDateTime: '开始日期',
        finishDateTime: '结束日期',
        preShowSeconds: '提前展示比赛(秒)',
        preEnterSeconds: '提前进入比赛(秒)',
        delayEnterSeconds: '延迟进入比赛(秒)',
        signType: '报名方式(0:付费报名 1:免费报名 2:纯门票 3:金币or门票)',
        signNum: '报名费数量',
        status: '配置状态(0:启用 1:禁用)',
        rewardsCfg: '名次奖励',
        imagePath: '封面图片',
        whileList: '白名单',
        openDaysLimit: '每日限制',
        sort: '排序',
        repeatDelayDays: '间隔天数',
        daySections: '每日时段',
        awardType: '奖励类型',
        prizeExtra: '动态奖池信息',
        signExtra: '报名额外信息',
        associateKey: '推荐方案',
        dcReport: '是否上报数据中心'
      },
      headAttrs: ['matchCfgId', 'title'],

      // 搜索表单
      searchForm: {
        gameId: 2033, // MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_PUSOY
        status: -1,
        csId: -1,
        repeatType: -1,
        appId: -1
      },
      // 排序重复提示
      showTip: false,
      // 编辑表单
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        data: initEditFormData(),
        loopDetail: initLoopDetail(),
        rankRewards: initRankRewards(),
        appInfo: initAppInfo(),
        whileList: initWhiteList(),
        signExtra: initSignExtra(),
        listExtra: initListExtra(),
        prizeExtra: initPrizeExtra()
      },

      // 配置数据
      configs: {
        // 静态配置
        gameCfgs: GAME_CONFIGS,
        statusCfgs: STATUS_CONFIGS,
        repeatCfgs: REPEAT_TYPE_CONFIGS,
        disappearCfgs: DISAPPEAR_TYPE_CONFIGS,
        openMatchTypeCfgs: OPEN_MATCH_TYPE_CONFIGS,
        signUpTypeCfgs: SIGN_UP_TYPE_CONFIGS,
        rebuySignUpTypeCfgs: REBUY_SIGN_UP_TYPE_CONFIGS,
        getTypeCfgs: GET_TYPE_CONFIGS,
        whileListCfgs: WHITE_LIST_CONFIGS,
        rebateScenesCfgs: REBATE_SCENES_CONFIGS,
        betScenesCfgs: BET_SCENES_CONFIGS,
        prizeModleCfgs: PRIZE_MODEL_CONFIGS,
        propsInfo: PROPS_INFO_CONFIGS,

        // 动态配置
        prizeTemplateCfg: [],
        matchPropsCfgs: [],
        matchTicketsCfgs: [],
        csCfgs: [],
        showCsCfgs: [],
        guideCfgs: [],
        guideShowCfgs: [],
        matchListTagOptions: MATCH_LIST_TAG_OPTIONS,
        itemDayTypeOptions: [],

        // 比赛全局ID配置
        MATCH_PUSOY_UNIQUE_ID_CFG: [
          { value: 1, label: 'Pusoy 1' },
          { value: 2, label: 'Pusoy 2' },
          { value: 3, label: 'Pusoy 3' }
        ],

        // 比赛牌桌ID配置
        MATCH_PUSOY_TABLE_SCENE_ID_CFG: [
          { value: 1, label: '牌桌场景 1' },
          { value: 2, label: '牌桌场景 2' },
          { value: 3, label: '牌桌场景 3' }
        ],

        // Map 配置
        endMinuteCfgs: new Map(),
        endNumCfgs: new Map(),
        promoteNumCfgs: new Map(),
        reachOutNumCfgs: new Map(),
        growTotalNumCfgs: new Map(),
        disuseScoreGrowDetail: new Map(),
        csExtraCfgs: new Map(),
        csIdCfg: [],
        reubyGrowCfgs: []
      },

      // 属性名称映射
      attrNames: {
        appInfo: 'APP信息',
        matchCfgId: '赛事id',
        title: '赛事名称',
        gid: '游戏id',
        ruleId: '赛制id',
        startType: '开赛方式',
        startUserNum: '开赛人数',
        repeatType: '循环类型',
        disappearType: '消失时间点',
        startDateTime: '开始日期',
        finishDateTime: '结束日期',
        preShowSeconds: '提前展示比赛(秒)',
        preEnterSeconds: '提前进入比赛(秒)',
        delayEnterSeconds: '延迟进入比赛(秒)',
        signType: '报名方式(0:付费报名 1:免费报名 2:纯门票 3:金币or门票)',
        signNum: '报名费数量',
        status: '配置状态(0:启用 1:禁用)',
        rewardsCfg: '名次奖励',
        imagePath: '封面图片',
        whileList: '白名单',
        openDaysLimit: '每日限制',
        sort: '排序',
        repeatDelayDays: '间隔天数',
        daySections: '每日时段',
        awardType: '奖励类型',
        prizeExtra: '动态奖池信息',
        signExtra: '报名额外信息',
        associateKey: '推荐方案',
        dcReport: '是否上报数据中心'
      }
    }
  },
  computed: {
    hasData() {
      return this.tableData.length > 0
    },
    isEditMode() {
      return this.editForm.isAdd === false
    }
  },
  mounted() {
    this.initComponent()
  },
  methods: {
    /**
     * 初始化组件
     */
    async initComponent() {
      try {
        const env = this.$store.getters.env
        this.initConfigs()

        // 先加载赛制配置
        if (!IsMars()) {
          await this.getCsCfgs(env)
          await this.getPrizeTemplateCfg(env)
        } else {
          await this.getCsCfgs(env)
          await this.getPrizeTemplateCfg(env)
        }

        // 赛制配置加载完成后，根据默认游戏ID过滤赛制配置
        this.filterCsCfgsByGameId(this.searchForm.gameId)

        await this.getGuideCfgs()

        if (!IsMars()) {
          await this.getMatchProps(env)
        }

        await this.getMatchList(env)
      } catch (error) {
        // 初始化执行错误
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
