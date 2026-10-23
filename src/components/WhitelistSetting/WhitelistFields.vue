<template>
  <div>
    <el-form-item v-if="has(WHITELIST_TYPE.SITE_ID)" label="SiteId白名单：">
      <SiteSelect
        :value="form.siteIdList"
        multiple
        placeholder="请选择站点"
        style="width: 100%; max-width: 400px"
        @input="onSiteChange"
      />
    </el-form-item>

    <el-form-item v-if="has(WHITELIST_TYPE.USER)" label="白名单用户：">
      <div style="max-width: 500px">
        <el-input
          v-model="uidText"
          type="textarea"
          :rows="4"
          placeholder="输入用户ID，多个用逗号、空格或换行分隔"
          @blur="onUidBlur"
        />
        <div class="hint">已输入 {{ parseUids(uidText).length }} 个用户ID</div>
      </div>
    </el-form-item>

    <template v-if="has(WHITELIST_TYPE.AB_TEST)">
      <el-form-item label="A/B测试开关：">
        <el-switch
          :value="form.abTest.switch"
          active-text="开启"
          inactive-text="关闭"
          @change="onSwitchChange"
        />
      </el-form-item>
      <el-form-item v-if="form.abTest.switch" label="B分组比例：">
        <el-input-number
          :value="form.abTest.ratio"
          :min="0"
          :max="100"
          :precision="0"
          controls-position="right"
          @change="onRatioChange"
        />
        <span style="margin-left: 8px">%</span>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import SiteSelect from '@/components/SiteSelect/index.vue'
import { WHITELIST_TYPE } from './config'

export default {
  name: 'WhitelistFields',
  components: { SiteSelect },
  props: {
    form: { type: Object, required: true },
    types: { type: Array, required: true }
  },
  data() {
    return {
      WHITELIST_TYPE,
      uidText: (this.form.uidList || []).join('\n')
    }
  },
  watch: {
    'form.uidList'(val) {
      if (this.parseUids(this.uidText).join() !== (val || []).join()) {
        this.uidText = (val || []).join('\n')
      }
    }
  },
  methods: {
    has(type) {
      return this.types.includes(type)
    },
    parseUids(text) {
      return (text || '')
        .split(/[,，\s]+/)
        .map(s => Number(s.trim()))
        .filter(n => Number.isInteger(n) && n > 0)
    },
    onSiteChange(val) {
      this.$set(this.form, 'siteIdList', val)
      this.$emit('change')
    },
    onUidBlur() {
      this.$set(this.form, 'uidList', Array.from(new Set(this.parseUids(this.uidText))))
      this.uidText = this.form.uidList.join('\n')
      this.$emit('change')
    },
    onSwitchChange(on) {
      this.$set(this.form.abTest, 'switch', on)
      // 开关关闭时 B 分组比例强制为 0
      if (!on) this.$set(this.form.abTest, 'ratio', 0)
      this.$emit('change')
    },
    onRatioChange(val) {
      this.$set(this.form.abTest, 'ratio', val || 0)
      this.$emit('change')
    }
  }
}
</script>

<style scoped>
.hint {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}
</style>
