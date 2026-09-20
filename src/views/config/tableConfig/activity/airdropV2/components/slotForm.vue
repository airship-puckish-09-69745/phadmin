<template>
  <el-dialog
    title="Slot 空投活动"
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
                <el-tag type="" size="medium">Slot</el-tag>
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
                label="Slot游戏："
                :category-ids="[1]"
              />
            </el-col>
          </el-row>

          <!-- 白名单配置 -->
          <!--1. AppId白名单 2. SiteId白名单 3. ABTest开关 4. UID白名单-->
          <WhitelistConfig v-model="item.whitelist" :features="[2, 3]" />

          <!-- 参与活动用户类型 -->
          <UserTypeUnit v-model="item.userConfig" :activity-cfg-id="item.id" :activity-id="item.activityId" />
        </el-form>
      </el-tab-pane>

      <!-- ======================== 奖励配置（Slot - 道具奖励 + 投注金奖励） ======================== -->
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
                  <el-option v-for="opt in slotTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="进度要求(₱)" min-width="120" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.taskCondition" placeholder="进度值" size="mini" :disabled="!item.enableProgressPrize" oninput="if(value<0||value===''){value=0}" />
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
                <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini" :disabled="!item.enableProgressPrize" oninput="if(value<0||value===''){value=0}" />
              </template>
            </el-table-column>
            <el-table-column label="道具上限" min-width="100" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propLimit" placeholder="上限" size="mini" :disabled="!item.enableProgressPrize" oninput="if(value<0||value===''){value=0}" />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <!-- ---------- 投注金奖励（固定一条） ---------- -->
        <fieldset>
          <legend style="display: flex; align-items: center; gap: 10px">
            <b>投注金奖励</b>（固定一条）
            <el-tag size="mini" type="info" effect="plain">可选</el-tag>
            <el-switch
              v-model="item.enableBetMoneyPrize"
              active-text="启用"
              inactive-text="不配置"
              @change="onBetMoneyPrizeEnabledChange"
            />
          </legend>
          <div v-if="!item.enableBetMoneyPrize" style="margin-bottom: 8px; color: #909399; font-size: 12px">
            已标记为不配置投注金奖励，仅保存道具奖励配置。
          </div>
          <el-table :data="[item.slotBetMoney]" border size="small" style="width: 100%">
            <!-- 任务类型 -->
            <el-table-column label="任务类型" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" size="mini" :disabled="!item.enableBetMoneyPrize">
                  <el-option v-for="opt in slotTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <!-- 任务条件 -->
            <el-table-column label="任务条件(₱)" min-width="130">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.taskCondition"
                  placeholder="请输入"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 总奖励 -->
            <el-table-column label="总奖励(₱)" min-width="120">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.totalReward"
                  placeholder="请输入"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
                  oninput="if(value<0||value===''){value=0}"
                />
              </template>
            </el-table-column>
            <!-- 已发奖励（只读，由后端更新）-->
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
                  placeholder="请输入"
                  size="mini"
                  :disabled="!item.enableBetMoneyPrize"
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
import UserTypeUnit from '@/components/UserType/index.vue'
import { ACTIVITY_ID } from '../index.vue'
import {GetPropConfigListFromCache} from "@/utils/propV2";
import Log from "echarts/src/scale/Log";

const GAME_TYPE = 1 // Slot
const MAX_DEBUG_TIME_OFFSET = 30 * 24 * 60 * 60
const MAX_COUNT = 1000000000
const MAX_AMOUNT = Math.floor(Number.MAX_SAFE_INTEGER / 1000)
const MAX_TEXT_LENGTH = 100

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

function newProp() {
  return { taskType: 2, taskCondition: 0, propType: 0, propId: 0, propName: '', propTime: 1, propNum: 0, propLimit: 0 }
}

