<template>
  <div class="whitelist-config">
    <!-- isOpen 开关 -->
    <el-form-item v-if="hasFeature(5)" label="白名单开关：">
      <el-switch v-model="localValue.isOpen" :active-value="true" :inactive-value="false" active-text="开" inactive-text="关"/>
    </el-form-item>

    <!-- AppId 白名单 -->
    <el-form-item v-if="hasFeature(1)" label="AppId白名单：">
      <AppIdSelect v-model="localValue.appIdList" multiple style="width: 100%; max-width: 400px"/>
    </el-form-item>

    <!-- SiteId 白名单 -->
    <el-form-item v-if="hasFeature(2)" label="SiteId白名单：">
      <SiteSelect v-model="localValue.siteIdList" multiple placeholder="请选择站点" style="width: 100%; max-width: 400px"/>
    </el-form-item>

    <!-- UID 列表 -->
    <el-form-item v-if="hasFeature(4)" label="UID白名单：">
      <div style="max-width: 500px">
        <el-input
          v-model="uidInputText"
          type="textarea"
          :rows="3"
          placeholder="输入UID，多个用逗号或换行分隔"
          @blur="parseUidInput"
        />
        <div style="margin-top: 4px; color: #909399; font-size: 12px">
          已输入 {{ localValue.uidList.length }} 个UID
        </div>
      </div>
    </el-form-item>

    <!-- AB 测试 -->
    <template v-if="hasFeature(3)">
      <el-form-item label="AB测试开关：">
        <el-switch v-model="localValue.abTest.switch" :active-value="true" :inactive-value="false" active-text="开" inactive-text="关"/>
      </el-form-item>
      <el-form-item v-if="localValue.abTest.switch" label="B分组比例：">
        <el-input v-model.number="localValue.abTest.bPercent" placeholder="0~100" style="max-width: 200px">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import SiteSelect from '@/components/SiteSelect/index.vue'
import AppIdSelect from '@/components/AppIdSelect/index.vue'

/**
 * 白名单配置通用组件
 *
 * features 数值含义（可组合传入数组）：
 *   1 = AppId白名单
 *   2 = SiteId白名单
 *   3 = AB测试
 *   4 = UID列表
 *   5 = isOpen开关
 *
 * 数据结构：
 * {
 *   appIdList: [],
 *   siteIdList: [],
 *   abTest: { switch: false, bPercent: 0 },
 *   uidList: [],
 *   isOpen: false
 * }
 */
export default {
  name: 'WhitelistConfig',
  components: { SiteSelect, AppIdSelect },
  props: {
    value: {
      type: Object,
      default: () => ({
        appIdList: [],
        siteIdList: [],
        abTest: { switch: false, bPercent: 0 },
        uidList: [],
        isOpen: false
      })
    },
    // 控制展示哪些功能，如 [2, 3] 展示 SiteId白名单 + AB测试
    features: {
      type: Array,
      default: () => [2, 3]
    }
  },
  data() {
    return {
      uidInputText: ''
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'value.uidList': {
      immediate: true,
      handler(val) {
        this.uidInputText = (val || []).join('\n')
      }
    }
  },
  methods: {
    hasFeature(code) {
      return this.features.includes(code)
    },
    parseUidInput() {
      const raw = this.uidInputText || ''
      const uids = raw
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => Number(s))
        .filter(n => !isNaN(n) && n > 0)
      const updated = Object.assign({}, this.value, { uidList: uids })
      this.$emit('input', updated)
    }
  }
}
</script>

<style scoped>
.whitelist-config {
  width: 100%;
}
</style>
