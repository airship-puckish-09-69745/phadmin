<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <div style="margin-top: 16px">
        启用开关：<el-switch v-model="configData.Data.Status" active-color="#13ce66" @change="onUpdateStatus" />
        大奖图标和发放开关：<el-switch v-model="configData.Data.IsOpenReward" active-color="#13ce66" @change="onUpdateBonusStatus" />
      </div>
      <br>
      <el-tabs v-if="configData.Data" type="border-card">
        <el-tab-pane label="活动地图">
          <MapConfig :map-list="configData.Data.MapConfig" :activity-options="activityOptions" @update="handleUpdateMap" @delete="handleDeleteMap" @reload="getConfigData" />
        </el-tab-pane>
        <el-tab-pane label="年终大奖侧栏">
          <BonusConfig :update-data="configData.Data.BounusConfig" @update="handleUpdateBonus" @delete="handleDeleteBonus" @reload="getConfigData" />
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <DetailsConfig :details-list="configData.Data.DetailsConfig" :activity-options="activityOptions" @update="handleUpdateDetails" @delete="handleDeleteDetails" @reload="getConfigData" />
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
import {getCustomize, updateCustomize} from "@/api/custome_configV2";
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
        { name: '红包雨活动', id: 13 },
        { name: '七日留存活动', id: 17 },
        { name: '万圣节活动',id: 18 },
        { name: '竖版排行榜活动', id: 19 },
        { name: 'Poker排行榜活动', id: 20 },
      ],
      configData: {
        Data: {
          Status: false,
          BounusConfig: {}, // 年终大奖侧栏配置
          MapConfig: [], // 活动地图配置
          DetailsConfig: [], // 活动详情配置
          WhiteList: {}, // 白名单配置
          IsOpenReward: true // 是否开启大奖图标和发放开关
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
    onUpdateStatus() {
      this.$nextTick(() => {
        this.updateConfigData()
      })
    },
    /**
     * 获取配置数据
     */
    async getConfigData() {
      const res = await getCustomize(this.subKey)

      if (res.RetCode === 0) {
        const data = res.Data
        this.configData = data
        this.configData.Data = JSON.parse(data.Data) || {}
        const Data = this.configData.Data

        // 确保配置数据的结构完整
        // 根据ID进行排序
        if (!Data.Status) {
          Data.Status = false
        }
        if (!Data.BounusConfig) {
          Data.BounusConfig = {}
        }
        if (!Data.MapConfig) {
          Data.MapConfig = []
        } else {
          Data.MapConfig.sort((a, b) => b.ID - a.ID)
        }
        if (!Data.DetailsConfig) {
          Data.DetailsConfig = []
        } else {
          Data.DetailsConfig.sort((a, b) => b.ID - a.ID)
        }
        if (!Data.WhiteList) {
          Data.WhiteList = {}
        }
        if (!Data.IsOpenReward) {
          Data.IsOpenReward = false
        }
      } else {
        this.$message.error('获取配置数据失败: ' + res.RetMsg)
        this.configData.Data = {}
      }
      console.log('conf: ', this.configData.Data)
    },
    /**
     * 更新配置数据
     */
    async updateConfigData() {
      const params = {
        ...this.configData
      }
      params.Data = JSON.stringify(this.configData.Data)
      const res = await updateCustomize(params)

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
     * 处理年终大奖侧栏配置更新
     * @param data 更新的配置数据
     */
    handleUpdateBonus(data) {
      this.handleUpdateConfigData('BounusConfig', data)
    },
    /**
     * 处理年终大奖侧栏配置删除
     * @param id 要删除的配置ID
     */
    async handleDeleteBonus(id) {
      try {
        await this.$confirm(`确定删除ID为 ${id} 的配置吗？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.configData.Data.BounusConfig = this.configData.Data.BounusConfig.filter(item => item.ID !== id)
        this.$message.success('删除成功')
        this.$emit('delete', id)
      } catch (error) {
        this.$message.info('已取消删除')
      }
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
    /**
     * 处理活动详情配置更新
     * @param data 包含配置数据的对象
     */
    handleUpdateDetails(data) {
      const DetailsConfig = this.configData.Data.DetailsConfig
      if (data.ID) {
        const current = DetailsConfig.find(item => item.ID === data.ID)
        DetailsConfig.splice(DetailsConfig.indexOf(current), 1, { ...current, ...data })
      } else {
        const newId = Date.now().toString()
        DetailsConfig.push({ ...data, ID: newId })
      }
      this.handleUpdateConfigData('DetailsConfig', DetailsConfig)
    },

    /**
     * 处理活动详情配置删除
     * @param ID 包含配置数据的对象
     */
    async handleDeleteDetails(ID) {
      const DetailsConfig = this.configData.Data.DetailsConfig
      const index = DetailsConfig.findIndex(item => item.ID === ID)
      if (index !== -1) {
        DetailsConfig.splice(index, 1)
        this.handleUpdateConfigData('DetailsConfig', DetailsConfig)
      } else {
        this.$message.error('活动详情配置未找到')
      }
    },

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
