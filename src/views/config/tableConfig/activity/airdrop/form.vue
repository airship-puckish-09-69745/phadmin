<template>
  <el-dialog
    :title="isEdit ? '编辑空投活动' : '新增空投活动'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ========== 活动配置 ========== -->
      <el-tab-pane label="活动配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="220px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="空投活动名称：" required>
                <el-input v-model="item.name" placeholder="请输入活动名称" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker
                  v-model="item.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker
                  v-model="item.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                  @change="onChangeEndTime"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：" required>
                <el-date-picker
                  v-model="item.showEndTime"
                  type="datetime"
                  placeholder="选择展示结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">

              <el-form-item label="调试时间偏移量（仅测试用）：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="发放奖励类型：" required>
                <el-select v-model="item.rewardConfig.rewardType" placeholder="请选择" style="width:90px" disabled>
                  <el-option
                    v-for="item in rewardTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-if="item.rewardConfig.rewardType === 2" v-model="item.rewardConfig.useSceneId" placeholder="请选择投注金" style="width:200px" disabled>
                  <el-option
                    v-for="scene in betScenes"
                    :key="scene.value"
                    :label="scene.label"
                    :value="scene.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="空投总奖励金额：" required>
                <el-input v-model.number="item.rewardConfig.totalReward" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="发奖剩余监控比例：" required>
                <el-input v-model.number="item.rewardConfig.remainRewardMonitorRate" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">％</template>
                </el-input>
                <div v-if="isEdit && sentRewardAmount > item.rewardConfig.remainRewardMonitorRate * item.rewardConfig.totalReward / 100" style="color: red">
                  发奖总额已超阈值（{{ sentRewardAmount }}）
                </div>
                <div v-else-if="isEdit" style="color: red">
                  已发奖总额（{{ sentRewardAmount }}）
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="单个用户最大领奖额：" required>
                <el-input v-model.number="item.rewardConfig.userRewardLimit" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="调试时间偏移量（仅测试用）：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务文本：" required>
                <el-input v-model="item.taskConfig.taskText" placeholder="请输入任务文本" style="max-width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务条件：" required>
                <el-input v-model.number="item.taskConfig.taskValueRequired" placeholder="请输入任务条件值" style="max-width: 200px"/>
              </el-form-item>
            </el-col>

            <el-col  :xs="24" :sm="12">
              <el-form-item label="SiteId白名单：">
                <SiteSelect
                  v-model="item.whitelistCfg.siteIdList"
                  multiple
                  placeholder="请选择"
                  style="width: 100%; max-width: 400px"
                />
              </el-form-item>
            </el-col>

          </el-row>

          <!-- 玩法大类型 -->
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="玩法大类型：" required>
                <el-radio-group v-model="item.gameType" @change="onGameTypeChange">
                  <el-radio :label="1">Slot</el-radio>
                  <el-radio :label="2">Poker</el-radio>
                  <el-radio :label="3">Casino</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 参与活动游戏选择 - 使用GameSelector组件 -->
          <el-row>
            <el-col :span="24">
              <GameSelector
                v-model="item.gameIdCfg"
                label="勾选支持的游戏："
                :category-ids="[item.gameType]"
                @change="onGameSelectionChange"
              />
            </el-col>
          </el-row>

          <!-- 任务配置 - 合并到活动配置 -->
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="任务类型：" required>
                <el-select v-model="item.taskConfig.taskType" placeholder="请选择" style="width: 300px">
                  <el-option
                    v-for="item in gameTaskTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <!-- 白名单配置 - 合并到活动配置 -->
          <el-row :gutter="20">
            <el-col v-if="version === 'V1'" :span="11">
              <el-form-item label="AppId白名单：">
                <el-select v-model="item.whitelistCfg.appIdList" multiple placeholder="请选择" style="width: 400px">
                  <el-option
                    v-for="item in appIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <!-- 参与活动用户类型 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与活动用户类型：" required>
                <el-select v-model="userType" placeholder="请选择" style="width:280px" @change="onUserTypeChange">
                  <el-option
                    v-for="item in userTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 参与活动用户类型 - 使用 UserTypeSelector 组件 -->
          <UserTypeSelector
            v-model="item.userTypes"
            :activity-id="item.id"
            :show-end-time="item.showEndTime"
            :user-filter-condition.sync="item.userFilterCondition"
            :register-date-range.sync="registerDateRange"
            :imported-filename.sync="item.importedFilename"
            @uid-imported-deleted="handleUidImportedDeleted"
            @uid-imported-success="handleUidImportedSuccess"
            ref="userTypeSelector"
          />
        </el-form>
      </el-tab-pane>

      <!-- ========== 领奖配置 ========== -->
      <el-tab-pane label="领奖配置" name="reward">
        <RewardConfig v-model="item" :game-type="item.gameType" />
      </el-tab-pane>

      <!-- ========== 导入的用户 ========== -->
      <el-tab-pane v-if="showImportElement" label="导入的用户" name="importedUsers">
        <el-row :gutter="5">
          <el-col>
            <el-button type="primary" @click="getImportedUidList()" size="mini">查询</el-button>
            <el-table
              :data="importedUidList"
              border
              style="width: 100%"
              :cell-style="cellStyle"
            >
              <el-table-column
                prop="uid"
                label="用户ID"
              />
              <el-table-column
                prop="create_at"
                label="导入时间"
              >
                <template slot-scope="scope">
                  {{ formatTime(scope.row.create_at) }}
                </template>
              </el-table-column>
            </el-table>
            <el-col :offset="12" :span="9">
              <div class="block">
                <el-pagination
                  :current-page="importedUidPage.currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="importedUidPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="importedUidListCount"
                  @size-change="handleUidImportedTableSizeChange"
                  @current-change="handleUidImportedTableCurrentChange"
                />
              </div>
            </el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'
