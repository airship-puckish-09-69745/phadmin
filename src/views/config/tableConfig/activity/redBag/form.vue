<template>
  <el-dialog
    :title="getEditTitle()"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="65%"
    top="5vh"
    @opened="handleDialogOpened"
    @close="handleDialogClose"
  >
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="红包雨活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="baseConfigForm" label-width="220px">
                <el-col>
                  <el-form-item label="活动名称" :required="true">
                    <el-input v-model="item.activityName" style="width: 500px;" placeholder="请输入活动名称" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="活动开关">
                    <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="消息推送开关">
                    <el-switch v-model="item.isSend" :active-value="true" :inactive-value="false" />
                    <el-tooltip class="item" effect="light" placement="right-start">
                      <template #content>
                        <div>控制推送红包任务进度</div>
                      </template>
                      <i class="el-icon-info" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="活动开始时间">
                    <el-date-picker
                      v-model="item.startTime"
                      type="datetime"
                      placeholder="选择开始时间"
                      value-format="timestamp"
                      size="mini"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="活动结束时间">
                    <el-date-picker
                      v-model="item.endTime"
                      type="datetime"
                      placeholder="选择结束时间"
                      value-format="timestamp"
                      size="mini"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="每日活动开始时间">
                    <el-date-picker
                      v-model="item.everyDayStartTime"
                      type="datetime"
                      placeholder="选择结束时间"
                      format="HH:mm"
                      size="mini"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="每日活动结束时间">
                    <el-date-picker
                      v-model="item.everyDayEndTime"
                      type="datetime"
                      placeholder="选择结束时间"
                      format="HH:mm"
                      size="mini"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="限制红包发送金币额度" :required="true">
                    <el-input v-model="item.limitMaxNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="活动展示金额">
                    <el-input v-model.number="item.showGold" style="width: 200px;" placeholder="请输入显示金额数量" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="单日弹窗次数">
                    <el-input v-model.number="item.showTimes" style="width: 200px;" placeholder="请输入限制数量" />
                    <el-tooltip class="item" effect="light" placement="right-start">
                      <template #content>
                        <div>配置1则所有用户单日只弹出1次该弹窗，配置0则该弹窗不主动弹出，配置-1则该弹窗次数为无限</div>
                      </template>
                      <i class="el-icon-info" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col v-if="env == 'test'" :xs="24" :sm="12">
                  <el-form-item label="时间偏移(秒)">
                    <el-input v-model="item.timeS" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>

                <!-- 参与活动用户类型 -->
                <el-col>
                  <UserTypeUnit
                    :key="userTypeUnitKey"
                    v-model="item.userConfig"
                    :enabled-user-types="[1,2,3,5]"
                    :activity-cfg-id="Number(item.id) || 0"
                    :custom-user-type-label="currentUserTypeLabel"
                    :custom-user-tag-options="currentUserTagOptions"
                    :level-tag-ids="currentLevelTagIds"
                    :activity-id="13"
                  />
                </el-col>

                <el-col>
                  <el-form-item label="玩法大类型">
                    <el-radio-group v-model="item.gameType" @change="handleGameTypeChange">
                      <el-radio :label="1">Slot</el-radio>
                      <el-radio :label="2">Poker</el-radio>
                      <el-radio :label="3">Casino</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="12">
                <el-form-item label="勾选支持的游戏" :required="true">
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                  />
                  <el-tree
                    ref="tree"
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check-change="handleCheckChange"
                  />
                </el-form-item>
                <el-form-item label="给选中游戏排序" :required="true">
                  <el-button size="mini" type="primary" @click="showGamesSortDialog">
                    排序
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>

          <!-- 游戏排序弹窗 -->
          <el-dialog
            title="给选中游戏排序"
            :visible.sync="gamesSortDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
          >
            <el-table
              :data="gamesSorted"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="gameId"
                label="游戏Id"
                width="200"
              />
              <el-table-column
                prop="name"
                label="游戏名称"
                width="200"
              />
              <el-table-column
                prop="orderNo"
                label="排序编号"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.orderNo"
                    :min="0"
                    :precision="0"
                    :step="1"
                    :controls="false"
                    size="mini"
                    style="width: 100%;"
                    @change="onOrderNoChange"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-row style="top: 10px">
              <el-button type="primary" @click="saveGamesSort">保存</el-button>
            </el-row>
          </el-dialog>
        </el-tab-pane>

        <el-tab-pane label="任务配置">
          <TaskConfig v-model="item" />
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <WhitelistConfig v-model="item" />
        </el-tab-pane>
      </el-tabs>

      <el-row style="margin-top: 20px">
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="handleSaveData">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import { divFields1000, mulFields1000 } from '@/utils/index'
import UserTypeUnit from '@/components/UserType/index.vue'
import TaskConfig from './components/TaskConfig.vue'
import WhitelistConfig from './components/WhitelistConfig.vue'

