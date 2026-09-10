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
                :game-ids="[23,22,15,21,34,28,29,126]"
              />
            </el-col>
          </el-row>

          <!-- 白名单配置 -->
          <!--1. AppId白名单 2. SiteId白名单 3. ABTest开关 4. UID白名单-->
          <WhitelistConfig v-model="item.whitelist" :features="[2, 3]" />
          <!-- 参与活动用户类型：poker 标签用户支持 poker新增用户/poker下注/poker额度 -->
          <UserTypeUnit
            v-model="item.userConfig"
            :activity-cfg-id="item.id"
            :activity-id="item.activityId"
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

          <el-table :data="[item.propPools]" border size="small" style="width: 100%">
            <el-table-column label="任务类型" min-width="140" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" style="width: 220px" :disabled="!item.enableProgressPrize">
                  <el-option v-for="opt in pokerTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="进度要求" min-width="120" align="center">
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
            <el-table-column label="道具类型" min-width="140" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propType" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize" @change="onPropTypeChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具名称" min-width="160" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize" @change="onPropNameChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propOptionsMap[scope.$index] || []" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="可用时间" min-width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propTime" placeholder="请选择" size="mini" :disabled="!item.enableProgressPrize">
                  <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具数量" min-width="100" align="center">
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
            <el-table-column label="道具上限" min-width="100" align="center">
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

        <!-- ---------- 投注金奖励（阶梯配置）---------- -->
        <fieldset>
          <legend style="display: flex; align-items: center; gap: 10px">
            <b>投注金奖励</b>
            <el-tag size="mini" type="info" effect="plain">可选</el-tag>
            <el-switch
              v-model="item.enableBetMoneyPrize"
              active-text="启用"
              inactive-text="不配置"
              @change="onBetMoneyPrizeEnabledChange"
            />
          </legend>
          <div v-if="!item.enableBetMoneyPrize" style="margin-bottom: 8px; color: #909399; font-size: 12px">
            已标记为不配置投注金奖励。
          </div>
          <!--          <div v-if="item.enableBetMoneyPrize" style="margin-bottom: 12px; padding: 10px; background-color: #f0f9ff; border-left: 4px solid #409eff; font-size: 13px">-->
          <!--            <div style="margin-bottom: 5px"><strong>说明：</strong></div>-->
          <!--            <div style="color: #606266; line-height: 1.6">-->
          <!--              • <strong>总奖励</strong>：活动奖励池总额<br>-->
          <!--              • <strong>已发奖励</strong>：已经发放的奖励金额（由后端自动更新，只读）<br>-->
          <!--              • <strong>任务条件</strong>：用户投注金额需达到此值才能参与奖励<br>-->
          <!--              • <strong>奖励阶梯</strong>：根据用户积分区间和系数范围计算实际奖励，每个阶梯设定不同的奖励上限-->
          <!--            </div>-->
          <!--          </div>-->
          <div style="margin-bottom: 12px">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              :disabled="!item.enableBetMoneyPrize || item.pokerBetMoney.rewardTiers.length >= 20"
              @click="addPokerBetMoneyTier"
            >
              添加阶梯（最多20行）
            </el-button>
            <span style="margin-left: 12px; color: #909399; font-size: 13px">
              当前 {{ item.pokerBetMoney.rewardTiers.length }} 行，最少1行，最多20行
            </span>
          </div>
          <el-table
            :data="item.pokerBetMoney.rewardTiers"
            border
            size="small"
            style="width: 100%"
            :span-method="pokerBetMoneySpanMethod"
          >
            <!-- 任务类型 -->
            <el-table-column label="任务类型" min-width="150" align="center">
              <template slot-scope="_">
                <el-select v-model="item.pokerBetMoney.taskType" placeholder="请选择" style="width: 220px" :disabled="!item.enableBetMoneyPrize">
                  <el-option v-for="opt in pokerTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>

            <!-- 总奖励 -->
            <el-table-column label="总奖励(₱)" min-width="80" align="center">
              <template slot-scope="_">
                <el-input
                  v-model.number="item.pokerBetMoney.totalReward"
                  placeholder="总奖励"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 任务条件 -->
            <el-table-column label="任务条件" min-width="80" align="center">
              <template slot-scope="_">
                <el-input
                  v-model.number="item.pokerBetMoney.taskCondition"
                  placeholder="请输入"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 已发奖励（只读，由后端实时更新）-->
            <el-table-column label="已发奖励(₱)" min-width="80" align="center">
              <template slot-scope="_">
                <el-input v-model.number="item.pokerBetMoney.issuedReward" placeholder="--" size="mini" disabled />
              </template>
            </el-table-column>

            <el-table-column label="积分区间开始" min-width="80" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.minScore"
                  placeholder="起始积分"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="积分区间结束" min-width="80" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.maxScore"
                  placeholder="结束积分"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="系数区间开始" min-width="80" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.minCoefficient"
                  placeholder="如 0.5"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="系数区间结束" min-width="80" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maxCoefficient"
                  placeholder="如 1.0"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="奖励上限(₱)" min-width="80" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.maxReward"
                  placeholder="奖励上限"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  :disabled="!item.enableBetMoneyPrize || item.pokerBetMoney.rewardTiers.length <= 1"
                  @click="removePokerBetMoneyTier(scope.$index)"
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
import UserTypeUnit from '@/components/UserType/index.vue'
import { ACTIVITY_ID } from '../index.vue'
import {PROP_TYPE_OPTIONS} from "@/utils/options";
import {IsProd} from "@/utils/env";
import { MATCH_TICKET_RIGHTS_ID_CFG_PROD, MATCH_TICKET_RIGHTS_ID_CFG_DEV } from "@/utils/prop";
import store from "@/store";
import {GetPropConfigListFromCache} from "@/utils/propV2";


