<template>
  <el-dialog
    title="Poker 空投活动"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ======================== 活动配置 ======================== -->
      <el-tab-pane label="活动配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 500px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>

            <!-- 时间配置 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width: 280px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 280px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：" required>
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" style="width: 280px" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="调试时间偏移(秒)：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 玩法类型（只读） -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="玩法大类型：">
                <el-tag type="success" size="medium">Poker</el-tag>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 任务文本（任务类型/条件已移至奖励配置）-->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="任务文本：">
                <el-input v-model="item.taskText" placeholder="请输入" style="max-width: 400px" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 勾选游戏 -->
          <el-row>
            <el-col :span="24">
              <GameSelector
                v-model="item.gameIdList"
                label="Poker游戏："
                :category-ids="[2]"
              />
            </el-col>
          </el-row>

          <!-- 白名单配置 -->
          <!--1. AppId白名单 2. SiteId白名单 3. ABTest开关 4. UID白名单-->
          <WhitelistConfig v-model="item.whitelist" :features="[2, 3]" />
          <!-- 参与活动用户类型：poker 标签用户支持 poker新增用户/poker下注/poker额度 -->
          <AirdropUserType
            v-model="item.userConfig"
            :activity-cfg-id="item.id"
            custom-user-type-label="poker 标签用户"
            :custom-user-tag-options="pokerUserTagOptions"
            :level-tag-ids="[]"
          />
        </el-form>
      </el-tab-pane>

      <!-- ======================== 奖励配置（Poker - 道具奖励 + 投注金奖励）======================== -->
      <el-tab-pane label="奖励配置" name="reward">
        <!-- ---------- 道具奖励（进度奖励列表） ---------- -->
        <fieldset style="margin-bottom: 20px">
          <legend style="display: flex; align-items: center; gap: 10px">
            <b>道具奖励</b>
            <el-tag size="mini" type="info" effect="plain">可选</el-tag>
            <el-switch
              v-model="item.enableProgressPrize"
              active-text="启用"
              inactive-text="不配置"
              @change="onProgressPrizeEnabledChange"
            />
          </legend>
          <div v-if="!item.enableProgressPrize" style="margin-bottom: 8px; color: #909399; font-size: 12px">
            已标记为不配置道具奖励，仅保存投注金奖励配置。
          </div>

          <el-table :data="[item.progressPrizes]" border size="small" style="width: 100%">
            <el-table-column label="任务类型" min-width="140" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" style="width: 220px" :disabled="!item.enableProgressPrize">
                  <el-option v-for="opt in pokerTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="进度要求" min-width="120">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.taskCondition"
                  :placeholder="progressPlaceholder"
                  size="mini"
                  :disabled="!item.enableProgressPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="道具类型" min-width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propType" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize" @change="onPropTypeChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具名称" min-width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize" @change="onPropNameChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propOptionsMap[scope.$index] || []" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="可用时间" min-width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propTime" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize">
                  <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具数量" min-width="100">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.propNum"
                  placeholder="数量"
                  size="mini"
                  :disabled="!item.enableProgressPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="道具上限" min-width="100">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.propLimit"
                  placeholder="上限"
                  size="mini"
                  :disabled="!item.enableProgressPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <!-- ---------- 投注金奖励（固定一条，原大奖配置）---------- -->
        <fieldset>
          <legend><b>投注金奖励</b>（仅可配置一条）</legend>
          <el-table :data="[item.rewardRange]" border size="small" style="width: 100%">
            <!-- 总奖励 -->
            <el-table-column label="总奖励(₱)" min-width="120">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.totalReward"
                  placeholder="总奖励"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 已发奖励（只读，由后端实时更新）-->
            <el-table-column label="已发奖励(₱)" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.issuedReward" placeholder="--" size="mini" disabled />
              </template>
            </el-table-column>
            <!-- 用户最大领奖 -->
            <el-table-column label="用户最大领奖(₱)" min-width="150">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.userMaxReward"
                  placeholder="最大领奖"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 任务条件 -->
            <el-table-column label="任务条件(₱)" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.taskCondition"
                  placeholder="请输入"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="积分区间开始" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.minScore"
                  placeholder="起始积分"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="积分区间结束" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.maxScore"
                  placeholder="结束积分"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="系数区间开始" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.minCoefficient"
                  placeholder="如 0.5"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="系数区间结束" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maxCoefficient"
                  placeholder="如 1.0"
                  size="mini"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import GameSelector from '@/components/Game/GameSelector.vue'
