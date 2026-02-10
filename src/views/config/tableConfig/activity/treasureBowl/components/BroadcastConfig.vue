<template>
  <div class="broadcast-config">
    <el-form label-width="180px" size="small">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="播报门槛(奖励金额)：">
            <el-input v-model.number="formData.broadcastCfg.threshold" placeholder="请输入" style="max-width: 200px">
              <template slot="prepend">≥</template>
              <template slot="append">₱</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="限制播报条数：">
            <el-input v-model.number="formData.broadcastCfg.maxCount" placeholder="请输入" style="max-width: 200px">
              <template slot="append">条</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BroadcastConfig',
  props: {
    value: { type: Object, required: true }
  },
  computed: {
    formData: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val.broadcastCfg) {
          this.$set(val, 'broadcastCfg', { threshold: 500, maxCount: 50 })
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.broadcast-config {
  width: 100%;
}
</style>
