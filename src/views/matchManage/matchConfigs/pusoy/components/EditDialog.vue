<template>
  <el-dialog
    :title="editForm.title"
    :visible.sync="editForm.visable"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="900px"
    @close="handleClose"
  >
    <el-form :model="editForm.data" label-width="200px" size="mini">
      <el-form-item v-if="editForm.data.id > 0" label="赛事ID：">
        {{ editForm.data.id }}
      </el-form-item>

      <!-- APP信息配置 -->
      <AppInfoConfig
        :app-info="editForm.appInfo"
        @app-id-change="handleAppIdChange"
        @add-app-info="handleAddAppInfo"
        @remove-app-info="handleRemoveAppInfo"
      />

      <!-- 基本信息配置 -->
      <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
        <legend>基本信息</legend>
        <el-form-item label="赛事名称：" :required="true">
          <el-input v-model="editForm.data.name" style="width: 200px;" placeholder="请填写赛事名称" />
        </el-form-item>
        <el-form-item label="游戏选择：" :required="true">
          <el-select v-model="editForm.data.gameId" placeholder="请选择" size="mini" @change="handleGameChange">
            <el-option
              v-for="item in gameCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="赛制选择：" :required="true">
          <el-select v-model="editForm.data.csId" placeholder="请选择" size="mini" filterable @change="handleCsChange">
            <el-option
              v-for="item in showCsCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开赛条件：" :required="true">
          <el-select v-model="editForm.data.opentMatchType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in openMatchTypeCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最低开赛人数：" :required="true">
          <el-input v-model="editForm.data.opentMatchMember" style="width: 200px;" placeholder="请填写开赛人数" />
        </el-form-item>
        <el-form-item label="封面图片URL：" :required="true">
          <ImagePicker v-model="editForm.data.imagePath" />
        </el-form-item>
        <el-form-item label="白名单开关：" :required="true">
          <el-radio v-for="item in whileListCfgs" :key="item.value" v-model="editForm.whileList.type" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item v-if="editForm.whileList.type==1" label="白名单设置：" :required="true">
          <el-input v-model="editForm.whileList.data" style="width: 400px;" placeholder="多个uid用,分开" />
        </el-form-item>
        <el-form-item label="排序值：" :required="true">
          <el-input v-model.number="editForm.data.sort" style="width: 200px;" placeholder="值越高排序越在前" @input="handleSortChange" />
          <span v-show="showTip" style="color:red; margin-left:10px">注意有相同的排序值</span>
          <el-tooltip class="item" effect="light" placement="right-start">
            <template #content>
              <div>排序相同，时间相同则会同时展示。排序相同时间不同则大于30分钟的会展示</div>
            </template>
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="比赛全局ID：" :required="true">
          <el-select v-model="editForm.signExtra.matchUniqueId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in MATCH_PUSOY_UNIQUE_ID_CFG"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="比赛牌桌ID：" :required="true">
          <el-select v-model="editForm.listExtra.tableSceneId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in MATCH_PUSOY_TABLE_SCENE_ID_CFG"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </fieldset>

      <!-- 开赛时间配置 -->
      <LoopConfig
        :edit-form="editForm"
        :repeat-cfgs="repeatCfgs"
      />


      <!-- 報名條件配置 -->
      <SignUpConditionConfig
        :edit-form="editForm"
        :sign-up-type-cfgs="signUpTypeCfgs"
        :match-tickets-cfgs="matchTicketsCfgs"
        @sign-up-type-change="handleSignUpTypeChange"
        @prop-change="handlePropChange"
      />

      <!-- Rebuy報名條件配置 -->
      <RebuyConditionConfig
        :edit-form="editForm"
        :rebuy-sign-up-type-cfgs="rebuySignUpTypeCfgs"
        :match-tickets-cfgs="matchTicketsCfgs"
        :reuby-grow-cfgs="reubyGrowCfgs"
        @rebuy-sign-type-change="handleRebuySignTypeChange"
        @rebuy-prop-change="handleRebuyPropChange"
      />

      <!-- 显示控制 -->
      <fieldset>
        <legend>显示控制</legend>
        <el-form-item label="消失时间点：" :required="true">
          <el-select v-model="editForm.data.disappearType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in disappearCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </fieldset>

      <!-- 奖励配置 -->
      <RewardConfig
        :rank-rewards="editForm.rankRewards"
        :prize-extra="editForm.prizeExtra"
        :get-type-cfgs="getTypeCfgs"
        :bet-scenes-cfgs="betScenesCfgs"
        :rebate-scenes-cfgs="rebateScenesCfgs"
        :match-props-cfgs="matchPropsCfgs"
        :prize-modle-cfgs="prizeModleCfgs"
        :prize-template-cfg="prizeTemplateCfg"
        :item-day-type-options="itemDayTypeOptions"
        @add-reward-item="handleAddRewardItem"
        @remove-reward-item="handleRemoveRewardItem"
        @add-rank-reward="handleAddRankReward"
        @remove-rank-reward="handleRemoveRankReward"
        @reward-type-change="handleRewardTypeChange"
        @reward-num-change="handleRewardNumChange"
        @props-change="handlePropsChange"
        @props-num-change="handlePropsNumChange"
        @props-expire-change="handlePropsExpireChange"
        @award-type-change="handleAwardTypeChange"
        @start-rank-change="handleStartRankChange"
        @end-rank-change="handleEndRankChange"
        @prize-template-change="handlePrizeTemplateChange"
        @prize-rate-change="handlePrizeRateChange"
        @reward-type-radio-change="handleRewardTypeRadioChange"
      />

      <!-- 引導推薦配置 -->
      <GuideRecommendationConfig
        :edit-form="editForm"
        :guide-show-cfgs="guideShowCfgs"
        :match-list-tag-options="matchListTagOptions"
        @associate-key-change="handleAssociateKeyChange"
        @match-events-change="handleMatchEventsChange"
      />

      <!-- 數據中心上報配置 -->
      <DataCenterReportConfig
        :edit-form="editForm"
        @dc-report-change="handleDcReportChange"
      />
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AppInfoConfig from './AppInfoConfig.vue'
import LoopConfig from './LoopConfig.vue'
import RewardConfig from './RewardConfig.vue'
import SignUpConditionConfig from './SignUpConditionConfig.vue'
import RebuyConditionConfig from './RebuyConditionConfig.vue'
import GuideRecommendationConfig from './GuideRecommendationConfig.vue'
import DataCenterReportConfig from './DataCenterReportConfig.vue'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import {
  MATCH_PUSOY_UNIQUE_ID_CFG,
  MATCH_PUSOY_TABLE_SCENE_ID_CFG
} from '@/utils/options'

