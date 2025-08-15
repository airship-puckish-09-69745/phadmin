<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <el-tabs v-if="configData.Data" type="border-card">
        <el-tab-pane label="比赛列表Tag">
          <MatchTagConfig :tag-config="configData.Data.MatchTagConfig"  @update="handleUpdateTag" @delete="handleDeleteTag" @reload="getConfigData" />
        </el-tab-pane>
        <el-tab-pane label="免费引导付费开关">
          <MatchFreeGuideConfig :config="configData.Data.MatchFreeGuideConfig" @update="handleUpdateConfigData" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import MatchTagConfig from './components/MatchTagConfig/index.vue'
import request from '@/utils/request'
import MatchFreeGuideConfig from "@/views/matchManage/matchOperations/matchOther/components/WhiteListConfig/index.vue";
export default {
  name: 'MatchOther',
  components: {
    MatchFreeGuideConfig,
    Publish,
    MatchTagConfig,
  },
  data() {
    return {
      // 主键
      subKey: 'match_other_config',
      configData: {
        Data: {
          MatchTagConfig: [], //比赛页签
          MatchFreeGuideConfig: {} // 比赛免费付费引导开关
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
        if (!Data.MatchTagConfig) {
          Data.MatchTagConfig = []
        }
        if (!Data.MatchFreeGuideConfig) {
          Data.MatchFreeGuideConfig = {}
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
     * 处理比赛Tag配置的更新
     * 如果ID存在则更新，否则添加新的Tag配置
     * @param data {Object} 包含Tag配置数据
     */
    handleUpdateTag(data) {
      const MatchTagConfig = this.configData.Data.MatchTagConfig
      if (data.ID) {
        const currentTag = MatchTagConfig.find(item => item.ID === data.ID)
        MatchTagConfig.splice(MatchTagConfig.indexOf(currentTag), 1, { ...currentTag, ...data })
      } else {
        // 添加新的配置
        const newId = Date.now().toString() // 使用时间戳作为新ID
        MatchTagConfig.push({ ...data, ID: newId })
      }
      this.handleUpdateConfigData('MatchTagConfig', MatchTagConfig)
    },


    handleDeleteTag(ID) {
      const MatchTagConfig = this.configData.Data.MatchTagConfig
      const index = MatchTagConfig.findIndex(item => item.ID === ID)
      if (index !== -1) {
        MatchTagConfig.splice(index, 1)
        this.handleUpdateConfigData('MatchTagConfig', MatchTagConfig)
      } else {
        this.$message.error('Tag配置未找到')
      }
    }
  }
}
</script>
