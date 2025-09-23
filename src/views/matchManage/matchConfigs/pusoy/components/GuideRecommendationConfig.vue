<template>
  <fieldset>
    <legend>引导推荐</legend>
    <el-form-item label="游戏推荐方案：" :required="true">
      <el-select 
        v-model="editForm.data.associateKey" 
        placeholder="请选择" 
        size="mini"
        @change="handleAssociateKeyChange"
      >
        <el-option
          v-for="item in guideShowCfgs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="checkMatchGuidesDisable(editForm.appInfo[0].appId)"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="赛事分类：" :required="true">
      <el-select 
        v-model="editForm.signExtra.matchEvents" 
        placeholder="请选择" 
        size="mini"
        @change="handleMatchEventsChange"
      >
        <el-option
          v-for="item in matchListTagOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </fieldset>
</template>

<script>
export default {
  name: 'GuideRecommendationConfig',
  props: {
    editForm: {
      type: Object,
      required: true
    },
    guideShowCfgs: {
      type: Array,
      default: () => []
    },
    matchListTagOptions: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 检查比赛引导是否禁用
    checkMatchGuidesDisable(appId) {
      if (!appId) return true
      for (let i = 0; i < this.guideShowCfgs.length; i++) {
        if (this.guideShowCfgs[i].appId > 0 && this.guideShowCfgs[i].appId === appId) {
          return false
        }
      }
      return true
    },

    // 處理推薦方案改變
    handleAssociateKeyChange(value) {
      this.$emit('associate-key-change', value)
    },

    // 處理賽事分類改變
    handleMatchEventsChange(value) {
      this.$emit('match-events-change', value)
    }
  }
}
</script>

<style scoped>
fieldset {
  margin: 20px auto;
  max-height: max-content;
  min-width: inherit;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-select {
  width: 200px;
}
</style>
