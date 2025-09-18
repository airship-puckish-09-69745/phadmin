<template>
  <el-form ref="item" label-width="300px">
    <el-form-item label="支持的AppId：">
      <el-select v-model="formData.AppIdList" multiple placeholder="请选择" style="width: 400px">
        <el-option
          v-for="item in APPID_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
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
import {APPID_OPTIONS} from "@/utils/options";

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
        Sites: [],
        AppIdList: []
      })
    }
  },
  data() {
    return {
      APPID_OPTIONS,
      formData: {
        OtherGameStatus: false,
        Sites: [],
        AppIdList: []
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