import WhitelistConfig from '@/components/WhitelistConfig/index.vue'
import AirdropUserType from '@/components/AirdropUserType/index.vue'
import { ACTIVITY_ID } from '../index.vue'

const GAME_TYPE = 2 // Poker
const MAX_DEBUG_TIME_OFFSET = 30 * 24 * 60 * 60
const MAX_COUNT = 1000000000
const MAX_AMOUNT = Math.floor(Number.MAX_SAFE_INTEGER / 1000)
const MAX_TEXT_LENGTH = 100
const MAX_COEFFICIENT = 99.99

function defaultWhitelist() {
  return { appIdList: [], siteIdList: [], abTest: { switch: false, bPercent: 0 }, uidList: [], isOpen: false }
}

function defaultUserConfig() {
  return {
    userTypes: [2],
    userFilterCondition: {
      registerTimeRange: { min: 0, max: 0 },
      betTimesRange: { min: 0, max: 0 },
      userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
    },
    importedFilename: ''
  }
}

// 投注金奖励默认值（新增 totalReward/issuedReward/userMaxReward）
function defaultRewardRange() {
  return {
    totalReward: 0,
    issuedReward: 0,
    userMaxReward: 0,
    taskCondition: 0,
    minScore: 0,
    maxScore: 0,
    minCoefficient: 0,
    maxCoefficient: 0
  }
}

