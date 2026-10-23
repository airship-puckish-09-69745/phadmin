<template>
  <div class="ut-body">
    <!-- 用户类型：单选卡片 -->
    <div class="ut-cards">
      <div
        v-for="opt in effectiveOptions"
        :key="opt.value"
        :class="['ut-card', { 'is-active': config.userType === opt.value }]"
        @click="selectType(opt.value)"
      >
        <i :class="[opt.icon, 'ut-card__icon']" />
        <div class="ut-card__main">
          <div class="ut-card__title">{{ opt.label }}</div>
          <div class="ut-card__desc">{{ opt.desc }}</div>
        </div>
        <el-radio :value="config.userType" :label="opt.value" class="ut-card__radio"><span /></el-radio>
      </div>
    </div>

    <div class="ut-panel">
      <!-- 1 新增用户 / 2 所有用户 -->
      <div v-if="isType(USER_TYPE_VALUES.NEW) || isType(USER_TYPE_VALUES.ALL)" class="ut-tip">
        <i class="el-icon-info" />
        {{ isType(USER_TYPE_VALUES.NEW) ? '仅新增用户可参与该活动，无需额外配置' : '所有用户均可参与该活动，无需额外配置' }}
      </div>

      <!-- 3 导入用户 -->
      <template v-if="isType(USER_TYPE_VALUES.IMPORT)">
        <div class="ut-import-stat">
          <el-tag size="small">已导入用户：{{ importedUidListCount }}</el-tag>
          <el-tag size="small" type="success">已生效用户：{{ importedUidCacheCount }}</el-tag>
          <span class="ut-import-stat__hint">重复导入不会覆盖原有的用户ID</span>
        </div>
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          title="注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！"
          style="margin-top: 8px"
        />
        <template v-if="activityCfgId > 0">
          <el-upload
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
          <div style="margin-top: 8px">
            <el-button type="success" size="small" @click="submitUpload">上传用户ID数据</el-button>
            <el-button type="danger" size="small" @click="delImportedUid">重置已导入的用户ID</el-button>
          </div>
          <ImportedUserList
            v-if="showImportUserList"
            ref="importedUserList"
            :visible="isType(USER_TYPE_VALUES.IMPORT)"
            :activity-cfg-id="activityCfgId"
            :activity-id="activityId"
            :request-url="importListApi"
            :include-activity-id="includeActivityId"
            :extra-data="importRequestData"
            @loaded="onImportedUserListLoaded"
          />
        </template>
        <div v-else class="ut-tip ut-tip--warn">请先保存活动后再导入用户</div>
      </template>

      <!-- 4 筛选用户 -->
      <el-form v-if="isType(USER_TYPE_VALUES.FILTER)" label-width="110px" size="small">
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
            v-model.number="filterCfg.betTimesRange.min"
            placeholder="最小投注次数"
            style="width: 150px"
            oninput="if(value<0||value===''){value=0}"
            @input="emitChange"
          />
          <span style="margin: 0 8px">至</span>
          <el-input
            v-model.number="filterCfg.betTimesRange.max"
            placeholder="最大投注次数"
            style="width: 150px"
            oninput="if(value<0||value===''){value=0}"
            @input="emitChange"
          />
        </el-form-item>
      </el-form>

      <!-- 5 标签用户 -->
      <TagPicker
        v-if="isType(USER_TYPE_VALUES.TAG)"
        :value="tagCfg.tags"
        :tag-types="tagTypes"
        @input="onTagsChange"
      />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import ImportedUserList from '@/components/UserType/ImportedUserList.vue'
import TagPicker from './TagPicker.vue'
import { DEFAULT_USER_TYPE_OPTIONS, USER_TYPE_VALUES } from './config'