import RewardConfig from './components/RewardConfig.vue'
import GameSelector from '@/components/Game/GameSelector.vue'
import UserTypeSelector from './components/UserTypeSelector.vue'

const gameTaskTypeValidBet = 2 // 游戏任务类型：有效投注

function newItem() {
  return {
    id: 0,
    name: '',
    activityId: 12,
    startTime: Date.parse(new Date().toString()),
    endTime: Date.parse(new Date().toString()),
    showEndTime: Date.parse(new Date().toString()),
    modifyUser: '',
    status: 7,
    gameIdCfg: [],
    ruleImgHor: [],
    ruleImgVer: [],
    whitelistCfg: {
      appIdList: [],
      siteIdList: ['Dev'],
      abTest: {
        switch: false,
        bPercent: 0
      }
    },
    debugTimeOffset: 0,
    taskConfig: {
      taskType: 0,
      taskText: '',
      gameType: 1,
      taskValueRequired: 20
    },
    gameType: 1,
    rewardConfig: {
      rewardType: 2,
      useSceneId: 13,
      totalReward: 0,
      remainRewardMonitorRate: 90,
      rewardRanges: [],
      userRewardLimit: 0
    },
    progressPrizes: [],
    userTypes: [2], // 2 所有用户
    importedFilename: '',
    userFilterCondition: {
      registerTimeRange: {
        min: 0,
        max: 0
      },
      betTimesRange: {
        min: 0,
        max: 0
      },
      userTagConfig: {
        tagId: 0,
        tagValue: 1,
        tagType: 0
      }
    }
  }
}