function newPrize() {
  return { taskType: 2, taskCondition: 0, propType: 0, propId: 0, propName: '', propTime: 1, propNum: 0, propLimit: 0 }
}

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    showEndTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    debugTimeOffset: 0,
    gameIdList: [],
    whitelist: defaultWhitelist(),
    taskText: '',
    enableProgressPrize: false,
    progressPrizes: newPrize(),
    // 投注金奖励（原大奖配置，含新增字段）
    rewardRange: defaultRewardRange(),
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'PokerForm',
  components: { GameSelector, WhitelistConfig, AirdropUserType },
  props: {
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      item: newItem(),
      dialogVisible: false,
      activeTab: 'activity',
      saving: false,
      propList: [],
      propOptionsMap: {},
      // 任务类型选项（暂时只有"有效下注总额"）
      pokerTaskTypes: [
        { value: 1, label: '牌局次数' },
        { value: 2, label: '有效下注总额' },
        { value: 3, label: 'Pot次数' }
      ],
      propTypeOptions: [
        { value: 7, label: '新版Tongits门票', disabled: false },
        { value: 2, label: '头像框', disabled: false },
        { value: 4, label: '德州头像框', disabled: false },
        { value: 8, label: '新版德州参赛券', disabled: false },
        { value: 5, label: 'SlotFreeSpin', disabled: false },
        { value: 10, label: '互动道具', disabled: false }
      ],
      propDayTypeOptions: [
        { value: 1, label: '1天' },
        { value: 3, label: '3天' },
        { value: 7, label: '7天' },
        { value: 30, label: '30天' }
      ],
      // Poker 专属标签用户选项（tagType/tagId 请与后端约定的值对齐）
      pokerUserTagOptions: [
        {
          value: 7, label: 'poker用户类型', children: [
            { value: 70001, label: 'poker 新增用户' },
            { value: 70002, label: 'poker 下注' },
            { value: 70003, label: 'poker 额度' }
          ]
        }
      ]
    }
  },
  computed: {
    // 进度要求列的占位符：有效下注时显示金额单位
    progressPlaceholder() {
      return this.item.progressPrizes && this.item.progressPrizes.taskType === 2 ? '金额(₱)' : '次数'
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) return
      if (this.isEdit && this.data && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        this.item = newItem()
        this.propOptionsMap = {}
        this.activeTab = 'activity'
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    this.getPropList()
  },
  methods: {
    handleDialogClose() {
      this.$emit('close')
    },
    safeJson(val, def) {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch (e) { return def }
      }
      return (val !== null && val !== undefined) ? val : def
    },
    toSafeNumber(val, def = 0) {
      const num = Number(val)
      return Number.isFinite(num) ? num : def
    },
    validateNumber(val, label, { min = 0, max = MAX_AMOUNT, integer = false } = {}) {
      const num = Number(val)
      if (!Number.isFinite(num)) {
        Message.error(`${label}必须为数字`)
        return false
      }
      if (integer && !Number.isInteger(num)) {
        Message.error(`${label}必须为整数`)
        return false
      }
      if (num < min || num > max) {
        Message.error(`${label}需在 ${min} ~ ${max} 范围内`)
        return false
      }
      return true
    },
    normalizePrize(rawPrize) {
      const prize = this.safeJson(rawPrize, {})
      if (Array.isArray(prize)) {
        return { ...newPrize(), ...(prize[0] || {}) }
      }
      return { ...newPrize(), ...(prize || {}) }
    },
    isProgressPrizeConfigured(prize) {
      return this.toSafeNumber(prize.propId) > 0 || this.toSafeNumber(prize.propNum) > 0 || this.toSafeNumber(prize.propLimit) > 0
    },
    validateUserConfig() {
      const userConfig = this.item.userConfig || defaultUserConfig()
      const userType = Array.isArray(userConfig.userTypes) && userConfig.userTypes.length > 0 ? userConfig.userTypes[0] : 2
      userConfig.userTypes = [userType]
      const condition = userConfig.userFilterCondition || defaultUserConfig().userFilterCondition
      userConfig.userFilterCondition = condition
      const registerTimeRange = condition.registerTimeRange || { min: 0, max: 0 }
      const betTimesRange = condition.betTimesRange || { min: 0, max: 0 }
      const userTagConfig = condition.userTagConfig || { tagType: 0, tagId: 0, tagValue: 0 }
      if (userType === 4) {
        if (!registerTimeRange.min || !registerTimeRange.max || registerTimeRange.max < registerTimeRange.min) {
          Message.error('请选择有效的用户注册时间范围')
          return false
        }
        if (!this.validateNumber(betTimesRange.min, '累计投注次数最小值', { min: 0, max: MAX_COUNT, integer: true })) return false
        if (!this.validateNumber(betTimesRange.max, '累计投注次数最大值', { min: 0, max: MAX_COUNT, integer: true })) return false
        if (this.toSafeNumber(betTimesRange.max) < this.toSafeNumber(betTimesRange.min)) {
          Message.error('累计投注次数最大值不能小于最小值')
          return false
        }
      }
      if (userType === 5) {
        if (!userTagConfig.tagType) {
          Message.error('请选择标签类型')
          return false
        }
        if (!userTagConfig.tagId) {
          Message.error('请选择标签子类')
          return false
        }
        if (userTagConfig.tagId === 20000 && !userTagConfig.tagValue) {
          Message.error('请选择游戏强度')
          return false
        }
      }
      this.item.userConfig = userConfig
      return true
    },
    onProgressPrizeEnabledChange(enabled) {
      if (enabled) {
        if (!this.item.progressPrizes.propType) {
          this.item.progressPrizes.propType = this.propTypeOptions[0].value
        }
        this.buildPropOptionsForIndex(this.item.progressPrizes.propType, 0)
      } else {
        this.item.progressPrizes.propId = 0
        this.item.progressPrizes.propName = ''
        this.item.progressPrizes.propNum = 0
        this.item.progressPrizes.propLimit = 0
      }
    },
    loadEditData() {
      const raw = JSON.parse(JSON.stringify(this.data))
      const act = this.safeJson(raw.activity, {})
      const ext = this.safeJson(raw.extend, {})
      const whitelist = this.safeJson(act.whitelist, defaultWhitelist())
      if (!whitelist.abTest) whitelist.abTest = { switch: false, bPercent: 0 }
      if (!whitelist.uidList) whitelist.uidList = []
      if (!whitelist.appIdList) whitelist.appIdList = []
      if (!whitelist.siteIdList) whitelist.siteIdList = []

      const defaultFilterCondition = defaultUserConfig().userFilterCondition
      const userFilterCondition = this.safeJson(ext.userFilterCondition, defaultFilterCondition)
      if (!userFilterCondition.registerTimeRange) userFilterCondition.registerTimeRange = { min: 0, max: 0 }
      if (!userFilterCondition.betTimesRange) userFilterCondition.betTimesRange = { min: 0, max: 0 }
      if (!userFilterCondition.userTagConfig) userFilterCondition.userTagConfig = { tagType: 0, tagId: 0, tagValue: 0 }

      const userConfig = {
        userTypes: this.safeJson(ext.userTypes, [2]),
        userFilterCondition,
        importedFilename: ext.importedFilename || ''
      }

      const prize = this.normalizePrize(ext.progressPrizes)
      const taskType = this.toSafeNumber(prize.taskType || ext.taskType, 1)
      prize.taskType = taskType

      // 有效下注类型时进度要求除以 1000 转换为 ₱ 显示
      if (taskType === 2) {
        prize.taskCondition = this.toSafeNumber(prize.taskCondition) / 1000
      }
      const enableProgressPrize = typeof ext.enableProgressPrize === 'boolean'
        ? ext.enableProgressPrize
        : this.isProgressPrizeConfigured(prize)

      // 投注金奖励：货币字段除以 1000 转换为 ₱ 显示；系数除以 100
      const rr = this.safeJson(ext.rewardRange, defaultRewardRange())
      const rewardRange = {
        totalReward: (rr.totalReward || 0) / 1000,
        issuedReward: (rr.issuedReward || 0) / 1000, // 只读，显示已发放金额
        userMaxReward: (rr.userMaxReward || 0) / 1000,
        taskCondition: (rr.taskCondition || 0) / 1000,
        minScore: (rr.minScore || 0) / 1000,
        maxScore: (rr.maxScore || 0) / 1000,
        minCoefficient: (rr.minCoefficient || 0) / 100,
        maxCoefficient: (rr.maxCoefficient || 0) / 100
      }

      this.item = {
        id: raw.id || 0,
        activityId: ACTIVITY_ID,
        status: raw.status,
        modifyUser: raw.modifyUser,
        activityName: act.name || '',
        isOpen: act.isOpen !== undefined ? act.isOpen : true,
        startTime: (act.startTime || 0) * 1000,
        endTime: (act.endTime || 0) * 1000,
        showEndTime: (act.showEndTime || 0) * 1000,
        debugTimeOffset: act.debugTimeOffset || 0,
        gameIdList: Array.isArray(act.gameIdList) ? act.gameIdList : [],
        whitelist,
        taskText: ext.taskText || '',
        enableProgressPrize,
        progressPrizes: prize,
        rewardRange,
        userConfig
      }

      this.$nextTick(() => {
        const propType = this.item.progressPrizes.propType || this.propTypeOptions[0].value
        this.buildPropOptionsForIndex(propType, 0)
      })
    },
    validateData() {
      this.item.activityName = (this.item.activityName || '').trim()
      if (!this.item.activityName) { Message.error('请输入活动名称'); return false }
      if (this.item.activityName.length > MAX_TEXT_LENGTH) { Message.error(`活动名称长度不能超过${MAX_TEXT_LENGTH}个字符`); return false }
      if (!this.item.startTime) { Message.error('请选择开始时间'); return false }
      if (!this.item.endTime) { Message.error('请选择结束时间'); return false }
      if (!this.item.showEndTime) { Message.error('请选择展示结束时间'); return false }
      if (this.item.endTime <= this.item.startTime) { Message.error('活动结束时间必须晚于活动开始时间'); return false }
      if (this.item.showEndTime < this.item.endTime) { Message.error('展示结束时间不能早于活动结束时间'); return false }
      if (!this.validateNumber(this.item.debugTimeOffset, '调试时间偏移(秒)', { min: -MAX_DEBUG_TIME_OFFSET, max: MAX_DEBUG_TIME_OFFSET, integer: true })) return false
      if (!this.item.whitelist.siteIdList || this.item.whitelist.siteIdList.length === 0) {
        Message.error('请选择SiteId白名单'); return false
      }
      if (!this.item.gameIdList || this.item.gameIdList.length === 0) {
        Message.error('请选择参与活动的游戏'); return false
      }
      if (!this.validateUserConfig()) return false
      const prize = this.item.progressPrizes
      if (!this.validateNumber(prize.taskCondition, this.progressPlaceholder, { min: 0, max: MAX_AMOUNT })) return false
      if (this.item.enableProgressPrize) {
        if (!prize.propType || !prize.propId) {
          Message.error('请配置道具类型和道具名称'); return false
        }
        if (!this.validateNumber(prize.propNum, '道具数量', { min: 1, max: MAX_COUNT, integer: true })) return false
        if (!this.validateNumber(prize.propLimit, '道具上限', { min: 1, max: MAX_COUNT, integer: true })) return false
        if (this.toSafeNumber(prize.propLimit) < this.toSafeNumber(prize.propNum)) {
          Message.error('道具上限不能小于道具数量'); return false
        }
        if (this.toSafeNumber(prize.propLimit) % this.toSafeNumber(prize.propNum) !== 0) {
          Message.error('道具上限必须为道具数量的整数倍'); return false
        }
      }
      const rewardRange = this.item.rewardRange
      if (!this.validateNumber(rewardRange.totalReward, '总奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
      if (!this.validateNumber(rewardRange.issuedReward, '已发奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
      if (!this.validateNumber(rewardRange.userMaxReward, '用户最大领奖(₱)', { min: 0, max: MAX_AMOUNT })) return false
      if (this.toSafeNumber(rewardRange.totalReward) > 0 && this.toSafeNumber(rewardRange.userMaxReward) > this.toSafeNumber(rewardRange.totalReward)) {
        Message.error('用户最大领奖不能大于总奖励'); return false
      }
      if (!this.validateNumber(rewardRange.taskCondition, '任务条件', { min: 0, max: MAX_AMOUNT })) return false
      if (!this.validateNumber(rewardRange.minScore, '积分区间开始', { min: 0, max: MAX_AMOUNT })) return false
      if (!this.validateNumber(rewardRange.maxScore, '积分区间结束', { min: 0, max: MAX_AMOUNT })) return false
      if (this.toSafeNumber(rewardRange.taskCondition) < this.toSafeNumber(rewardRange.minScore)) {
        Message.error('任务条件不能小于积分区间开始'); return false
      }
      if (this.toSafeNumber(rewardRange.taskCondition) > this.toSafeNumber(rewardRange.maxScore)) {
        Message.error('任务条件不能小于积分区间开始'); return false
      }
      if (this.toSafeNumber(rewardRange.maxScore) < this.toSafeNumber(rewardRange.minScore)) {
        Message.error('积分区间结束不能小于积分区间开始'); return false
      }
      if (!this.validateNumber(rewardRange.minCoefficient, '系数区间开始', { min: 0, max: MAX_COEFFICIENT })) return false
      if (!this.validateNumber(rewardRange.maxCoefficient, '系数区间结束', { min: 0, max: MAX_COEFFICIENT })) return false
      if (this.toSafeNumber(rewardRange.maxCoefficient) < this.toSafeNumber(rewardRange.minCoefficient)) {
        Message.error('系数区间结束不能小于系数区间开始'); return false
      }
      return true
    },
    getPostData() {
      const d = this.item
      const prize = { ...newPrize(), ...d.progressPrizes }
      prize.taskType = this.toSafeNumber(prize.taskType, 1)
      if (prize.taskType === 2) {
        prize.taskCondition = Math.round(this.toSafeNumber(prize.taskCondition) * 1000)
      }
      if (!d.enableProgressPrize) {
        prize.propType = 0
        prize.propId = 0
        prize.propName = ''
        prize.propNum = 0
        prize.propLimit = 0
      }
      // 投注金奖励：货币字段乘以 1000 存储；系数乘以 100 取整；已发奖励由后端维护
      const rewardRange = {
        totalReward: Math.round(this.toSafeNumber(d.rewardRange.totalReward) * 1000),
        issuedReward: Math.round(this.toSafeNumber(d.rewardRange.issuedReward) * 1000),
        userMaxReward: Math.round(this.toSafeNumber(d.rewardRange.userMaxReward) * 1000),
        taskCondition: Math.round(this.toSafeNumber(d.rewardRange.taskCondition) * 1000),
        minScore: Math.round(this.toSafeNumber(d.rewardRange.minScore) * 1000),
        maxScore: Math.round(this.toSafeNumber(d.rewardRange.maxScore) * 1000),
        minCoefficient: Math.round(this.toSafeNumber(d.rewardRange.minCoefficient) * 100),
        maxCoefficient: Math.round(this.toSafeNumber(d.rewardRange.maxCoefficient) * 100)
      }
      const activityObj = {
        name: d.activityName,
        activityId: ACTIVITY_ID,
        isOpen: d.isOpen,
        startTime: Math.floor(d.startTime / 1000),
        endTime: Math.floor(d.endTime / 1000),
        showEndTime: Math.floor(d.showEndTime / 1000),
        debugTimeOffset: this.toSafeNumber(d.debugTimeOffset, 0),
        gameType: GAME_TYPE,
        gameIdList: d.gameIdList,
        whitelist: d.whitelist
      }
      // Poker extend：包含道具奖励(progressPrizes)和投注金奖励(rewardRange)，不含 casino 的 propPools 或 slot 的 betReward
      const extendObj = {
        // taskType: prize.taskType,
        taskText: d.taskText || '',
        enableProgressPrize: !!d.enableProgressPrize,
        progressPrizes: prize,
        rewardRange,
        userTypes: d.userConfig.userTypes,
        userFilterCondition: d.userConfig.userFilterCondition,
        importedFilename: d.userConfig.importedFilename || ''
      }
      return {
        id: d.id,
        activityId: ACTIVITY_ID,
        activity: JSON.stringify(activityObj),
        extend: JSON.stringify(extendObj)
      }
    },
    handleSave() {
      if (!this.validateData()) return
      const postData = this.getPostData()
      this.saving = true
      const url = postData.id > 0 ? '/activityconfig/update' : '/activityconfig/create'
      request({ url, method: 'post', data: postData }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      }).finally(() => { this.saving = false })
    },
    // ---- 道具相关 ----
    getPropList() {
      request({ url: '/propsconfig/props/config/list', method: 'get', data: { PageNum: 1, PageSize: 1000 }}).then(res => {
        if (res.RetCode === 0) {
          this.propList = (res.Data && res.Data.list) || []
        }
      })
    },
    buildPropOptionsForIndex(propType, idx) {
      const currTime = Date.now()
      const opts = this.propList
        .filter(p => p.item_type === propType && p.status === 1)
        .filter(p => {
          if (![2, 4, 5].includes(p.item_type)) return currTime < p.expire_time * 1000
          return true
        })
        .map(p => ({ value: p.id, label: p.item_name, disabled: false }))
      this.$set(this.propOptionsMap, idx, opts)
    },
    onPropTypeChange(row, idx) {
      row.propId = 0
      row.propName = ''
      this.buildPropOptionsForIndex(row.propType, idx)
    },
    onPropNameChange(row, idx) {
      const opts = this.propOptionsMap[idx] || []
      const sel = opts.find(o => o.value === row.propId)
      if (sel) row.propName = sel.label
    }
  }
}
</script>
