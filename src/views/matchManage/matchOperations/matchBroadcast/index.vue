<template>
  <el-card>
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <div class="search-filter">
      <div class="search-filter-item">
        appid: <el-select v-model="searchFilter.app_id" placeholder="请选择应用id" size="mini" @change="onSearch">
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

    <div style="margin-top: 12px; min-width:600px">
      <el-table
        :data="FilterableBroadcastList"
        border
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;overflow-y: auto;"
        height="700"
      >
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :formatter="item.formatter" />
        <el-table-column
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-color="#13ce66"
              @change="handleSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleShowBroadcastDialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="onDeleteBroadcastConfirm(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <AddMatchBroadcastDialog
      :app-id="searchFilter.app_id"
      :broadcast-type-options="broadcastTypeOptions"
      :channel-options="CHANNEL_OPTIONS"
      :visible="broadcastDialog.visible"
      :update-data="broadcastDialog.updateData"
      :position-options="positionOptions"
      :match-unique-id-cfgs="matchUniqueIdCfgs"
      :match-first-rank-cfgs="broadcastDialog.matchFirstRankCfgs"
      :jp-first-rank-cfgs ="broadcastDialog.jpFirstRankCfgs"
      :app-id-options="APPID_OPTIONS"
      @close="handleCloseBroadcastDialog"
      @reload="onSearch"
      @save="handleUpdateConfig"
    />
  </el-card>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import { parseTime } from '@/utils'
import { APPID_OPTIONS, CHANNEL_OPTIONS } from '@/utils/options'
import { broadcastTypeOptions, positionOptions, getBroadcastTypeName } from './options'
import AddMatchBroadcastDialog from './components/AddMatchBroadcastDialog.vue'
import { $libShow } from '@/utils/common'

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
      libShow: $libShow,
      configData: {},
      FilterableBroadcastList: [], // 通过appId过滤之后展示到列表
      broadcastTypeOptions,
      APPID_OPTIONS,
      CHANNEL_OPTIONS,
      searchFilter: {
        app_id: 1000002
      },
      tableData: [],
      positionOptions,
      broadcastDialog: {
        visible: false,
        updateData: null,
        matchFirstRankCfgs: [],
        jpFirstRankCfgs: []
      },
      columns: [
        {
          prop: 'ID',
          label: '配置ID',
          width: 126
        },
        {
          prop: 'Title',
          label: '标题'
        },
        {
          prop: 'AppId',
          label: 'AppID',
          width: 100,
          formatter: (row) => {
            return this.getAppIdTypeName(row.AppId)
          }
        },
        {
          prop: 'Channel',
          label: '渠道',
          width: 160,
          formatter: (row) => {
            return row.Channel.join(', ')
          }
        },
        {
          prop: 'BroadcastType',
          label: '类型',
          width: 100,
          formatter: (row) => {
            return getBroadcastTypeName(row.BroadcastType)
          }
        },
        {
          prop: 'Origin',
          label: '来源',
          width: 160,
          formatter: (row) => {
            const originNames = []
            row.Origin.forEach(item => {
              originNames.push(this.getMatchUniqueIdName(item))
            })
            return originNames && originNames.length > 0 ? originNames.join(', ') : '--'
          }
        },
        {
          prop: 'Content',
          label: '内容'
        },
        // 频率
        {
          prop: 'BroadcastFrequency',
          label: '频率',
          width: 100
        },
        // 有效期
        {
          prop: 'BroadcastTimeRange',
          label: '有效期',
          width: 170,
          formatter: (row) => {
            const dateRange = []
            dateRange.push(this.parseTime(row.BroadcastTimeRange[0] * 1000, '{y}/{m}/{d} {h}:{i}'))
            dateRange.push(this.parseTime(row.BroadcastTimeRange[1] * 1000, '{y}/{m}/{d} {h}:{i}'))
            return dateRange.join('-')
          }
        },
        {
          prop: 'CreateTime',
          label: '创建时间',
          width: 150,
          formatter: (row) => {
            return this.parseTime(row.CreateTime * 1000)
          }
        },
        {
          prop: 'UpdateTime',
          label: '更新时间',
          width: 150,
          formatter: (row) => {
            return this.parseTime(row.UpdateTime * 1000)
          }
        }
      ],
      matchUniqueIdCfgs: [
        { 'value': 10001, 'label': '188Free' },
        { 'value': 10002, 'label': '12888Free' },
        { 'value': 10003, 'label': 'P10' },
        { 'value': 10004, 'label': 'P20' },
        { 'value': 10005, 'label': 'P40' },
        { 'value': 10006, 'label': 'P100' },
        { 'value': 10007, 'label': 'P300' },
        { 'value': 10008, 'label': 'GTCC 2005' },
        { 'value': 10009, 'label': 'Yamaha Moto' }
      ]
    }
  },
  mounted() {
    this.onSearch()
    APPID_OPTIONS.push({ 'value': -1, 'label': 'all' })
  },
  methods: {
    // 弹窗二次确认上架和下架操作
    handleSwitchChange(row) {
      this.$nextTick(() => {
        this.$confirm(`确认${!row.Status ? '下架' : '上架'}[ ${row.Title} ]吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认操作
          row.UpdateTime = parseInt(Date.now() / 1000)
          this.handleUpdateConfig(row)
        }).catch(() => {
          // 取消操作
          row.Status = !row.Status
          this.$message.info('操作已取消')
        })
      })
    },
    parseTime(timestamp, format = '{y}-{m}-{d} {h}:{i}:{s}') {
      return timestamp ? parseTime(timestamp, format) : '--'
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    onSearch() {
      this.getConfigData()
    },
    // 获取赛事来源名称
    getMatchUniqueIdName(value) {
      const matchUniqueIdCfg = this.matchUniqueIdCfgs.find(item => item.value === value)
      return matchUniqueIdCfg ? matchUniqueIdCfg.label : value
    },
    handleCloseBroadcastDialog() {
      this.broadcastDialog.visible = false
      this.broadcastDialog.updateData = null
      this.broadcastDialog.matchFirstRankCfgs = []
      this.broadcastDialog.jpFirstRankCfgs = []
    },
    /**
     * 展示新增/编辑对话框
     * @param data 编辑数据，null则为新增
     */
    handleShowBroadcastDialog(data = null) {
      this.broadcastDialog.updateData = data
      let matchFirstRankCfgs = []
      // 除了编辑的数据之外的所有比赛第一名的配置
      if (data) {
        matchFirstRankCfgs = this.tableData.filter(item => item.ID !== data.ID && item.BroadcastType === 1)
      } else {
        matchFirstRankCfgs = this.tableData.filter(item => item.BroadcastType === 1)
      }
      this.broadcastDialog.matchFirstRankCfgs = matchFirstRankCfgs
      let jpFirstRankCfgs = []
      if (data) {
        jpFirstRankCfgs = this.tableData.filter(item => item.ID !== data.ID && item.BroadcastType === 2)
      } else {
        jpFirstRankCfgs = this.tableData.filter(item => item.BroadcastType === 2)
      }
      this.broadcastDialog.jpFirstRankCfgs = jpFirstRankCfgs
      this.broadcastDialog.visible = true
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
        // 根据ID进行排序
        if (!Data.BroadcastList) {
          Data.BroadcastList = []
          this.FilterableBroadcastList = []
        } else {
          // 通过应用id进行筛选
          if (this.searchFilter.app_id > 0) {
            this.FilterableBroadcastList = Data.BroadcastList.filter(item => item.AppId === this.searchFilter.app_id)
          } else if (this.searchFilter.app_id === -1) {
            this.FilterableBroadcastList = Data.BroadcastList
          }
        }
        this.tableData = Data.BroadcastList
      } else {
        this.$message.error('获取配置数据失败: ' + res.RetMsg)
        this.configData.Data = {}
      }
      console.log('conf: ', this.configData.Data)
    },
    async handleUpdateConfig(data) {
      // 判断是否存在ID
      // 存在ID，更新已有项， 不存在就生成ID插入到最前面
      const index = this.configData.Data.BroadcastList.findIndex(item => item.ID === data.ID)
      if (index !== -1) {
        this.configData.Data.BroadcastList[index] = data
      } else {
        this.configData.Data.BroadcastList.unshift(data)
      }
      this.handleSaveConfig()
    },
    handleSaveConfig() {
      const params = {
        ...this.configData
      }
      params.Data.UpdateTimes = (this.configData.Data.UpdateTimes || 0) + 1
      params.Data = JSON.stringify(this.configData.Data)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: params
      }).then(res => {
        if (res.RetCode === 0) {
          this.$message.success('配置数据更新成功')
        } else {
          this.$message.error('更新配置数据失败: ' + res.RetMsg)
        }
        this.onSearch()
      })
    },
    /**
     * 删除数据的二次确认弹窗
     * @param row 要删除的行数据
     */
    onDeleteBroadcastConfirm(row) {
      this.$confirm(`确认删除[ ${row.Title} ]吗？`, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.configData.Data.BroadcastList.findIndex(item => item.ID === row.ID)
        if (index !== -1) {
          this.configData.Data.BroadcastList.splice(index, 1)
          this.handleSaveConfig()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    getAppIdTypeName(row) {
      let showName = ''
      for (let i = 0; i < APPID_OPTIONS.length; i++) {
        if (APPID_OPTIONS[i].value === row) {
          showName = APPID_OPTIONS[i].label
          break
        }
      }
      return showName
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
/* 强制保留水平滚动条位置（无滚动条时显示空白区域） */
.el-table__body-wrapper {
  overflow-x: scroll !important;
  scrollbar-width: thin; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* Chrome/Safari 隐藏滚动条但保留功能 */
.el-table__body-wrapper::-webkit-scrollbar {
  height: 6px !important; /* 滚动条高度（不可为0） */
  background: transparent !important;
}

/* 滚动条滑块（可选） */
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>
