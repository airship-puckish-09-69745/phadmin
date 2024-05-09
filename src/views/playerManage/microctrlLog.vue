<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="searchForm.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="玩法：">
          <el-select v-model="searchForm.gameId" placeholder="请选择">
            <el-option
              v-for="item in gameConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="操作类型：">
          <el-select v-model="searchForm.operate" placeholder="请选择">
            <el-option
              v-for="item in typeConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="场次类型：">
          <el-select v-model="searchForm.level" placeholder="请选择">
            <el-option
              v-for="item in levelConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-form-item label="玩家id：">
            <el-input v-model="searchForm.uid" size="mini" />
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
    >
      <el-table-column
        prop="Id"
        label="ID"
        width="100"
      />

      <el-table-column
        prop="Uid"
        label="UID"
      />

      <el-table-column
        prop="Level"
        label="场次类型"
      >
        <template slot-scope="{row}">
          {{ getLevelName(row.Level) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="operate"
        label="操作类型"
      >
        <template slot-scope="{row}">
          {{ getTypeName(row.Operate) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="BoutId"
        label="回合数"
      />

      <el-table-column
        prop="Innings"
        label="回合第几局触发"
      />

      <el-table-column
        prop="BasicVal"
        label="回合平均输赢倍数"
      >
        <template slot-scope="{row}">
          {{ fmtValue(row.BasicVal) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="UpdateTime"
        label="操作时间"
      >
        <template slot-scope="{row}">
          {{ formatTime(row.UpdateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
export default {
  name: 'MicroctrlLog',
  data() {
    return {
      searchForm: {
        date: $libDate.GetDayBegin(new Date().getTime()),
        gameId: 20,
        operate: 0,
        level: 0,
        uid: 0
      },
      gameConfig: [
        // { 'value': 0, 'label': '全部' },
        // { 'value': 25, 'label': 'color game' },
        { 'value': 20, 'label': 'Mines - 扫雷' },
        // { 'value': 100, 'label': 'Tower' },
        // { 'value': 101, 'label': 'Sicbo' },
        // { 'value': 102, 'label': 'Hilo' },
        // { 'value': 103, 'label': 'Windrop' }
      ],
      levelConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '新手' },
        { 'value': 2, 'label': '普通' }
      ],
      typeConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 4, 'label': '杀' },
        { 'value': 8, 'label': '帮' },
      ],
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      prizeVisible: false,
      envProjectName: process.env.VUE_APP_PROJECT,
    }
  },
  methods: {
    search() {
      const _this = this
      // const loading = this.$loading({
      //     lock: true,
      //     text: '数据拉取中，请稍候...',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      // })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/log/microctrl',
          Uid: _this.searchForm.uid,
          Operate: _this.searchForm.operate,
          Time: this.searchForm.date / 1000,
          Gameid: _this.searchForm.gameId,
          Page: _this.currentPage,
          Limit: _this.pageNum,
          Level: _this.searchForm.level
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs == 'no Data') {
            Message.success('查询结果为空')
            // loading.close()
            return
          }
          if (objs.TotalCount > 0) {
            _this.totalCount = objs.TotalCount
            _this.tableData = objs.Items
          } else {
            _this.totalCount = 0
            _this.tableData = []
          }
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    fmtValue(val) {
      return parseInt(val) / 100
    },
    // 转行卢比
    toRupee(amount) {
      return parseInt(amount) / 1000
    },
    // 获取游戏名称
    getGameName(gameId) {
      var name = ''
      for (let i = 0; i < this.gameConfig.length; i++) {
        if (gameId == this.gameConfig[i].value) {
          name = this.gameConfig[i].label
          break
        }
      }
      return name
    },
    getLevelName(level) {
      var name = ''
      for (let i = 0; i < this.levelConfig.length; i++) {
        if (level === this.levelConfig[i].value) {
          name = this.levelConfig[i].label
          break
        }
      }
      return name
    },
    // 获取操作类型
    getTypeName(operate) {
      var name = ''
      for (let i = 0; i < this.typeConfig.length; i++) {
        if (operate === this.typeConfig[i].value) {
          name = this.typeConfig[i].label
          break
        }
      }
      return name
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    }
  }
}
</script>
