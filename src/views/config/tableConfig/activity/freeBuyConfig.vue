<template>
  <div class="page-container free-buy-config">
    <el-row>
      <publish
        primary-key="id"
        :key-id="getFullKey()"
        :app-id="configAppId"
        :env-empty="false"
        :check="configCheck"
        compare-type="Array"
        :attr-names="{ id: '配置ID', activityName: '活动名称', startTime: '开始时间', endTime: '结束时间', status: '状态' }"
        :head-attrs="['id', 'activityName']"
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
          <div>用户：{{ userTypeText(scope.row.userTypes) }}</div>
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
                <el-form-item label="期次ID">
                  <el-input :value="editItem.id || '保存后自动生成'" disabled />
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
            <el-form-item label="参与用户类型" required>
              <el-select v-model="editItem.userType" style="width: 100%" @change="onUserTypeChange">
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="editItem.userType === 3" label="导入用户">
              <span>已导入用户：{{ importedUidCount }}</span>
              <span class="user-import-tip">（重复导入不会覆盖已有用户）</span>
              <br>
              <span class="user-import-warning">活动结束时间需要晚于当前时间，否则导入用户无法参与活动。</span>
              <el-upload
                ref="freeBuyUidUpload"
                drag
                action="#"
                :auto-upload="false"
                :limit="1"
                accept=".csv,.txt"
                :before-upload="handleBeforeUpload"
                :on-change="handleFreeBuyFileChange"
                :on-remove="handleFreeBuyFileRemove"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传 CSV 或 TXT 格式文件，且不超过10MB</div>
              </el-upload>
              <el-button type="success" size="mini" @click="submitUpload">上传用户ID数据</el-button>
              <el-button type="danger" size="mini" @click="delImportedUid">重置已导入用户</el-button>
            </el-form-item>
            <template v-if="editItem.userType === 5">
              <el-form-item label="新增标签条件" required>
                <el-select v-model="userTagDraft.tagType" style="width: 100%" @change="onUserTagTypeChange">
                  <el-option
                    v-for="item in userTagTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="标签条件" required>
                <el-select v-model="userTagDraft.tagId" style="width: 100%" @change="onUserTagIdChange">
                  <el-option
                    v-for="item in currentUserTagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="判断方式">
                <el-checkbox v-model="userTagDraft.isReverse">反向判断</el-checkbox>
                <span class="user-import-tip">命中此标签的用户不参与活动</span>
              </el-form-item>
              <el-form-item v-if="isUserLevelTag" label="标签值" required>
                <el-select v-model="userTagDraft.tagValue" style="width: 100%">
                  <el-option v-for="item in userLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addUserTag">加入标签</el-button>
              </el-form-item>
              <el-form-item v-else label="">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addUserTag">加入标签</el-button>
              </el-form-item>
              <el-form-item label="已选标签" required>
                <div class="user-tag-list">
                  <el-tag
                    v-for="(tag, index) in editItem.userTagConfig"
                    :key="userTagKey(tag, index)"
                    closable
                    size="small"
                    @close="removeUserTag(index)"
                  >
                    {{ userTagText(tag) }}
                  </el-tag>
                  <span v-if="!editItem.userTagConfig.length" class="user-import-tip">请先加入至少一个标签</span>
                  <span class="user-import-tip">同一种标签只能添加一次；正向标签命中任意一个即可参与，反向标签命中后立即拒绝。</span>
                </div>
              </el-form-item>
            </template>
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
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import Publish from '@/components/Publish/index.vue'
import draggable from 'vuedraggable'
import store from '@/store'
import { ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'

const CONFIG_KEY = 'FreeBuyConfig'
const ACTIVITY_ID = 30
const STATUS_ONLINE = 2
const STATUS_ABANDONED = 3
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

function newUserTagConfig() {
  return {
    tagType: 5,
    tagId: 50001,
    tagValue: 1,
    isReverse: false
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

function newActivity(id = 0) {
  return {
    id,
    activityName: '',
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
    userTypes: [2],
    userTagConfig: [],
    debugTimeOffset: 0,
    abTest: {
      switch: false,
      bPercent: 0
    }
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
      env: store.getters.env || '',
      configs: [],
      loading: false,
      saving: false,
      activityDialogVisible: false,
      activityEditMode: false,
      editItem: newActivity(),
      userTagDraft: newUserTagConfig(),
      taskDialogVisible: false,
      taskEditMode: false,
      taskEditOriginalKey: '',
      taskEditItem: newTask(1),
      freeSpinPropOptions: [],
      richCardOptions: [],
      richCardGameOptions: [],
      richCardOpenGameMap: {},
      slotGameOptions: [],
      importedUidCount: 0,
      freeBuyUidFile: null,
      userTypeOptions: [
        { value: 2, label: '全部用户' },
        { value: 3, label: '导入用户' },
        { value: 5, label: '用户标签' }
      ],
      userTagTypeOptions: [
        { value: 5, label: 'Slots用户类型' }
      ],
      slotsTagOptions: [
        { value: 50001, label: 'Slots新增用户' },
        { value: 50002, label: 'Slots登录天数' },
        { value: 50008, label: 'Slots回归用户' },
        { value: 50005, label: 'Slots下注额度' },
        { value: 50006, label: 'Slots日均下注额度' },
        { value: 50003, label: 'Slots携带金额' },
        { value: 50043, label: 'Slots Super Free Buy' }
      ],
      userLevelOptions: [
        { value: 1, label: '轻度用户' },
        { value: 2, label: '中度用户' },
        { value: 3, label: '重度用户' }
      ]
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
    },
    currentUserTagOptions() {
      return this.slotsTagOptions
    },
    isUserLevelTag() {
      return [50003, 50005, 50006, 50043].includes(Number(this.userTagDraft.tagId))
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    this.getFreeSpinProps()
    this.getMissionData()
    this.getGameAll()
  },
  methods: {
    getFullKey() {
      return CONFIG_KEY
    },
    getList() {
      this.loading = true
      request({
        url: '/activityconfig/all',
        method: 'get',
        data: { activityId: ACTIVITY_ID }
      }).then(response => {
        if (response.RetCode !== 0) return
        this.configs = (response.Data || []).map(item => {
          const activity = JSON.parse(item.activity || '{}')
          const extend = JSON.parse(item.extend || '{}')
          const whitelist = activity.whitelist || {}
          return this.normalizeActivity({
            id: Number(item.id),
            activityName: activity.name || '',
            startTime: Number(activity.startTime) || 0,
            endTime: Number(activity.endTime) || 0,
            isOpen: Boolean(activity.isOpen),
            status: Number(item.status) || STATUS_OFFLINE,
            siteIdList: Array.isArray(whitelist.siteIdList) ? whitelist.siteIdList : [],
            gameIdList: Array.isArray(activity.gameIdList) ? activity.gameIdList : [],
            debugTimeOffset: Number(activity.debugTimeOffset) || 0,
            abTest: whitelist.abTest || {},
            ...extend
          })
        }).sort((a, b) => b.id - a.id)
      }).catch(error => {
        console.error('Free Buy配置列表加载失败:', error)
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeActivity(item) {
      const data = JSON.parse(JSON.stringify(item || {}))
      // 兼容清理旧配置中已经废弃的 App 参与范围字段。
      delete data.appIdList
      data.isOpen = Boolean(data.isOpen)
      data.status = Number(data.status) || STATUS_OFFLINE
      // 清理旧配置中的UID白名单字段，Free Buy按参与用户类型控制玩家范围。
      delete data.isWhite
      delete data.whiteList
      data.siteIdList = Array.isArray(data.siteIdList) ? data.siteIdList : []
      data.gameIdList = Array.isArray(data.gameIdList) ? data.gameIdList : []
      data.dailyPropLimit = Number(data.dailyPropLimit) || 0
      data.totalPropLimit = Number(data.totalPropLimit) || 0
      data.taskList = Array.isArray(data.taskList) ? data.taskList.map(task => this.normalizeTask(task)) : []
      data.userTypes = Array.isArray(data.userTypes)
        ? data.userTypes.map(Number).filter(item => [2, 3, 5].includes(item))
        : [2]
      if (!data.userTypes.length) data.userTypes = [2]
      data.userType = data.userTypes[0]
      const userTagList = Array.isArray(data.userTagConfig)
        ? data.userTagConfig
        : (data.userTagConfig ? [data.userTagConfig] : [])
      data.userTagConfig = userTagList.map(tag => ({
        ...newUserTagConfig(),
        ...(tag || {}),
        tagType: Number(tag && tag.tagType) || 5,
        tagId: Number(tag && tag.tagId) || 50001,
        tagValue: Number(tag && tag.tagValue) || 1,
        isReverse: Boolean(tag && tag.isReverse)
      }))
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
        this.editItem = newActivity()
      }
      this.userTagDraft = this.editItem.userTagConfig.length
        ? { ...this.editItem.userTagConfig[0] }
        : newUserTagConfig()
      this.importedUidCount = 0
      this.freeBuyUidFile = null
      if (isEdit && this.editItem.userType === 3) this.getImportedUidCount()
      this.activityDialogVisible = true
    },
    onUserTypeChange(userType) {
      if (Number(userType) === 3 && this.activityEditMode) {
        this.getImportedUidCount()
      } else {
        this.importedUidCount = 0
        this.freeBuyUidFile = null
        if (this.$refs.freeBuyUidUpload) this.$refs.freeBuyUidUpload.clearFiles()
      }
    },
    onUserTagTypeChange(tagType) {
      this.userTagDraft.tagId = this.slotsTagOptions[0].value
      this.userTagDraft.tagValue = 1
    },
    onUserTagIdChange() {
      this.userTagDraft.tagValue = 1
    },
    addUserTag() {
      const tag = {
        tagType: Number(this.userTagDraft.tagType),
        tagId: Number(this.userTagDraft.tagId),
        tagValue: Number(this.userTagDraft.tagValue),
        isReverse: Boolean(this.userTagDraft.isReverse)
      }
      if (tag.tagType <= 0 || tag.tagId <= 0 || tag.tagValue <= 0) {
        this.$message.error('请先配置完整的标签条件')
        return
      }
      if (this.editItem.userTagConfig.some(item => Number(item.tagId) === tag.tagId)) {
        this.$message.warning('同一种标签只能添加一次')
        return
      }
      this.editItem.userTagConfig.push(tag)
      this.userTagDraft = newUserTagConfig()
    },
    removeUserTag(index) {
      this.editItem.userTagConfig.splice(index, 1)
    },
    getImportedUidCount() {
      if (!this.editItem.id) return
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          ConfigId: this.editItem.id,
          Path: '/activity/freebuy/uid/import/count'
        }
      }).then(response => {
        if (response.RetCode === 0) this.importedUidCount = Number(response.Data) || 0
      })
    },
    delImportedUid() {
      this.$confirm('确定要重置已导入的用户ID吗？', '提示', { type: 'warning' }).then(() => {
        return request({
          url: '/dataProxy/info',
          method: 'post',
          timeout: 90000,
          data: {
            Env: this.env,
            ConfigId: this.editItem.id,
            Path: '/activity/freebuy/uid/import/del'
          }
        })
      }).then(response => {
        if (response && response.RetCode === 0) {
          this.importedUidCount = 0
          this.$message.success('已重置导入用户')
        }
      }).catch(() => {})
    },
    handleBeforeUpload(file) {
      const validType = /\.(csv|txt)$/i.test(file.name || '')
      if (!validType) {
        this.$message.error('上传的文件只能是 CSV 或 TXT 格式')
        return false
      }
      if (file.size / 1024 / 1024 >= 10) {
        this.$message.error('上传文件不能超过10MB')
        return false
      }
      return true
    },
    handleFreeBuyFileChange(file) {
      if (file && file.raw && this.handleBeforeUpload(file.raw)) this.freeBuyUidFile = file.raw
    },
    handleFreeBuyFileRemove() {
      this.freeBuyUidFile = null
    },
    submitUpload() {
      if (!this.activityEditMode || !this.editItem.id) {
        this.$message.error('请先保存活动期次，再导入用户')
        return
      }
      if (Number(this.editItem.endTime) <= Math.floor(Date.now() / 1000)) {
        this.$message.error('活动结束时间不能早于当前时间')
        return
      }
      if (!this.freeBuyUidFile) {
        this.$message.error('请选择要导入的用户文件')
        return
      }

      const reader = new FileReader()
      reader.onload = async event => {
        const uidSet = new Set()
        String(event.target.result || '').split(/\r?\n/).forEach(line => {
          const value = String(line).split(/[,;\t]/)[0].trim().replace(/^\uFEFF/, '')
          if (/^\d+$/.test(value) && Number(value) > 0) uidSet.add(Number(value))
        })
        const uidList = [...uidSet]
        if (!uidList.length) {
          this.$message.error('文件中没有有效的用户ID')
          return
        }

        let imported = 0
        const expireAt = Number(this.editItem.endTime) + 30 * 24 * 60 * 60
        try {
          for (let start = 0; start < uidList.length; start += 5000) {
            const response = await request({
              url: '/dataProxy/info',
              method: 'post',
              timeout: 90000,
              data: {
                Env: this.env,
                ConfigId: this.editItem.id,
                ExpireAt: expireAt,
                Uids: uidList.slice(start, start + 5000),
                Path: '/activity/freebuy/uid/import'
              }
            })
            if (!response || response.RetCode !== 0) throw new Error('导入用户失败')
            imported += Number(response.Data && response.Data.imported) || 0
          }
          this.$message.success(`上传成功，新导入用户 ${imported} 个`)
          this.getImportedUidCount()
          this.freeBuyUidFile = null
          if (this.$refs.freeBuyUidUpload) this.$refs.freeBuyUidUpload.clearFiles()
        } catch (error) {
          console.error('Free Buy导入用户失败:', error)
        }
      }
      reader.onerror = () => this.$message.error('读取用户文件失败')
      reader.readAsText(this.freeBuyUidFile, 'UTF-8')
    },
    saveActivity() {
      const activity = this.buildActivityForSave(this.editItem)
      const error = this.validateActivity(activity, this.activityEditMode)
      if (error) {
        this.$message.error(error)
        return
      }
      this.saving = true
      request({
        url: this.activityEditMode ? '/activityconfig/update' : '/activityconfig/create',
        method: 'post',
        data: this.buildActivityPostData(activity)
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('活动期次保存成功，发布后生效')
          this.activityDialogVisible = false
          this.getList()
        }
      }).finally(() => {
        this.saving = false
      })
    },
    buildActivityForSave(item) {
      const data = this.normalizeActivity(item)
      data.id = Number(data.id)
      data.startTime = Math.floor(Number(item.startTimeValue) / 1000)
      data.endTime = Math.floor(Number(item.endTimeValue) / 1000)
      data.gameIdList = this.toNumberList(data.gameIdList)
      data.siteIdList = data.siteIdList.map(value => String(value)).filter(Boolean)
      data.userTypes = [Number(item.userType)]
      data.userTagConfig = data.userTagConfig.map(tag => ({
        tagType: Number(tag.tagType),
        tagId: Number(tag.tagId),
        tagValue: Number(tag.tagValue),
        isReverse: Boolean(tag.isReverse)
      }))
      delete data.userType
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
    buildActivityPostData(data) {
      const activity = {
        activityId: ACTIVITY_ID,
        name: data.activityName,
        startTime: data.startTime,
        endTime: data.endTime,
        showEndTime: data.endTime,
        gameIdList: data.gameIdList,
        whitelist: {
          siteIdList: data.siteIdList,
          abTest: data.abTest
        },
        status: data.status,
        isOpen: data.isOpen,
        debugTimeOffset: data.debugTimeOffset,
        GameType: 1
      }
      const extend = {
        dailyPropLimit: data.dailyPropLimit,
        totalPropLimit: data.totalPropLimit,
        taskList: data.taskList,
        userTypes: data.userTypes,
        userTagConfig: data.userTagConfig
      }
      return {
        id: data.id,
        activityId: ACTIVITY_ID,
        activity: JSON.stringify(activity),
        extend: JSON.stringify(extend)
      }
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
        return request({
          url: '/activityconfig/update/status',
          method: 'post',
          data: { id: row.id, status, activityId: ACTIVITY_ID }
        })
      }).then(response => {
        if (response && response.RetCode === 0) {
          this.$message.success(`${action}状态保存成功，发布后生效`)
          this.getList()
        }
      }).catch(() => {})
    },
    deleteActivity(row) {
      this.$confirm(`确认删除活动“${row.activityName}”吗？`, '提示', { type: 'warning' }).then(() => {
        return request({
          url: '/activityconfig/update/status',
          method: 'post',
          data: { id: row.id, status: STATUS_ABANDONED, activityId: ACTIVITY_ID }
        })
      }).then(response => {
        if (response && response.RetCode === 0) {
          this.$message.success('活动期次已废弃，配置ID继续保留')
          this.getList()
        }
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
        return true
      }
      const ids = new Set()
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
      }
      return true
    },
    validateActivity(activity, requireId = true) {
      if (!activity || (requireId && Number(activity.id) <= 0)) return '期次ID必须大于0'
      if (!String(activity.activityName || '').trim()) return '请填写活动名称'
      if (Number(activity.startTime) <= 0) return '请填写开始时间'
      if (Number(activity.endTime) <= Number(activity.startTime)) return '结束时间必须晚于开始时间'
      if (!Array.isArray(activity.gameIdList) || !activity.gameIdList.length) return '请至少选择一个参与游戏'
      if (!Array.isArray(activity.userTypes) || activity.userTypes.length !== 1 || ![2, 3, 5].includes(Number(activity.userTypes[0]))) return '请选择参与用户类型'
      if (Number(activity.userTypes[0]) === 5) {
        if (!Array.isArray(activity.userTagConfig) || !activity.userTagConfig.length) return '请至少加入一个用户标签条件'
        const tagIds = new Set()
        for (const tag of activity.userTagConfig) {
          if (!tag || Number(tag.tagType) <= 0 || Number(tag.tagId) <= 0 || Number(tag.tagValue) <= 0) return '请配置有效的用户标签条件'
          if (Number(tag.tagType) !== 5) return 'Slots标签配置无效'
          if (![50001, 50002, 50003, 50005, 50006, 50008, 50043].includes(Number(tag.tagId))) return `不支持的标签ID：${tag.tagId}`
          if ([50003, 50005, 50006, 50043].includes(Number(tag.tagId)) && ![1, 2, 3].includes(Number(tag.tagValue))) return '请选择有效的用户等级'
          if (tagIds.has(Number(tag.tagId))) return `同一种标签只能添加一次：${tag.tagId}`
          tagIds.add(Number(tag.tagId))
        }
      }
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
    userTypeText(values) {
      const userType = Array.isArray(values) ? Number(values[0]) : Number(values)
      const option = this.userTypeOptions.find(item => item.value === userType)
      return option ? option.label : '-'
    },
    userTagKey(tag, index) {
      return `${Number(tag.tagType)}:${Number(tag.tagId)}:${Number(tag.tagValue)}:${Boolean(tag.isReverse)}:${index}`
    },
    userTagText(tag) {
      const type = this.userTagTypeOptions.find(item => item.value === Number(tag.tagType))
      const tagOption = this.slotsTagOptions.find(item => item.value === Number(tag.tagId))
      const direction = tag.isReverse ? '反向' : '正向'
      if ([50003, 50005, 50006, 50043].includes(Number(tag.tagId))) {
        const value = this.userLevelOptions.find(item => item.value === Number(tag.tagValue))
        return `${direction}${type ? type.label : '标签'}：${tagOption ? tagOption.label : tag.tagId} - ${value ? value.label : tag.tagValue}`
      }
      return `${direction}${type ? type.label : '标签'}：${tagOption ? tagOption.label : tag.tagId}`
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

.user-import-tip {
  color: #909399;
  margin-left: 8px;
}

.user-tag-list {
  line-height: 30px;
}

.user-tag-list .el-tag {
  margin: 0 8px 8px 0;
}

.user-import-warning {
  color: #e6a23c;
  display: inline-block;
  margin: 6px 0;
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
