<template>
  <div class="airdrop-user-type">
    <!-- 用户类型选择 -->
    <el-form-item label="参与活动用户类型：" required>
      <el-select v-model="currentUserType" placeholder="请选择" style="width: 280px" @change="onUserTypeChange">
        <el-option v-for="item in effectiveUserTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <!-- 导入用户 -->
    <template v-if="isImportUsers">
      <el-form-item label="导入用户：">
        <div>
          <span>已导入用户：{{ importedUidListCount }}</span>
          <span style="margin-left: 8px">（已生效用户：{{ importedUidCacheCount }}）</span>
          <span style="margin-left: 8px; color: #0088ff">重复导入不会覆盖原有的用户ID</span>
        </div>
        <div style="margin-top: 4px; color: #e6a23c; font-size: 12px">
          注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！
        </div>
        <el-upload
          v-if="activityCfgId > 0"
          ref="upload"
          drag
          :action="actionURL"
          accept=".csv,text/csv"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload"
          :with-credentials="true"
          :auto-upload="false"
          :limit="1"
          style="margin-top: 8px"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处 或 <em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传 text/csv 格式文件，且不超过10MB</div>
        </el-upload>
        <div v-if="activityCfgId > 0" style="margin-top: 8px">
          <el-button type="success" size="small" @click="submitUpload">上传用户ID数据</el-button>
          <el-button type="danger" size="small" style="margin-left: 8px" @click="delImportedUid">重置已导入的用户ID</el-button>
        </div>
        <div v-else style="color: #909399; font-size: 12px; margin-top: 4px">请先保存活动后再导入用户</div>
        <ImportedUserList
          v-if="showImportUserList && activityCfgId > 0 && currentUserType ==  3"
          ref="importedUserList"
          :visible="isImportUsers"
          :activity-cfg-id="activityCfgId"
          :activity-id="activityId"
          :request-url="importListApi"
          :include-activity-id="includeActivityId"
          :extra-data="importRequestData"
          @loaded="onImportedUserListLoaded"
        />
      </el-form-item>
    </template>

    <!-- 筛选用户 -->
    <template v-if="isFilterUsers">
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
          :picker-options="pickerOptions"
          @change="onRegisterDateChange"
        />
      </el-form-item>
      <el-form-item label="累计投注次数：">
        <el-input
          v-model.number="localValue.userFilterCondition.betTimesRange.min"
          placeholder="最小投注次数"
          style="width: 150px"
          oninput="if(value<0||value===''){value=0}"
        />
        <span style="margin: 0 8px">至</span>
        <el-input
          v-model.number="localValue.userFilterCondition.betTimesRange.max"
          placeholder="最大投注次数"
          style="width: 150px"
          oninput="if(value<0||value===''){value=0}"
        />
      </el-form-item>
    </template>

    <!-- 用户标签 -->
    <template v-if="isTagUsers">
      <el-form-item label="标签类型：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagType" placeholder="请选择标签类型" @change="onTagTypeChange">
          <el-option v-for="item in effectiveUserTagOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签子类：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagId" placeholder="请选择标签子类" @change="onTagIdChange">
          <el-option v-for="item in tagIdOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showUserLevelCondition" label="用户等级：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagValue" placeholder="请选择用户等级">
          <el-option v-for="item in userLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showGameIntensityCondition" label="游戏强度：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagValue" placeholder="请选择游戏强度">
          <el-option v-for="item in userTagGameIntensityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import ImportedUserList from './ImportedUserList.vue'
import {
  DEFAULT_ENABLED_USER_TYPES,
  DEFAULT_USER_TYPE_OPTIONS,
  USER_TYPE_VALUES,
  defaultUserConfig,
  defaultUserFilterCondition
} from './config'

