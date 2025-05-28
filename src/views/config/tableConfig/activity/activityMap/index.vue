<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="活动地图">
          <MapConfig />
        </el-tab-pane>
        <el-tab-pane label="年终大奖侧栏">
          <BonusConfig />
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <DetailsConfig />
        </el-tab-pane>
        <el-tab-pane label="白名单配置">
          <WhiteListConfig />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import MapConfig from './components/MapConfig/index.vue'
import WhiteListConfig from './components/WhiteListConfig/index.vue'
import DetailsConfig from './components/DetailsConfig/index.vue'
import BonusConfig from './components/BonusConfig/index.vue'
export default {
  name: 'ActivityMap',
  components: {
    Publish,
    MapConfig,
    WhiteListConfig,
    DetailsConfig,
    BonusConfig
  },
  data() {
    return {
      // 主键
      subKey: 'activity_map_task_cfg'
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    }
  }
}
</script>
