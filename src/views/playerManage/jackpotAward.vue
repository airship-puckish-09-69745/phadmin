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
          <el-select v-model="searchForm.gameId" placeholder="请选择" @change="changeLevelConfig">
            <el-option
              v-for="item in gameConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型：">
          <el-select v-model="searchForm.awardType" placeholder="请选择">
            <el-option
              v-for="item in awardTypeConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型：">
          <el-select v-model="searchForm.isRobot" placeholder="请选择">
            <el-option
              v-for="item in userTypeConfig"
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
          <el-select v-model="searchForm.level" placeholder="请选择">
            <el-option
              v-for="item in levelConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户ID：">
          <el-input v-model="searchForm.uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询中奖记录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showLimit">日限展示</el-button>
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
        width="100"
      >
        <template slot-scope="{row}">
          {{ getGameName(row.GameId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="玩家ID"
        width="100"
      />
      <el-table-column
        prop="AwardType"
        label="场次类型"
        width="100"
      >
        <template slot-scope="{row}">
          {{ getAwardLevelName(row.Level) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="AwardType"
        label="奖池类型"
        width="100"
      >
        <template slot-scope="{row}">
          {{ getAwardTypeName(row.AwardType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="IsRobot"
        label="是否真人"
        width="100"
      >
        <template slot-scope="{row}">
          <div v-if="!row.IsRobot" style="color:green;">真人</div>
          <div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="BetMoney"
        label="下注总额"
        width="100"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.BetMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="AwardNum"
        label="奖励金额"
        width="100"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.AwardNum) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="SendTime"
        label="中奖时间"
        width="150"
      >
        <template slot-scope="{row}">
          {{ formatTime(row.SendTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="BetInfo"
        label="近百局下注情况"
      >
        <template slot-scope="{row}">
          {{ formatBetInfo(row.BetInfo) }}
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
      title="今天已经领走数量"
      :modal="false"
      :visible.sync="prizeVisible"
    >
      <el-descriptions title="">
        <el-descriptions-item label="一等奖">{{ prizeInfo.JackpotType1 }}</el-descriptions-item>
        <el-descriptions-item label="二等奖">{{ prizeInfo.JackpotType2 }}</el-descriptions-item>
        <el-descriptions-item label="三等奖">{{ prizeInfo.JackpotType3 }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
export default {
  name: 'JackpotAward',
  data() {
    return {
      searchForm: {
        date: $libDate.GetDayBegin(new Date().getTime()),
        gameId: 25,
        awardType: 0,
        uid: 0,
        isRobot: -1,
        app: 0,
        level: 0
      },
      appConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '1000002' },
        { 'value': 1000005, 'label': '1000005' }
      ],
      levelConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '普通场次' }
      ],
      gameConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 25, 'label': 'color game' },
        { 'value': 20, 'label': 'Mines - 扫雷' },
        { 'value': 100, 'label': 'Tower' },
        // { 'value': 101, 'label': 'Sicbo' },
        { 'value': 102, 'label': 'Hilo' },
        { 'value': 103, 'label': 'Windrop' },
        { 'value': 106, 'label': '金猪' },
        { 'value': 108, 'label': 'DropBall' },
        { 'value': 110, 'label': 'Video Poker' },
        { 'value': 115, 'label': 'MultiPlayer NiuNiu' }
      ],
      userTypeConfig: [
        { 'value': -1, 'label': '全部' },
        { 'value': 0, 'label': '真人' },
        { 'value': 1, 'label': '机器人' }
      ],
      awardTypeConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '一等奖' },
        { 'value': 2, 'label': '二等奖' },
        { 'value': 3, 'label': '三等奖' },
        { 'value': 4, 'label': '阳光普照' }
      ],
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      prizeVisible: false,
      prizeInfo: {
        JackpotType1: 0,
        JackpotType2: 0,
        JackpotType3: 0,
        JackpotType4: 0
      },
      prizeForm: {
        ChangeNum: 0,
        ChangeRobotNum: 0
      }
    }
  },
  created() {

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
          Path: '/jackpot/award/log',
          Uid: _this.searchForm.uid,
          AwardType: _this.searchForm.awardType,
          Time: $libDate.SelectTimeToIndiaByZone(this.searchForm.date) / 1000,
          GameId: _this.searchForm.gameId,
          Page: _this.currentPage,
          Limit: _this.pageNum,
          IsRobot: _this.searchForm.isRobot,
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
      this.searchForm.level = 0
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
    showLimit() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/day/limit',
          GameId: _this.searchForm.gameId,
          Time: $libDate.SelectTimeToIndia(this.searchForm.date) / 1000,
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
    // changePrizePool(isRobot) {
    //   const _this = this
    //   let changeNum = _this.prizeForm.ChangeNum
    //   let robotFlag = 0
    //   if (isRobot) {
    //     robotFlag = 1
    //     changeNum = _this.prizeForm.ChangeRobotNum
    //   }
    //   request({
    //     url: '/dataProxy/info',
    //     method: 'get',
    //     data: {
    //       Env: _this.env,
    //       Path: '/jackpot/operate',
    //       GameId: _this.searchForm.gameId,
    //       ChangeNum: changeNum * 1000,
    //       IsRobot: robotFlag
    //     }
    //   }).then(response => {
    //     if (response.RetCode === 0) {
    //       _this.showInfo()
    //       this.$message({
    //         message: '操作成功！',
    //         type: 'success'
    //       })
    //     } else {
    //       this.$message.error('操作失败')
    //     }
    //   })
    // },
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
    getAwardTypeName(awardType) {
      var name = ''
      for (let i = 0; i < this.awardTypeConfig.length; i++) {
        if (awardType == this.awardTypeConfig[i].value) {
          name = this.awardTypeConfig[i].label
          break
        }
      }
      return name
    },
    // 获取操作类型
    getAwardLevelName(level) {
      var name = ''
      for (let i = 0; i < this.levelConfig.length; i++) {
        if (level == this.levelConfig[i].value) {
          name = this.levelConfig[i].label
          break
        }
      }
      return name
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    showBoolFlag(boolFlag) {
      if (boolFlag == 1) {
        return '是'
      } else {
        return '否'
      }
    },
    formatBetInfo(betInfo) {
      var showInfo = ''
      if (betInfo == '') {
        return showInfo
      }
      var betObj = JSON.parse(betInfo)
      if (betObj.BetRound > 0 && betObj.BetMoney > 0) {
        showInfo = '下注局数：' + betObj.BetRound + ';下注总额:' + betObj.BetMoney / 1000 + ';排序得分:' + betObj.Score / 1000
      }
      return showInfo
    }
  }
}
</script>