// 投注金奖励默认值（已发奖励为只读，初始为 0）
function defaultSlotBetMoney() {
  return { taskType: 2, taskCondition: 0, totalReward: 0, issuedReward: 0, userMaxReward: 0 }
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
    enableProgressPrize: false,
    enableBetMoneyPrize: true,
    taskText: '',
    propPools: newProp(),
    // 投注金奖励（固定一条）
    slotBetMoney: defaultSlotBetMoney(),
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'SlotForm',
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
      slotTaskTypes: [
        { value: 2, label: '有效下注总额' }
      ],
      propTypeOptions: [
        { value: 5, label: 'SlotFreeSpin', disabled: false }
      ],
      propDayTypeOptions: [
        { value: 1, label: '1天' },
        { value: 3, label: '3天' },
        { value: 7, label: '7天' },
        { value: 30, label: '30天' }
      ]
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
        // 默认加载道具选项
        this.buildPropOptionsForIndex(5, 0)
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
    getTaskStat() {
      const actCfgId = this.toSafeNumber((this.data && this.data.id) || this.item.id, 0)
      if (actCfgId <= 0) return

      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/activity/airdropv2/task/stat',
          actCfgId: actCfgId
        }
      }).then(response => {
        console.log('response',response)
        if (response.RetCode === 0 && response.Data) {
          console.log(response.Data)
          this.item.slotBetMoney.issuedReward = this.toSafeNumber(response.Data.BetMoneyTaskAmount, 0) / 1000
        }
      })
    },

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
    isBetMoneyPrizeConfigured(slotBetMoney) {
      if (!slotBetMoney) return false
      return this.toSafeNumber(slotBetMoney.totalReward) > 0 || this.toSafeNumber(slotBetMoney.taskCondition) > 0 || this.toSafeNumber(slotBetMoney.userMaxReward) > 0
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
    onBetMoneyPrizeEnabledChange(enabled) {
      if (!enabled) {
        this.item.slotBetMoney.taskCondition = 0
        this.item.slotBetMoney.totalReward = 0
        this.item.slotBetMoney.userMaxReward = 0
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
      const taskType = this.toSafeNumber(prop.taskType || ext.taskType, 2)
      prop.taskType = taskType
      // 有效下注类型时进度要求存储单位为 1/1000 ₱，前端显示除以 1000
      if (taskType === 2) {
        prop.taskCondition = this.toSafeNumber(prop.taskCondition) / 1000
      }
      const enableProgressPrize = typeof ext.enableProgressPrize === 'boolean' ? ext.enableProgressPrize : this.isProgressPrizeConfigured(prop)

      // 投注金奖励：货币字段除以 1000 转换为 ₱ 显示；系数除以 100
      const rr = this.safeJson(ext.slotBetMoney, defaultSlotBetMoney())

      const slotBetMoney = {
        taskType: this.toSafeNumber(rr.taskType || 2),
        // issuedReward: (rr.issuedReward || 0) / 1000, // 只读，显示已发放金额
        userMaxReward: (rr.userMaxReward || 0) / 1000,
        totalReward: (rr.totalReward || 0) / 1000
      }
      // 有效下注类型时进度要求存储单位为 1/1000 ₱，前端显示除以 1000
      if (slotBetMoney.taskType === 2) {
        slotBetMoney.taskCondition = (rr.taskCondition || 0) / 1000
      }

      const enableBetMoneyPrize = typeof ext.enableBetMoneyPrize === 'boolean' ? ext.enableBetMoneyPrize : this.isBetMoneyPrizeConfigured(slotBetMoney)

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
        enableProgressPrize,
        enableBetMoneyPrize,
        taskText: ext.taskText || '',
        propPools: prop,
        slotBetMoney,
        userConfig
      }
      this.getTaskStat()

      // 初始化道具选项映射
      this.$nextTick(() => {
        const propType = this.item.propPools.propType || this.propTypeOptions[0].value
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

      // Task 4: 至少保留一个奖励类型
      if (!this.item.enableProgressPrize && !this.item.enableBetMoneyPrize) {
        Message.error('道具奖励和投注金奖励至少需要启用一个')
        return false
      }

      const prize = this.item.propPools
      if (this.item.enableProgressPrize) {
        if (!this.validateNumber(prize.taskCondition, '进度要求(₱)', { min: 0, max: MAX_AMOUNT })) return false
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

      if (this.item.enableBetMoneyPrize) {
        const slotBetMoney = this.item.slotBetMoney
        if (!this.validateNumber(slotBetMoney.taskCondition, '任务条件(₱)', { min: 0, max: MAX_AMOUNT })) return false
        if (!this.validateNumber(slotBetMoney.totalReward, '总奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
        // if (!this.validateNumber(slotBetMoney.issuedReward, '已发奖励(₱)', { min: 0, max: MAX_AMOUNT })) return false
        if (!this.validateNumber(slotBetMoney.userMaxReward, '用户最大领奖(₱)', { min: 0, max: MAX_AMOUNT })) return false
        if (this.toSafeNumber(slotBetMoney.totalReward) > 0 && this.toSafeNumber(slotBetMoney.userMaxReward) > this.toSafeNumber(slotBetMoney.totalReward)) {
          Message.error('用户最大领奖不能大于总奖励'); return false
        }
      }
      return true
    },
    getPostData() {
      const d = this.item
      // 道具奖励：进度要求回存时乘以 1000
      const prop = { ...newProp(), ...d.propPools }
      prop.taskType = this.toSafeNumber(prop.taskType, 2)
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

      const slotBetMoney = !d.enableBetMoneyPrize ? defaultSlotBetMoney() : {
        taskType: this.toSafeNumber(d.slotBetMoney.taskType, 2),
        taskCondition: Math.round(this.toSafeNumber(d.slotBetMoney.taskCondition)),
        totalReward: Math.round(this.toSafeNumber(d.slotBetMoney.totalReward) * 1000),
        // issuedReward: Math.round(this.toSafeNumber(d.slotBetMoney.issuedReward) * 1000),
        userMaxReward: Math.round(this.toSafeNumber(d.slotBetMoney.userMaxReward) * 1000)
      }

      // taskType 2: 投注金奖励任务条件为有效下注总额时，乘以 1000 存储
      if (slotBetMoney.taskType === 2) {
        slotBetMoney.taskCondition = Math.round(this.toSafeNumber(slotBetMoney.taskCondition) * 1000)
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
        // 投注金奖励：货币字段乘以 1000 存储，已发奖励由后端维护保持原值
        slotBetMoney: slotBetMoney,
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
      GetPropConfigListFromCache().then(({ itemList }) => {
        this.propList = itemList || []
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
