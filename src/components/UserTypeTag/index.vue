<template>
  <div class="user-type-tag">
    <!-- tag 模式：摘要标签 + 编辑入口 -->
    <div v-if="mode === 'tag'" class="user-type-tag__tags">
      <span class="user-type-tag__label">{{ tagLabel }}</span>
      <el-tag size="small" effect="plain" type="success" class="user-type-tag__tag">{{ typeLabel }}</el-tag>
      <el-tag
        v-for="(text, i) in detailTexts"
        :key="i"
        size="small"
        effect="plain"
        type="info"
        class="user-type-tag__tag"
      >{{ text }}</el-tag>
      <el-button v-if="!disabled" type="text" size="mini" icon="el-icon-edit" @click="openDialog">配置</el-button>
    </div>

    <!-- 页面嵌入模式 -->
    <UserTypeBody v-if="mode === 'inline'" v-bind="bodyProps" :config="localConfig" @change="emitInput" />

    <!-- tag / dialog 模式的弹窗 -->
    <el-dialog
      v-if="mode !== 'inline'"
      :title="title"
      :visible.sync="dialogVisible"
      width="860px"
      append-to-body
      :close-on-click-modal="false"
    >
      <UserTypeBody v-bind="bodyProps" :config="draft" />
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserTypeBody from './UserTypeBody.vue'
import {
  DEFAULT_ENABLED_USER_TYPES,
  DEFAULT_USER_TYPE_OPTIONS,
  USER_TYPE_VALUES,
  defaultUserTypeConfig,
  normalizeUserTypeConfig,
  validateUserTypeConfig
} from './config'

/**
 * 参与活动用户类型组件，支持三种使用场景：
 *  - mode="inline"：嵌入页面直接编辑
 *  - mode="tag"：展示摘要 tag，点击“配置”弹窗编辑
 *  - mode="dialog"：由父组件通过 :visible.sync 控制弹窗
 *
 * v-model 数据格式（每种类型一个字段，便于扩展）：
 * { userType: 2, 1: {}, 2: {}, 3: { importedFilename }, 4: { registerTimeRange, betTimesRange }, 5: { tags: [{ tagType, tagGid, tagId, tagValues }] } }
 * userType：1=新用户 2=所有用户（默认） 3=导入用户 4=筛选用户 5=标签用户
 */
export default {
  name: 'UserTypeTag',
  components: { UserTypeBody },
  props: {
    value: { type: Object, default: () => defaultUserTypeConfig() },
    mode: {
      type: String,
      default: 'tag',
      validator: v => ['inline', 'tag', 'dialog'].includes(v)
    },
    visible: { type: Boolean, default: false },
    title: { type: String, default: '参与活动用户类型' },
    tagLabel: { type: String, default: '参与活动用户类型：' },
    disabled: { type: Boolean, default: false },
    // 允许选择的用户类型，默认全部
    enabledUserTypes: { type: Array, default: () => DEFAULT_ENABLED_USER_TYPES },
    // 自定义类型选项（label/desc/icon 可覆盖）
    userTypeOptions: { type: Array, default: null },
    // 限定可选标签类型（tagType），为空则不限制
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
      innerVisible: false,
      draft: defaultUserTypeConfig()
    }
  },
  computed: {
    normalizedEnabledTypes() {
      const list = (this.enabledUserTypes || []).map(Number).filter(t => DEFAULT_ENABLED_USER_TYPES.includes(t))
      return list.length ? list : DEFAULT_ENABLED_USER_TYPES
    },
    defaultType() {
      return this.normalizedEnabledTypes.includes(USER_TYPE_VALUES.ALL) ? USER_TYPE_VALUES.ALL : this.normalizedEnabledTypes[0]
    },
    localConfig() {
      return this.normalize(this.value)
    },
    bodyProps() {
      return {
        enabledUserTypes: this.normalizedEnabledTypes,
        userTypeOptions: this.userTypeOptions,
        tagTypes: this.tagTypes,
        activityCfgId: this.activityCfgId,
        activityId: this.activityId,
        showImportUserList: this.showImportUserList,
        includeActivityId: this.includeActivityId,
        importRequestData: this.importRequestData,
        importTotalApi: this.importTotalApi,
        importUploadApi: this.importUploadApi,
        importDeleteApi: this.importDeleteApi,
        importListApi: this.importListApi
      }
    },
    dialogVisible: {
      get() {
        return this.mode === 'dialog' ? this.visible : this.innerVisible
      },
      set(val) {
        if (this.mode === 'dialog') this.$emit('update:visible', val)
        else this.innerVisible = val
      }
    },
    typeLabel() {
      const type = this.localConfig.userType
      const custom = (this.userTypeOptions || []).find(o => o.value === type)
      const def = DEFAULT_USER_TYPE_OPTIONS.find(o => o.value === type)
      return (custom && custom.label) || (def && def.label) || ''
    },
    detailTexts() {
      const cfg = this.localConfig
      if (cfg.userType === USER_TYPE_VALUES.IMPORT) {
        return cfg[USER_TYPE_VALUES.IMPORT].importedFilename ? ['已上传导入文件'] : []
      }
      if (cfg.userType === USER_TYPE_VALUES.FILTER) {
        const { registerTimeRange: r, betTimesRange: b } = cfg[USER_TYPE_VALUES.FILTER]
        const texts = []
        if (r.min && r.max) texts.push(`注册 ${this.formatDate(r.min)} ~ ${this.formatDate(r.max)}`)
        texts.push(`投注次数 ${b.min}~${b.max}`)
        return texts
      }
      if (cfg.userType === USER_TYPE_VALUES.TAG) {
        return [`已选 ${cfg[USER_TYPE_VALUES.TAG].tags.length} 个标签`]
      }
      return []
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) this.draft = this.normalize(this.value)
    },
    // 默认值或不可用类型回落到允许的类型，并补齐缺失字段
    value: {
      immediate: true,
      handler(val) {
        const normalized = this.normalize(val)
        if (JSON.stringify(normalized) !== JSON.stringify(val)) this.$emit('input', normalized)
      }
    }
  },
  methods: {
    normalize(raw) {
      const cfg = normalizeUserTypeConfig(raw, this.defaultType)
      if (!this.normalizedEnabledTypes.includes(cfg.userType)) cfg.userType = this.defaultType
      return cfg
    },
    formatDate(sec) {
      const d = new Date(sec * 1000)
      const p = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
    },
    openDialog() {
      this.dialogVisible = true
    },
    emitInput() {
      this.$emit('input', this.normalize(this.localConfig))
    },
    handleConfirm() {
      const msg = validateUserTypeConfig(this.draft)
      if (msg) {
        this.$message.error(msg)
        return
      }
      const result = this.normalize(this.draft)
      this.$emit('input', result)
      this.$emit('change', result)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.user-type-tag {
  width: 100%;
}
.user-type-tag__label {
  color: #606266;
  margin-right: 8px;
}
.user-type-tag__tag {
  margin-right: 6px;
}
</style>