export default {
  name: 'ActivityUserType',
  components: {
    ImportedUserList
  },
  // 父组件 → 子组件: 用 props 传值
  props: {
    value: {
      type: Object,
      default: () => defaultUserConfig()
    },
    activityCfgId: {
      type: Number,
      default: 0
    },
    activityId: {
      type: Number,
      default: 0
    },
    // 自定义"用户标签"选项的显示名称，例如 "casino 标签用户"
    customUserTypeLabel: {
      type: String,
      default: ''
    },
    // 自定义标签类型选项，不传则使用内置的 Slots 标签选项
    customUserTagOptions: {
      type: Array,
      default: null
    },
    // 触发"用户等级"子选择的 tagId 列表；不同玩法可覆盖
    levelTagIds: {
      type: Array,
      default: () => [50005, 50006, 50003, 50002]
    },
    // 允许的用户类型列表，默认全部可选
    enabledUserTypes: {
      type: Array,
      default: () => DEFAULT_ENABLED_USER_TYPES
    },
    // 是否显示导入用户列表，默认显示
    showImportUserList: {
      type: Boolean,
      default: true
    },
    // 是否在导入请求中包含 activityId，默认包含
    includeActivityId: {
      type: Boolean,
      default: true
    },
    // 导入请求的额外参数，默认空对象
    importRequestData: {
      type: Object,
      default: () => ({})
    },
    // 导入相关的 API 接口地址，默认值可覆盖
    importTotalApi: {
      type: String,
      default: '/activityconfig/uids/total'
    },
    // 导入用户的 API 接口地址，默认值可覆盖
    importUploadApi: {
      type: String,
      default: '/activityconfig/uids/import'
    },
    // 删除已导入用户的 API 接口地址，默认值可覆盖
    importDeleteApi: {
      type: String,
      default: '/activityconfig/uids/imported/delete'
    },
    //  获取已导入用户列表的 API 接口地址，默认值可覆盖
    importListApi: {
      type: String,
      default: '/activityconfig/uids/imported'
    }
  },

  data() {
    return {

      currentUserType: 2,
      importedUidCacheCount: 0,
      importedUidListCount: 0,
      registerDateRange: [],
      tagIdOptions: [],
      uploadProgress: 0,
      uploadElapsed: 0,
      // 内置的基础用户类型选项
      userTypeOptions: DEFAULT_USER_TYPE_OPTIONS,
      // 内置的 Slots 标签类型选项（可被 customUserTagOptions prop 覆盖）
      userTagOptions: [
        { value: 2, label: '游戏强度', children: [{ value: 20000, label: '游戏强度' }] },
        {
          value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' },
            { value: 50005, label: '下注额度' },
            { value: 50006, label: '日均下注额度' },
            { value: 50003, label: '携带金额' }
          ]
        }
      ],
      userTagGameIntensityOptions: [
        { value: 0, label: '未选择' },
        { value: 1, label: '无感' },
        { value: 2, label: '尝试' },
        { value: 3, label: '常玩' },
        { value: 4, label: '核心' }
      ],
      userLevelOptions: [
        { value: 1, label: '轻度用户' },
        { value: 2, label: '中度用户' },
        { value: 3, label: '重度用户' }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date(); const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date(); const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    localValue() {
      return this.value
    },
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    normalizedEnabledUserTypes() {
      const list = Array.isArray(this.enabledUserTypes) ? this.enabledUserTypes : []
      const normalized = list.map(v => Number(v)).filter(v => Number.isInteger(v))
      return normalized.length > 0 ? normalized : DEFAULT_ENABLED_USER_TYPES
    },
    defaultUserType() {
      if (this.normalizedEnabledUserTypes.includes(USER_TYPE_VALUES.ALL)) {
        return USER_TYPE_VALUES.ALL
      }
      return this.normalizedEnabledUserTypes[0]
    },
    // 实际使用的用户类型选项：若传入了自定义标签名则替换 value=5 的标签
    effectiveUserTypeOptions() {
      const enabledSet = new Set(this.normalizedEnabledUserTypes)
      const baseOptions = this.userTypeOptions.filter(opt => enabledSet.has(opt.value))
      if (!this.customUserTypeLabel) return baseOptions
      return baseOptions.map(opt =>
        opt.value === USER_TYPE_VALUES.TAG ? { ...opt, label: this.customUserTypeLabel } : opt
      )
    },
    // 实际使用的标签类型选项：优先使用 prop 传入的，否则用内置 Slots 选项
    effectiveUserTagOptions() {
      return this.customUserTagOptions || this.userTagOptions
    },
    isImportUsers() {
      return this.currentUserType === USER_TYPE_VALUES.IMPORT
    },
    isFilterUsers() {
      return this.currentUserType === USER_TYPE_VALUES.FILTER
    },
    isTagUsers() {
      return this.currentUserType === USER_TYPE_VALUES.TAG
    },
    // 哪些 tagId 需要展示"用户等级"子选择（各玩法通过 levelTagIds prop 配置）
    showUserLevelCondition() {
      const userTagConfig = (this.localValue.userFilterCondition && this.localValue.userFilterCondition.userTagConfig) || {}
      return this.isTagUsers && this.levelTagIds.includes(userTagConfig.tagId)
    },
    showGameIntensityCondition() {
      const userTagConfig = (this.localValue.userFilterCondition && this.localValue.userFilterCondition.userTagConfig) || {}
      return this.isTagUsers &&
        userTagConfig.tagType === 2 &&
        userTagConfig.tagId === 20000
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) return
        const userType = (val.userTypes && val.userTypes.length > 0) ? Number(val.userTypes[0]) : this.defaultUserType
        const normalizedUserType = this.normalizeUserType(userType)
        this.currentUserType = normalizedUserType
        if (normalizedUserType !== userType) {
          this.emitChange()
        }
        // 初始化注册时间范围
        const cond = val.userFilterCondition || {}
        const rtr = cond.registerTimeRange || {}
        if (rtr.min && rtr.max) {
          this.registerDateRange = [rtr.min * 1000, rtr.max * 1000]
        } else {
          this.registerDateRange = []
        }
        // 初始化标签选项
        const tagType = cond.userTagConfig ? Number(cond.userTagConfig.tagType) || 0 : 0
        this.syncTagIdOptions(tagType)
      }
    },
    normalizedEnabledUserTypes() {
      const normalized = this.normalizeUserType(this.currentUserType)
      if (normalized !== this.currentUserType) {
        this.currentUserType = normalized
        this.emitChange()
      }
    },
    activityCfgId: {
      immediate: true,
      handler(val) {
        if (val > 0) {
          this.getImportedUidCacheCount()
          this.refreshImportedUserList()
        } else {
          this.importedUidCacheCount = 0
          this.importedUidListCount = 0
        }
      }
    }
  },
  methods: {
    normalizeUserType(userType) {
      const type = Number(userType)
      if (this.normalizedEnabledUserTypes.includes(type)) {
        return type
      }
      return this.defaultUserType
    },
    buildImportRequestData(extraData = {}) {
      const data = {
        ...this.importRequestData,
        ActCfgId: this.activityCfgId,
        ...extraData
      }
      if (this.includeActivityId && this.activityId > 0) {
        data.ActivityId = this.activityId
      }
      return data
    },
    onImportedUserListLoaded(payload) {
      this.importedUidListCount = Number(payload && payload.total) || 0
    },
    refreshImportedUserList() {
      if (!this.showImportUserList || !this.$refs.importedUserList) {
        return
      }
      this.$refs.importedUserList.refresh()
    },
    changeUploadLoadingText(progress, elapsedSeconds) {
      this.uploadProgress = Number(progress) || 0
      this.uploadElapsed = Number(elapsedSeconds) || 0
    },
    getUserTagConfig() {
      if (!this.localValue.userFilterCondition) {
        this.$set(this.localValue, 'userFilterCondition', defaultUserFilterCondition())
      }
      if (!this.localValue.userFilterCondition.userTagConfig) {
        this.$set(this.localValue.userFilterCondition, 'userTagConfig', { tagType: 0, tagId: 0, tagValue: 0 })
      }
      return this.localValue.userFilterCondition.userTagConfig
    },
    syncTagIdOptions(tagType) {
      const found = this.effectiveUserTagOptions.find(item => item.value === tagType)
      this.tagIdOptions = (found && found.children) || []
    },
    emitChange() {
      this.$emit('input', {
        ...defaultUserConfig(this.defaultUserType),
        ...this.localValue,
        userTypes: [this.currentUserType]
      })
    },
    onUserTypeChange(val) {
      const normalizedUserType = this.normalizeUserType(val)
      this.currentUserType = normalizedUserType
      if (normalizedUserType !== USER_TYPE_VALUES.TAG) {
        const userTagConfig = this.getUserTagConfig()
        userTagConfig.tagType = 0
        userTagConfig.tagId = 0
        userTagConfig.tagValue = 0
        this.tagIdOptions = []
      } else {
        const userTagConfig = this.getUserTagConfig()
        this.syncTagIdOptions(userTagConfig.tagType)
      }
      if (normalizedUserType === USER_TYPE_VALUES.IMPORT) {
        this.refreshImportedUserList()
      }
      this.emitChange()
    },
    onRegisterDateChange(range) {
      const min = range ? Math.floor(range[0] / 1000) : 0
      const endOfDay = range ? new Date(range[1]).setHours(23, 59, 59, 0) : 0
      const max = range ? Math.floor(endOfDay / 1000) : 0
      if (!this.localValue.userFilterCondition) {
        this.$set(this.localValue, 'userFilterCondition', defaultUserFilterCondition())
      }
      this.localValue.userFilterCondition.registerTimeRange = { min, max }
      this.emitChange()
    },
    onTagTypeChange(tagType) {
      const userTagConfig = this.getUserTagConfig()
      this.syncTagIdOptions(tagType)
      if (!this.tagIdOptions.some(opt => opt.value === userTagConfig.tagId)) {
        userTagConfig.tagId = this.tagIdOptions.length > 0 ? this.tagIdOptions[0].value : 0
      }
      userTagConfig.tagType = tagType
      userTagConfig.tagValue = 0
      this.emitChange()
    },
    onTagIdChange() {
      const userTagConfig = this.getUserTagConfig()
      userTagConfig.tagValue = 0
      this.emitChange()
    },
    getImportedUidCacheCount() {
      if (!this.activityCfgId) return Promise.resolve()
      return request({
        url: this.importTotalApi,
        method: 'post',
        data: this.buildImportRequestData()
      }).then(res => {
        if (res.RetCode === 0) {
          const total = res.Data && res.Data.total !== undefined ? res.Data.total : res.Data
          this.importedUidCacheCount = Number(total) || 0
        }
      })
    },
    handleBeforeUpload(file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        Message.error('只能上传 CSV 格式文件')
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        Message.error('文件不能超过 10MB')
        return false
      }
      return true
    },
    submitUpload() {
      if (this.$refs.upload) {
        this.$refs.upload.submit()
      }
    },

    async handleUploadSuccess(response, _file, _fileList) {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      // 文件上传失败
      if (response.RetCode !== 0) {
        this.$message.error(response.Data)
        return
      }

      // 获取服务器上传后的文件名
      const uploadedFilename = response.Data
      console.log('upload success:', uploadedFilename)
      this.$set(this.localValue, 'importedFilename', uploadedFilename)
      this.emitChange()

      // 记录开始时间
      const startTime = Date.now()

      // 模拟导入进度，最多到 99%
      let progress = Math.ceil(Math.random() * 10)

      const ticker = setInterval(() => {
        progress += Math.ceil(Math.random() * 10)

        if (progress >= 99) {
          progress = 99
          clearInterval(ticker)
        }

        const elapsedTime = (Date.now() - startTime) / 1000
        this.changeUploadLoadingText(progress, elapsedTime)
      }, 1000)

      let imported = 0

      try {
        // 真正执行 UID 导入
        const importResponse = await request({
          url: this.importUploadApi,
          method: 'post',
          timeout: 90000,
          data: this.buildImportRequestData({
            Filename: uploadedFilename
          })
        })
        // UID 导入失败
        if (importResponse.RetCode !== 0) {
          this.$message.error(importResponse.Data)
          return
        }
        imported = importResponse.Data.imported || 0
        // UID 导入成功
        this.$message.success('上传成功，新导入的数量为：' + imported)
        this.importedUidCacheCount = imported
        await this.getImportedUidCacheCount()
        this.refreshImportedUserList()
      } catch (reason) {
        // 真正的 UID 导入请求异常
        // Message.error('UID 导入失败，请稍后重试')
      } finally {
        // 清理定时器
        clearInterval(ticker)

        // 计算总耗时
        const elapsedTime = (Date.now() - startTime) / 1000

        // 导入流程结束，显示 100%
        this.changeUploadLoadingText(100, elapsedTime)
        console.log('导入数量：' + imported + '，用时：' + elapsedTime + 's')
        // 清理上传组件
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      }
    },
    delImportedUid() {
      this.$confirm('确定要重置已导入的用户id吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: this.importDeleteApi,
          method: 'post',
          data: this.buildImportRequestData()
        }).then(res => {
          if (res.RetCode === 0) {
            Message.success('已重置导入的用户id！')
            this.importedUidCacheCount = 0
            this.importedUidListCount = 0
            this.refreshImportedUserList()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.airdrop-user-type {
  width: 100%;
}
</style>
