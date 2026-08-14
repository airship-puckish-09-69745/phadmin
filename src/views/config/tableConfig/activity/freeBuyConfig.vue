<template>
  <div class="page-container free-buy-config">
    <el-row>
      <publish
        primary-key="id"
        :key-id="getFullKey()"
        :app-id="configAppId"
        :env-empty="false"
        :check="configCheck"
        compare-type="Object"
        :attr-names="{ nextConfigId: '下一个期次ID', configs: '活动期次' }"
      />
    </el-row>

    <el-row class="toolbar">
      <el-col :span="20">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="openActivityDialog(false)">新增活动期次</el-button>
      </el-col>
      <el-col :span="4" class="toolbar-actions">
        <el-button type="success" size="mini" icon="el-icon-refresh" :loading="loading" @click="getList">刷新</el-button>
      </el-col>
    </el-row>

    <el-alert
      v-if="!configRecord.ID"
      title="当前环境尚未创建 Free Buy 通用配置，保存首个活动期次后即可发布。"
      type="info"
      show-icon
      :closable="false"
      class="config-alert"
    />

    <el-table
      v-loading="loading"
      :data="configs"
      border
      stripe
      style="width: 100%"
      empty-text="暂无 Free Buy 活动配置"
    >
      <el-table-column prop="id" label="期次ID" width="90" align="center" />
      <el-table-column prop="activityName" label="活动名称" min-width="180" />
      <el-table-column label="活动时间" min-width="290">
        <template slot-scope="scope">
          {{ formatTime(scope.row.startTime) }} 至 {{ formatTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="参与范围" min-width="220">
        <template slot-scope="scope">
          <div>站点：{{ formatList(scope.row.siteIdList, '全部') }}</div>
          <div>游戏：{{ formatGameList(scope.row.gameIdList) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务" width="130" align="center">
        <template slot-scope="scope">
          {{ taskCountText(scope.row.taskList) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 2 && scope.row.isOpen ? 'success' : 'info'">
            {{ statusText(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="openActivityDialog(true, scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.status !== 2"
            size="mini"
            type="success"
            icon="el-icon-upload2"
            @click="changeStatus(scope.row, 2)"
          >上架</el-button>
          <el-button
            v-else
            size="mini"
            type="warning"
            icon="el-icon-download"
            @click="changeStatus(scope.row, 6)"
          >下架</el-button>
          <el-button
            v-if="scope.row.status !== 2"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteActivity(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="activityDialogTitle"
      :visible.sync="activityDialogVisible"
      :close-on-click-modal="false"
      width="76%"
      top="4vh"
    >
      <el-form ref="activityForm" :model="editItem" label-width="150px" size="small">
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="活动开关">
                  <el-switch v-model="editItem.isOpen" active-text="开启" inactive-text="关闭" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调试时间偏移(秒)">
                  <el-input-number v-model="editItem.debugTimeOffset" :min="-31536000" :max="31536000" controls-position="right" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="期次ID" required>
                  <el-input-number v-model="editItem.id" :min="1" :max="2147483647" :disabled="true" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动名称" required>
                  <el-input v-model.trim="editItem.activityName" maxlength="50" show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开始时间" required>
                  <el-date-picker
                    v-model="editItem.startTimeValue"
                    type="datetime"
                    value-format="timestamp"
                    placeholder="选择活动开始时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" required>
                  <el-date-picker
                    v-model="editItem.endTimeValue"
                    type="datetime"
                    value-format="timestamp"
                    placeholder="选择活动结束时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="每日道具上限" required>
                  <el-input-number v-model="editItem.dailyPropLimit" :min="1" :max="2147483647" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总道具上限" required>
                  <el-input-number v-model="editItem.totalPropLimit" :min="1" :max="2147483647" controls-position="right" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="站点">
              <site-select v-model="editItem.siteIdList" multiple clearable filterable placeholder="不选择表示全部站点" style="width: 100%" />
            </el-form-item>
            <el-form-item label="参与游戏" required>
              <el-select
                v-model="editItem.gameIdList"
                multiple
                filterable
                placeholder="请选择参与游戏"
                style="width: 100%"
              >
                <el-option
                  v-for="game in slotGameOptions"
                  :key="game.value"
                  :label="game.label"
                  :value="game.value"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="A/B测试">
            <el-divider content-position="left">A/B测试</el-divider>
            <el-form-item label="A/B测试开关">
              <el-switch v-model="editItem.abTest.switch" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="B分组比例" required>
              <el-input-number v-model="editItem.abTest.bPercent" :min="0" :max="100" :precision="0" controls-position="right" />
              <span class="unit-text">%</span>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="任务与奖励">
            <div class="task-toolbar">
              <span>各任务类型是独立任务链，同一笔 Super Free 实际购买只会增加一条任务链，匹配优先级由服务端定义。</span>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="openTaskDialog(false)">新增任务</el-button>
            </div>
            <div class="task-order-row">
              <span class="task-order-text">展示顺序：</span>
              <draggable
                :value="taskTypeOrder"
                class="task-order-list"
                handle=".task-order-item"
                ghost-class="task-order-ghost"
                chosen-class="task-order-chosen"
                :animation="150"
                @end="onTaskTypeDragEnd"
              >
                <el-button v-for="taskType in taskTypeOrder" :key="taskType" class="task-order-item" size="small" plain>
                  <i class="el-icon-rank" />
                  类型{{ taskType }}
                </el-button>
              </draggable>
            </div>
            <el-table :data="sortedEditTasks" border size="small" empty-text="请至少配置两种任务类型各一项">
              <el-table-column prop="taskType" label="任务类型" min-width="170">
                <template slot-scope="scope">{{ taskTypeText(scope.row.taskType) }}</template>
              </el-table-column>
              <el-table-column prop="taskId" label="任务ID" width="80" align="center" />
              <el-table-column label="完成条件" min-width="200">
                <template slot-scope="scope">
                  单次实际消耗 {{ compareText(scope.row.compareType) }} {{ scope.row.conditionAmount }}，完成 {{ scope.row.targetProgress }} 次
                </template>
              </el-table-column>
              <el-table-column label="奖励" min-width="220">
                <template slot-scope="scope">{{ rewardText(scope.row.reward) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" circle title="编辑任务" @click="openTaskDialog(true, scope.row)" />
                  <el-button size="mini" type="danger" icon="el-icon-delete" circle title="删除任务" @click="deleteTask(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activityDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveActivity">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="taskDialogTitle"
      :visible.sync="taskDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="620px"
    >
      <el-form :model="taskEditItem" label-width="160px" size="small">
        <el-form-item label="任务类型" required>
          <el-select v-model="taskEditItem.taskType" style="width: 100%" @change="handleTaskTypeChange">
            <el-option label="类型一：实际消耗大于等于" :value="1" />
            <el-option label="类型二：实际消耗固定额度" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务ID" required>
          <el-input-number v-model="taskEditItem.taskId" :min="1" :max="1000" controls-position="right" />
        </el-form-item>
        <el-form-item label="实际消耗条件" required>
          <el-input-number v-model="taskEditItem.conditionAmount" :min="1" :max="1000000000" controls-position="right" />
          <span class="unit-text">Bet</span>
        </el-form-item>
        <el-form-item label="需完成次数" required>
          <el-input-number v-model="taskEditItem.targetProgress" :min="1" :max="100000" controls-position="right" />
        </el-form-item>
        <el-divider content-position="left">奖励配置</el-divider>
        <el-form-item label="奖励类型" required>
          <el-radio-group v-model="taskEditItem.reward.rewardType" @change="handleRewardTypeChange">
            <el-radio :label="1">Slots FreeSpin</el-radio>
            <el-radio :label="2">富裕卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="taskEditItem.reward.rewardType === 1">
          <el-form-item label="FreeSpin道具" required>
            <el-select v-model="taskEditItem.reward.propId" filterable placeholder="请选择FreeSpin道具" style="width: 100%">
              <el-option v-for="item in freeSpinPropOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="适用游戏" required>
            <el-select v-model="taskEditItem.reward.slotsType" filterable placeholder="请选择游戏" style="width: 100%">
              <el-option v-for="item in richCardGameOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="富裕卡" required>
            <el-cascader
              v-model="taskEditItem.rewardRichCardSelect"
              :options="richCardOptions"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择星级和Bet"
              style="width: 100%"
            />
          </el-form-item>
        </template>
        <el-form-item label="奖励数量" required>
          <el-input-number v-model="taskEditItem.reward.rewardNum" :min="1" :max="100000" controls-position="right" />
        </el-form-item>
        <el-form-item label="有效天数" required>
          <el-select v-model="taskEditItem.reward.validDays" :disabled="taskEditItem.reward.rewardType === 2" style="width: 100%">
            <el-option v-for="item in validDayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTask">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate } from '@/utils/common'
import { createCustomize, getCustomize, updateCustomize } from '@/api/custome_configV2'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import Publish from '@/components/Publish/index.vue'
import draggable from 'vuedraggable'
import store from '@/store'
import { ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'

const SUB_KEY = 'free_buy_task_cfg'
const STATUS_ONLINE = 2
const STATUS_OFFLINE = 6

function newReward(rewardType = 1) {
  return {
    rewardType,
    propId: 0,
    rewardNum: 1,
    validDays: rewardType === 2 ? 2 : 1,
    richCardLevel: 0,
    slotsType: 0,
    bet: 0
  }
}

function newTask(taskType = 1) {
  return {
    taskType,
    taskId: 1,
    targetProgress: 1,
    compareType: taskType === 1 ? 1 : 2,
    conditionAmount: 1,
    reward: newReward(taskType === 1 ? 1 : 2),
    rewardRichCardSelect: []
  }
}

// 需求文档明确了四个任务档位；未提供的道具ID和富裕卡星级保留为空，必须由运营确认。
function defaultTasks() {
  return [
    {
      ...newTask(1),
      taskId: 1,
      conditionAmount: 100,
      reward: { ...newReward(1), rewardNum: 3 }
    },
    {
      ...newTask(1),
      taskId: 2,
      conditionAmount: 600,
      reward: { ...newReward(1), rewardNum: 5 }
    },
    { ...newTask(2), taskId: 1, conditionAmount: 1000, reward: { ...newReward(2), rewardNum: 1, bet: 500 }},
    { ...newTask(2), taskId: 2, conditionAmount: 5000, reward: { ...newReward(2), rewardNum: 3, bet: 1000 }}
  ]
}

function newActivity(id) {
  return {
    id,
    activityName: `第${id}期 Free Buy`,
    startTime: 0,
    endTime: 0,
    startTimeValue: null,
    endTimeValue: null,
    isOpen: false,
    status: STATUS_OFFLINE,
    siteIdList: ['BP', 'GP'],
    gameIdList: [],
    dailyPropLimit: 1,
    totalPropLimit: 1,
    taskList: defaultTasks(),
    debugTimeOffset: 0,
    abTest: {
      switch: false,
      bPercent: 0
    }
  }
}

function newConfigRecord(appId) {
  return {
    ID: 0,
    AppId: appId,
    Type: 1,
    Name: 'Slots Free Buy活动配置',
    Description: 'Slots Free Buy活动期次、实际消耗任务与奖励配置',
    Data: '[]',
    RedisSubkey: SUB_KEY
  }
}

export default {
  name: 'FreeBuyConfig',
  components: {
    Publish,
    SiteSelect,
    draggable
  },
  data() {
    const configAppId = parseInt(store.getters.appId) || -1
    return {
      configAppId,
      configRecord: newConfigRecord(configAppId),
      configs: [],
      nextConfigId: 1,
      loading: false,
      saving: false,
      activityDialogVisible: false,
      activityEditMode: false,
      editItem: newActivity(1),
      taskDialogVisible: false,
      taskEditMode: false,
      taskEditOriginalKey: '',
      taskEditItem: newTask(1),
      freeSpinPropOptions: [],
      richCardOptions: [],
      richCardGameOptions: [],
      richCardOpenGameMap: {},
      slotGameOptions: []
    }
  },
  computed: {
    activityDialogTitle() {
      return this.activityEditMode ? '编辑 Free Buy 活动期次' : '新增 Free Buy 活动期次'
    },
    taskDialogTitle() {
      return this.taskEditMode ? '编辑任务' : '新增任务'
    },
    taskTypeOrder() {
      const order = []
      for (const task of this.editItem.taskList || []) {
        const taskType = Number(task.taskType)
        if (Number.isInteger(taskType) && taskType > 0 && !order.includes(taskType)) order.push(taskType)
      }
      return order
    },
    sortedEditTasks() {
      return [...(this.editItem.taskList || [])].sort((a, b) => {
        return this.taskTypeOrder.indexOf(Number(a.taskType)) - this.taskTypeOrder.indexOf(Number(b.taskType)) || Number(a.taskId) - Number(b.taskId)
      })
    },
    validDayOptions() {
      return ITEM_DAY_TYPE_OPTIONS.filter(item => !item.disabled && item.value !== 0 && item.value !== 365)
    }
  },
  created() {
    this.getList()
    this.getFreeSpinProps()
    this.getMissionData()
    this.getGameAll()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + SUB_KEY
    },
    getList() {
      this.loading = true
      getCustomize(SUB_KEY, this.configAppId).then(response => {
        if (response.RetCode === 0 && response.Data) {
          this.configRecord = { ...newConfigRecord(this.configAppId), ...response.Data, AppId: this.configAppId }
          const configData = this.parseConfigData(response.Data.Data)
          this.configs = configData.configs
          this.nextConfigId = configData.nextConfigId
        } else {
          this.configRecord = newConfigRecord(this.configAppId)
          this.configs = []
          this.nextConfigId = 1
        }
      }).finally(() => {
        this.loading = false
      })
    },
    parseConfigData(data) {
      if (!data) return { configs: [], nextConfigId: 1 }
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        if (!parsed || Array.isArray(parsed) || !Array.isArray(parsed.configs)) {
          throw new Error('Free Buy配置必须包含configs数组')
        }
        const nextConfigId = Number(parsed.nextConfigId)
        if (!Number.isInteger(nextConfigId) || nextConfigId <= 0) {
          throw new Error('Free Buy配置nextConfigId必须是正整数')
        }
        const list = parsed.configs
        const configs = list.map(item => this.normalizeActivity(item)).sort((a, b) => b.id - a.id)
        const maxConfigId = configs.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
        if (nextConfigId <= maxConfigId) {
          throw new Error('Free Buy配置nextConfigId必须大于现有期次ID')
        }
        return {
          configs,
          nextConfigId
        }
      } catch (error) {
        console.error('Free Buy配置解析失败:', error)
        this.$message.error('Free Buy配置格式错误，请检查nextConfigId和configs')
        return { configs: [], nextConfigId: 1 }
      }
    },
    normalizeActivity(item) {
      const data = JSON.parse(JSON.stringify(item || {}))
      // 兼容清理旧配置中已经废弃的 App 参与范围字段。
      delete data.appIdList
      data.isOpen = Boolean(data.isOpen)
      data.status = Number(data.status) || STATUS_OFFLINE
      // 兼容并清理旧配置中的UID白名单字段，Free Buy只按站点范围和A/B测试控制参与玩家。
      delete data.isWhite
      delete data.whiteList
      data.siteIdList = Array.isArray(data.siteIdList) ? data.siteIdList : []
      data.gameIdList = Array.isArray(data.gameIdList) ? data.gameIdList : []
      data.dailyPropLimit = Number(data.dailyPropLimit) || 0
      data.totalPropLimit = Number(data.totalPropLimit) || 0
      data.taskList = Array.isArray(data.taskList) ? data.taskList.map(task => this.normalizeTask(task)) : []
      data.debugTimeOffset = Number(data.debugTimeOffset) || 0
      data.abTest = { switch: false, bPercent: 0, ...(data.abTest || {}) }
      data.abTest.switch = Boolean(data.abTest.switch)
      data.abTest.bPercent = Number(data.abTest.bPercent)
      return data
    },
    normalizeTask(task) {
      const data = { ...newTask(Number(task.taskType) || 1), ...task }
      data.reward = { ...newReward(Number(task.reward && task.reward.rewardType) || 1), ...(task.reward || {}) }
      if (Number(data.reward.rewardType) === 2) {
        data.reward.validDays = 2
        data.rewardRichCardSelect = Array.isArray(task.rewardRichCardSelect) && task.rewardRichCardSelect.length === 2
          ? task.rewardRichCardSelect.map(Number)
          : (Number(data.reward.richCardLevel) > 0 && Number(data.reward.bet) > 0
            ? [Number(data.reward.richCardLevel), Number(data.reward.bet)]
            : [])
      } else {
        data.rewardRichCardSelect = []
      }
      return data
    },
    getFreeSpinProps() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: { PageNum: 1, PageSize: 1000 }
      }).then(response => {
        if (response.RetCode !== 0) return
        const rows = response.Data && Array.isArray(response.Data.list) ? response.Data.list : []
        this.freeSpinPropOptions = rows
          .filter(item => Number(item.item_type) === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN && Number(item.status) === 1)
          .map(item => ({ value: Number(item.id), label: this.formatPropOptionLabel(item) }))
      }).catch(error => {
        console.error('FreeSpin道具列表加载失败:', error)
      })
    },
    getMissionData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: { SubKey: 'slotsmission' }
      }).then(response => {
        if (response.RetCode !== 0 || !response.Data) return
        const config = JSON.parse(response.Data.Data || '{}')
        this.richCardOpenGameMap = (config.BuyFreeList || []).reduce((result, item) => {
          result[Number(item.SlotsType)] = Boolean(item.Open)
          return result
        }, {})
        this.richCardOptions = (config.RichCardList || []).map(item => ({
          value: Number(item.RichCardLevel),
          label: `星级${item.RichCardLevel}`,
          children: (item.Bets || []).map(bet => ({
            value: Number(bet),
            label: `金额 ${Number(bet) / 1000}`
          }))
        }))
        this.refreshRichCardGameOptions()
      }).catch(error => {
        console.error('富裕卡规则加载失败:', error)
      })
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode !== 0) return
        this.slotGameOptions = (response.Data || [])
          .filter(item => Number(item.CategoryID) === 1)
          .map(item => ({ value: Number(item.Gid), label: `${item.Name} [${item.Gid}]` }))
          .sort((a, b) => a.value - b.value)
        this.refreshRichCardGameOptions()
      }).catch(error => {
        console.error('富裕卡游戏列表加载失败:', error)
      })
    },
    refreshRichCardGameOptions() {
      this.richCardGameOptions = this.slotGameOptions
        .filter(item => this.richCardOpenGameMap[item.value])
        .sort((a, b) => a.value - b.value)
    },
    openActivityDialog(isEdit, row) {
      this.activityEditMode = isEdit
      if (isEdit) {
        this.editItem = this.normalizeActivity(row)
        this.$set(this.editItem, 'startTimeValue', Number(row.startTime) * 1000)
        this.$set(this.editItem, 'endTimeValue', Number(row.endTime) * 1000)
      } else {
        this.editItem = newActivity(this.nextConfigId)
      }
      this.activityDialogVisible = true
    },
    saveActivity() {
      const activity = this.buildActivityForSave(this.editItem)
      const error = this.validateActivity(activity)
      if (error) {
        this.$message.error(error)
        return
      }
      const exists = this.configs.some(item => item.id === activity.id)
      if (!this.activityEditMode && exists) {
        this.$message.error(`期次ID ${activity.id} 已存在`)
        return
      }
      const nextConfigs = JSON.parse(JSON.stringify(this.configs))
      const index = nextConfigs.findIndex(item => item.id === activity.id)
      if (index >= 0) {
        nextConfigs.splice(index, 1, activity)
      } else {
        nextConfigs.push(activity)
      }
      const nextConfigId = this.activityEditMode ? this.nextConfigId : Math.max(this.nextConfigId, activity.id + 1)
      this.persistConfigs(nextConfigs, '活动期次保存成功', nextConfigId).then(success => {
        if (success) this.activityDialogVisible = false
      })
    },
    buildActivityForSave(item) {
      const data = this.normalizeActivity(item)
      data.id = Number(data.id)
      data.startTime = Math.floor(Number(item.startTimeValue) / 1000)
      data.endTime = Math.floor(Number(item.endTimeValue) / 1000)
      data.gameIdList = this.toNumberList(data.gameIdList)
      data.siteIdList = data.siteIdList.map(value => String(value)).filter(Boolean)
      const taskTypeOrder = []
      for (const task of data.taskList) {
        const taskType = Number(task.taskType)
        if (Number.isInteger(taskType) && taskType > 0 && !taskTypeOrder.includes(taskType)) taskTypeOrder.push(taskType)
      }
      data.taskList = data.taskList.map(task => this.cleanTask(task)).sort((a, b) => {
        return taskTypeOrder.indexOf(a.taskType) - taskTypeOrder.indexOf(b.taskType) || a.taskId - b.taskId
      })
      delete data.startTimeValue
      delete data.endTimeValue
      return data
    },
    cleanTask(task) {
      const data = this.normalizeTask(task)
      data.taskType = Number(data.taskType)
      data.taskId = Number(data.taskId)
      data.targetProgress = Number(data.targetProgress)
      data.compareType = data.taskType === 1 ? 1 : 2
      data.conditionAmount = Number(data.conditionAmount)
      data.reward.rewardType = Number(data.reward.rewardType)
      data.reward.propId = Number(data.reward.propId) || 0
      data.reward.rewardNum = Number(data.reward.rewardNum)
      data.reward.validDays = data.reward.rewardType === 2 ? 2 : Number(data.reward.validDays)
      data.reward.slotsType = Number(data.reward.slotsType) || 0
      data.reward.richCardLevel = data.reward.rewardType === 2 ? Number(data.rewardRichCardSelect[0]) || 0 : 0
      data.reward.bet = data.reward.rewardType === 2 ? Number(data.rewardRichCardSelect[1]) || 0 : 0
      if (data.reward.rewardType === 1) {
        data.reward.slotsType = 0
      } else {
        data.reward.propId = 0
      }
      delete data.rewardRichCardSelect
      return data
    },
    persistConfigs(configs, successMessage, nextConfigId = this.nextConfigId) {
      this.saving = true
      const payload = {
        ...newConfigRecord(this.configAppId),
        ...this.configRecord,
        AppId: this.configAppId,
        Type: 1,
        RedisSubkey: SUB_KEY,
        Data: JSON.stringify({ nextConfigId, configs })
      }
      const saveRequest = payload.ID ? updateCustomize(payload) : createCustomize(payload)
      return saveRequest.then(response => {
        if (response.RetCode !== 0) return false
        this.configs = configs.map(item => this.normalizeActivity(item)).sort((a, b) => b.id - a.id)
        this.nextConfigId = nextConfigId
        this.$message.success(`${successMessage}，发布后生效`)
        this.getList()
        return true
      }).finally(() => {
        this.saving = false
      })
    },
    changeStatus(row, status) {
      const action = status === STATUS_ONLINE ? '上架' : '下架'
      if (status === STATUS_ONLINE) {
        const error = this.validateActivity(row)
        if (error) {
          this.$message.error(`无法上架：${error}`)
          return
        }
      }
      this.$confirm(`确认${action}活动“${row.activityName}”吗？保存后仍需发布配置才会同步到 Redis。`, '提示', { type: 'warning' }).then(() => {
        const nextConfigs = JSON.parse(JSON.stringify(this.configs))
        const item = nextConfigs.find(config => config.id === row.id)
        item.status = status
        if (status === STATUS_ONLINE) item.isOpen = true
        return this.persistConfigs(nextConfigs, `${action}状态保存成功`)
      }).catch(() => {})
    },
    deleteActivity(row) {
      this.$confirm(`确认删除活动“${row.activityName}”吗？`, '提示', { type: 'warning' }).then(() => {
        const nextConfigs = this.configs.filter(item => item.id !== row.id)
        return this.persistConfigs(nextConfigs, '活动期次删除成功')
      }).catch(() => {})
    },
    openTaskDialog(isEdit, row) {
      this.taskEditMode = isEdit
      if (isEdit) {
        this.taskEditItem = this.normalizeTask(row)
        this.taskEditOriginalKey = this.taskKey(row)
      } else {
        const taskType = 1
        const maxId = (this.editItem.taskList || [])
          .filter(item => item.taskType === taskType)
          .reduce((max, item) => Math.max(max, Number(item.taskId) || 0), 0)
        this.taskEditItem = newTask(taskType)
        this.taskEditItem.taskId = maxId + 1
        this.taskEditOriginalKey = ''
      }
      this.taskDialogVisible = true
    },
    handleTaskTypeChange(taskType) {
      this.taskEditItem.compareType = taskType === 1 ? 1 : 2
      const maxId = (this.editItem.taskList || [])
        .filter(item => item.taskType === taskType && this.taskKey(item) !== this.taskEditOriginalKey)
        .reduce((max, item) => Math.max(max, Number(item.taskId) || 0), 0)
      if (!this.taskEditMode) this.taskEditItem.taskId = maxId + 1
    },
    handleRewardTypeChange(rewardType) {
      const current = this.taskEditItem.reward
      this.taskEditItem.reward = { ...newReward(rewardType), rewardNum: current.rewardNum }
      this.taskEditItem.rewardRichCardSelect = []
    },
    saveTask() {
      const task = this.cleanTask(this.taskEditItem)
      const error = this.validateTask(task)
      if (error) {
        this.$message.error(error)
        return
      }
      const newKey = this.taskKey(task)
      const duplicate = this.editItem.taskList.some(item => this.taskKey(item) === newKey && this.taskKey(item) !== this.taskEditOriginalKey)
      if (duplicate) {
        this.$message.error(`任务类型 ${task.taskType} 的任务ID ${task.taskId} 已存在`)
        return
      }
      const nextTasks = JSON.parse(JSON.stringify(this.editItem.taskList || []))
      const index = this.taskEditMode ? nextTasks.findIndex(item => this.taskKey(item) === this.taskEditOriginalKey) : -1
      if (index >= 0) {
        nextTasks.splice(index, 1, task)
      } else {
        nextTasks.push(task)
      }
      this.editItem.taskList = nextTasks
      this.taskDialogVisible = false
    },
    onTaskTypeDragEnd(event) {
      const taskTypeOrder = [...this.taskTypeOrder]
      const oldIndex = Number(event.oldIndex)
      const newIndex = Number(event.newIndex)
      if (oldIndex === newIndex || oldIndex < 0 || newIndex < 0 || oldIndex >= taskTypeOrder.length || newIndex >= taskTypeOrder.length) return
      const movedTypes = taskTypeOrder.splice(oldIndex, 1)
      taskTypeOrder.splice(newIndex, 0, movedTypes[0])
      this.editItem.taskList = [...(this.editItem.taskList || [])].sort((a, b) => {
        return taskTypeOrder.indexOf(Number(a.taskType)) - taskTypeOrder.indexOf(Number(b.taskType)) || Number(a.taskId) - Number(b.taskId)
      })
    },
    deleteTask(row) {
      this.$confirm(`确认删除任务类型 ${row.taskType} 的任务 ${row.taskId} 吗？`, '提示', { type: 'warning' }).then(() => {
        this.editItem.taskList = this.editItem.taskList.filter(item => this.taskKey(item) !== this.taskKey(row))
      }).catch(() => {})
    },
    configCheck() {
      if (!this.configs.length) {
        this.$message.error('至少需要一个 Free Buy 活动期次')
        return false
      }
      const ids = new Set()
      let maxConfigId = 0
      for (const activity of this.configs) {
        const error = this.validateActivity(activity)
        if (error) {
          this.$message.error(`期次 ${activity.id || '-'}：${error}`)
          return false
        }
        if (ids.has(activity.id)) {
          this.$message.error(`期次ID ${activity.id} 重复`)
          return false
        }
        ids.add(activity.id)
        maxConfigId = Math.max(maxConfigId, Number(activity.id) || 0)
      }
      if (!Number.isInteger(this.nextConfigId) || this.nextConfigId <= maxConfigId) {
        this.$message.error('下一个期次ID必须大于现有期次ID')
        return false
      }
      return true
    },
    validateActivity(activity) {
      if (!activity || Number(activity.id) <= 0) return '期次ID必须大于0'
      if (!String(activity.activityName || '').trim()) return '请填写活动名称'
      if (Number(activity.startTime) <= 0) return '请填写开始时间'
      if (Number(activity.endTime) <= Number(activity.startTime)) return '结束时间必须晚于开始时间'
      if (!Array.isArray(activity.gameIdList) || !activity.gameIdList.length) return '请至少选择一个参与游戏'
      if (Number(activity.dailyPropLimit) <= 0) return '每日发放道具上限必须大于0'
      if (Number(activity.totalPropLimit) <= 0) return '总发放道具上限必须大于0'
      if (Number(activity.dailyPropLimit) > Number(activity.totalPropLimit)) return '每日发放道具上限不能大于总发放道具上限'
      if (!activity.abTest || !Number.isInteger(activity.abTest.bPercent) || activity.abTest.bPercent < 0 || activity.abTest.bPercent > 100) return 'B分组比例必须是0到100之间的整数'
      if (!Array.isArray(activity.taskList) || !activity.taskList.length) return '请配置任务'
      const taskTypes = new Set()
      const taskKeys = new Set()
      for (const task of activity.taskList) {
        const error = this.validateTask(task)
        if (error) return error
        const key = this.taskKey(task)
        if (taskKeys.has(key)) return `任务类型 ${task.taskType} 的任务ID ${task.taskId} 重复`
        taskKeys.add(key)
        taskTypes.add(Number(task.taskType))
      }
      if (!taskTypes.has(1) || !taskTypes.has(2)) return '任务类型一和任务类型二都必须至少配置一项'
      return ''
    },
    validateTask(task) {
      if (![1, 2].includes(Number(task.taskType))) return '任务类型无效'
      if (Number(task.taskId) <= 0) return '任务ID必须大于0'
      if (Number(task.targetProgress) <= 0) return `任务 ${task.taskId} 的完成次数必须大于0`
      if (Number(task.conditionAmount) <= 0) return `任务 ${task.taskId} 的实际消耗条件必须大于0`
      if (Number(task.taskType) === 1 && Number(task.compareType) !== 1) return `任务 ${task.taskId} 的比较方式应为大于等于`
      if (Number(task.taskType) === 2 && Number(task.compareType) !== 2) return `任务 ${task.taskId} 的比较方式应为等于`
      const reward = task.reward || {}
      if (Number(reward.rewardNum) <= 0) return `任务 ${task.taskId} 的奖励数量必须大于0`
      if (Number(reward.validDays) <= 0) return `任务 ${task.taskId} 的奖励有效天数必须大于0`
      if (Number(reward.rewardType) === 1 && Number(reward.propId) <= 0) return `任务 ${task.taskId} 请选择 FreeSpin 道具`
      if (Number(reward.rewardType) === 2) {
        if (Number(reward.richCardLevel) <= 0) return `任务 ${task.taskId} 请选择富裕卡星级`
        if (Number(reward.slotsType) <= 0) return `任务 ${task.taskId} 请选择富裕卡适用游戏`
        if (Number(reward.bet) <= 0) return `任务 ${task.taskId} 请填写富裕卡 Bet`
      }
      if (![1, 2].includes(Number(reward.rewardType))) return `任务 ${task.taskId} 的奖励类型无效`
      return ''
    },
    taskKey(task) {
      return `${Number(task.taskType)}:${Number(task.taskId)}`
    },
    toNumberList(values) {
      return [...new Set((values || []).map(value => Number(value)).filter(value => Number.isInteger(value) && value > 0))]
    },
    formatTime(timestamp) {
      return timestamp ? $libDate.FormateSecondStr(timestamp, 2) : '-'
    },
    formatList(values, emptyText) {
      return Array.isArray(values) && values.length ? values.join('、') : emptyText
    },
    formatGameList(values) {
      if (!Array.isArray(values) || !values.length) return '-'
      return values.map(value => Number(value) === 230 ? `Pahiyas Win's [${value}]` : value).join('、')
    },
    taskCountText(tasks) {
      const list = Array.isArray(tasks) ? tasks : []
      const typeOne = list.filter(item => Number(item.taskType) === 1).length
      const typeTwo = list.filter(item => Number(item.taskType) === 2).length
      return `类型一 ${typeOne} / 类型二 ${typeTwo}`
    },
    statusText(row) {
      if (!row.isOpen) return '活动关闭'
      return row.status === STATUS_ONLINE ? '已上架' : '已下架'
    },
    taskTypeText(taskType) {
      if (Number(taskType) === 1) return '类型一：大于等于'
      if (Number(taskType) === 2) return '类型二：固定额度'
      return `类型${taskType}`
    },
    compareText(compareType) {
      return Number(compareType) === 1 ? '≥' : '='
    },
    rewardText(reward) {
      if (!reward) return '-'
      if (Number(reward.rewardType) === 1) {
        const prop = this.freeSpinPropOptions.find(item => item.value === Number(reward.propId))
        return `${prop ? prop.label : `FreeSpin 道具 ${reward.propId || '未选'}`} × ${reward.rewardNum}，${reward.validDays}天`
      }
      const game = this.richCardGameOptions.find(item => item.value === Number(reward.slotsType))
      return `${game ? game.label : `游戏 ${reward.slotsType || '未选'}`}，${reward.richCardLevel || '未选'}星富裕卡 × ${reward.rewardNum}，Bet ${Number(reward.bet || 0) / 1000}，${reward.validDays}天`
    },
    formatPropOptionLabel(item) {
      let name = item.item_name
      try {
        const extra = typeof item.item_extra === 'string' ? JSON.parse(item.item_extra) : item.item_extra
        if (extra && extra.showName) name += `(${extra.showName})`
      } catch (error) {
        console.warn(`FreeSpin道具 ${item.id} 的item_extra解析失败:`, error)
      }
      return `${name} [${item.id}]`
    }
  }
}
</script>

<style scoped>
.free-buy-config {
  padding: 10px;
}

.toolbar {
  margin-bottom: 10px;
}

.toolbar-actions {
  text-align: right;
}

.config-alert {
  margin-bottom: 10px;
}

.task-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #606266;
}

.task-order-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 10px 12px 2px;
  margin-bottom: 10px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
}

.task-order-text {
  flex-shrink: 0;
  margin-right: 10px;
  line-height: 32px;
}

.task-order-list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  min-height: 32px;
}

.task-order-item {
  margin: 0 8px 8px 0 !important;
  cursor: move;
}

.task-order-item i {
  margin-right: 4px;
}

.task-order-ghost {
  opacity: 0.35;
}

.task-order-chosen {
  color: #409eff;
  background: #ecf5ff;
  border-color: #409eff;
}

.unit-text {
  margin-left: 8px;
  color: #606266;
}
</style>