const GAME_TYPE = 2 // Poker
const MAX_DEBUG_TIME_OFFSET = 30 * 24 * 60 * 60
const MAX_COUNT = 1000000000
const MAX_AMOUNT = Math.floor(Number.MAX_SAFE_INTEGER / 1000)
const MAX_TEXT_LENGTH = 100
const MAX_COEFFICIENT = 99.99
const MAX_REWARD_TIER_COUNT = 20

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
function newPokerBetMoneyTier() {
  return {
    minScore: 0,
    maxScore: 0,
    minCoefficient: 0,
    maxCoefficient: 0,
    maxReward: 0
  }
}

// 投注金奖励默认值
function defaultPokerBetMoney() {
  return {
    taskType: 2,
    totalReward: 1,
    issuedReward: 0,
    taskCondition: 2,
    rewardTiers: [newPokerBetMoneyTier()]
  }
}

function newProp() {
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
    enableBetMoneyPrize: true,
    propPools: newProp(),
    pokerBetMoney: defaultPokerBetMoney(),
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'PokerForm',
  components: { GameSelector, WhitelistConfig, UserTypeUnit },
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
        { value: 2, label: '头像框', disabled: false },
        { value: 4, label: '德州头像框', disabled: false },
        { value: 8, label: '新版德州参赛券', disabled: false },
        { value: 5, label: 'SlotFreeSpin', disabled: false },
        { value: 7, label: '新版Tongits门票', disabled: false },
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
      return this.item.propPools && this.item.propPools.taskType === 2 ? '金额(₱)' : '次数'
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
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.appId = store.getters.appId || this.appId
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
        return { ...newProp(), ...(prize[0] || {}) }
      }
      return { ...newProp(), ...(prize || {}) }
    },
    isProgressPrizeConfigured(prize) {
      return this.toSafeNumber(prize.propId) > 0 || this.toSafeNumber(prize.propNum) > 0 || this.toSafeNumber(prize.propLimit) > 0
    },
    normalizePokerBetMoney(rawPokerBetMoney) {
      const rr = this.safeJson(rawPokerBetMoney, {})
      let rewardTiers = Array.isArray(rr.rewardTiers) ? rr.rewardTiers : []
      if (rewardTiers.length === 0) {
        rewardTiers = [{
          minScore: rr.minScore || 0,
          maxScore: rr.maxScore || 0,
          minCoefficient: rr.minCoefficient || 0,
          maxCoefficient: rr.maxCoefficient || 0,
          maxReward: rr.maxReward !== undefined ? rr.maxReward : (rr.userMaxReward || 0)
        }]
      }
      const taskType = this.toSafeNumber(rr.taskType) || 2
      const divisor = taskType === 2 ? 1000 : 1


      rewardTiers = rewardTiers
        .slice(0, MAX_REWARD_TIER_COUNT)
        .map(t => ({
          minScore: this.toSafeNumber(t.minScore) / divisor,
          maxScore: this.toSafeNumber(t.maxScore) / divisor,
          minCoefficient: this.toSafeNumber(t.minCoefficient) / 100,
          maxCoefficient: this.toSafeNumber(t.maxCoefficient) / 100,
          maxReward: this.toSafeNumber(t.maxReward) / 1000
        }))
      return {
        taskType: taskType,
        totalReward: this.toSafeNumber(rr.totalReward) / 1000,
        issuedReward: this.toSafeNumber(rr.issuedReward) / 1000,
        taskCondition: this.toSafeNumber(rr.taskCondition) / divisor,
        rewardTiers
      }
    },
    isBetMoneyPrizeConfigured(pokerBetMoney) {
      if (!pokerBetMoney) return false
      if (this.toSafeNumber(pokerBetMoney.taskType) > 0) return true
      if (this.toSafeNumber(pokerBetMoney.totalReward) > 0) return true
      if (this.toSafeNumber(pokerBetMoney.issuedReward) > 0) return true
      if (this.toSafeNumber(pokerBetMoney.taskCondition) > 0) return true
      const tiers = Array.isArray(pokerBetMoney.rewardTiers) ? pokerBetMoney.rewardTiers : []
      return tiers.some(t =>
        this.toSafeNumber(t.minScore) > 0 ||
        this.toSafeNumber(t.maxScore) > 0 ||
        this.toSafeNumber(t.minCoefficient) > 0 ||
        this.toSafeNumber(t.maxCoefficient) > 0 ||
        this.toSafeNumber(t.maxReward) > 0
      )
    },
    // 投注金奖励表格合并单元格：任务类型/总奖励/任务条件/已发奖励 4列合并
    pokerBetMoneySpanMethod({ rowIndex, columnIndex }) {
      if (![0, 1, 2,3].includes(columnIndex)) return undefined
      const tiers = (this.item.pokerBetMoney && this.item.pokerBetMoney.rewardTiers) || []
      const rowspan = tiers.length > 0 ? tiers.length : 1
      if (rowIndex === 0) {
        return { rowspan, colspan: 1 }
      }
      return { rowspan: 0, colspan: 0 }
    },
    onBetMoneyPrizeEnabledChange(enabled) {
      if (!enabled) return
      if (!this.item.pokerBetMoney || !Array.isArray(this.item.pokerBetMoney.rewardTiers) || this.item.pokerBetMoney.rewardTiers.length === 0) {
        this.$set(this.item, 'pokerBetMoney', defaultPokerBetMoney())
      }
    },
    addPokerBetMoneyTier() {
      const tiers = this.item.pokerBetMoney.rewardTiers
      if (tiers.length >= MAX_REWARD_TIER_COUNT) {
        Message.warning('最多只能添加20行')
        return
      }
      tiers.push(newPokerBetMoneyTier())
    },
    removePokerBetMoneyTier(index) {
      const tiers = this.item.pokerBetMoney.rewardTiers
      if (tiers.length <= 1) {
        Message.warning('至少保留1行')
        return
      }
      tiers.splice(index, 1)
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
        if (!this.item.propPools.propType) {
          this.item.propPools.propType = this.propTypeOptions[0].value
        }
        this.buildPropOptionsForIndex(this.item.propPools.propType, 0)
      } else {
        this.item.propPools.propId = 0
        this.item.propPools.propName = ''
        this.item.propPools.propNum = 0
        this.item.propPools.propLimit = 0
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

      const prop = this.normalizePrize(ext.propPools)
      const taskType = this.toSafeNumber(prop.taskType || ext.taskType, 1)
      prop.taskType = taskType

      // 有效下注类型时进度要求除以 1000 转换为 ₱ 显示
      if (taskType === 2) {
        prop.taskCondition = this.toSafeNumber(prop.taskCondition) / 1000
      }
      const enableProgressPrize = typeof ext.enableProgressPrize === 'boolean'
        ? ext.enableProgressPrize
        : this.isProgressPrizeConfigured(prop)

      // 投注金奖励：货币字段除以 1000 转换为 ₱ 显示；系数除以 100
      const pokerBetMoney = this.normalizePokerBetMoney(ext.pokerBetMoney)
      const enableBetMoneyPrize = typeof ext.enableBetMoneyPrize === 'boolean' ? ext.enableBetMoneyPrize : this.isBetMoneyPrizeConfigured(pokerBetMoney)

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
        enableBetMoneyPrize,
        propPools: prop,
        pokerBetMoney,
        userConfig
      }

      this.$nextTick(() => {
        const propType = this.item.propPools.propType || this.propTypeOptions[0].value
        if (this.isNewTicketProp(propType)) {
          this.onPropTypeChange(this.item.propPools, 0, false)
        } else {
          this.buildPropOptionsForIndex(propType, 0)
        }
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

      // Task 4: 至少保留一个奖励类型
      if (!this.item.enableProgressPrize && !this.item.enableBetMoneyPrize) {
        Message.error('道具奖励和投注金奖励至少需要启用一个')
        return false
      }

      const prize = this.item.propPools
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
      const pokerBetMoney = this.item.pokerBetMoney
      if (this.item.enableBetMoneyPrize) {
        if (!this.validateNumber(pokerBetMoney.taskType, '任务类型', { min: 0, max: MAX_AMOUNT })) return false
        if (!this.validateNumber(pokerBetMoney.totalReward, '总奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
        if (!this.validateNumber(pokerBetMoney.issuedReward, '已发奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
        if (!this.validateNumber(pokerBetMoney.taskCondition, '任务条件(₱)', { min: 0, max: MAX_AMOUNT })) return false
        const rewardTiers = Array.isArray(pokerBetMoney.rewardTiers) ? pokerBetMoney.rewardTiers : []
        if (rewardTiers.length === 0) {
          Message.error('请至少配置一条投注金奖励阶梯'); return false
        }
        if (rewardTiers.length > MAX_REWARD_TIER_COUNT) {
          Message.error('投注金奖励阶梯最多20条'); return false
        }
        for (let i = 0; i < rewardTiers.length; i++) {
          const tier = rewardTiers[i]
          const prefix = `第${i + 1}条投注金阶梯`
          if (!this.validateNumber(tier.minScore, `${prefix}积分区间开始`, { min: 0, max: MAX_AMOUNT })) return false
          if (!this.validateNumber(tier.maxScore, `${prefix}积分区间结束`, { min: 0, max: MAX_AMOUNT })) return false
          // Task 3: 积分区间开始 < 积分区间结束
          if (this.toSafeNumber(tier.maxScore) <= this.toSafeNumber(tier.minScore)) {
            Message.error(`${prefix}积分区间结束必须大于开始`); return false
          }
          if (!this.validateNumber(tier.minCoefficient, `${prefix}系数区间开始`, { min: 0, max: MAX_COEFFICIENT })) return false
          if (!this.validateNumber(tier.maxCoefficient, `${prefix}系数区间结束`, { min: 0, max: MAX_COEFFICIENT })) return false
          if (this.toSafeNumber(tier.maxCoefficient) < this.toSafeNumber(tier.minCoefficient)) {
            Message.error(`${prefix}系数区间结束不能小于开始`); return false
          }
          if (!this.validateNumber(tier.maxReward, `${prefix}奖励上限(₱)`, { min: 0, max: MAX_AMOUNT })) return false
        }
        // Task 3: 检查积分区间是否交叉
        for (let i = 0; i < rewardTiers.length; i++) {
          for (let j = i + 1; j < rewardTiers.length; j++) {
            const tier1 = rewardTiers[i]
            const tier2 = rewardTiers[j]
            const min1 = this.toSafeNumber(tier1.minScore)
            const max1 = this.toSafeNumber(tier1.maxScore)
            const min2 = this.toSafeNumber(tier2.minScore)
            const max2 = this.toSafeNumber(tier2.maxScore)
            // 检查区间是否有交叉：区间1和区间2有交叉当且仅当 max1 > min2 且 max2 > min1
            if (max1 > min2 && max2 > min1) {
              Message.error(`第${i + 1}条和第${j + 1}条投注金阶梯的积分区间存在交叉，请调整`); return false
            }
          }
        }
      }
      return true
    },
    getPostData() {
      const d = this.item
      const prop = { ...newProp(), ...d.propPools }
      prop.taskType = this.toSafeNumber(prop.taskType, 1)
      if (prop.taskType === 2) {
        prop.taskCondition = Math.round(this.toSafeNumber(prop.taskCondition) * 1000)
      }
      if (!d.enableProgressPrize) {
        prop.propType = 0
        prop.propId = 0
        prop.propName = ''
        prop.propNum = 0
        prop.propLimit = 0
      }
      const taskType = this.toSafeNumber(d.pokerBetMoney.taskType, 2)
      const mult = taskType === 2 ? 1000 : 1

      // 投注金奖励：货币字段乘以 1000 存储；系数乘以 100 取整；已发奖励由后端维护
      const rewardTiers = Array.isArray(d.pokerBetMoney.rewardTiers) && d.pokerBetMoney.rewardTiers.length > 0
        ? d.pokerBetMoney.rewardTiers
        : [newPokerBetMoneyTier()]
      const pokerBetMoney = {
        taskType: taskType,
        totalReward: Math.round(this.toSafeNumber(d.pokerBetMoney.totalReward) * 1000),
        issuedReward: Math.round(this.toSafeNumber(d.pokerBetMoney.issuedReward) * 1000),
        taskCondition: Math.round(this.toSafeNumber(d.pokerBetMoney.taskCondition) * mult),
        rewardTiers: rewardTiers.slice(0, MAX_REWARD_TIER_COUNT).map(t => ({
          minScore: Math.round(this.toSafeNumber(t.minScore) * mult),
          maxScore: Math.round(this.toSafeNumber(t.maxScore) * mult),
          minCoefficient: Math.round(this.toSafeNumber(t.minCoefficient) * 100),
          maxCoefficient: Math.round(this.toSafeNumber(t.maxCoefficient) * 100),
          maxReward: Math.round(this.toSafeNumber(t.maxReward) * 1000)
        }))
      }
      if (!d.enableBetMoneyPrize) {
        pokerBetMoney.taskType = 2
        pokerBetMoney.totalReward = 0
        pokerBetMoney.taskCondition = 0
        pokerBetMoney.rewardTiers = [newPokerBetMoneyTier()]
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
      const extendObj = {
        taskText: d.taskText || '',
        enableProgressPrize: !!d.enableProgressPrize,
        enableBetMoneyPrize: !!d.enableBetMoneyPrize,
        propPools: prop,
        pokerBetMoney,
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
      // request({ url: '/propsconfig/props/config/list', method: 'get', data: { PageNum: 1, PageSize: 1000 }}).then(res => {
      //   if (res.RetCode === 0) {
      //     this.propList = (res.Data && res.Data.list) || []
      //   }
      // })
      GetPropConfigListFromCache().then(({ itemList }) => {
        this.propList = itemList || []
      })
    },
    // 是否是新版道具
    isNewTicketProp(itemType) {
      return [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(itemType)
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
    onPropTypeChange(row, idx, shouldReset = true) {
      const prevPropId = row.propId
      const prevPropName = row.propName
      const prevSceneId = row.sceneId
      if (shouldReset) {
        row.propId = 0
        row.propName = ''
      }
      const isTicketProp = this.isNewTicketProp(row.propType)
      if (!isTicketProp && Object.prototype.hasOwnProperty.call(row, 'sceneId')) {
        row.sceneId = 0
      }

      // 是否是新版道具类型（如新版Tongits门票、新版德州参赛券等），如果是则需要重新构建道具选项
      if (isTicketProp) {
        // 根据当前道具类型获取对应的门票配置
        const ticketsConfig = IsProd() ? MATCH_TICKET_RIGHTS_ID_CFG_PROD : MATCH_TICKET_RIGHTS_ID_CFG_DEV
        const ticketList = ticketsConfig[this.appId]
        const opts = (Array.isArray(ticketList) ? ticketList : [])
          .filter(ticket => ticket && ticket.ticketId !== undefined && ticket.ticketId !== null)
          .map(ticket => ({
            value: ticket.ticketId,
            label: ticket.label || String(ticket.ticketId),
            sceneId: ticket.sceneId,
            disabled: false
          }))
        this.$set(this.propOptionsMap, idx, opts)

        if (!shouldReset) {
          const matchedTicket = opts.find(opt => String(opt.value) === String(prevPropId))
          if (matchedTicket) {
            row.propId = matchedTicket.value
            row.propName = matchedTicket.label
            row.sceneId = matchedTicket.sceneId
          } else {
            row.propId = prevPropId
            row.propName = prevPropName
            if (prevSceneId !== undefined) {
              row.sceneId = prevSceneId
            }
          }
        }
      } else {
        this.buildPropOptionsForIndex(row.propType, idx)
      }
    },
    onPropNameChange(row, idx) {
      const opts = this.propOptionsMap[idx] || []
      const sel = opts.find(o => String(o.value) === String(row.propId))
      if (sel) {
        row.propName = sel.label
        if (this.isNewTicketProp(row.propType) && sel.sceneId !== undefined && sel.sceneId !== null) {
          row.sceneId = sel.sceneId
        }
      }
    }
  }
}
</script>
