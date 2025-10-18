<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <el-tabs v-if="configData.Data" type="border-card">
        <el-tab-pane label="比赛列表Tag">
          <MatchTagConfig
            :tag-config="configData.Data.MatchTagConfig"
            :pusoy-white-list-config="configData.Data.MatchPusoyWhiteListConfig"
            @update="handleUpdateTag"
            @delete="handleDeleteTag"
            @reload="getConfigData"
            @save-uid-list="saveUidList" />
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
          MatchFreeGuideConfig: {}, // 比赛免费付费引导开关
          MatchPusoyWhiteListConfig: { //pusoy 页签白名单
            switch: false,
            uidList: []
          },
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
      try {
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

          // 確保數據結構完整性
          this.ensureDataStructure()
        } else {
          this.$message.error('获取配置数据失败: ' + res.RetMsg)
          this.ensureDataStructure()
        }
      } catch (error) {
        console.error('獲取配置數據時發生錯誤:', error)
        this.$message.error('獲取配置數據失敗: ' + error.message)
        this.ensureDataStructure()
      }
    },

    /**
     * 確保數據結構完整性
     */
    ensureDataStructure() {
      const Data = this.configData.Data

      // 確保 MatchTagConfig 是數組
      if (!Array.isArray(Data.MatchTagConfig)) {
        Data.MatchTagConfig = []
      }

      // 確保 MatchFreeGuideConfig 是對象
      if (!Data.MatchFreeGuideConfig || typeof Data.MatchFreeGuideConfig !== 'object') {
        Data.MatchFreeGuideConfig = {}
      }

      // 確保 MatchPusoyWhiteListConfig 是正確的對象結構
      if (Array.isArray(Data.MatchPusoyWhiteListConfig)) {
        // 如果是數組格式（舊格式），轉換為對象格式
        console.log('檢測到舊的數組格式，正在轉換:', Data.MatchPusoyWhiteListConfig)
        Data.MatchPusoyWhiteListConfig = {
          switch: Data.MatchPusoyWhiteListConfig.length > 0,
          uidList: Data.MatchPusoyWhiteListConfig
        }
      } else if (!Data.MatchPusoyWhiteListConfig || typeof Data.MatchPusoyWhiteListConfig !== 'object') {
        // 如果不存在或不是對象，創建默認結構
        Data.MatchPusoyWhiteListConfig = {
          switch: false,
          uidList: []
        }
      } else {
        // 如果存在但結構不完整，補充缺失的屬性
        if (typeof Data.MatchPusoyWhiteListConfig.switch !== 'boolean') {
          Data.MatchPusoyWhiteListConfig.switch = false
        }
        if (!Array.isArray(Data.MatchPusoyWhiteListConfig.uidList)) {
          Data.MatchPusoyWhiteListConfig.uidList = []
        }
      }

      console.log('數據結構已確保:', Data)
    },
    /**
     * 更新配置数据
     */
    async updateConfigData() {
      try {
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
      } catch (error) {
        this.$message.error('更新配置数据失败: ' + error.message)
      } finally {
        // 無論成功失敗都重新加載數據以保持同步
        this.getConfigData()
      }
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
    },

    /**
     * 處理 Pusoy 頁簽白名單 UID 列表的保存
     * @param config {Object|String} 配置對象或UID字符串
     */
    saveUidList(config) {
      //console.log('收到白名單配置:', config)
      try {
        let finalConfig = {
          switch: false,
          uidList: []
        }

        // 處理新的配置結構
        if (config && typeof config === 'object' && config.hasOwnProperty('switch')) {
          // 新格式：包含開關和UID列表的對象
          finalConfig.switch = config.switch

          if (config.switch && config.uidList) {
            const uidArray = config.uidList.split(',').map(uid => {
              const trimmedUid = uid.trim()
              if (!trimmedUid) return null // 跳過空字符串

              const numUid = parseInt(trimmedUid, 10)
              if (isNaN(numUid)) {
                throw new Error(`無效的 UID: ${trimmedUid}`)
              }
              return numUid
            }).filter(uid => uid !== null && uid > 0)

            finalConfig.uidList = uidArray
          }
        } else if (typeof config === 'string') {
          // 兼容舊格式：直接傳遞字符串
          const uidArray = config.split(',').map(uid => {
            const trimmedUid = uid.trim()
            if (!trimmedUid) return null

            const numUid = parseInt(trimmedUid, 10)
            if (isNaN(numUid)) {
              throw new Error(`無效的 UID: ${trimmedUid}`)
            }
            return numUid
          }).filter(uid => uid !== null && uid > 0)

          finalConfig.switch = uidArray.length > 0
          finalConfig.uidList = uidArray
        }

        // 更新配置數據
        this.configData.Data.MatchPusoyWhiteListConfig = finalConfig
        //console.log('更新後的配置:', this.configData.Data.MatchPusoyWhiteListConfig)
        // 保存到服務器
        this.updateConfigData()
        //console.log('Pusoy 頁簽白名單已保存:', finalConfig)
      } catch (error) {
        //console.error('保存 UID 列表時發生錯誤:', error)
        this.$message.error('保存 UID 列表失敗: ' + error.message)
      }
    }
  }
}
</script>