function defaultUserConfig(defaultUserType = 2) {
  return {
    userTypes: [defaultUserType],
    userFilterCondition: {
      registerTimeRange: { min: 0, max: 0 },
      betTimesRange: { min: 0, max: 0 },
      userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
    },
    importedFilename: ''
  }
}

const GAME_TYPE_USER_TAG_PRESET = {
  1: {
    customUserTypeLabel: '',
    levelTagIds: [],
    customUserTagOptions: [
      {
        value: 5,
        label: 'Slots用户类型',
        children: [
          { value: 50001, label: 'Slots新增用户' },
          { value: 50002, label: 'Slots登录天数' },
          { value: 50008, label: 'Slots回归用户' },
          { value: 50005, label: '下注额度' },
          { value: 50006, label: '日均下注额度' },
          { value: 50003, label: '携带金额' }
        ]
      }
    ]
  },
  2: {
    customUserTypeLabel: 'poker 标签用户',
    levelTagIds: [],
    customUserTagOptions: [
      {
        value: 7,
        label: 'poker用户类型',
        children: [
          { value: 70001, label: 'poker 新增用户' },
          { value: 70002, label: 'poker 下注' },
          { value: 70003, label: 'poker 额度' }
        ]
      }
    ]
  },
  3: {
    customUserTypeLabel: 'casino 标签用户',
    levelTagIds: [],
    customUserTagOptions: [
      {
        value: 6,
        label: 'casino用户类型',
        children: [
          { value: 60001, label: 'casino 新增用户' },
          { value: 60002, label: 'casino 下注' },
          { value: 60003, label: 'casino 额度' }
        ]
      }
    ]
  }
}
export default {
  name: 'RedBagForm',
  // 注册子组件
  components: {
    UserTypeUnit, // 参与活动用户类型选择组件
    TaskConfig, // 任务配置组件（任务列表管理、新增/编辑/删除任务、红包价值配置）
    WhitelistConfig // 白名单配置组件（AppId/SiteId白名单、A/B测试）
  },
  props: {
    /**
     * 控制弹窗显示/隐藏
     * 父组件通过 :visible.sync 传递，true 显示弹窗，false 隐藏弹窗
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 是否为编辑模式
     * true 表示编辑已有配置，false 表示新增配置
     */
    isEdit: {
      type: Boolean,
      default: false
    },
    /**
     * 编辑时传入的配置数据对象
     * 新增时为空对象，编辑时为要编辑的配置
     */
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      subKey: 'red_task_cfg',
      item: this.getDefaultItem(),
      appId: parseInt(store.getters.appId) || -1,
      fields: [
        'showGold', 'limitMaxNum', 'rewardNum'
      ],
      env: store.getters.env || '',
      // 游戏树相关
      filterText: '',
      allTreeData: [],
      treeData: [],
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      gamesSorted: [],
      gamesSortDialogVisible: false
    }
  },
  computed: {
    userTypeUnitKey() {
      return `red-bag-user-type-${Number((this.item && this.item.gameType) || 1)}`
    },
    currentUserTypePreset() {
      return this.getUserTypePreset(this.item && this.item.gameType)
    },
    currentUserTagOptions() {
      return this.currentUserTypePreset.customUserTagOptions
    },
    currentUserTypeLabel() {
      return this.currentUserTypePreset.customUserTypeLabel
    },
    currentLevelTagIds() {
      return this.currentUserTypePreset.levelTagIds
    }
  },
  // 侦听属性变化，自动处理弹窗显示/隐藏和数据加载/重置
  watch: {
    /**
     * 侦听父组件传入的 visible 属性（弹窗显示/隐藏）
     * - 打开弹窗时：
     *   - 如果是编辑模式且有 editData，加载编辑数据
     *   - 如果是新增模式，重置表单为默认数据
     * - 关闭弹窗时：不做处理
     */
    visible(val) {
      this.dialogVisible = val
      if (val && this.isEdit && Object.keys(this.editData).length > 0) {
        this.loadEditData()
      } else if (val && !this.isEdit) {
        this.resetData()
      }
    },
    /**
     * 侦听本地 dialogVisible 变量（控制弹窗显示/隐藏）
     * - 变化时同步通知父组件（实现 .sync 语法糖）
     */
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    // 游戏树关键字过滤
    filterText(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    },
    // 编辑模式下，游戏ID变化时同步树的选中状态
    'item.gameIdCfg': {
      handler() {
        if (this.isEdit && this.$refs.tree) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.item.gameIdCfg || [])
            this.updateGamesSorted()
          })
        }
      },
      immediate: true
    },
    // 监听 item 对象引用变化（如新增/编辑切换），重置游戏选择状态
    item(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.ensureUserConfig()
        this.gamesSorted = []
        this.$nextTick(() => {
          this.applyGameTypeFilter()
        })
      }
    }
  },
  mounted() {
    this.ensureUserConfig()
    this.getGameAll()
  },
  methods: {
    getUserTypePreset(gameType = 1) {
      const normalizedGameType = Number(gameType) || 1
      return GAME_TYPE_USER_TAG_PRESET[normalizedGameType] || GAME_TYPE_USER_TAG_PRESET[1]
    },
    getDefaultTagByGameType(gameType = 1) {
      const preset = this.getUserTypePreset(gameType)
      const firstTagType = (preset.customUserTagOptions && preset.customUserTagOptions[0]) || {}
      const firstTagChild = (firstTagType.children && firstTagType.children[0]) || {}
      return {
        tagType: Number(firstTagType.value) || 0,
        tagId: Number(firstTagChild.value) || 0
      }
    },
    normalizeTagConfigByGameType(userTagConfig, gameType, forceResetTag = false) {
      const preset = this.getUserTypePreset(gameType)
      const options = Array.isArray(preset.customUserTagOptions) ? preset.customUserTagOptions : []
      const defaultTag = this.getDefaultTagByGameType(gameType)
      const normalized = {
        tagType: Number((userTagConfig || {}).tagType) || 0,
        tagId: Number((userTagConfig || {}).tagId) || 0,
        tagValue: Number((userTagConfig || {}).tagValue) || 0
      }

      const validTagTypes = options.map(opt => Number(opt.value)).filter(v => Number.isInteger(v))
      if (forceResetTag || !validTagTypes.includes(normalized.tagType)) {
        normalized.tagType = defaultTag.tagType
      }

      const currentTagType = options.find(opt => Number(opt.value) === normalized.tagType)
      const validTagIds = currentTagType && Array.isArray(currentTagType.children)
        ? currentTagType.children.map(child => Number(child.value)).filter(v => Number.isInteger(v))
        : []
      if (forceResetTag || !validTagIds.includes(normalized.tagId)) {
        normalized.tagId = validTagIds.length > 0 ? validTagIds[0] : defaultTag.tagId
      }
      return normalized
    },
    syncUserConfigByGameType(forceResetTag = false) {
      if (!this.item) return
      const fallbackType = Array.isArray(this.item.userType) && this.item.userType.length > 0
        ? Number(this.item.userType[0]) || 2
        : 2
      const normalizedUserConfig = this.normalizeUserConfig(this.item.userConfig, fallbackType)
      const currentUserType = Array.isArray(normalizedUserConfig.userTypes) && normalizedUserConfig.userTypes.length > 0
        ? Number(normalizedUserConfig.userTypes[0]) || fallbackType
        : fallbackType
      normalizedUserConfig.userTypes = [currentUserType]

      if (currentUserType === 5) {
        normalizedUserConfig.userFilterCondition.userTagConfig = this.normalizeTagConfigByGameType(
          normalizedUserConfig.userFilterCondition.userTagConfig,
          this.item.gameType,
          forceResetTag
        )
      }

      this.$set(this.item, 'userConfig', normalizedUserConfig)
      this.item.userType = normalizedUserConfig.userTypes
      this.item.userLabel = currentUserType === 5
        ? Number(normalizedUserConfig.userFilterCondition.userTagConfig.tagId) || this.getDefaultTagByGameType(this.item.gameType).tagId
        : null
    },
    // 确保 item.userConfig 已初始化，防止 UserType 渲染时 userConfig 为 undefined
    ensureUserConfig() {
      if (!this.item) return
      if (!this.item.userConfig) {
        const fallbackType = Array.isArray(this.item.userType) && this.item.userType.length > 0
          ? Number(this.item.userType[0]) || 2
          : 2
        this.$set(this.item, 'userConfig', defaultUserConfig(fallbackType))
      }
      this.syncUserConfigByGameType(false)
    },
    // 获取一个全新的默认表单数据对象（用于新增或重置表单）
    getDefaultItem() {
      const userConfig = defaultUserConfig()
      userConfig.userFilterCondition.userTagConfig.tagType = 5
      userConfig.userFilterCondition.userTagConfig.tagId = 50001
      return {
        activityName: '',
        isOpen: true,
        isSend: true,
        startTime: 0,
        endTime: 0,
        everyDayStartTime: 0,
        everyDayEndTime: 0,
        showTimes: 0,
        sockGainRatio: 10,
        showGold: 0,
        ruleImgHor: [],
        ruleImgVer: [],
        rewardUseSceneId: 0,
        limitMaxNum: 0,
        timeS: 0,
        userType: [2], // 兼容旧数据
        UserTypeUnitData: defaultUserConfig(),
        appId: -1,
        prizePoolCfg: [],
        gameIdCfg: [],
        appIdList: [],
        siteIdList: [],
        whiteList: [],
        abTest: {
          switch: false,
          bPercent: 0
        },
        curId: '',
        isWhite: true,
        taskCfgData: [],
        rewardType: 1, // 默认选中 投注金
        gameType: 1, // 默认选中 Slot
        userLabel: null // 用户标签

      }
    },
    // 生成唯一的本地存储 key，通常用于缓存或区分不同配置类型
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    // 获取弹窗标题，根据 isEdit 判断是“新增”还是“修改”
    getEditTitle() {
      return this.isEdit ? '修改配置' : '新增配置'
    },
    // 获取白名单 UID 列表，保证返回数组
    getWhiteList() {
      return this.item.whiteList || []
    },
    // 处理任务配置数据，将 rewardNum 字段 *1000 后返回新数组（用于保存时格式转换）
    getTaskCfgData(cfgData) {
      return cfgData.map(data => {
        const newData = mulFields1000(data, this.fields)
        const result = { ...data, rewardNum: newData.rewardNum }
        // 处理 rewardPools 中的 value1 和 value2（金额字段 * 1000），weight（权重字段 * 100）
        if (result.rewardPools && Array.isArray(result.rewardPools)) {
          result.rewardPools = result.rewardPools.map(pool => ({
            ...pool,
            value1: Math.round(Number(pool.value1) * 1000),
            value2: Math.round(Number(pool.value2) * 1000)
          }))
        }
        return result
      })
    },
    // 处理红包配置，将金额字段 * 1000，权重字段 * 100
    formatRedBagCfgForSave(cfgList) {
      return cfgList.map(item => {
        const newItem = { ...item }
        // 处理rewardPools数组
        if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
          newItem.rewardPools = newItem.rewardPools.map(pool => ({
            poolName: pool.poolName,
            value1: Math.round(Number(pool.value1) * 1000),
            value2: Math.round(Number(pool.value2) * 1000),
            weight: Number(pool.weight),
            limitNum: pool.limitNum
          }))
        }
        return newItem
      })
    },
    // 处理红包配置，将金额字段 / 1000，权重字段 / 100
    formatRedBagCfgForEdit(cfgList) {
      return cfgList.map(item => {
        const newItem = { ...item }
        // 处理rewardPools数组
        if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
          newItem.rewardPools = newItem.rewardPools.map(pool => ({
            ...pool,
            value1: Number(pool.value1) / 1000,
            value2: Number(pool.value2) / 1000
          }))
        }
        return newItem
      })
    },
    /**
     * 批量赋值字段
     * 将 newData 中 fields 指定的字段赋值到 data 上（只赋值存在于 newData 的字段）
     * 用于数据格式转换后同步字段，避免遗漏和冗余代码
     * @param {Object} data - 目标对象（被赋值）
     * @param {Object} newData - 源对象（提供新值）
     * @param {Array} fields - 需要赋值的字段名数组
     */
    assignFields(data, newData, fields) {
      fields.forEach(f => {
        if (Object.prototype.hasOwnProperty.call(newData, f)) {
          data[f] = newData[f]
        }
      })
    },

    normalizeUserConfig(userConfig, fallbackUserType = 2) {
      const normalized = defaultUserConfig(fallbackUserType)
      if (userConfig && typeof userConfig === 'object') {
        const currentType = Array.isArray(userConfig.userTypes) && userConfig.userTypes.length > 0
          ? Number(userConfig.userTypes[0]) || fallbackUserType
          : fallbackUserType
        normalized.userTypes = [currentType]
        const condition = userConfig.userFilterCondition || {}
        normalized.userFilterCondition = {
          registerTimeRange: {
            min: Number((condition.registerTimeRange || {}).min) || 0,
            max: Number((condition.registerTimeRange || {}).max) || 0
          },
          betTimesRange: {
            min: Number((condition.betTimesRange || {}).min) || 0,
            max: Number((condition.betTimesRange || {}).max) || 0
          },
          userTagConfig: {
            tagType: Number((condition.userTagConfig || {}).tagType) || 0,
            tagId: Number((condition.userTagConfig || {}).tagId) || 0,
            tagValue: Number((condition.userTagConfig || {}).tagValue) || 0
          }
        }
        normalized.importedFilename = userConfig.importedFilename || ''
      }
      return normalized
    },
    buildUserConfigFromLegacy(userType, userLabel, userConfig, gameType = 1) {
      let parsedUserType = userType
      if (typeof userType === 'string') {
        try {
          parsedUserType = JSON.parse(userType || '[2]')
        } catch (e) {
          parsedUserType = [2]
        }
      }
      const userTypes = Array.isArray(parsedUserType)
        ? parsedUserType.map(v => Number(v)).filter(v => Number.isInteger(v))
        : [Number(parsedUserType) || 2]
      const fallbackType = userTypes.length > 0 ? userTypes[0] : 2
      const normalized = this.normalizeUserConfig(userConfig, fallbackType)
      normalized.userTypes = [fallbackType]
      if (fallbackType === 5) {
        const nextTagConfig = {
          ...normalized.userFilterCondition.userTagConfig,
          tagId: Number(userLabel) || Number((normalized.userFilterCondition.userTagConfig || {}).tagId) || 0
        }
        normalized.userFilterCondition.userTagConfig = this.normalizeTagConfigByGameType(nextTagConfig, gameType)
      }
      return normalized
    },
    configCheck() {
      if (this.item.startTime === 0) {
        this.errmsg('请填写输入开始时间')
        return false
      }
      if (this.item.endTime === 0) {
        this.errmsg('请填写输入结束时间')
        return false
      }
      return true
    },
    errmsg(msg) {
      this.$message.error(msg)
    },
    // 弹窗相关方法
    handleDialogOpened() {
      this.$emit('opened')
      // 如果是编辑模式，设置已选中的游戏
      if (this.isEdit) {
        this.$nextTick(() => {
          this.setCheckedGames()
        })
      }
    },
    // 关闭弹窗时触发，通知父组件
    handleDialogClose() {
      this.$emit('close')
    },
    // 取消按钮处理，关闭弹窗
    handleCancel() {
      this.dialogVisible = false
    },
    // 新增配置
    handleAddData(tableData) {
      request({
        url: '/redbagactivity/create',
        method: 'post',
        data: tableData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('新增成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    // 编辑配置
    handleEditData(tableData) {
      tableData.id = this.item.id
      request({
        url: '/redbagactivity/update',
        method: 'post',
        data: tableData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('更新成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },

    /**
     * 总保存数据方法
     * 1. 校验表单数据
     * 2. 格式化时间、金额、权重等字段
     * 3. 组装 tableData 对象，准备提交后端
     * 4. 根据 isEdit 区分调用新增或编辑接口
     */
    handleSaveData() {
      // 1. 校验表单数据，未通过则中断
      if (!this.configCheck()) return
      // 2. 时间字段转换为秒
      const startTime = Math.floor(this.item.startTime / 1000)
      const endTime = Math.floor(this.item.endTime / 1000)
      const everyStartTime = this.item.everyDayStartTime ? Math.floor(this.item.everyDayStartTime / 1000) : 0
      const everyEndTime = this.item.everyDayEndTime ? Math.floor(this.item.everyDayEndTime / 1000) : 0
      // 3. 处理各类配置数据，金额/权重/数组等格式化为后端需要的字符串
      // 从taskCfgData中分离任务配置和红包价值配置
      // 任务配置：包含taskType字段的记录
      // 红包配置：包含redId字段且不包含taskType的记录
      const taskConfigs = this.item.taskCfgData.filter(item => item.taskType)
      // const redBagConfigs = this.item.taskCfgData.filter(item => item.redId && !item.taskType)
      let taskCfgData = this.getTaskCfgData(taskConfigs)
      taskCfgData = JSON.stringify(taskCfgData)
      // const redBagCfg = JSON.stringify(this.formatRedBagCfgForSave(redBagConfigs))
      const gameIdCfg = JSON.stringify(this.item.gameIdCfg)
      const abTest = JSON.stringify(this.item.abTest)
      const whiteList = JSON.stringify(this.getWhiteList())
      const siteIdList = JSON.stringify(this.item.siteIdList)
      // 4. appIdList 为空时补充当前 appId
      if (!this.item.appIdList) {
        this.item.appIdList = []
      }
      if (this.item.appIdList.length === 0) {
        this.item.appIdList.push(this.appId)
      }
      // 5. 金额/权重等字段批量 *1000 处理
      const newItem = mulFields1000(this.item, this.fields)
      const normalizedUserConfig = this.normalizeUserConfig(this.item.userConfig, 2)
      const currentUserType = normalizedUserConfig.userTypes[0]
      if (currentUserType === 5) {
        normalizedUserConfig.userFilterCondition.userTagConfig = this.normalizeTagConfigByGameType(
          normalizedUserConfig.userFilterCondition.userTagConfig,
          this.item.gameType
        )
      }
      const defaultTag = this.getDefaultTagByGameType(this.item.gameType)
      const currentUserLabel = currentUserType === 5
        ? Number(normalizedUserConfig.userFilterCondition.userTagConfig.tagId) || defaultTag.tagId
        : null
      if (currentUserType === 5 && !currentUserLabel) {
        this.errmsg('请选择用户标签')
        return
      }
      this.item.userConfig = normalizedUserConfig
      this.item.userType = normalizedUserConfig.userTypes
      this.item.userLabel = currentUserLabel

      // 6. 组装最终提交数据对象
      const fromData = {
        activityName: this.item.activityName, // 活动名称
        appId: parseInt(store.getters.appId), // 应用ID
        isOpen: this.item.isOpen, // 活动开关
        isSend: this.item.isSend, // 是否发放
        startTime: startTime, // 活动开始时间（秒）
        endTime: endTime, // 活动结束时间（秒）
        everyDayStartTime: everyStartTime, // 每日开始时间（秒）
        everyDayEndTime: everyEndTime, // 每日结束时间（秒）
        showTimes: this.item.showTimes, // 展示次数
        showGold: newItem.showGold, // 展示金额（*1000）
        limitMaxNum: newItem.limitMaxNum, // 最大限领（*1000）
        timeS: this.item.timeS ?? 0, // 时间偏移
        rewardType: this.item.rewardType, // 奖励类型
        gameType: this.item.gameType, // 玩法大类型
        userType: normalizedUserConfig.userTypes, // 用户类型
        userLabel: currentUserLabel, // 用户标签
        taskCfgData: taskCfgData, // 任务配置（JSON字符串）
        // redBagCfg: redBagCfg, // 红包价值配置（JSON字符串）
        gameIdCfg: gameIdCfg, // 游戏ID配置（JSON字符串）
        whiteList: whiteList, // 白名单（JSON字符串）
        isWhite: this.item.isWhite, // 是否白名单
        appIdList: JSON.stringify(this.item.appIdList), // 应用ID列表（JSON字符串）
        siteIdList: siteIdList, // 站点ID列表（JSON字符串）
        abTest: abTest, // AB测试配置（JSON字符串）
        status: this.item.status // 活动状态
      }

      console.log(fromData)

      // 7. 根据 isEdit 区分调用新增或编辑接口
      if (this.isEdit) {
        this.handleEditData(fromData)
      } else {
        // 添加默认 6: '下架'
        fromData.status = 6
        this.handleAddData(fromData)
      }
    },

    // 加载编辑数据
    loadEditData() {
      // 1) 校验 editData 是否存在（非空对象）
      if (this.editData && Object.keys(this.editData).length > 0) {
        // 深拷贝传入的数据，避免修改原对象引用
        const data = JSON.parse(JSON.stringify(this.editData))

        /*
         * safeJsonParse:
         * - 有些字段后端返回的是 JSON 字符串，这个辅助函数负责安全解析
         * - 如果不是字符串或解析失败，则返回提供的默认值（避免异常）
         */
        const safeJsonParse = (str, defaultValue = []) => {
          if (typeof str === 'string' && str.trim()) {
            try {
              return JSON.parse(str)
            } catch (e) {
              // 如果解析失败，打印日志并返回默认值
              console.error('JSON解析失败:', e)
              return defaultValue
            }
          }
          // 如果已经是对象则直接返回，否则返回默认值
          return typeof str === 'object' ? str : defaultValue
        }

        // 安全地解析后端可能以字符串形式返回的字段
        data.taskCfgData = safeJsonParse(data.taskCfgData, [])
        data.redBagCfg = safeJsonParse(data.redBagCfg, [])
        data.gameIdCfg = safeJsonParse(data.gameIdCfg, [])
        data.whiteList = safeJsonParse(data.whiteList, [])
        data.appIdList = safeJsonParse(data.appIdList, [])
        data.siteIdList = safeJsonParse(data.siteIdList, [])
        data.abTest = safeJsonParse(data.abTest, { switch: false, bPercent: 0 })
        //  对需要按千倍/百分位处理的字段做统一转换（使用工具函数）
        // divFields1000 会将指定字段除以 1000（反向处理），返回一个新对象
        const newData = divFields1000(data, this.fields)
        // 使用 assignFields 只把需要的字段从 newData 覆盖回 data
        this.assignFields(data, newData, this.fields)
        //  处理 taskCfgData 中 rewardNum 字段（前端期望的单位）
        if (Array.isArray(data.taskCfgData)) {
          data.taskCfgData = data.taskCfgData.map(item => {
            const newItem = { ...item }
            // 处理 rewardNum
            if (newItem.rewardNum !== undefined && newItem.rewardNum !== null) {
              newItem.rewardNum = Number(newItem.rewardNum) / 1000
            }
            // 处理 rewardPools 中的金额字段（/ 1000）和权重字段（/ 100）
            if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
              newItem.rewardPools = newItem.rewardPools.map(pool => ({
                ...pool,
                value1: Number(pool.value1) / 1000,
                value2: Number(pool.value2) / 1000
              }))
            }
            return newItem
          })
        }

        // 合并红包配置到taskCfgData中
        if (Array.isArray(data.redBagCfg)) {
          const formattedRedBagCfg = this.formatRedBagCfgForEdit(data.redBagCfg)
          data.taskCfgData = [...(data.taskCfgData || []), ...formattedRedBagCfg]
        }

        if (data.startTime) data.startTime = data.startTime * 1000
        if (data.endTime) data.endTime = data.endTime * 1000
        if (data.everyDayStartTime) data.everyDayStartTime = data.everyDayStartTime * 1000
        if (data.everyDayEndTime) data.everyDayEndTime = data.everyDayEndTime * 1000

        // 确保 rewardType 和 gameType 有默认值
        if (data.rewardType === undefined || data.rewardType === null) {
          data.rewardType = 1
        }
        if (data.gameType === undefined || data.gameType === null) {
          data.gameType = 1
        }
        //
        if (typeof data.userLabel === 'string') {
          data.userLabel = parseInt(data.userLabel, 10)
        }
        data.userConfig = this.buildUserConfigFromLegacy(data.userType, data.userLabel, data.userConfig, data.gameType)
        data.userType = data.userConfig.userTypes
        data.userLabel = data.userConfig.userTypes[0] === 5
          ? data.userConfig.userFilterCondition.userTagConfig.tagId
          : null
        this.item = data
      }
    },
    // 重置from，防止数据残留
    resetData() {
      this.item = this.getDefaultItem()
      this.gamesSorted = []
      this.$nextTick(() => {
        this.applyGameTypeFilter()
      })
    },

    // 游戏树筛选方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleGameTypeChange() {
      // 切换玩法大类型时，清除已选游戏和排序缓存
      this.syncUserConfigByGameType(true)
      this.item.gameIdCfg = []
      this.gamesSorted = []
      this.applyGameTypeFilter()
    },
    applyGameTypeFilter() {
      const selectedKey = 'p-' + this.item.gameType
      this.treeData = this.allTreeData.filter(cty => cty.id === selectedKey)

      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.gameIdCfg || [])
        }
        this.updateGamesSorted()
      })
    },
    // 游戏树选中变化
    handleCheckChange(data, checked) {
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      if (!this.item.gameIdCfg) {
        this.item.gameIdCfg = []
      }
      const gameIdCfg = this.item.gameIdCfg
      const index = gameIdCfg.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          gameIdCfg.push(data.id)
        }
      } else {
        if (index >= 0) {
          gameIdCfg.splice(index, 1)
        }
      }

      this.item.gameIdCfg = gameIdCfg
      this.updateGamesSorted()
    },
    // 更新选中游戏的排序列表
    updateGamesSorted() {
      const gamesSorted = []
      const gameIdCfg = this.item.gameIdCfg || []
      this.treeData.forEach(category => {
        if (category.children) {
          category.children.forEach(game => {
            if (gameIdCfg.includes(game.id)) {
              const existIndex = gamesSorted.findIndex(g => g.gameId === game.id)
              if (existIndex < 0) {
                gamesSorted.push({
                  gameId: game.id,
                  name: game.label,
                  orderNo: gameIdCfg.indexOf(game.id) + 1
                })
              }
            }
          })
        }
      })
      gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
      this.gamesSorted = gamesSorted
    },
    // 显示游戏排序弹窗
    showGamesSortDialog() {
      this.updateGamesSorted()
      this.gamesSortDialogVisible = true
    },
    // 保存游戏排序
    saveGamesSort() {
      this.gamesSortDialogVisible = false
      this.gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
      const gameIdCfg = []
      this.gamesSorted.forEach(item => {
        gameIdCfg.push(item.gameId)
      })
      this.item.gameIdCfg = gameIdCfg
    },
    // 排序号变化时自动排序
    onOrderNoChange() {
      this.gamesSorted.forEach(item => {
        const orderNo = Number(item.orderNo)
        item.orderNo = Number.isFinite(orderNo) && orderNo >= 0 ? Math.floor(orderNo) : 0
      })
      this.gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
    },
    // 设置选中的游戏
    setCheckedGames() {
      if (this.$refs.tree && this.item.gameIdCfg) {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.item.gameIdCfg)
          this.updateGamesSorted()
        })
      }
    },
    // 获取游戏列表
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1) {
              continue
            }

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

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
          this.applyGameTypeFilter()

          if (this.isEdit && this.$refs.tree && this.item.gameIdCfg) {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.item.gameIdCfg)
              this.updateGamesSorted()
            })
          }
        }
      })
    }
  }
}
</script>
