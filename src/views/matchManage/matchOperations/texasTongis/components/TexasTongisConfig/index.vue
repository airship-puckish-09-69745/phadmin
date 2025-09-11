<template>
  <el-form ref="item" label-width="300px">
    <el-form-item label="支持的SiteId：">
      <SiteSelect v-model="formData.Sites" multiple placeholder="请选择" style="width: 400px" />
    </el-form-item>
    <el-col>
      <el-button type="primary" @click="handleUpdateConfigData">保存配置</el-button>
    </el-col>
  </el-form>
</template>

<script>
import GameTreeSelector from '@/views/config/tableConfig/activity/activityMap/components/DetailsConfig/components/GamesTreeSelector.vue'
import SiteSelect from '@/components/SiteSelect/index.vue'

export default {
  name: 'TexasTongisConfig',
  components: {
    GameTreeSelector,
    SiteSelect
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        OtherGameStatus: false,
        Sites: []
      })
    }
  },
  data() {
    return {
      formData: {
        OtherGameStatus: false,
        Sites: []
      },
    }
  },
  watch: {
    config: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      immediate: true
    }
  },
  methods: {
    handleUpdateConfigData() {
      this.$emit('update', 'TexasTongisConfig', this.formData)
    }
  }
}
</script>
