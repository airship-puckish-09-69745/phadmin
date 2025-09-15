<template>
  <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
    <legend>APP信息</legend>
    <el-table
      :data="appInfo"
      border
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'35px'}"
    >
      <el-table-column
        prop="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="appId"
        label="AppID"
        width="450"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.appId" placeholder="请选择" size="mini" @change="handleAppIdChange(scope.$index, scope.row.appId)">
            <el-option
              v-for="item in APPID_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="channelId"
        label="渠道ID"
        width="450"
      >
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.channelId">
            <el-checkbox v-for="item in getChannelOptions(scope.row.appId)" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </fieldset>
</template>

<script>
import { $libShow } from '@/utils/common'
import { APPID_OPTIONS, CHANNEL_OPTIONS } from '@/utils/options'

export default {
  name: 'AppInfoConfig',
  props: {
    appInfo: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      libShow: $libShow,
      APPID_OPTIONS,
      CHANNEL_OPTIONS
    }
  },
  methods: {
    getChannelOptions(appId) {
      // 根據 appId 過濾渠道選項
      return this.CHANNEL_OPTIONS.filter(item => {
        // 這裡可以根據實際業務邏輯來過濾渠道
        return true
      })
    },
    handleAppIdChange(index, appId) {
      // 當 AppID 改變時，清空對應的渠道選擇
      this.$emit('app-id-change', index, appId)
    }
  }
}
</script>
