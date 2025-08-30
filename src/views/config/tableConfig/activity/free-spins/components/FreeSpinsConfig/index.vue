<template>
  <el-form ref="item" label-width="300px">
    <el-form-item label="活动开关：">
      <el-switch v-model="formData.Status" :active-value="true" :inactive-value="false" />
      <el-tooltip  class="item" effect="dark" content="仅前端用" placement="right-start">
        <i class="el-icon-info" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="Other game开关：">
      <el-switch v-model="formData.OtherGameStatus" :active-value="true" :inactive-value="false" />
    </el-form-item>
    <el-form-item label="支持的SiteId：">
      <SiteSelect v-model="formData.Sites" multiple placeholder="请选择" style="width: 400px" />
    </el-form-item>
    <el-form-item label="Other game支持的游戏id">
      <GameTreeSelector :selected-games-id="formData.OtherGames" @change="handleGamesChange" />
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
  name: 'FreeSpinsConfig',
  components: {
    GameTreeSelector,
    SiteSelect
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        Status: false,
        PersonQuotaLimit: 0,
        PersonNumberLimit: 0,
        OtherGameStatus: false,
        Sites: [],
        OtherGames: []
      })
    }
  },
  data() {
    return {
      formData: {
        Status: false,
        PersonQuotaLimit: 0,
        PersonNumberLimit: 0,
        OtherGameStatus: false,
        Sites: [],
        OtherGames: []
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
      // 将限额转换为数字类型
      this.formData.PersonQuotaLimit = Number(this.formData.PersonQuotaLimit)
      this.formData.PersonNumberLimit = Number(this.formData.PersonNumberLimit)
      this.$emit('update', 'FreeSpinsConfig', this.formData)
    },
    handleGamesChange(games) {
      this.formData.OtherGames = games.map(item => item.id)
      // console.log(games)
    }
  }
}
</script>
