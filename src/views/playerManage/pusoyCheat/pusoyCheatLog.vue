<script>
import request from '@/utils/request'
import { $libDate, $libType, ClientTableData } from '@/utils/common'

export default {
  data() {
    return {
      cheatLogs: [],
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
      clientDB: new ClientTableData([], 1, {})
    }
  },
  created() {
  },
  methods: {
    getDataInfo() {
      this.getBlackData()
      this.getData()
    },
    async getBlackData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black',
          Page: 1,
          Limit: 100,
          Gid: this.Gid,
          Uid: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          $this.blacks = data.Items || []
          for (let i = 0; i < $this.blacks.length; i++) {
            const black = $this.blacks[i]
            $this.blackuids.push(black.Uid1)
            $this.blackuids.push(black.Uid2)
            $this.blackuids.push(black.Uid3)
          }
        }
      })
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/log',
          Page: 1,
          Limit: 1000,
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
          }
          cheatLogs.sort(function(a, b) {
            return a.FinishTime - b.FinishTime
          })
          $this.clientDB = new ClientTableData(cheatLogs, $this.pageNum, {}, 'showBlackButton', -1)
          $this.handleCurrentChange(1)
        }
      })
    },
    showBlackButton(row) {
      const cheatUids = []
      cheatUids.push(row.Uid1)
      cheatUids.push(row.Uid2)
      cheatUids.push(row.Uid3)
      for (let i = 0; i < cheatUids.length; i++) {
        const uid = cheatUids[i]
        if (!this.blackuids.includes(uid)) {
          return true
        }
      }
      return false
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
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
    handleClick(row) {
      this.$confirm('是否确认添加进黑名单，且踢出玩家?', '提示', { type: 'warning' }).then(() => {
        this.addToBlack(row)
        this.getDataInfo()
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
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black/add',
          Uid1: row.Uid1,
          Uid2: row.Uid2,
          Uid3: row.Uid3,
          Gid: row.Gid,
          Tid: row.Tid,
          FinishTime: row.FinishTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('添加成功')
        } else {
          $this.$message.error('添加失败')
        }
      })
    }
  }
}
</script>

<template>

  <div class="app-container">
    <el-row :span="6">
      <el-form label-width="150px" size="small">
        <el-col :span="6">
          <el-form-item label="游戏：" :required="true">
            <el-select v-model.number="Gid" placeholder="请选择">
              <el-option
                v-for="itemGid in options"
                :key="itemGid.value"
                :label="itemGid.label"
                :value="itemGid.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getDataInfo">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="cheatLogs"
        border
        style="width: 100%;"
      >
        <el-table-column
          label="玩家信息"
          width="630"
        >
          <template slot-scope="scope">
            <el-table
              :data="scope.row.userInfo"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="玩家ID"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  {{ formatUid(scope.row.Uid) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="BeforeMoney"
                label="玩家起始资金"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.BeforeMoney/1000) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="ChangeMoney"
                label="玩家变化资金"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.ChangeMoney/1000) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="AfterMoney"
                label="玩家最终资金"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.AfterMoney/1000) }}
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-table-column>
        <el-table-column
          prop="CrackTimes"
          label="crack次数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="ZeroTimes"
          label="0分值次数"
          width="120"
          align="center"
        />

        <el-table-column
          prop="PlayTimes"
          label="总局数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="PlayTimes"
          label="总盈亏"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{ getSummaries(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Gid"
          label="游戏"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatGameId(scope.row.Gid) }}
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
          prop="FinishTime"
          sortable
          label="最新时间"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.FinishTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
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
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10,20, 40, 60, 80]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style>

</style>
