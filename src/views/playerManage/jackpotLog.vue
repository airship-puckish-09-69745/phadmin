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
        <el-form-item label="奖池类型：">
          <el-select v-model="searchForm.poolType" placeholder="请选择">
            <el-option
              v-for="item in poolConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="searchForm.actType" placeholder="请选择">
            <el-option
              v-for="item in typeConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="应用APP：">
          <el-select v-model="searchForm.app" placeholder="请选择">
            <el-option
              v-for="item in appConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="场次类型：">
          <el-select v-model="searchForm.level" placeholder="请选择" @click.native="changeLevelConfig">
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
          <el-button type="primary" size="mini" @click="search">查询流水</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showInfo">奖池信息</el-button>
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
        prop="GameId"
        label="玩法"
      >
        <template slot-scope="{row}">
          {{ getGameName(row.GameId) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="envProjectName=='ph'"
        prop="PoolType"
        label="奖池类型"
      >
        <template slot-scope="{row}">
          {{ getPoolTypeName(row.PoolType) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="envProjectName=='ph'"
        prop="ActType"
        label="操作类型"
      >
        <template slot-scope="{row}">
          {{ getTypeName(row.ActType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ChangeNum"
        label="变化数量"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.ChangeNum) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="EndNum"
        label="操作后奖池数量"
      >

        <template slot-scope="{row}">
          <div v-if="envProjectName=='ph'">
            {{ toRupee(row.EndNum) }}
          </div>
          <div v-if="envProjectName=='ph_audit'">
            {{ toRupee(row.PoolMoney) }}
          </div>
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
    <el-dialog
      title="奖池信息"
      :modal="false"
      :visible.sync="prizeVisible"
    >
      <el-descriptions title="">
        <el-descriptions-item label="用户奖池">{{ toRupee(prizeInfo.UserPool) }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="展示奖池">{{ toRupee(prizeInfo.ShowPool) }}</el-descriptions-item>
        <el-descriptions-item label="最后更新时间">{{ formatTime(prizeInfo.UpdateTime) }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="prizeForm">
        <el-form-item label="手动修改玩家奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(false)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="手动修改展示奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeRobotNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(true)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item />
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
export default {
  name: 'RocketRet',
  data() {
    return {
      searchForm: {
        date: $libDate.GetDayBegin(new Date().getTime()),
        gameId: 25,
        poolType: 0,
        actType: 0,
        app: 0,
        level: 0,
        uid: 0
      },
      gameConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 25, 'label': 'color game' },
        { 'value': 20, 'label': 'Mines - 扫雷' },
        { 'value': 100, 'label': 'Tower' },
        // { 'value': 101, 'label': 'Sicbo' },
        { 'value': 102, 'label': 'Hilo' },
        { 'value': 103, 'label': 'Windrop' },
        { 'value': 106, 'label': '金猪' }
      ],
      appConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '1000002' },
        { 'value': 1000005, 'label': '1000005' }
      ],
      levelConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '普通场次' }
      ],
      poolConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '玩家奖池' },
        { 'value': 2, 'label': '展示奖池' }
      ],
      typeConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '牌局增加' },
        { 'value': 2, 'label': 'jackpot返奖' },
        { 'value': 3, 'label': '后台调整用户奖池' },
        { 'value': 4, 'label': '后台调整展示奖池' }
      ],
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      prizeVisible: false,
      prizeInfo: {
        UserPool: 0,
        ShowPool: 0,
        UpdateTime: 0
      },
      envProjectName: process.env.VUE_APP_PROJECT,
      prizeForm: {
        ChangeNum: 0,
        ChangeRobotNum: 0
      }
    }
  },
  created() {
    console.log('======', this.envProjectName)
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
          Path: '/jackpot/log',
          Uid: _this.searchForm.uid,
          PoolType: _this.searchForm.poolType,
          ActType: _this.searchForm.actType,
          Time: this.searchForm.date / 1000,
          GameId: _this.searchForm.gameId,
          Page: _this.currentPage,
          Limit: _this.pageNum,
          App: _this.searchForm.app,
          Level: _this.searchForm.level,
          SearchType: _this.searchForm.searchType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs == 'no Data') {
            Message.success('查询结果为空')
            // loading.close()
            return
          }
          if (objs.total > 0) {
            _this.totalCount = objs.total
            _this.tableData = objs.list
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
    changeLevelConfig() {
      if (this.searchForm.gameId === 103) {
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 2, 'label': 'EXPERT' },
          { 'value': 1, 'label': 'HIGH' }]
      } else if (this.searchForm.gameId === 106) {
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 1, 'label': 'grand' },
          { 'value': 2, 'label': 'major' },
          { 'value': 3, 'label': 'minor' }
        ]
      }
    },
    showInfo() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/info',
          GameId: _this.searchForm.gameId,
          App: _this.searchForm.app,
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
          _this.prizeInfo = objs
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
      this.prizeVisible = true
    },
    changePrizePool(isRobot) {
      const _this = this
      let changeNum = _this.prizeForm.ChangeNum
      let robotFlag = 0
      if (isRobot) {
        robotFlag = 1
        changeNum = _this.prizeForm.ChangeRobotNum
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/operate',
          GameId: _this.searchForm.gameId,
          ChangeNum: changeNum * 1000,
          App: _this.searchForm.app,
          Level: _this.searchForm.level,
          IsRobot: robotFlag
        }
      }).then(response => {
        if (response.RetCode === 0) {
          _this.showInfo()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
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
    // 获取操作类型
    getTypeName(actType) {
      var name = ''
      for (let i = 0; i < this.typeConfig.length; i++) {
        if (actType == this.typeConfig[i].value) {
          name = this.typeConfig[i].label
          break
        }
      }
      return name
    },
    getPoolTypeName(poolType) {
      var name = ''
      for (let i = 0; i < this.poolConfig.length; i++) {
        if (poolType == this.poolConfig[i].value) {
          name = this.poolConfig[i].label
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