export default {
  name: 'UserTypeBody',
  components: { ImportedUserList, TagPicker },
  props: {
    // 可变的完整配置对象，由外层持有
    config: { type: Object, required: true },
    enabledUserTypes: { type: Array, required: true },
    userTypeOptions: { type: Array, default: null },
    tagTypes: { type: Array, default: () => [] },
    activityCfgId: { type: Number, default: 0 },
    activityId: { type: Number, default: 0 },
    showImportUserList: { type: Boolean, default: true },
    includeActivityId: { type: Boolean, default: true },
    importRequestData: { type: Object, default: () => ({}) },
    importTotalApi: { type: String, default: '/activityconfig/uids/total' },
    importUploadApi: { type: String, default: '/activityconfig/uids/import' },
    importDeleteApi: { type: String, default: '/activityconfig/uids/imported/delete' },
    importListApi: { type: String, default: '/activityconfig/uids/imported' }
  },
  data() {
    return {
      USER_TYPE_VALUES,
      importedUidCacheCount: 0,
      importedUidListCount: 0,
      registerDateRange: [],
      pickerOptions: {
        shortcuts: [
          { text: '最近一周', onClick: picker => picker.$emit('pick', [new Date(Date.now() - 7 * 864e5), new Date()]) },
          { text: '最近一个月', onClick: picker => picker.$emit('pick', [new Date(Date.now() - 30 * 864e5), new Date()]) }
        ]
      }
    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    effectiveOptions() {
      const base = Array.isArray(this.userTypeOptions) && this.userTypeOptions.length > 0
        ? this.userTypeOptions
        : DEFAULT_USER_TYPE_OPTIONS
      const defaults = DEFAULT_USER_TYPE_OPTIONS.reduce((m, o) => ({ ...m, [o.value]: o }), {})
      return base
        .filter(o => this.enabledUserTypes.includes(o.value))
        .map(o => ({ ...defaults[o.value], ...o }))
    },
    filterCfg() {
      return this.config[USER_TYPE_VALUES.FILTER]
    },
    tagCfg() {
      return this.config[USER_TYPE_VALUES.TAG]
    }
  },
  watch: {
    'filterCfg.registerTimeRange': {
      immediate: true,
      handler(rtr) {
        this.registerDateRange = rtr && rtr.min && rtr.max ? [rtr.min * 1000, rtr.max * 1000] : []
      }
    },
    activityCfgId: {
      immediate: true,
      handler(val) {
        if (val > 0) {
          this.getImportedUidCacheCount()
        } else {
          this.importedUidCacheCount = 0
          this.importedUidListCount = 0
        }
      }
    }
  },
  methods: {
    isType(type) {
      return this.config.userType === type
    },
    emitChange() {
      this.$emit('change')
    },
    selectType(type) {
      if (this.config.userType === type) return
      this.config.userType = type
      this.emitChange()
      if (type === USER_TYPE_VALUES.IMPORT) {
        this.$nextTick(this.refreshImportedUserList)
      }
    },
    onTagsChange(tags) {
      this.$set(this.tagCfg, 'tags', tags)
      this.emitChange()
    },
    onRegisterDateChange(range) {
      const min = range ? Math.floor(range[0] / 1000) : 0
      const max = range ? Math.floor(new Date(range[1]).setHours(23, 59, 59, 0) / 1000) : 0
      this.$set(this.filterCfg, 'registerTimeRange', { min, max })
      this.emitChange()
    },
    buildImportRequestData(extraData = {}) {
      const data = { ...this.importRequestData, ActCfgId: this.activityCfgId, ...extraData }
      if (this.includeActivityId && this.activityId > 0) {
        data.ActivityId = this.activityId
      }
      return data
    },
    onImportedUserListLoaded(payload) {
      this.importedUidListCount = Number(payload && payload.total) || 0
    },
    refreshImportedUserList() {
      if (this.showImportUserList && this.$refs.importedUserList) {
        this.$refs.importedUserList.refresh()
      }
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
      if (this.$refs.upload) this.$refs.upload.submit()
    },
    async handleUploadSuccess(response) {
      if (this.$refs.upload) this.$refs.upload.clearFiles()
      if (response.RetCode !== 0) {
        this.$message.error(response.Data)
        return
      }
      const uploadedFilename = response.Data
      this.$set(this.config[USER_TYPE_VALUES.IMPORT], 'importedFilename', uploadedFilename)
      this.emitChange()
      try {
        const importResponse = await request({
          url: this.importUploadApi,
          method: 'post',
          timeout: 90000,
          data: this.buildImportRequestData({ Filename: uploadedFilename })
        })
        if (importResponse.RetCode !== 0) {
          this.$message.error(importResponse.Data)
          return
        }
        const imported = importResponse.Data.imported || 0
        this.$message.success('上传成功，新导入的数量为：' + imported)
        this.importedUidCacheCount = imported
        await this.getImportedUidCacheCount()
        this.refreshImportedUserList()
      } finally {
        if (this.$refs.upload) this.$refs.upload.clearFiles()
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
.ut-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
}
.ut-card {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.ut-card:hover {
  border-color: #409eff;
}
.ut-card.is-active {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 1px #409eff inset;
}
.ut-card__icon {
  font-size: 22px;
  color: #909399;
  margin-right: 10px;
}
.ut-card.is-active .ut-card__icon {
  color: #409eff;
}
.ut-card__main {
  flex: 1;
  min-width: 0;
}
.ut-card__title {
  font-weight: 600;
  color: #303133;
}
.ut-card__desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}
.ut-card__radio {
  margin-left: 6px;
  pointer-events: none;
}
.ut-panel {
  margin-top: 14px;
  padding: 14px;
  background: #fafafa;
  border-radius: 6px;
}
.ut-tip {
  color: #606266;
}
.ut-tip--warn {
  color: #909399;
  font-size: 12px;
}
.ut-import-stat {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ut-import-stat__hint {
  color: #0088ff;
  font-size: 12px;
}
</style>
