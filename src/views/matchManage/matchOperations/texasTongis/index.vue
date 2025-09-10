<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <!-- <div style="margin-top: 16px">
        启用开关：<el-switch v-model="configData.Data.Status" active-color="#13ce66" @change="onUpdateStatus" />
      </div> -->
      <br>
      <el-tabs v-if="configData.Data" type="border-card">
        <el-tab-pane label="Texas Tongits配置">
          <TexasTongisConfig :config="configData.Data.TexasTongisConfig" @update="handleUpdateConfigData" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import TexasTongisConfig from './components/TexasTongisConfig/index.vue'
export default {
  name: 'TexasTongis',
  components: {
    Publish,
    TexasTongisConfig
  },
  data() {
    return {
      // 主键
      subKey: 'texas_tongis_cfg',
      configData: {
        Data: {
          // Status: false,
          TexasTongisConfig: {
            // "Status": false,
            // "PersonQuotaLimit": 0, 每日单人道具总额度发放限制
            // "PersonNumberLimit": 0, 每日单人道具总数量发放限制
            // "OtherGameStatus": false,
            // "Sites": ["Dev"],
            // "OtherGames": [1]
          },
        }
      }
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
      // this.$nextTick(() => {
      //   this.updateConfigData()
      // })
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
        // if (!Data.Status) {
        //   Data.Status = false
        // }
        if (!Data.TexasTongisConfig) {
          Data.TexasTongisConfig = {}
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
    }
  }
}
</script>
