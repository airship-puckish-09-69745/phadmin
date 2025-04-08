<script>
import request from '@/utils/request'
import { $libDate, $libType, ClientTableData } from '@/utils/common'

export default {
  data() {
    return {
      cheatLogs: [],
      cheatLogsCredit: [],
      cheatLogsNoCredit: [],
      cheatLogsBlack: [],
      cheatLogsMaybe: [],

      checkTime: {start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()) },
      cheatLogsNewCredit: [],
      cheatLogsNewNoCredit: [],
      changeMoneyAll: 0,
      changeMoneyBlackAll: 0,
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      Gid: 21,
      options: [{
        value: 21,
        label: 'PUSOY'
      }, {
        value: 126,
        label: 'PUSOYWILD'
      }],
      blacks: [],
      blackuids: [],
      MaybeUids: [],
      clientDB: new ClientTableData([], 1, {}),
      clientDBCredit: new ClientTableData([], 1, {}),
      clientDBNoCredit: new ClientTableData([], 1, {}),

      clientDBMaybe: new ClientTableData([], 1, {}),
      clientDBBlack: new ClientTableData([], 1, {}),
      totalCountCredit: 0,
      totalCountNoCredit: 0
    }
  },
  async created() {
    await this.getBlackData()
    await this.getMaybeData()
  },
  methods: {
    async getDataInfo() {
      // await this.getBlackData()
      // await this.getData()
      await this.getMaybeData()
    },
    async getDataInfoCredit() {
      await this.getMaybeData()
      await this.getDataCreditNew(1)
    },
    async getDataInfoNoCredit() {
      // await this.getBlackData()
      // await this.getData()
      await this.getMaybeData()
      await this.getDataCreditNew(0)
    },
    async getBlackData() {
      const $this = this
      $this.blackuids = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black',
          Page: 1,
          Limit: 9999,
          Gid: this.Gid,
          Uid: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          $this.blacks = data.Items || []
          let mySet = new Set();
          for (let i = 0; i < $this.blacks.length; i++) {
            const black = $this.blacks[i]
            mySet.add(black.Uid1)
            mySet.add(black.Uid2)
            mySet.add(black.Uid3)
          }
          mySet.delete(0)
          $this.blackuids = Array.from(mySet)
          $this.blackuids.sort((a, b) => a - b);
          $this.clientDBBlack = new ClientTableData($this.blackuids, $this.pageNum, {}, 'showBlackButton', -1)
          $this.handleCurrentChangeBlack(1)
        }
      })
    },
    async getData() {
      const $this = this
      $this.cheatLogs = []
      $this.clientDB = new ClientTableData([], 1, {})
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/log',
          Page: 1,
          Limit: 9999,
          Gid: this.Gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogs = data.Items || []
          $this.totalCount = data.Total || 0
          for (let i = 0; i < cheatLogs.length; i++) {
            const cheatLog = cheatLogs[i]
            const userInfo = []
            userInfo.push({ 'Uid': cheatLog.Uid1, 'BeforeMoney': cheatLog.BeforeMoney1, 'ChangeMoney': cheatLog.ChangeMoney1, 'AfterMoney': cheatLog.AfterMoney1 })
            userInfo.push({ 'Uid': cheatLog.Uid2, 'BeforeMoney': cheatLog.BeforeMoney2, 'ChangeMoney': cheatLog.ChangeMoney2, 'AfterMoney': cheatLog.AfterMoney2 })
            userInfo.push({ 'Uid': cheatLog.Uid3, 'BeforeMoney': cheatLog.BeforeMoney3, 'ChangeMoney': cheatLog.ChangeMoney3, 'AfterMoney': cheatLog.AfterMoney3 })
            let showBlackButton = false
            for (let j = 0; j < 3; j++) {
              if (!$this.blackuids.includes(userInfo[j].Uid)) {
                showBlackButton = true
              }
            }
            cheatLog.userInfo = userInfo
            cheatLog.showBlackButton = showBlackButton
            cheatLog.ChangeMoneyAll = cheatLog.ChangeMoney1 + cheatLog.ChangeMoney2 + cheatLog.ChangeMoney3
          }
          cheatLogs.sort(function(a, b) {
            return b.FinishTime - a.FinishTime
          })
          $this.clientDB = new ClientTableData(cheatLogs, $this.pageNum, {}, 'showBlackButton', -1)
          $this.handleCurrentChange(1)
        }
      })
    },
    showBlackButton(row) {
      for (let i = 0; i < row.Uids.length; i++) {
        const uid = row.Uids[i].Uid
        if (!this.blackuids.includes(uid)) {
          return true
        }
      }
      return false
    },
    showMaybeButton(row) {
      for (let i = 0; i < row.Uids.length; i++) {
        const uid = row.Uids[i].Uid
        if (!this.MaybeUids.includes(uid)) {
          return true
        }
      }
      return false
    },
    formatTimeDate(ts) {
      return $libDate.FormateSecondStr(ts, 1)
    },
    formatCredit(row) {
      if (row.UserType === 1) {
        return ' 信誉用户'
      } else if (row.UserType === 0) {
        return ' 普通用户'
      } else if (row.UserType === 2) {
        return ' 黑名单用户'
      } else {
        return '未知用户'
      }
    },
    formatMaybe(row) {
      if (this.MaybeUids.includes(row.Uid)) {
        return '是'
      } else {
        return '否'
      }
    },
    formatMaybeUid(row) {
      return row
    },
    formatBlackUid(row) {
      return row
    },
    isShow(row) {
      return row.Tid !== 0
    },
    formatCheatDateShootAllTwo(row) {
      return ' (全垒打2人做小) ' + row.ShootAllTwo + ' 次'
    },
    formatCheatDateShootAllOne(row) {
      return ' (全垒打1人做小) ' + row.ShootAllOne + ' 次'
    },
    formatCheatDateExtraAddScore(row) {
      return ' (4人局躲加分牌) ' + row.ExtraAddScore + ' 次'
    },
    formatCheatDateThreeSmall(row) {
      return ' (3人局做小牌) ' + row.ThreeSmall + ' 次'
    },
    formatCheatDateThreeCrack(row) {
      return ' (3人局全crack) ' + row.ThreeCrack + ' 次'
    },
    formatCheatDateThreeZero(row) {
      return ' (3人局全0分) ' + row.ThreeZero + ' 次'
    },
    formatCheatDateThreeTwoCrack(row) {
      return ' (3人局2人crack) ' + row.ThreeTwoCrack + ' 次'
    },
    formatTimeTime(ts) {
      return $libDate.FormateSecondStr(ts, 4)
    },
    formatGameId(gameId) {
      if (gameId == 21) {
        return 'Pusoy'
      } else {
        return 'PusoyWild'
      }
    },
    getSummaries(row) {
      const n = (row.ChangeMoney1 + row.ChangeMoney2 + row.ChangeMoney3) / 1000
      if ($libType.IsNumber(n)) {
        return n.toLocaleString()
      } else {
        return n
      }
    },
    formatUid(uid) {
      if (this.blackuids.includes(uid)) {
        return uid + ' (已拉黑)'
      } else {
        return uid
      }
    },
    refreshShow() {
      this.cheatLogs = this.clientDB.GetCurrentPageData()
      this.changeMoneyAll = 0
      for (let i = 0; i < this.clientDB.TotalData.length; i++) {
        this.changeMoneyAll += this.clientDB.TotalData[i].ChangeMoneyAll
        // if (this.clientDB.TotalData[i].showBlackButton) {
        //   this.changeMoneyBlackAll += this.clientDB.TotalData[i].ChangeMoneyAll
        // }
      }
      // this.refreshStat()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    refreshShowCredit() {
      this.cheatLogsCredit = this.clientDBCredit.GetCurrentPageData()
    },
    handleSizeChangeCredit(val) {
      this.clientDBCredit.GetPage().SetPageNum(val)
      this.refreshShowCredit()
    },
    handleCurrentChangeCredit(val) {
      this.clientDBCredit.GetPage().SetPageNo(val)
      this.refreshShowCredit()
    },
    refreshShowNoCredit() {
      this.cheatLogsNoCredit = this.clientDBNoCredit.GetCurrentPageData()
    },
    handleSizeChangeNoCredit(val) {
      this.clientDBNoCredit.GetPage().SetPageNum(val)
      this.refreshShowNoCredit()
    },
    handleCurrentChangeNoCredit(val) {
      this.clientDBNoCredit.GetPage().SetPageNo(val)
      this.refreshShowNoCredit()
    },
    refreshShowBlack() {
      this.cheatLogsBlack = this.clientDBBlack.GetCurrentPageData()
    },
    handleSizeChangeBlack(val) {
      this.clientDBBlack.GetPage().SetPageNum(val)
      this.refreshShowBlack()
    },
    handleCurrentChangeBlack(val) {
      this.clientDBBlack.GetPage().SetPageNo(val)
      this.refreshShowBlack()
    },
    refreshShowMaybe() {
      this.cheatLogsMaybe = this.clientDBMaybe.GetCurrentPageData()
    },
    handleSizeChangeMaybe(val) {
      this.clientDBMaybe.GetPage().SetPageNum(val)
      this.refreshShowMaybe()
    },
    handleCurrentChangeMaybe(val) {
      this.clientDBMaybe.GetPage().SetPageNo(val)
      this.refreshShowMaybe()
    },
    handleClick(row) {
      this.$confirm('是否确认添加进黑名单，且踢出玩家?', '提示', { type: 'warning' }).then(async() => {
        await this.addToBlack(row)
        await this.getBlackData()
        // this.getDataInfo()
      }).catch(() => {
        console.log('取消')
      })
    },
    handleAddMaybe(row) {
      this.$confirm('是否确认添加进疑似名单?', '提示', { type: 'warning' }).then(async() => {
        await this.addToMaybe(row)
        await this.getMaybeData()
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDelMaybe(row) {
      this.$confirm('是否确认从疑似名单删除?', '提示', { type: 'warning' }).then(async() => {
        await this.delToMaybe(row)
        await this.getMaybeData()
      }).catch(() => {
        console.log('取消')
      })
    },
    formatNumber(n) {
      if ($libType.IsNumber(n)) {
        return n.toLocaleString()
      } else {
        return n
      }
    },
    async addToBlack(row) {
      const $this = this
      const uids = [0,0,0]
      for (let i = 0; i < row.Uids.length; i++) {
        uids[i] = row.Uids[i].Uid
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black/add',
          Uid1: uids[0],
          Uid2: uids[1],
          Uid3: uids[2],
          Gid: row.GameId,
          Tid: row.Tid,
          FinishTime: row.UpdateTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('添加成功')
        } else {
          $this.$message.error('添加失败')
        }
      })
    },
    async addToMaybe(row) {
      const $this = this
      const uids = [0,0,0]
      for (let i = 0; i < row.Uids.length; i++) {
        uids[i] = row.Uids[i].Uid
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/maybe/add',
          Uid1: uids[0],
          Uid2: uids[1],
          Uid3: uids[2],
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('添加成功')
        } else {
          $this.$message.error('添加失败')
        }
      })
    },
    async delToMaybe(row) {
      const $this = this
      const uids = [0,0,0]
      for (let i = 0; i < row.Uids.length; i++) {
        uids[i] = row.Uids[i].Uid
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/maybe/del',
          Uid1: uids[0],
          Uid2: uids[1],
          Uid3: uids[2],
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('添加成功')
        } else {
          $this.$message.error('添加失败')
        }
      })
    },
    async getMaybeData() {
      const $this = this
      $this.MaybeUids = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/maybe',
          Page: 1,
          Limit: 9999
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const maybes = data.Items || []
          for (let i = 0; i < maybes.length; i++) {
            const maybe = maybes[i]
            $this.MaybeUids.push(maybe.Uid1)
          }
          $this.clientDBMaybe = new ClientTableData($this.MaybeUids, $this.pageNum, {}, 'showBlackButton', -1)
          $this.handleCurrentChangeMaybe(1)
        }
      })
    },
    async getDataCreditNew(userType) {
      const $this = this
      if (userType === 1) {
        $this.cheatLogsNewCredit = []
        $this.totalCountCredit = 0
        $this.clientDBCredit = new ClientTableData([], 1, {})
      } else {
        $this.cheatLogsNewNoCredit = []
        $this.totalCountNoCredit = 0
        $this.clientDBNoCredit = new ClientTableData([], 1, {})
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/log/new',
          Page: 1,
          Limit: 9999,
          UserType: userType,
          Start: this.checkTime.start/1000,
          End: this.checkTime.end/1000,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogs = data.Items || []
          if (userType === 1) {
            $this.totalCountCredit = data.Total || 0
            for (let i = 0; i < cheatLogs.length; i++) {
              const cheatLog = cheatLogs[i]
              if (this.MaybeUids.includes(cheatLog.Uid)) {
                cheatLog.maybe = 1
              } else {
                cheatLog.maybe = 0
              }
              $this.cheatLogsNewCredit.push(cheatLog)
            }
            cheatLogs.sort(function(a, b) {
              return b.maybe - a.maybe
            })
            $this.clientDBCredit = new ClientTableData(cheatLogs, $this.pageNum, {}, 'showBlackButton', -1)
            $this.handleCurrentChangeCredit(1)
          } else {
            $this.totalCountCredit = data.Total || 0
            for (let i = 0; i < cheatLogs.length; i++) {
              const cheatLog = cheatLogs[i]
              if (this.MaybeUids.includes(cheatLog.Uid)) {
                cheatLog.maybe = 1
              } else {
                cheatLog.maybe = 0
              }
              $this.cheatLogsNewNoCredit.push(cheatLog)
            }
            cheatLogs.sort(function(a, b) {
              return b.maybe - a.maybe
            })
            $this.clientDBNoCredit = new ClientTableData(cheatLogs, $this.pageNum, {}, 'showBlackButton', -1)
            $this.handleCurrentChangeNoCredit(1)
          }
        }
      })
    }

  }
}
</script>

