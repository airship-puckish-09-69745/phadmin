<template>
  <el-dialog
    :title="isEdit ? '编辑活动配置' : '新增活动配置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基础配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.activity.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activity.name" placeholder="请输入活动名称" style="max-width: 300px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间：" required>
                <el-date-picker v-model="item.activity.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width:  200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间：" required>
                <el-date-picker v-model="item.activity.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：" required>
                <el-date-picker v-model="item.activity.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="第二期开始时间：" required>
                <el-date-picker v-model="item.extend.phase2Time" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width:  200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="总奖励金额：" required>
                <el-input v-model.number="item.extend.totalReward" placeholder="总奖励金额" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 参与活动游戏选择 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="参与活动游戏：" required>
                <el-input v-model="filterText" placeholder="输入关键字搜索游戏" style="max-width: 300px; margin-bottom: 8px" />
                <el-tree
                  ref="tree"
                  :data="treeData"
                  show-checkbox
                  node-key="id"
                  highlight-current
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  :default-expanded-keys="[]"
                  @check-change="handleCheckChange"
                />
                <div style="margin-top: 10px">
                  <el-button size="small" type="primary" icon="el-icon-sort" @click="showGamesSortDialog">
                    给选中游戏排序
                  </el-button>
                  <span style="margin-left: 10px; color: #999; font-size: 12px">
                    已选中 {{ (item.activity.gameIdList || []).length }} 个游戏
                  </span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="任务配置">
        <el-row :gutter="5">
          <el-col>
            <fieldset style="margin-top: 10px">
              <legend>普通任务列表</legend>
              <el-table
                :data="normalTasks"
                border
              >
                <el-table-column
                  prop="taskType"
                  label="任务类型"
                >
                  <template slot-scope="scope">
                    {{ scope.row.taskType + '-' + getTaskTypeName(scope.row.taskType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="targetValue"
                  label="任务条件"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.targetValue" placeholder="任务条件" style="max-width: 200px" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskType"
                  label="奖励类型"
                >
                  <template slot-scope="scope">
                    选票
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rewardItem.rewardNum"
                  label="奖励数量"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.rewardItem.rewardNum" placeholder="奖励数量" style="max-width: 200px" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>

            <fieldset style="margin-top: 10px">
              <legend>挑战任务列表</legend>
              <el-button type="primary" size="small" @click="addChallengeTask">添加挑战任务</el-button>
              <el-table
                :data="challengeTasks"
                border
                style="margin-top: 5px"
                >
                <el-table-column
                  prop="taskType"
                  label="任务类型"
                >
                  <template slot-scope="scope">
                    {{ getTaskTypeName(scope.row.taskType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="targetValue"
                  label="任务条件"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.targetValue" placeholder="任务条件" style="max-width: 200px" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskType"
                  label="奖励类型"
                >
                  <template slot-scope="scope">
                    头像框
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskType"
                  label="头像框"
                  width="220"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShowAvatarFrameSelectDialog(scope.$index, scope.row.rewardItem.rewardId, DATA_SOURCE_TYPES.CHALLENGE_TASK_REWARD_ITEM)">
                      {{ getAvatarFrameName(scope.row.rewardItem.rewardId) }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rewardItem.rewardExpireDays"
                  label="头像框有效天数"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.rewardItem.rewardExpireDays" placeholder="请选择奖励有天数" style="max-width: 200px">
                      <el-option v-for="item in propDayTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  column-key="op"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="delChallengeTask(scope.$index)" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="报名奖励配置">
        <el-row :gutter="5">
          <el-col>
            <el-descriptions direction="vertical" :column="3" border>
              <el-descriptions-item label="头像框">
                <el-select v-model="item.extend.registerRewardItem.rewardId" placeholder="请选择头像框" style="width: 100%">
                  <el-option label="请选择" :value="0" />
                  <el-option v-for="prop in propList" :key="prop.id" :label="prop.item_name" :value="prop.id" />
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item label="有效天数">
                <el-select v-model="item.extend.registerRewardItem.rewardExpireDays" placeholder="请选择有效天数" style="max-width: 200px">
                  <el-option v-for="item in propDayTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item label="数量">
                <el-input v-model.number="item.extend.registerRewardItem.rewardNum" placeholder="数量" style="max-width: 200px" />
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="榜单奖励配置">
        <el-row :gutter="5">
          <el-col>
            <fieldset style="margin-top: 10px">
              <legend>榜单最大显示名次</legend>
              <el-col :span="4">
                <el-input v-model.number="item.extend.maxRankShow" placeholder="请输入榜单显示人数" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
              </el-col>
            </fieldset>
            <fieldset style="margin-top: 10px">
              <legend>奖励配置</legend>
              <el-button size="mini" type="primary" @click="handleAddRankRewardItem()">添加</el-button>
              <el-table
                :data="item.extend.rankRewardItems"
                border
                style="width: 100%; margin-top: 10px"
                :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column
                  prop="rankRange.min"
                  label="排名开始"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.rankRange.min" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rankRange.max"
                  label="排名结束"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.rankRange.max" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="reward"
                  label="奖励金额"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.rewardItems[0].rewardNum" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="reward"
                  label="头像框"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShowAvatarFrameSelectDialog(scope.$index, scope.row.rewardItems[1].rewardId, DATA_SOURCE_TYPES.RANK_REWARD_ITEM)">
                      {{ getAvatarFrameName(scope.row.rewardItems[1].rewardId) }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="reward"
                  label="头像框有效天数"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.rewardItems[1].rewardExpireDays" placeholder="请选择额像框有效天数" style="max-width: 200px">
                      <el-option v-for="item in propDayTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" column-key="op">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelRankRewardItem(scope.$index)" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="白名单配置" name="whitelist">
        <el-form label-width="180px" size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="item.activity.whitelist.siteIdList" multiple placeholder="请选择" style="width: 100%; max-width: 300px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 游戏排序弹窗 -->
    <el-dialog
      title="给选中游戏排序"
      :visible.sync="gamesSortDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
    >
      <div style="margin-bottom: 10px; color: #909399; font-size: 13px">
        提示：排序编号越小，游戏在活动中的展示顺序越靠前
      </div>
      <el-table :data="gamesSorted" border stripe max-height="400">
        <el-table-column prop="gameId" label="游戏ID" width="100" align="center" />
        <el-table-column prop="name" label="游戏名称" min-width="150" />
        <el-table-column prop="orderNo" label="排序编号" width="150" align="center">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.orderNo"
              type="number"
              :min="1"
              :max="gamesSorted.length"
              size="small"
              style="width: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="gamesSortDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGamesSort">保存排序</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="头像框选择"
      :visible.sync="avatarFrameSelectForm.propListDialogVisible"
      :close-on-click-modal="false"
      append-to-body width="300px">
      <el-select v-model="avatarFrameSelectForm.selectedPropId" placeholder="请选择头像框" style="width: 100%">
        <el-option label="请选择" :value="0" />
        <el-option v-for="prop in propList" :key="prop.id" :label="prop.item_name" :value="prop.id" />
      </el-select>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="handleSelectProp">保 存</el-button>
        <el-button @click="avatarFrameSelectForm.propListDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleSave">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import { $libShow } from '@/utils/common'
import { ACTIVITY_REWARD_TYPES, PROP_TYPE_OPTIONS } from '@/utils/options'

const ACTIVITY_ID = 24

// 任务类型
const TASK_TYPES = {
  DAILY_LOGIN: 1,
  DAILY_SHARE: 2,
  PLAY_GAME: 3,
  CHALLENGE: 4
}

// 任务类型选项
const TASK_TYPE_NAMES = {
  1: '每日登录',
  2: '每日分享',
  3: '玩一局游戏',
  4: '挑战任务',
}

// 数据源类型
const DATA_SOURCE_TYPES = {
  RANK_REWARD_ITEM: 1,
  CHALLENGE_TASK_REWARD_ITEM: 2
}

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activity: {
      name: '',
      activityId: ACTIVITY_ID,
      isOpen: true,
      startTime: Date.now(),
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      showEndTime: Date.now() + 8 * 24 * 60 * 60 * 1000,
      gameIdList: [],
      whitelist: {
        siteIdList: []
      }
    },
    extend: {
      totalReward: 0,
      maxRankShow: 20,
      phase2Time: Date.now() + 14 * 24 * 60 * 60 * 1000,
      tasks: [],
      rankRewardItems: [],
      registerRewardItem: {
        rewardId: 0,
        rewardNum: 1,
        rewardType: ACTIVITY_REWARD_TYPES.PROP,
        rewardSubType: PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,
        rewardExpireDays: 1
      }
    }
  }
}

// 新增普通任务
function newNormalTask(taskId, taskType) {
  return {
    taskId: taskId,
    taskType: taskType,
    targetValue: 1,
    rewardItem: {
      rewardId: 0,
      rewardNum: 1,
      rewardType: ACTIVITY_REWARD_TYPES.ACTIVITY_ITEM,
    }
  }
}

// 新增挑战任务
function newChallengeTask(taskId) {
  return {
    taskId: taskId,
    taskType: TASK_TYPES.CHALLENGE,
    targetValue: 1,
    rewardItem: {
      rewardId: 0,
      rewardNum: 1,
      rewardType: ACTIVITY_REWARD_TYPES.PROP,
      rewardSubType: PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,
      rewardExpireDays: 1
    }
  }
}

function newRankRewardItem() {
  return {
    rankRange: {
      min: 0,
      max: 0,
    },
    rewardItems: [
      {
        rewardId: 0,
        rewardNum: 0,
        rewardType: ACTIVITY_REWARD_TYPES.BET_GOLD,
        rewardSubType: 0
      },
      {
        rewardId: 0,
        rewardNum: 1,
        rewardType: ACTIVITY_REWARD_TYPES.PROP,
        rewardSubType: PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME,
        rewardExpireDays: 1
      }
    ]
  }
}

export default {
  name: 'UpdateForm',
  components: { SiteSelect },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    propList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      libShow: $libShow,
      item: newItem(),
      dialogVisible: false,
      activeTab: 'activity',
      gamesSorted: [],
      gamesSortDialogVisible: false,
      // 游戏树数据
      defaultProps: { label: 'label', children: 'children', disabled: 'disabled' },
      treeData: [],
      allTreeData: [],
      filterText: '',
      filterGameIds: [2031, 10002],
      activityId: ACTIVITY_ID,
      // 普通任务列表
      normalTasks: [],
      // 挑战任务列表
      challengeTasks: [],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ],
      // 头像框选择弹窗数据
      avatarFrameSelectForm: {
        selectedPropId: 0,
        propListDialogVisible: false,
        rowIndexEditing: -1,
        dataSourceType: 0,
      },
      DATA_SOURCE_TYPES,
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) {
        return
      }

      // 编辑模式下，加载数据
      if (this.isEdit && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        // 新增模式下，初始化数据
        this.item = newItem()
        // 初始化普通任务列表
        this.normalTasks = [
          newNormalTask(1, TASK_TYPES.DAILY_LOGIN),
          newNormalTask(2, TASK_TYPES.DAILY_SHARE),
          newNormalTask(3, TASK_TYPES.PLAY_GAME)
        ]
        // 初始化挑战任务列表
        this.challengeTasks = []
      }
      // 获取所有游戏列表并构建树结构
      this.getGameAll().then(() => {
        // 勾选当前活动配置的游戏
        this.selectGamesForTree()
      })
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 关闭弹窗
    handleDialogClose() {
      this.$emit('close')
    },
    // 新增排名奖励项
    handleAddRankRewardItem() {
      this.item.extend.rankRewardItems.push({
        ...newRankRewardItem()
      })
    },
    // 删除排名奖励项
    handleDelRankRewardItem(index) {
      this.item.extend.rankRewardItems.splice(index, 1)
    },
    // 显示头像框选择弹窗
    handleShowAvatarFrameSelectDialog(index, propId, dataSourceType) {
      this.avatarFrameSelectForm.rowIndexEditing = index
      this.avatarFrameSelectForm.dataSourceType = dataSourceType
      this.avatarFrameSelectForm.selectedPropId = propId
      this.avatarFrameSelectForm.propListDialogVisible = true
    },
    // 选择头像框
    handleSelectProp() {
      if (this.avatarFrameSelectForm.selectedPropId === 0) {
        Message.error('请选择头像框')
        return
      }
      if (this.avatarFrameSelectForm.dataSourceType === 0) {
        Message .error('请选择数据来源')
        return
      }

      if (this.avatarFrameSelectForm.dataSourceType === DATA_SOURCE_TYPES.RANK_REWARD_ITEM) {
        const rankRewardItem = this.item.extend.rankRewardItems[this.avatarFrameSelectForm.rowIndexEditing]
        rankRewardItem.rewardItems[1].rewardId = this.avatarFrameSelectForm.selectedPropId
      } else {
        const taskRewardItem = this.challengeTasks[this.avatarFrameSelectForm.rowIndexEditing].rewardItem
        taskRewardItem.rewardId = this.avatarFrameSelectForm.selectedPropId
      }

      this.avatarFrameSelectForm.selectedPropId = 0
      this.avatarFrameSelectForm.propListDialogVisible = false
    },
    // 新增挑战任务
    addChallengeTask() {
      this.challengeTasks.push(newChallengeTask(this.challengeTasks.length + 4))
    },
    // 删除挑战任务
    delChallengeTask(index) {
      this.challengeTasks.splice(index, 1)
    },
    // 获取头像框名称
    getAvatarFrameName(propId) {
      if (propId === 0) {
        return '请选择'
      }
      const prop = this.propList.find(item => item.id === propId)
      return prop ? prop.item_name : '未知ID:' + propId
    },
    // 获取任务类型名称
    getTaskTypeName(taskType) {
      return TASK_TYPE_NAMES[taskType]
    },
    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.data))

      // 时间：秒 -> 毫秒
      data.activity.startTime *= 1000
      data.activity.endTime *= 1000
      data.activity.showEndTime *= 1000

      // 总奖励金额缩小1000倍
      data.extend.totalReward = data.extend.totalReward / 1000
      // 第二阶段开始时间：秒 -> 毫秒
      data.extend.phase2Time *= 1000

      // 游戏列表
      if (!Array.isArray(data.activity.gameIdList)) data.activity.gameIdList = []

      // 白名单
      if (!data.activity.whitelist) {
        data.activity.whitelist = {
          siteIdList: []
        }
      }
      if (!Array.isArray(data.activity.whitelist.siteIdList)) data.activity.whitelist.siteIdList = []

      // 普通任务列表
      this.normalTasks = []
      if (!Array.isArray(data.extend.tasks) || data.extend.tasks.length === 0) {
        data.extend.tasks = []
        this.normalTasks = [
          newNormalTask(1, TASK_TYPES.DAILY_LOGIN),
          newNormalTask(2, TASK_TYPES.DAILY_SHARE),
          newNormalTask(3, TASK_TYPES.PLAY_GAME)
        ]
      }

      // 挑战任务列表
      this.challengeTasks = []
      if (!Array.isArray(data.extend.challengeTasks)) data.extend.challengeTasks = []
      // 按任务类型分类
      for (const task of data.extend.tasks) {
        if (task.taskType === TASK_TYPES.CHALLENGE) {
          this.challengeTasks.push(task)
        } else {
          this.normalTasks.push(task)
        }
      }
      // 榜单奖励金额缩小1000倍
      data.extend.rankRewardItems.forEach(rankRewardItem => {
        rankRewardItem.rewardItems.forEach(rewardItem => {
          rewardItem.rewardNum = Math.floor(rewardItem.rewardNum / 1000)
        })
      })

      this.item = data
    },
    // 校验数据
    validateData() {
      if (!this.item.activity.name) {
        Message.error('请输入活动名称')
        return false
      }
      if (!this.item.activity.startTime) {
        Message.error('请选择开始时间')
        return false
      }
      if (!this.item.activity.endTime) {
        Message.error('请选择结束时间')
        return false
      }
      if (!this.item.extend.totalReward || this.item.extend.totalReward <= 0) {
        Message.error('请输入奖励比例（大于0）')
        return false
      }
      if (!this.item.activity.gameIdList || this.item.activity.gameIdList.length <= 0) {
        Message.error('请选择参与活动的游戏')
        return false
      }
      if (!this.item.activity.whitelist.siteIdList.length) {
        Message.error('请选择站点白名单')
        return false
      }
      if (!this.item.extend.tasks.length) {
        Message.error('请配置活动任务')
        return false
      }
      for (const task of this.item.extend.tasks) {
        if (task.taskType === TASK_TYPES.CHALLENGE && !task.rewardItem.rewardId) {
          Message.error('请配置挑战任务奖励头像框')
          return false
        }
      }
      if (!this.item.extend.registerRewardItem.rewardId) {
        Message.error('请配置报名头像框奖励')
        return false
      }
      if (!this.item.extend.registerRewardItem.rewardNum || this.item.extend.registerRewardItem.rewardNum <= 0) {
        Message.error('请输入报名头像框奖励数量（大于0）')
        return false
      }
      if (!this.item.extend.rankRewardItems.length) {
        Message.error('请配置榜单奖励')
        return false
      }
      for (const rankRewardItem of this.item.extend.rankRewardItems) {
        if (!rankRewardItem.rewardItems[1].rewardId) {
          Message.error('请配置榜单奖励头像框')
          return false
        }
      }
      return true
    },
    // 处理提交数据（前端展示格式 -> 后端数据）
    getPostData() {
      const data = JSON.parse(JSON.stringify(this.item))

      // 时间：毫秒 -> 秒
      data.activity.startTime = Math.floor(data.activity.startTime / 1000)
      data.activity.endTime = Math.floor(data.activity.endTime / 1000)
      data.activity.showEndTime = Math.floor(data.activity.showEndTime / 1000)

      // 总奖励金额放大1000倍
      data.extend.totalReward = Math.floor(data.extend.totalReward * 1000)
      // 第二阶段开始时间：毫秒 -> 秒
      data.extend.phase2Time = Math.floor(data.extend.phase2Time / 1000)
      // 任务列表
      data.extend.tasks = [...this.normalTasks, ...this.challengeTasks]
      // 榜单奖励金额放大1000倍
      data.extend.rankRewardItems.forEach(rankRewardItem => {
        rankRewardItem.rewardItems.forEach(rewardItem => {
          rewardItem.rewardNum = Math.floor(rewardItem.rewardNum * 1000)
        })
      })
      // 榜单最大名次
      let makRank = 0
      data.extend.rankRewardItems.forEach(rankRewardItem => {
        makRank = Math.max(makRank, rankRewardItem.range.max)
      })
      data.extend.maxRankValid = makRank

      // 返回数据
      const ret = { ...data }
      ret.activity = JSON.stringify(data.activity)
      ret.extend = JSON.stringify(data.extend)

      return ret
    },
    handleSave() {
      if (!this.validateData()) return

      const postData = this.getPostData()

      if (postData.id > 0) {
        this.handleUpdate(postData)
      } else {
        this.handleCreate(postData)
      }
    },
    handleCreate(postData) {
      const url = '/activityconfig/create'
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },
    handleUpdate(postData) {
      const url = '/activityconfig/update'
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },
    // 游戏树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 游戏选中变化
    handleCheckChange(data, checked) {
      // 跳过类别节点
      if (typeof data.id === 'string' && data.id.startsWith('p-')) return

      if (!this.item.activity.gameIdList) this.item.activity.gameIdList = []
      const index = this.item.activity.gameIdList.indexOf(data.id)
      if (checked && index < 0) {
        this.item.activity.gameIdList.push(data.id)
      } else if (!checked && index >= 0) {
        this.item.activity.gameIdList.splice(index, 1)
      }
    },
    // 勾选当前活动配置的游戏
    selectGamesForTree() {
      this.$nextTick(() => {
        if (this.$refs.tree && this.item.activity.gameIdList) {
          this.$refs.tree.setCheckedKeys(this.item.activity.gameIdList)
          this.updateGamesSorted()
        }
      })
    },
    /**
     * 获取所有游戏列表并构建树结构
     */
    async getGameAll() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}

          // 按游戏类别分组
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          // 构建游戏树结构
          const categories = { 1: 'Slots', 2: 'Poker', 3: 'Casino' }
          const builtTree = []

          for (const key in data) {
            const games = data[key]
            const cty = { id: 'p-' + key, label: categories[key], children: [] }
            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({ id: game.Gid, label: game.Name })
            }
            builtTree.push(cty)
          }

          this.allTreeData = builtTree
          // 默认只显示 Poker 游戏，且不展开
          this.applyGameTypeFilter([2])
        }
      })
    },

    /**
     * 根据游戏类型过滤显示的游戏树
     * @param {number[]} gameTypes - 游戏类型数组 (1: Slots 2: Poker 3: Casino)
     */
    applyGameTypeFilter(gameTypes) {
      const selectedKeys = gameTypes.map(gameType => 'p-' + gameType)
      console.log('selectedKeys', selectedKeys)
      this.treeData = this.allTreeData.filter(cty => selectedKeys.includes(cty.id))
      // 不展开任何节点
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.gameIdList || [])
        }
        this.updateGamesSorted()
      })
    },

    // 打开游戏排序弹窗
    showGamesSortDialog() {
      if (!this.item.activity.gameIdList || this.item.activity.gameIdList.length === 0) {
        return Message.warning('请先选择参与活动的游戏')
      }
      // 根据当前选中的游戏ID，构建排序列表
      this.gamesSorted = this.item.activity.gameIdList.map((gameId, index) => {
        return {
          gameId: gameId,
          name: this.getGameNameById(gameId),
          orderNo: index + 1
        }
      })

      this.gamesSortDialogVisible = true
    },

    // 根据游戏ID获取游戏名称
    getGameNameById(gameId) {
      const game = this.allTreeData.flatMap(cty => cty.children).find(g => g.id === gameId)
      return game ? game.label : ''
    },

    // 更新已选游戏的排序列表
    updateGamesSorted() {
      if (!this.item.activity.gameIdList || this.item.activity.gameIdList.length === 0) {
        this.gamesSorted = []
        return
      }

      const gamesSorted = []
      const gameIdList = this.item.activity.gameIdList || []

      // 遍历所有游戏树，找到选中的游戏
      this.treeData.forEach(category => {
        if (category.children) {
          category.children.forEach(game => {
            if (gameIdList.includes(game.id)) {
              const existIndex = gamesSorted.findIndex(g => g.gameId === game.id)
              if (existIndex < 0) {
                gamesSorted.push({
                  gameId: game.id,
                  name: game.label,
                  orderNo: gameIdList.indexOf(game.id) + 1
                })
              }
            }
          })
        }
      })

      // 按 orderNo 排序
      gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
      this.gamesSorted = gamesSorted
    },

    // 保存游戏排序
    saveGamesSort() {
      // 验证排序编号
      const orderNos = this.gamesSorted.map(g => g.orderNo)
      const hasInvalid = orderNos.some(no => {
        return !Number.isInteger(no) || no < 1 || no > this.gamesSorted.length
      })
      if (hasInvalid) {
        return Message.error(`排序编号必须是1到${this.gamesSorted.length}之间的整数`)
      }

      // 按用户设置的 orderNo 排序，然后提取 gameId
      const sortedGames = this.gamesSorted.slice().sort((a, b) => a.orderNo - b.orderNo)

      // 重新赋值 orderNo 为 1, 2, 3, ...
      sortedGames.forEach((game, index) => {
        game.orderNo = index + 1
      })

      // 更新活动配置中的游戏顺序
      this.item.activity.gameIdList = sortedGames.map(game => game.gameId)

      this.gamesSortDialogVisible = false
      Message.success('游戏排序已更新')
    }
  }
}

</script>

<style scoped>

</style>