export default {
  name: 'EditDialog',
  components: {
    AppInfoConfig,
    LoopConfig,
    RewardConfig,
    SignUpConditionConfig,
    RebuyConditionConfig,
    GuideRecommendationConfig,
    DataCenterReportConfig,
    ImagePicker
  },
  props: {
    editForm: {
      type: Object,
      required: true
    },
    showTip: {
      type: Boolean,
      default: false
    },
    gameCfgs: {
      type: Array,
      default: () => []
    },
    showCsCfgs: {
      type: Array,
      default: () => []
    },
    openMatchTypeCfgs: {
      type: Array,
      default: () => []
    },
    whileListCfgs: {
      type: Array,
      default: () => []
    },
    repeatCfgs: {
      type: Array,
      default: () => []
    },
    disappearCfgs: {
      type: Array,
      default: () => []
    },
    signUpTypeCfgs: {
      type: Array,
      default: () => []
    },
    getTypeCfgs: {
      type: Array,
      default: () => []
    },
    betScenesCfgs: {
      type: Array,
      default: () => []
    },
    rebateScenesCfgs: {
      type: Array,
      default: () => []
    },
    matchPropsCfgs: {
      type: Array,
      default: () => []
    },
    matchTicketsCfgs: {
      type: Array,
      default: () => []
    },
    rebuySignUpTypeCfgs: {
      type: Array,
      default: () => []
    },
    reubyGrowCfgs: {
      type: Array,
      default: () => []
    },
    guideShowCfgs: {
      type: Array,
      default: () => []
    },
    matchListTagOptions: {
      type: Array,
      default: () => []
    },
    prizeModleCfgs: {
      type: Array,
      default: () => []
    },
    prizeTemplateCfg: {
      type: Array,
      default: () => []
    },
    itemDayTypeOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      MATCH_PUSOY_UNIQUE_ID_CFG,
      MATCH_PUSOY_TABLE_SCENE_ID_CFG
    }
  },
  created() {
    // EditDialog 已创建
  },
  mounted() {
    // EditDialog 已挂载
  },
  watch: {
    editForm: {
      handler(newVal) {
        // editForm 发生变化
      },
      immediate: true,
      deep: true
    },
    gameCfgs: {
      handler(newVal) {
        // gameCfgs 发生变化
      },
      immediate: true
    },
    showCsCfgs: {
      handler(newVal) {
        // showCsCfgs 发生变化
      },
      immediate: true
    }
  },
  methods: {
    repeatLoopDisabled() {
      return this.editForm.data.repeatType === 0
    },
    handleClose() {
      this.$emit('close')
    },
    handleSave() {
      this.$emit('save')
    },
    handleAppIdChange(index, appId) {
      this.$emit('app-id-change', index, appId)
    },
    handleAddAppInfo() {
      this.$emit('add-app-info')
    },
    handleRemoveAppInfo(index) {
      this.$emit('remove-app-info', index)
    },
    handleGameChange(value) {
      this.$emit('game-change', value)
    },
    handleCsChange(value) {
      this.$emit('cs-change', value)
    },
    handleSortChange(value) {
      this.$emit('sort-change', value)
    },
    handleSignUpTypeChange(value) {
      this.$emit('sign-up-type-change', value)
    },
    handlePropChange(value) {
      this.$emit('prop-change', value)
    },
    handleRebuySignTypeChange(value) {
      this.$emit('rebuy-sign-type-change', value)
    },
    handleRebuyPropChange(value) {
      this.$emit('rebuy-prop-change', value)
    },
    handleAssociateKeyChange(value) {
      this.$emit('associate-key-change', value)
    },
    handleMatchEventsChange(value) {
      this.$emit('match-events-change', value)
    },
    handleDcReportChange(value) {
      this.$emit('dc-report-change', value)
    },
    
    // 奖励模型相关事件处理
    handleAwardTypeChange(value) {
      this.$emit('award-type-change', value)
    },
    
    handlePrizeTemplateChange(value) {
      this.$emit('prize-template-change', value)
    },
    
    handlePrizeRateChange(value) {
      this.$emit('prize-rate-change', value)
    },
    
    handleRewardTypeRadioChange(value) {
      this.$emit('reward-type-radio-change', value)
    },
    handleAddRewardItem(rankIndex) {
      this.$emit('add-reward-item', rankIndex)
    },
    handleRemoveRewardItem(rankIndex, itemIndex) {
      this.$emit('remove-reward-item', rankIndex, itemIndex)
    },
    handleAddRankReward() {
      this.$emit('add-rank-reward')
    },
    handleRemoveRankReward(index) {
      this.$emit('remove-rank-reward', index)
    },
    handleRewardTypeChange(rankIndex, itemIndex, value) {
      this.$emit('reward-type-change', rankIndex, itemIndex, value)
    },
    handleRewardNumChange(rankIndex, itemIndex, value) {
      this.$emit('reward-num-change', rankIndex, itemIndex, value)
    },
    handlePropsChange(rankIndex, value) {
      this.$emit('props-change', rankIndex, value)
    },
    handlePropsNumChange(rankIndex, value) {
      this.$emit('props-num-change', rankIndex, value)
    },
    handlePropsExpireChange(rankIndex, value) {
      this.$emit('props-expire-change', rankIndex, value)
    },
    handleStartRankChange(rankIndex, value) {
      this.$emit('start-rank-change', rankIndex, value)
    },
    handleEndRankChange(rankIndex, value) {
      this.$emit('end-rank-change', rankIndex, value)
    },
    handleAwardTypeChange(awardType) {
      this.$emit('award-type-change', awardType)
    },
    handlePrizeTemplateChange(value) {
      this.$emit('prize-template-change', value)
    },
    handlePrizeRateChange(value) {
      this.$emit('prize-rate-change', value)
    },
    handleRewardTypeRadioChange(value) {
      this.$emit('reward-type-radio-change', value)
    }
  }
}
</script>
