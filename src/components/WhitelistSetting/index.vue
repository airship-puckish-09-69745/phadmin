<template>
  <div class="whitelist-setting">
    <!-- tag 模式：摘要标签 + 编辑入口 -->
    <div v-if="mode === 'tag'" class="whitelist-setting__tags">
      <span class="whitelist-setting__label">{{ tagLabel }}</span>
      <el-tag
        v-for="(text, i) in summaryTexts"
        :key="i"
        size="small"
        effect="plain"
        class="whitelist-setting__tag"
      >{{ text }}</el-tag>
      <el-tag v-if="summaryTexts.length === 0" size="small" type="info" effect="plain">未配置</el-tag>
      <el-button v-if="!disabled" type="text" size="mini" icon="el-icon-edit" @click="openDialog">配置</el-button>
    </div>

    <!-- 页面嵌入模式 -->
    <el-form v-if="mode === 'inline'" label-width="130px" :disabled="disabled">
      <WhitelistFields :form="localValue" :types="enabledTypes" @change="emitInput" />
    </el-form>

    <!-- tag / dialog 模式的弹窗 -->
    <el-dialog
      v-if="mode !== 'inline'"
      :title="title"
      :visible.sync="dialogVisible"
      width="640px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form label-width="130px">
        <WhitelistFields :form="draft" :types="enabledTypes" />
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WhitelistFields from './WhitelistFields.vue'
import {
  WHITELIST_TYPE,
  ALL_WHITELIST_TYPES,
  defaultWhitelistValue,
  normalizeWhitelist
} from './config'

/**
 * 白名单配置组件，支持三种使用场景：
 *  - mode="inline"：嵌入页面直接编辑
 *  - mode="tag"：展示摘要 tag，点击“配置”弹窗编辑
 *  - mode="dialog"：由父组件通过 :visible.sync 控制弹窗
 *
 * v-model 数据格式：
 * { siteIdList: [], abTest: { switch: false, ratio: 0 }, uidList: [] }
 *
 * types：1=SiteId白名单 2=白名单用户 3=A/B测试开关和B分组比例
 * （A/B测试开关关闭时，B分组比例强制为0且不展示）
 */
export default {
  name: 'WhitelistSetting',
  components: { WhitelistFields },
  props: {
    value: { type: Object, default: () => defaultWhitelistValue() },
    mode: {
      type: String,
      default: 'inline',
      validator: v => ['inline', 'tag', 'dialog'].includes(v)
    },
    types: { type: Array, default: () => ALL_WHITELIST_TYPES },
    visible: { type: Boolean, default: false },
    title: { type: String, default: '白名单配置' },
    tagLabel: { type: String, default: '白名单配置：' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      innerVisible: false,
      draft: normalizeWhitelist(this.value)
    }
  },
  computed: {
    enabledTypes() {
      const list = (this.types || []).map(Number).filter(t => ALL_WHITELIST_TYPES.includes(t))
      return list.length ? list : ALL_WHITELIST_TYPES
    },
    localValue() {
      return normalizeWhitelist(this.value)
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
    summaryTexts() {
      const v = this.localValue
      const texts = []
      if (this.enabledTypes.includes(WHITELIST_TYPE.SITE_ID) && v.siteIdList.length) {
        texts.push(`SiteId白名单：${v.siteIdList.length}个`)
      }
      if (this.enabledTypes.includes(WHITELIST_TYPE.USER) && v.uidList.length) {
        texts.push(`白名单用户：${v.uidList.length}个`)
      }
      if (this.enabledTypes.includes(WHITELIST_TYPE.AB_TEST)) {
        texts.push(v.abTest.switch ? `A/B测试：开（B组${v.abTest.ratio}%）` : 'A/B测试：关')
      }
      return texts
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) this.draft = normalizeWhitelist(this.value)
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    emitInput() {
      this.$emit('input', normalizeWhitelist(this.localValue))
    },
    handleConfirm() {
      const result = normalizeWhitelist(this.draft)
      this.$emit('input', result)
      this.$emit('change', result)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.whitelist-setting {
  width: 100%;
}
.whitelist-setting__label {
  color: #606266;
  margin-right: 8px;
}
.whitelist-setting__tag {
  margin-right: 6px;
}
</style>
