<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs v-if="configData.Data" type="border-card">
        <el-tab-pane label="活动地图">
          <MapConfig :map-list="configData.Data.MapConfig" :activity-options="activityOptions" @update="handleUpdateMap" @delete="handleDeleteMap" @reload="getConfigData" />
        </el-tab-pane>
        <el-tab-pane label="年终大奖侧栏">
          <BonusConfig />
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <DetailsConfig />
        </el-tab-pane>
        <el-tab-pane label="白名单配置">
          <WhiteListConfig :config="configData.Data.WhiteList" @update="handleUpdateConfigData" />
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
import request from '@/utils/request'
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
      subKey: 'map_task_cfg',
      activityOptions: [
        { name: 'slot背包', id: 5 },
        { name: 'slot任务', id: 6 },
        { name: '摇钱树活动', id: 7 },
        { name: 'Poker乐园', id: 8 },
        { name: 'Banargay', id: 9 },
        { name: '复活节活动', id: 10 },
        { name: '新手任务活动', id: 11 },
        { name: '红包雨活动', id: 13 }
      ],
      configData: {
        Data: {
          BounusConfig: [], // 年终大奖侧栏配置
          MapConfig: [], // 活动地图配置
          DetailsConfig: [], // 活动详情配置
          WhiteList: {} // 白名单配置
        }
      } // 存储配置数据
    }
  },
  mounted() {
    this.getConfigData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    /**
     * 获取配置数据
     */
    async getConfigData() {
      const res = await request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      })

      if (res.RetCode === 0) {
        const data = res.Data
        this.configData = data
        this.configData.Data = JSON.parse(data.Data) || {}
        const Data = this.configData.Data

        // 确保配置数据的结构完整
        if (!Data.BounusConfig) {
          Data.BounusConfig = []
        }
        if (!Data.MapConfig) {
          Data.MapConfig = []
        }
        if (!Data.DetailsConfig) {
          Data.DetailsConfig = []
        }
        if (!Data.WhiteList) {
          Data.WhiteList = {}
        }
      } else {
        this.$message.error('获取配置数据失败: ' + res.RetMsg)
        this.configData.Data = {}
      }
    },
    /**
     * 更新配置数据
     */
    async updateConfigData() {
      const params = {
        ...this.configData
      }
      params.Data = JSON.stringify(this.configData.Data)
      const res = await request({
        url: 'customizeconfig/update',
        method: 'post',
        data: params
      })

      if (res.RetCode === 0) {
        this.$message.success('配置数据更新成功')
      } else {
        this.$message.error('更新配置数据失败: ' + res.RetMsg)
      }

      this.getConfigData()
    },
    /**
     * 子组件更新配置数据时调用
     */
    handleUpdateConfigData(key, newData) {
      const Data = this.configData.Data
      // 更新对应的配置数据
      Data[key] = newData
      this.updateConfigData()
    },
    /**
     * 处理地图配置的更新
     * 如果ID存在则更新，否则添加新的地图配置
     * @param data {Object} 包含地图配置数据
     */
    handleUpdateMap(data) {
      const MapConfig = this.configData.Data.MapConfig
      if (data.ID) {
        // 更新已有的地图配置
        const currentMap = MapConfig.find(item => item.ID === data.ID)
        MapConfig.splice(MapConfig.indexOf(currentMap), 1, { ...currentMap, ...data })
      } else {
        // 添加新的地图配置
        const newId = Date.now().toString() // 使用时间戳作为新ID
        MapConfig.push({ ...data, ID: newId })
      }
      console.log('Updated MapConfig:', MapConfig)

      this.handleUpdateConfigData('MapConfig', MapConfig)
    },
    /**
     * 处理地图配置的删除
     * @param ID {String} 地图配置的ID
     */
    handleDeleteMap(ID) {
      const MapConfig = this.configData.Data.MapConfig
      const index = MapConfig.findIndex(item => item.ID === ID)
      if (index !== -1) {
        MapConfig.splice(index, 1)
        this.handleUpdateConfigData('MapConfig', MapConfig)
      } else {
        this.$message.error('地图配置未找到')
      }
    }
  }
}
</script>