<template>
  <el-col class="app-container">
    <el_row>
      <el-tabs>
        <el-tab-pane label="授信作弊记录">
          <el-form :model="checkTime" label-width="90px" :inline="true" size="small">
            <el-form-item label="开始日期：">
              <el-date-picker
                v-model="checkTime.start"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="结束日期：">
              <el-date-picker
                v-model="checkTime.end"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期"
                size="mini"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="getDataInfoCredit">查询</el-button>
            </el-form-item>
          </el-form>



          <el-table
            :data="cheatLogsCredit"
            border
            style="width: 1550px;"
          >
            <el-table-column
              label="玩家信息"
              width="445"
              align="center"
            >
              <template slot-scope="scope">
                <el-table
                  :data="scope.row.Uids"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="Uid"
                    label="玩家ID"
                    width="150"
                    align="center"
                  />
                  <el-table-column
                    label="用户信誉"
                    width="150"
                    align="center"
                  >
                    <template slot-scope="scopeUids">
                      <div>{{ formatCredit(scopeUids.row) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="maybe"
                    label="是否标记疑似"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="scopeUids">
                      <div>{{ formatMaybe(scopeUids.row) }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

            </el-table-column>
            <el-table-column
              prop="Tid"
              label="桌子id"
              width="120"
              align="center"
            />
            <el-table-column
              label="作弊数据"
              width="250"
              align="center"
            >
              <template slot-scope="scope">
                <div v-show="isShow(scope.row)">{{ formatCheatDateShootAllTwo(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateShootAllOne(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateExtraAddScore(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeSmall(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeZero(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeTwoCrack(scope.row) }}</div>
                <div v-show="scope.row.Tid === 0">{{ formatCheatDateThreeCrack(scope.row) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="DefenseScore"
              label="防守分值"
              width="120"
              align="center"
            />
            <el-table-column
              label="游戏"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                {{ formatGameId(scope.row.GameId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="TableMoney"
              sortable
              label="场次"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                {{ formatNumber(scope.row.TableMoney/1000) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="UpdateTime"
              label="更新时间"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ formatTimeDate(scope.row.UpdateTime) }}</div>
                <div>{{ formatTimeTime(scope.row.UpdateTime) }}</div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="showMaybeButton(scope.row)"
                  type="primary"
                  size="mini"
                  @click="handleAddMaybe(scope.row)"
                >添加疑似
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="handleDelMaybe(scope.row)"
                >删除疑似
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="黑名单操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="showBlackButton(scope.row)"
                  type="primary"
                  size="mini"
                  @click="handleClick(scope.row)"
                >添加黑名单
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  disabled
                >已拉黑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="clientDBCredit.GetPage().GetCurrentPage()"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="clientDBCredit.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDBCredit.GetPage().GetTotalCount()"
              @size-change="handleSizeChangeCredit"
              @current-change="handleCurrentChangeCredit"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="非授信作弊记录">

          <el-form :model="checkTime" label-width="90px" :inline="true" size="small">
            <el-form-item label="开始日期：">
              <el-date-picker
                v-model="checkTime.start"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="结束日期：">
              <el-date-picker
                v-model="checkTime.end"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期"
                size="mini"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="getDataInfoNoCredit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="cheatLogsNoCredit"
            border
            style="width: 1550px;"
          >
            <el-table-column
              label="玩家信息"
              width="445"
              align="center"
            >
              <template slot-scope="scope">
                <el-table
                  :data="scope.row.Uids"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="Uid"
                    label="玩家ID"
                    width="150"
                    align="center"
                  />
                  <el-table-column
                    label="用户信誉"
                    width="150"
                    align="center"
                  >
                    <template slot-scope="scopeUids">
                      <div>{{ formatCredit(scopeUids.row) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否标记疑似"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="scopeUids">
                      <div>{{ formatMaybe(scopeUids.row) }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

            </el-table-column>
            <el-table-column
              prop="Tid"
              label="桌子id"
              width="120"
              align="center"
            />
            <el-table-column
              label="作弊数据"
              width="250"
              align="center"
            >
              <template slot-scope="scope">
                <div v-show="isShow(scope.row)">{{ formatCheatDateShootAllTwo(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateShootAllOne(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateExtraAddScore(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeSmall(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeZero(scope.row) }}</div>
                <div v-show="isShow(scope.row)">{{ formatCheatDateThreeTwoCrack(scope.row) }}</div>
                <div v-show="scope.row.Tid === 0">{{ formatCheatDateThreeCrack(scope.row) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="DefenseScore"
              label="防守分值"
              width="120"
              align="center"
            />
            <el-table-column
              label="游戏"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                {{ formatGameId(scope.row.GameId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="TableMoney"
              sortable
              label="场次"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                {{ formatNumber(scope.row.TableMoney/1000) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="UpdateTime"
              label="更新时间"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ formatTimeDate(scope.row.UpdateTime) }}</div>
                <div>{{ formatTimeTime(scope.row.UpdateTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="showMaybeButton(scope.row)"
                  type="primary"
                  size="mini"
                  @click="handleAddMaybe(scope.row)"
                >添加疑似
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="handleDelMaybe(scope.row)"
                >删除疑似
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="黑名单操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="showBlackButton(scope.row)"
                  type="primary"
                  size="mini"
                  @click="handleClick(scope.row)"
                >添加黑名单
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  disabled
                >已拉黑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="clientDBNoCredit.GetPage().GetCurrentPage()"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="clientDBNoCredit.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDBNoCredit.GetPage().GetTotalCount()"
              @size-change="handleSizeChangeNoCredit"
              @current-change="handleCurrentChangeNoCredit"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="疑似作弊名单">
          <el-table
            :data="cheatLogsMaybe"
            border
            style="width: 1550px;"
          >
            <el-table-column
              label="玩家ID"
              width="500"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ formatMaybeUid(scope.row) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="clientDBMaybe.GetPage().GetCurrentPage()"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="clientDBMaybe.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDBMaybe.GetPage().GetTotalCount()"
              @size-change="handleSizeChangeMaybe"
              @current-change="handleCurrentChangeMaybe"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="黑名单">
          <el-table
            :data="cheatLogsBlack"
            border
            style="width: 1550px;"
          >
            <el-table-column
              label="玩家ID"
              width="500"
              align="center"
            >
              <template slot-scope="scope">
                <div>{{ formatBlackUid(scope.row) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="clientDBBlack.GetPage().GetCurrentPage()"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="clientDBBlack.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDBBlack.GetPage().GetTotalCount()"
              @size-change="handleSizeChangeBlack"
              @current-change="handleCurrentChangeBlack"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

    </el_row>
  </el-col>
</template>

<style>

</style>
