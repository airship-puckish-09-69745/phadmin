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
          <AirdropUserType v-model="item.userConfig" :activity-cfg-id="item.id" />
        </el-form>
      </el-tab-pane>

      <!-- ======================== 奖励配置（Slot - 道具奖励 + 投注金奖励） ======================== -->
      <el-tab-pane label="奖励配置" name="reward">

        <!-- ---------- 道具奖励（进度奖励列表） ---------- -->
        <fieldset style="margin-bottom: 20px">
          <legend><b>道具奖励</b></legend>
          <el-table :data="[item.progressPrizes]" border size="small" style="width: 100%">
            <el-table-column label="任务类型" min-width="140" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" style="width: 220px">
                  <el-option v-for="opt in slotTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="进度要求(₱)" min-width="120" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.taskValueRequired" placeholder="进度值" size="mini" oninput="if(value<0||value===''){value=0}" />
              </template>
            </el-table-column>
            <el-table-column label="道具类型" min-width="140" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propType" placeholder="请选择" size="mini" @change="onPropTypeChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具名称" min-width="160" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" @change="onPropNameChange(scope.row, scope.$index)">
                  <el-option v-for="opt in propOptionsMap[scope.$index] || []" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="可用时间" min-width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propTime" placeholder="请选择" size="mini">
                  <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具数量" min-width="100" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini" oninput="if(value<0||value===''){value=0}" />
              </template>
            </el-table-column>
            <el-table-column label="道具上限" min-width="100" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propLimit" placeholder="上限" size="mini" oninput="if(value<0||value===''){value=0}" />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <!-- ---------- 投注金奖励（固定一条） ---------- -->
        <fieldset>
          <legend><b>投注金奖励</b>（固定一条）</legend>
          <el-table :data="[item.betReward]" border size="small" style="width: 100%">
            <!-- 任务类型 -->
            <el-table-column label="任务类型" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" size="mini">
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

const GAME_TYPE = 1 // Slot

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

function newPrize() {
  return { taskType: 2, taskValueRequired: 0, propType: 5, propId: 0, propName: '', propTime: 1, propNum: 0, propLimit: 0 }
}

// 投注金奖励默认值（已发奖励为只读，初始为 0）
function defaultBetReward() {
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
    // 任务类型（道具奖励全局设置，已移入奖励配置 tab）
    taskType: 2,
    taskText: '',
    progressPrizes: newPrize(),
    // 投注金奖励（固定一条）
    betReward: defaultBetReward(),
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'SlotForm',
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
    handleDialogClose() {
      this.$emit('close')
    },
    safeJson(val, def) {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch (e) { return def }
      }
      return (val !== null && val !== undefined) ? val : def
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

      const userConfig = {
        userTypes: this.safeJson(ext.userTypes, [2]),
        userFilterCondition: this.safeJson(ext.userFilterCondition, {
          registerTimeRange: { min: 0, max: 0 },
          betTimesRange: { min: 0, max: 0 },
          userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
        }),
        importedFilename: ext.importedFilename || ''
      }

      const taskType = ext.taskType || 2
      const prize = ext.progressPrizes ? ext.progressPrizes : newPrize()
      // 有效下注类型时进度要求存储单位为 1/1000 ₱，前端显示除以 1000
      if (taskType === 2) {
        prize.taskValueRequired = (prize.taskValueRequired || 0) / 1000
      }

      // 兼容旧数据：若无 betReward 则从旧的 taskCondition 字段迁移
      const rawBetReward = this.safeJson(ext.betReward, null)
      const betReward = rawBetReward
        ? {
          taskType: rawBetReward.taskType || taskType,
          taskCondition: (rawBetReward.taskCondition || 0) / 1000,
          totalReward: (rawBetReward.totalReward || 0) / 1000,
          issuedReward: (rawBetReward.issuedReward || 0) / 1000,
          userMaxReward: (rawBetReward.userMaxReward || 0) / 1000
        }
        : {
          taskType,
          // 旧数据中 taskCondition 存储于 ext 顶层
          taskCondition: taskType === 2 ? (ext.taskCondition || 0) / 1000 : (ext.taskCondition || 0),
          totalReward: 0,
          issuedReward: 0,
          userMaxReward: 0
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
        taskType,
        taskText: ext.taskText || '',
        progressPrizes: prize,
        betReward,
        userConfig
      }

      // 初始化道具选项映射
      this.$nextTick(() => {
        this.buildPropOptionsForIndex(this.item.progressPrizes[0].propType, 0)
      })
    },
    validateData() {
      if (!this.item.activityName) { Message.error('请输入活动名称'); return false }
      if (!this.item.startTime) { Message.error('请选择开始时间'); return false }
      if (!this.item.endTime) { Message.error('请选择结束时间'); return false }
      if (!this.item.showEndTime) { Message.error('请选择展示结束时间'); return false }
      if (!this.item.whitelist.siteIdList || this.item.whitelist.siteIdList.length === 0) {
        Message.error('请选择SiteId白名单'); return false
      }
      if (!this.item.gameIdList || this.item.gameIdList.length === 0) {
        Message.error('请选择参与活动的游戏'); return false
      }
      const prize = this.item.progressPrizes
      if (!prize.propType || !prize.propId) {
        Message.error('请配置道具类型和道具名称'); return false
      }
      if (this.item.progressPrizes.taskValueRequired < 0) {
        Message.error('进度要求不能小于0'); return false
      }
      return true
    },
    getPostData() {
      const d = this.item
      // 道具奖励：进度要求回存时乘以 1000
      const prize = Object.assign({}, d.progressPrizes)
      if (d.taskType === 2) {
        prize.taskValueRequired = (prize.taskValueRequired || 0) * 1000
      }

      const activityObj = {
        name: d.activityName,
        activityId: ACTIVITY_ID,
        isOpen: d.isOpen,
        startTime: Math.floor(d.startTime / 1000),
        endTime: Math.floor(d.endTime / 1000),
        showEndTime: Math.floor(d.showEndTime / 1000),
        debugTimeOffset: d.debugTimeOffset || 0,
        gameType: GAME_TYPE,
        gameIdList: d.gameIdList,
        whitelist: d.whitelist
      }
      // Slot extend：包含道具奖励(progressPrizes)和投注金奖励(betReward)
      const extendObj = {
        taskText: d.taskText || '',
        progressPrizes: prize,
        // 投注金奖励：货币字段乘以 1000 存储，已发奖励由后端维护保持原值
        betReward: {
          taskType: d.betReward.taskType,
          taskCondition: Math.round((d.betReward.taskCondition || 0) * 1000),
          totalReward: Math.round((d.betReward.totalReward || 0) * 1000),
          issuedReward: Math.round((d.betReward.issuedReward || 0) * 1000),
          userMaxReward: Math.round((d.betReward.userMaxReward || 0) * 1000)
        },
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
      console.log(111)
      console.log(postData)
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
