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

          <!-- 导入用户 -->
          <el-row v-if="showImportElement" :gutter="20">
            <el-col :span="24">
              <el-form-item label="导入用户：">
                <div>
                  <span>已导入用户：{{ importedUidListCount }}</span>
                  <span>（已生效用户：{{ importedUidCacheCount }}）</span>
                  <span style="color: #0088ff">重复导入，不会覆盖原有的用户ID</span><br>
                  <span style="color: red">注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！</span>
                </div>
                <el-upload
                  ref="upload"
                  drag
                  :action="actionURL"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleUploadSuccess"
                  :with-credentials="true"
                  :auto-upload="false"
                  :limit="1"
                >
                  <el-icon class="el-icon-upload" />
                  <div class="el-upload__text">
                    将文件拖到此处 或 <em>点击上传</em>
                  </div>
                  <div slot="tip" class="el-upload__tip">
                    只能上传 text/csv 格式文件，且不超过10MB
                  </div>
                </el-upload>
                <el-button class="ml-3" type="success" @click="submitUpload">
                  上传用户ID数据
                </el-button>
                <el-button class="ml-3" type="danger" @click="delImportedUid">
                  重置已导入的用户ID
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 筛选用户条件 -->
          <el-row v-if="showUserFilterCondition" :gutter="20">
            <el-col :span="24">
              <el-form-item label="筛选用户条件：">
                <el-form label-width="120px" size="mini">
                  <el-form-item label="用户注册时间：">
                    <el-date-picker
                      v-model="registerDateRange"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="timestamp"
                    />
                  </el-form-item>
                  <el-form-item label="累计投注次数：">
                    <el-col :span="6">
                      <el-input
                        v-model.number="item.userFilterCondition.betTimesRange.min"
                        placeholder="输入最小投注次数"
                        oninput="if(value < 0 || value === '' || value === null){value = 0;}"
                      />
                    </el-col>
                    <el-col :span="1">
                      <div style="text-align: center">至</div>
                    </el-col>
                    <el-col :span="6">
                      <el-input
                        v-model.number="item.userFilterCondition.betTimesRange.max"
                        placeholder="输入最大投注次数"
                        oninput="if(value < 0 || value === '' || value === null){value = 0;}"
                      />
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 用户标签配置 -->
          <el-row v-if="showUserTagCondition" :gutter="20">
            <el-col :span="12">
              <el-form-item label="标签类型：">
                <el-select v-model="item.userFilterCondition.userTagConfig.tagType" placeholder="请选择标签类型" @change="onTagTypeChange">
                  <el-option
                    v-for="item in userTagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="showUserTagCondition" :gutter="20">
            <el-col :span="12">
              <el-form-item label="标签子类：">
                <el-select v-model="item.userFilterCondition.userTagConfig.tagId" placeholder="请选择标签子类">
                  <el-option
                    v-for="item in userTagIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="showUserLevelCondition" :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户等级：">
                <el-select v-model="item.userFilterCondition.userTagConfig.tagValue" placeholder="请选择用户等级">
                  <el-option
                    v-for="item in userLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="showUserTagGameIntensityCondition" :gutter="20">
            <el-col :span="12">
              <el-form-item label="游戏强度：">
                <el-select v-model="item.userFilterCondition.userTagConfig.tagValue" placeholder="请选择游戏强度标签">
                  <el-option
                    v-for="item in userTagGameIntensityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
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
  components: { SiteSelect, RewardConfig, GameSelector },
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
      userType: 2,
      registerDateRange: [],
      userTagIdOptions: [],

      // 已发奖金额
      sentRewardAmount: 0,

      // 导入用户相关
      importedUidListCount: 0,
      importedUidCacheCount: 0,
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

      // 用户类型
      userTypes: [
        { 'value': 1, 'label': '新增用户' },
        { 'value': 2, 'label': '所有用户' },
        { 'value': 3, 'label': '导入用户' },
        { 'value': 4, 'label': '筛选用户' },
        { 'value': 5, 'label': '用户标签' }
      ],

      // 公共游戏任务类型
      commonGameTaskTypes: [
        { 'value': 1, 'label': '「牌局」次数' },
        { 'value': 2, 'label': '「有效下注」总额' }
      ],

      defaultGameTaskTypes: [
        { 'value': 0, 'label': '未选择' }
      ],

      // 选定游戏后对应可选任务类型
      gameTaskTypes: [],

      // 任务类型游戏配置映射
      taskTypeGameMap: {
        3: { 'label': '「Pot」次数', 'gameIds': [22, 28, 29, 23] },
        100: { 'label': '「Tongits」获胜次数', 'gameIds': [22, 28, 29] },
        101: { 'label': '「Tongits Fight」获胜次数', 'gameIds': [22, 28, 29] },
        200: { 'label': '「Pusoy 其它玩家」获胜次数', 'gameIds': [21, 126] },
        201: { 'label': '「Pusoy 全垒打」获胜次数', 'gameIds': [21, 126] },
        202: { 'label': '「Pusoy NATURALS」获胜次数', 'gameIds': [21, 126] },
        300: { 'label': '「Lucky9 三张牌获得9点」次数', 'gameIds': [23] }
      },

      // 用户标签类型
      userTagOptions: [
        { value: 2, label: '游戏强度', children: [{ value: 20000, label: '游戏强度' }] },
        { value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' },
            { value: 50005, label: '下注额度' },
            { value: 50006, label: '日均下注额度' },
            { value: 50003, label: '携带金额' }
          ]}
      ],

      // 游戏强度标签值
      userTagGameIntensityOptions: [
        { value: 0, label: '未选择' },
        { value: 1, label: '无感' },
        { value: 2, label: '尝试' },
        { value: 3, label: '常玩' },
        { value: 4, label: '核心' }
      ],

      // 用户等级
      userLevelOptions: [
        { value: 1, label: '轻度用户' },
        { value: 2, label: '中度用户' },
        { value: 3, label: '重度用户' }
      ]
    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    showImportElement() {
      return this.item.id > 0 && this.item.userTypes.includes(3) // 3 导入用户
    },
    showUserFilterCondition() {
      return this.item.userTypes.includes(4) // 4 筛选用户
    },
    showUserTagCondition() {
      return this.item.userTypes.includes(5) // 5 用户标签
    },
    showUserTagGameIntensityCondition() {
      return this.item.userTypes.includes(5) &&
        this.item.userFilterCondition.userTagConfig.tagType === 2 && // 2=游戏强度
        this.item.userFilterCondition.userTagConfig.tagId === 20000 // 20000=游戏强度
    },
    showUserLevelCondition() {
      const levelTagIds = [50005, 50006, 50003]
      return this.item.userTypes.includes(5) &&
        levelTagIds.includes(this.item.userFilterCondition.userTagConfig.tagId)
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
          this.gameTaskTypes = this.defaultGameTaskTypes
          this.userType = 2
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
      this.userType = item.userTypes[0]

      // 保存 tagValue，防止 onTagTypeChange 内部将其重置为 0
      const savedTagValue = item.userFilterCondition.userTagConfig.tagValue
      this.onTagTypeChange(item.userFilterCondition.userTagConfig.tagType)
      this.item.userFilterCondition.userTagConfig.tagValue = savedTagValue

      // 更新游戏任务类型
      this.updateGameTaskTypes(this.item.gameIdCfg)

      // 获取已发奖金额
      if (this.isEdit) {
        this.getSentRewardAmount()
        this.getImportedUidCacheCount()
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
    onGameSelectionChange(gameIds) {
      this.updateGameTaskTypes(gameIds)
    },
    updateGameTaskTypes(gameIds) {
      if (gameIds.length === 0) {
        this.gameTaskTypes = this.defaultGameTaskTypes
        return
      }
      // 将公共任务类型拷贝到 gameTaskTypes
      const gameTaskTypes = JSON.parse(JSON.stringify(this.commonGameTaskTypes))
      // 遍历 this.taskTypeGameMap 获取游戏共有的任务类型
      for (const taskType in this.taskTypeGameMap) {
        const cfg = this.taskTypeGameMap[taskType]
        if (gameIds.every(gameId => cfg.gameIds.includes(gameId))) {
          gameTaskTypes.push({ label: cfg.label, value: parseInt(taskType) })
        }
      }
      this.gameTaskTypes = gameTaskTypes
    },
    onUserTypeChange(val) {
      this.$set(this.item.userTypes, 0, val)
      if (val !== 5) { // 用户标签
        this.item.userFilterCondition.userTagConfig.tagType = 0
        this.item.userFilterCondition.userTagConfig.tagId = 0
        this.item.userFilterCondition.userTagConfig.tagValue = 0
      }
    },
    onTagTypeChange(tagType) {
      const tagOptions = this.userTagOptions.find(item => item.value === tagType)
      this.userTagIdOptions = tagOptions && tagOptions.children || []
      if (this.item.userFilterCondition.userTagConfig.tagType !== tagType && this.userTagIdOptions.length > 0) {
        this.item.userFilterCondition.userTagConfig.tagId = this.userTagIdOptions[0].value
      }
      if (tagType !== 2) { // 游戏强度标签
        this.item.userFilterCondition.userTagConfig.tagValue = 0
      }
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
    getImportedUidCacheCount() {
      if (this.item.id === 0) {
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: this.item.id,
          Path: '/activity/airdrop/uid/import/count'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.importedUidCacheCount = response.Data
        }
      })
    },
    delImportedUid() {
      this.$confirm('确定要重置已导入的用户id吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/uids/imported/delete',
          method: 'post',
          data: {
            Env: this.env,
            ActCfgId: this.item.id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('已重置导入的用户id！')
            this.importedUidCacheCount = 0
            this.importedUidListCount = 0
            this.importedUidList = []
          }
        })
      })
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
    handleBeforeUpload(file) {
      const isCsv = file.type === 'text/csv'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isCsv) {
        this.$message.error('上传的文件只能是 text/csv 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过10MB!')
        return false
      }
      return true
    },
    submitUpload() {
      if (this.item.showEndTime < new Date().getTime()) {
        this.$message.error('活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！')
        return
      }
      this.$refs.upload.submit()
    },
    handleUploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      if (response.RetCode === 0) {
        const uploadedFilename = response.Data
        this.item.importedFilename = uploadedFilename
        this.importData(uploadedFilename)
      }
    },
    importData(uploadedFilename) {
      request({
        url: '/airdropconfig/uids/import',
        method: 'post',
        timeout: 90000,
        data: {
          Env: this.env,
          ActCfgId: this.item.id,
          Filename: uploadedFilename
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('上传成功，新导入的数量为：' + response.Data.imported)
          if (this.item.id === 0) {
            this.importedUidCacheCount = response.Data.imported
          } else {
            this.getImportedUidCacheCount()
            this.getImportedUidList()
          }
        }
      })
    },
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