export default {
  components: { SiteSelect, RewardConfig, GameSelector, UserTypeSelector },
  props: {
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    editData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'activity',
      env: 'test',
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      item: newItem(),
      cellStyle: $libShow.DefaultTableCell,

      // 用户相关
      registerDateRange: [],

      // 已发奖金额
      sentRewardAmount: 0,

      // 导入用户相关 - 仅用于列表展示
      importedUidListCount: 0,
      importedUidList: [],
      importedUidPage: {
        currentPage: 1,
        pageSize: 10
      },

      // AppId选项
      appIdOptions: [
        { value: 1000002, label: '内部1000002' },
        { value: 1000003, label: 'GP-BP测试1000003' },
        { value: 1000005, label: '正式1000005' }
      ],

      // 奖励类型
      rewardTypes: [
        { 'value': 2, 'label': '投注金' }
      ],

      // 投注金
      betScenes: [
        { 'value': 13, 'label': '【空投活动poker】任意游戏投注' },
        { 'value': 32, 'label': '【空投活动slot】任意游戏投注' }
      ],

      // 所有游戏任务类型（不再联动，直接可选）
      allGameTaskTypes: [
        { 'value': 1, 'label': '「牌局」次数' },
        { 'value': 2, 'label': '「有效下注」总额' },
        { 'value': 3, 'label': '「Pot」次数' },
        { 'value': 100, 'label': '「Tongits」获胜次数' },
        { 'value': 101, 'label': '「Tongits Fight」获胜次数' },
        { 'value': 200, 'label': '「Pusoy 其它玩家」获胜次数' },
        { 'value': 201, 'label': '「Pusoy 全垒打」获胜次数' },
        { 'value': 202, 'label': '「Pusoy NATURALS」获胜次数' },
        { 'value': 300, 'label': '「Lucky9 三张牌获得9点」次数' }
      ]
    }
  },
  computed: {
    // Show imported users tab only when user type is "导入用户" and activity exists
    showImportElement() {
      return this.item.id > 0 && this.item.userTypes.includes(3) // 3 导入用户
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.activeTab = 'activity'
        if (this.isEdit && Object.keys(this.editData).length > 0) {
          this.loadEditData()
        } else {
          this.item = newItem()
          this.registerDateRange = []
        }
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleDialogClose() {
      this.item = newItem()
    },
    // 加载编辑数据
    loadEditData() {
      const item = JSON.parse(JSON.stringify(this.editData))
      item.startTime = item.startTime * 1000
      item.endTime = item.endTime * 1000
      item.showEndTime = item.showEndTime * 1000
      item.gameIdCfg = JSON.parse(item.gameIdCfg)
      item.whitelistCfg = JSON.parse(item.whitelistCfg)
      item.ruleImgHor = JSON.parse(item.ruleImgHor)
      item.ruleImgVer = JSON.parse(item.ruleImgVer)
      item.debugTimeOffset = item.debugTimeOffset || 0
      item.gameType = parseInt(item.gameType) || 1
      item.taskConfig = JSON.parse(item.taskConfig)
      item.rewardConfig = JSON.parse(item.rewardConfig)
      item.rewardConfig.totalReward = item.rewardConfig.totalReward / 1000
      if (item.rewardConfig.userRewardLimit) {
        item.rewardConfig.userRewardLimit = item.rewardConfig.userRewardLimit / 1000
      } else {
        item.rewardConfig['userRewardLimit'] = 0
      }
      item.progressPrizes = JSON.parse(item.progressPrizes)
      item.userTypes = JSON.parse(item.userTypes)

      if (item.userFilterCondition && item.userFilterCondition !== '{}' && item.userFilterCondition !== 'null') {
        item.userFilterCondition = JSON.parse(item.userFilterCondition)
        this.registerDateRange = [item.userFilterCondition.registerTimeRange.min * 1000, item.userFilterCondition.registerTimeRange.max * 1000]
        if (!item.userFilterCondition.userTagConfig) {
          item.userFilterCondition.userTagConfig = { tagId: 0, tagValue: 1, tagType: 0 }
        } else if (item.userFilterCondition.userTagConfig.tagValue === undefined || item.userFilterCondition.userTagConfig.tagValue === null) {
          item.userFilterCondition.userTagConfig.tagValue = 1
        }
      } else {
        item.userFilterCondition = {
          registerTimeRange: { min: 0, max: 0 },
          betTimesRange: { min: 0, max: 0 },
          userTagConfig: { tagId: 0, tagValue: 1, tagType: 0 }
        }
      }

      for (let i = 0; i < item.rewardConfig.rewardRanges.length; i++) {
        const rewardRange = item.rewardConfig.rewardRanges[i]
        rewardRange.minScore = rewardRange.minScore / 1000
        rewardRange.maxScore = rewardRange.maxScore / 1000
        rewardRange.minCoefficient = rewardRange.minCoefficient / 100
        rewardRange.maxCoefficient = rewardRange.maxCoefficient / 100
      }

      // 任务类型为有效投注时，任务值除以1000
      if (item.taskConfig.taskType === gameTaskTypeValidBet) {
        item.taskConfig.taskValueRequired /= 1000
        for (let i = 0; i < item.progressPrizes.length; i++) {
          const prize = item.progressPrizes[i]
          prize.taskValueRequired /= 1000
        }
      }

      if (item.whitelistCfg.abTest === undefined) {
        item.whitelistCfg['abTest'] = {
          switch: false,
          bPercent: 0
        }
      }

      this.item = item

      // Initialize UserTypeSelector component with user tag config
      this.$nextTick(() => {
        if (this.$refs.userTypeSelector && item.userFilterCondition.userTagConfig.tagType) {
          this.$refs.userTypeSelector.initUserTagOptions(item.userFilterCondition.userTagConfig.tagType)
        }
      })

      // 获取已发奖金额
      if (this.isEdit) {
        this.getSentRewardAmount()
      }
    },
    onChangeEndTime(val) {
      if (val < this.item.startTime) {
        Message.error('活动结束时间不能早于活动开始时间')
        this.item.endTime = this.item.startTime
      }
      this.item.showEndTime = this.item.endTime + 1000 * 60 * 60 * 24
    },
    onGameTypeChange(val) {
      // 根据玩法大类型联动发放奖励类型：Slot=32，Poker=13
      const gameTypeSceneMap = { 1: 32, 2: 13 }
      if (gameTypeSceneMap[val]) {
        this.item.rewardConfig.useSceneId = gameTypeSceneMap[val]
      }
    },
    onGameSelectionChange() {
      // Game selection change handler - removed task type linkage logic
      // Task types are now directly selectable regardless of game selection
    },
    getSentRewardAmount() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: this.item.id,
          Path: '/activity/airdrop/sent/reward/amount'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.sentRewardAmount = response.Data / 1000
        }
      })
    },
    // User import handlers - delegated to UserTypeSelector component
    handleUidImportedDeleted() {
      this.importedUidListCount = 0
      this.importedUidList = []
    },
    handleUidImportedSuccess() {
      this.getImportedUidList()
    },
    getImportedUidList() {
      if (!this.item.id) {
        return
      }
      request({
        url: '/airdropconfig/uids/imported',
        method: 'get',
        data: {
          ActCfgId: this.item.id,
          Page: this.importedUidPage.currentPage,
          PageSize: this.importedUidPage.pageSize
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.importedUidList = response.Data.list
          this.importedUidListCount = response.Data.total
        }
      })
    },
    handleUidImportedTableSizeChange(val) {
      this.importedUidPage.pageSize = val
      this.getImportedUidList()
    },
    handleUidImportedTableCurrentChange(val) {
      this.importedUidPage.currentPage = val
      this.getImportedUidList()
    },
    // Upload and import handlers removed - now handled by UserTypeSelector component
    getPostData() {
      if (this.item.name === '') {
        Message.error('请填写活动名称')
        return
      }
      if (!this.item.gameType) {
        Message.error('请选择玩法大类型')
        return
      }
      for (let i = 0; i < this.item.progressPrizes.length; i++) {
        const item = this.item.progressPrizes[i]
        if (item.propType === 0 || item.propId === 0 || item.propNum === 0 || item.propNumMax === 0) {
          Message.error('请完善进度奖励配置')
          return
        }
        if (item.propNumMax % item.propNum !== 0) {
          Message.error('道具数量上限必须为道具数量的倍数')
          return
        }
      }
      if (this.item.taskConfig.taskType === 0 || this.item.taskConfig.taskValueRequired === 0 || this.item.taskConfig.taskText === '') {
        Message.error('请完善任务配置')
        return
      }
      if (this.item.userTypes[0] === 4) {
        if (!this.registerDateRange || this.registerDateRange.length === 0) {
          Message.error('请选择注册时间')
          return
        }
      }
      if (this.item.userTypes[0] === 5) {
        if (this.item.userFilterCondition.userTagConfig.tagType === 0) {
          Message.error('请选择标签类型')
          return
        }
        if (this.item.userFilterCondition.userTagConfig.tagId === 0) {
          Message.error('请选择标签子类')
          return
        }
        if (this.item.userFilterCondition.userTagConfig.tagId === 20000 && this.item.userFilterCondition.userTagConfig.tagValue === 0) {
          Message.error('请选择游戏强度')
          return
        }
      }
      if (this.item.gameIdCfg.length === 0) {
        Message.error('请选择参与活动的游戏')
        return
      }
      if (this.item.gameType === 2 && this.item.rewardConfig.rewardRanges.length === 0) {
        Message.error('请配置大奖系数配置')
        return
      }

      const copyItem = JSON.parse(JSON.stringify(this.item))
      copyItem.rewardConfig.totalReward *= 1000
      copyItem.rewardConfig.userRewardLimit *= 1000
      copyItem.rewardConfig.rewardRanges.forEach(item => {
        item.minScore *= 1000
        item.maxScore *= 1000
        item.minCoefficient = parseInt(item.minCoefficient * 100)
        item.maxCoefficient = parseInt(item.maxCoefficient * 100)
      })
      for (let i = 0; i < copyItem.rewardConfig.rewardRanges.length; i++) {
        const item = copyItem.rewardConfig.rewardRanges[i]
        if (item.minCoefficient >= 100) {
          Message.error('奖励系数区间开始值必须小于1')
          return
        }
        if (item.maxCoefficient >= 100) {
          Message.error('奖励系数区间结束值必须小于1')
          return
        }
      }

      // 任务类型为有效投注时，任务值乘以1000
      if (copyItem.taskConfig.taskType === gameTaskTypeValidBet) {
        copyItem.taskConfig.taskValueRequired *= 1000
        for (let i = 0; i < copyItem.progressPrizes.length; i++) {
          const item = copyItem.progressPrizes[i]
          item.taskValueRequired *= 1000
        }
      }

      // 确保注册的结束时间是日期的最后一秒
      if (this.registerDateRange && this.registerDateRange.length > 0) {
        const registerEndTime = new Date(this.registerDateRange[1]).setHours(23, 59, 59, 0)
        copyItem.userFilterCondition.registerTimeRange.min = this.registerDateRange[0] / 1000
        copyItem.userFilterCondition.registerTimeRange.max = registerEndTime / 1000
      }

      if (this.item.whitelistCfg.appIdList.length === 0 && this.version === 'V2') {
        copyItem.whitelistCfg.appIdList = [this.appId]
      }

      const data = {}
      data.id = copyItem.id
      data.name = copyItem.name
      data.activityId = copyItem.activityId
      data.startTime = copyItem.startTime / 1000
      data.endTime = copyItem.endTime / 1000
      data.showEndTime = copyItem.showEndTime / 1000
      data.gameIdCfg = JSON.stringify(copyItem.gameIdCfg)
      data.ruleImgHor = JSON.stringify(copyItem.ruleImgHor)
      data.ruleImgVer = JSON.stringify(copyItem.ruleImgVer)
      data.whitelistCfg = JSON.stringify(copyItem.whitelistCfg)
      data.debugTimeOffset = copyItem.debugTimeOffset
      data.rewardConfig = JSON.stringify(copyItem.rewardConfig)
      data.taskConfig = JSON.stringify(copyItem.taskConfig)
      data.progressPrizes = JSON.stringify(copyItem.progressPrizes)
      data.userTypes = JSON.stringify(copyItem.userTypes)
      data.importedFilename = copyItem.importedFilename
      data.gameType = copyItem.gameType
      data.userFilterCondition = JSON.stringify(copyItem.userFilterCondition)
      return data
    },
    handleSave() {
      const data = this.getPostData()
      if (data === null || data === undefined) {
        return
      }
      if (this.isEdit) {
        this.updateData(data)
      } else {
        this.createData(data)
      }
    },
    createData(data) {
      data['env'] = this.env
      request({
        url: '/airdropconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    updateData(data) {
      request({
        url: '/airdropconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}

.reward-config-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
