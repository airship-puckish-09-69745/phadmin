<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <div class="search-filter">
      <div class="search-filter-item">
        appid: <el-select v-model="searchFilter.app_id" placeholder="请选择应用id" size="mini">
          <el-option
            v-for="item in APPID_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="onSearch()"
      >查 询</el-button>
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        style="float: right;"
        @click="handleShowBroadcastDialog()"
      >添加播报</el-button>
    </div>

    <AddMatchBroadcastDialog
      :broadcast-type-options="broadcastTypeOptions"
      :visible="broadcastDialog.visible"
      :update-data="broadcastDialog.updateData"
      @close="handleCloseBroadcastDialog"
      @reload="onSearch"
    />
  </el-card>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
// import request from '@/utils/request'
import { APPID_OPTIONS } from '@/utils/options'
import { broadcastTypeOptions } from '@/views/matchManage/matchBroadcast/options'
import AddMatchBroadcastDialog from './components/AddMatchBroadcastDialog.vue'

export default {
  name: 'MatchBroadcast',
  components: {
    Publish,
    AddMatchBroadcastDialog
  },
  data() {
    return {
      // 主键
      subKey: 'match_broadcast_cfg',
      broadcastTypeOptions,
      APPID_OPTIONS,
      searchFilter: {
        app_id: 1000002
      },
      broadcastDialog: {
        visible: false,
        updateData: null
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
    onSearch() {},
    handleCloseBroadcastDialog() {
      this.broadcastDialog.visible = false
      this.broadcastDialog.updateData = null
    },
    /**
     * 展示新增/编辑对话框
     * @param data 编辑数据，null则为新增
     */
    handleShowBroadcastDialog(data = null) {
      this.broadcastDialog.visible = true
      this.broadcastDialog.updateData = data
    }
  }
}
</script>

<style scoped lang="scss">
.search-filter {
  margin-top: 12px;
  &-item {
    display: inline-block;
    width: auto;
    max-width: 260px;
    margin-right: 16px;

    .el-input,
    .el-select {
      display: inline-block;
      width: 200px;
    }
  }
}
</style>
